import axios, { AxiosError } from 'axios';
import { JobListing } from '../types';
import { logger } from './logger';

// Configuration from environment or defaults
const MAX_JOBS = parseInt(process.env.MAX_JOBS_PER_SEARCH || '10', 10);
const TIMEOUT = parseInt(process.env.JOB_SEARCH_TIMEOUT || '5000', 10);
const MAX_FALLBACK_JOBS = 6;

/**
 * Search for jobs using multiple APIs with fallback
 */
export async function searchJobs(
  skills: string[],
  query: string,
  location?: string
): Promise<JobListing[]> {
  const cleanQuery = cleanJobQuery(query || skills.slice(0, 2).join(' '));
  const loc = cleanLocation(location || '');

  logger.info('Starting job search', { query: cleanQuery, location: loc, skills });

  const jobs: JobListing[] = [];

  // Try real APIs in parallel
  try {
    const results = await Promise.allSettled([
      searchAdzuna(cleanQuery, loc),
      searchJSearch(cleanQuery, loc),
    ]);

    results.forEach((r, index) => {
      if (r.status === 'fulfilled' && r.value.length > 0) {
        jobs.push(...r.value);
        logger.debug(`Job API ${index} returned ${r.value.length} jobs`);
      } else if (r.status === 'rejected') {
        logger.warn(`Job API ${index} failed`, { reason: r.reason });
      }
    });
  } catch (error) {
    logger.error('Job search failed', { error });
  }

  // Generate smart fallback links
  const fallbacks = generateFallbackJobs(cleanQuery, skills, loc);

  if (jobs.length > 0) {
    logger.info('Job search completed with API results', {
      apiJobs: jobs.length,
      fallbacks: 3,
    });
    return [...jobs.slice(0, 15), ...fallbacks.slice(0, 3)];
  }

  logger.info('Job search returning fallbacks only', { count: fallbacks.length });
  return fallbacks;
}

/**
 * Clean job query by removing company names and filler words
 */
function cleanJobQuery(raw: string): string {
  return raw
    .replace(/\s+(at|@|in|for|with|–|—|-)\s+.*/i, '') // "at Company"
    .replace(/\b(experienced|passionate|driven|results-oriented|motivated|skilled)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 60);
}

/**
 * Clean location for job APIs (prefer city only)
 */
function cleanLocation(raw: string): string {
  if (!raw) return '';
  // Many job APIs work better with city only
  const parts = raw.split(',').map(p => p.trim());
  return parts[0] || '';
}

/**
 * Generate fallback job search links
 */
function generateFallbackJobs(
  query: string,
  skills: string[],
  location: string
): JobListing[] {
  const q = encodeURIComponent(query);
  const loc = encodeURIComponent(location || 'remote');
  const skillsText = skills.slice(0, 4).join(', ');

  const fallbacks: Array<{
    title: string;
    company: string;
    link: string;
    source: string;
    description: string;
  }> = [
    {
      title: query,
      company: 'Search on LinkedIn',
      link: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${loc}`,
      source: 'LinkedIn Jobs',
      description: `Find ${query} positions on LinkedIn. Key skills: ${skillsText}`,
    },
    {
      title: query,
      company: 'Search on Indeed',
      link: `https://www.indeed.com/jobs?q=${q}&l=${loc}`,
      source: 'Indeed',
      description: `Browse ${query} jobs on Indeed. Skills: ${skillsText}`,
    },
    {
      title: query,
      company: 'Search on Glassdoor',
      link: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}`,
      source: 'Glassdoor',
      description: `Find ${query} roles with salary insights. Skills: ${skillsText}`,
    },
    {
      title: `Remote ${query}`,
      company: 'Search on RemoteOK',
      link: `https://remoteok.com/remote-jobs?q=${q}`,
      source: 'RemoteOK',
      description: `Search remote ${query} positions worldwide. Skills: ${skillsText}`,
    },
    {
      title: query,
      company: 'Search on Wellfound',
      link: `https://wellfound.com/jobs?q=${q}`,
      source: 'Wellfound',
      description: `Find startup ${query} opportunities. Skills: ${skillsText}`,
    },
    {
      title: query,
      company: 'Search on We Work Remotely',
      link: `https://weworkremotely.com/remote-jobs/search?term=${q}`,
      source: 'We Work Remotely',
      description: `Remote-first ${query} jobs. Skills: ${skillsText}`,
    },
  ];

  return fallbacks.slice(0, MAX_FALLBACK_JOBS).map(f => ({
    title: f.title,
    company: f.company,
    location: location || 'Remote / Worldwide',
    remote: true,
    applyLink: f.link,
    source: f.source,
    description: f.description,
  }));
}

/**
 * Search jobs using Adzuna API
 */
async function searchAdzuna(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    logger.debug('Adzuna API credentials not configured');
    return [];
  }

  try {
    const res = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        results_per_page: MAX_JOBS,
        what: q,
        where: loc === 'remote' || !loc ? '' : loc,
      },
      timeout: TIMEOUT,
    });

    return (res.data.results || []).map((j: any) => ({
      title: j.title,
      company: j.company.display_name,
      location: j.location.display_name,
      remote: j.location.display_name.toLowerCase().includes('remote'),
      applyLink: j.redirect_url,
      source: 'Adzuna',
      description: j.description?.substring(0, 200),
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.warn('Adzuna API error', {
        status: error.response?.status,
        message: error.message,
      });
    }
    return [];
  }
}

/**
 * Search jobs using JSearch API (RapidAPI)
 */
async function searchJSearch(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.RAPIDAPI_KEY) {
    logger.debug('RapidAPI key not configured');
    return [];
  }

  try {
    const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: loc ? `${q} in ${loc}` : q,
        page: '1',
        num_pages: '1',
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
      timeout: TIMEOUT,
    });

    return (res.data.data || [])
      .slice(0, MAX_JOBS)
      .map((j: any) => ({
        title: j.job_title,
        company: j.employer_name,
        location: j.job_city || j.job_country || 'Remote',
        remote: j.job_is_remote || false,
        applyLink: j.job_apply_link,
        source: 'JSearch',
        description: j.job_description?.substring(0, 200),
      }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.warn('JSearch API error', {
        status: error.response?.status,
        message: error.message,
      });
    }
    return [];
  }
}
