/**
 * Service for enriching analysis with job opportunities
 */
import { searchJobs } from '../jobSearchService';
import { enhanceJobMatching } from '../openaiService';
import { JobListing } from '../../types';
import { logger } from '../logger';

export interface JobSearchMetadata {
  primaryQuery: string;
  alternativeQueries: string[];
  location: string;
}

export interface JobEnrichmentResult {
  jobs: JobListing[];
  metadata: JobSearchMetadata;
}

/**
 * Enrich analysis with job opportunities
 */
export async function enrichWithJobOpportunities(
  cvText: string,
  candidateSummary: any,
  jobSearch?: any
): Promise<JobEnrichmentResult> {
  try {
    logger.info('Starting job enrichment', {
      hasJobSearch: !!jobSearch,
      location: candidateSummary?.location,
    });

    const { searchQuery, alternativeQueries, enhancedSkills } = await enhanceJobMatching(
      cvText,
      candidateSummary?.keySkills || [],
      candidateSummary?.title,
      jobSearch
    );

    // Search with primary query + top alternative
    const queriesToSearch = [searchQuery, ...(alternativeQueries || []).slice(0, 1)];
    const location = candidateSummary?.location || '';

    logger.debug('Executing job searches', {
      queriesCount: queriesToSearch.length,
      location,
    });

    const jobResults = await Promise.allSettled(
      queriesToSearch.map((q) => searchJobs(enhancedSkills, q, location))
    );

    // Merge and deduplicate results
    const jobs = deduplicateJobs(jobResults);

    logger.info('Job enrichment completed', {
      totalJobs: jobs.length,
      queriesExecuted: queriesToSearch.length,
    });

    return {
      jobs,
      metadata: {
        primaryQuery: searchQuery,
        alternativeQueries,
        location,
      },
    };
  } catch (error) {
    logger.error('Job enrichment failed', { error });
    // Return empty results instead of throwing
    return {
      jobs: [],
      metadata: {
        primaryQuery: '',
        alternativeQueries: [],
        location: '',
      },
    };
  }
}

/**
 * Deduplicate job listings using normalized keys
 */
function deduplicateJobs(jobResults: PromiseSettledResult<JobListing[]>[]): JobListing[] {
  const allJobs: JobListing[] = [];
  const seen = new Set<string>();

  for (const result of jobResults) {
    if (result.status === 'fulfilled') {
      for (const job of result.value) {
        const key = normalizeJobKey(job.title, job.company);
        if (!seen.has(key)) {
          seen.add(key);
          allJobs.push(job);
        }
      }
    }
  }

  return allJobs;
}

/**
 * Create normalized key for job deduplication
 */
function normalizeJobKey(title: string, company: string): string {
  const normalizeString = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '');

  return `${normalizeString(title)}|${normalizeString(company)}`;
}
