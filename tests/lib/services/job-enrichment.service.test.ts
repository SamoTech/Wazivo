/**
 * Unit tests for Job Enrichment Service
 */
import { enrichWithJobOpportunities } from '@/app/lib/services/job-enrichment.service';
import { JobListing } from '@/app/types';

// Mock dependencies
jest.mock('@/app/lib/jobSearchService', () => ({
  searchJobs: jest.fn(),
}));

jest.mock('@/app/lib/openaiService', () => ({
  enhanceJobMatching: jest.fn(),
}));

import { searchJobs } from '@/app/lib/jobSearchService';
import { enhanceJobMatching } from '@/app/lib/openaiService';

const mockSearchJobs = searchJobs as jest.MockedFunction<typeof searchJobs>;
const mockEnhanceJobMatching = enhanceJobMatching as jest.MockedFunction<
  typeof enhanceJobMatching
>;

describe('Job Enrichment Service', () => {
  const mockCandidateSummary = {
    name: 'John Doe',
    title: 'Software Engineer',
    keySkills: ['JavaScript', 'React', 'Node.js'],
    location: 'San Francisco, CA',
  };

  const mockJobSearch = {
    primaryQuery: 'Software Engineer',
    alternativeQueries: ['Frontend Developer', 'Full Stack Developer'],
    requiredSkills: ['JavaScript', 'React'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should enrich with job opportunities successfully', async () => {
    const mockJobs: JobListing[] = [
      {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        remote: true,
        applyLink: 'https://example.com/job1',
        source: 'Test',
      },
    ];

    mockEnhanceJobMatching.mockResolvedValue({
      searchQuery: 'Software Engineer',
      alternativeQueries: ['Frontend Developer'],
      enhancedSkills: ['JavaScript', 'React'],
    });

    mockSearchJobs.mockResolvedValue(mockJobs);

    const result = await enrichWithJobOpportunities(
      'CV text content',
      mockCandidateSummary,
      mockJobSearch
    );

    expect(result.jobs.length).toBeGreaterThan(0);
    expect(result.metadata.primaryQuery).toBe('Software Engineer');
  });

  it('should return empty results on error', async () => {
    mockEnhanceJobMatching.mockRejectedValue(new Error('API Error'));

    const result = await enrichWithJobOpportunities(
      'CV text content',
      mockCandidateSummary,
      mockJobSearch
    );

    expect(result.jobs).toEqual([]);
    expect(result.metadata.primaryQuery).toBe('');
  });

  it('should deduplicate jobs correctly', async () => {
    const duplicateJobs: JobListing[] = [
      {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'SF',
        remote: true,
        applyLink: 'https://example.com/job1',
        source: 'Source1',
      },
      {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'SF',
        remote: true,
        applyLink: 'https://example.com/job2',
        source: 'Source2',
      },
    ];

    mockEnhanceJobMatching.mockResolvedValue({
      searchQuery: 'Software Engineer',
      alternativeQueries: [],
      enhancedSkills: ['JavaScript'],
    });

    mockSearchJobs.mockResolvedValue(duplicateJobs);

    const result = await enrichWithJobOpportunities(
      'CV text',
      mockCandidateSummary,
      mockJobSearch
    );

    // Should only have one job after deduplication
    expect(result.jobs.length).toBe(1);
  });
});
