import axios from 'axios';
import { JobListing } from '../types';

const MAX_JOBS = 10;
const TIMEOUT  = 5000;

export async function searchJobs(
  skills: string[],
  query: string,
  location?: string
): Promise<JobListing[]> {

  // Clean the query — strip company names, "at X", filler words
  const cleanQuery = cleanJobQuery(query || skills.slice(0, 2).join(' '));
  const loc        = cleanLocation(location || '');
  const jobs: JobListing[] = [];

  // Try real APIs in parallel
  try {
    const results = await Promise.allSettled([
      searchAdzuna(cleanQuery, loc),
      searchJSearch(cleanQuery, loc),
    ]);
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value.length > 0) {
        jobs.push(...r.value);
      }
    });
  } catch {
    // fall through to fallbacks
  }

  // Generate smart fallback links based on the cleaned query
  const fallbacks = generateFallbackJobs(cleanQuery, skills, loc);

  if (jobs.length > 0) {
    return [...jobs.slice(0, 15), ...fallbacks.slice(0, 3)];
  }

  return fallbacks;
}

/**
 * Strip company names and noise from a job title/query string.
 * "Software Engineer at Google" → "Software Engineer"
 * "Experienced React Developer" → "React Developer"
 */
function cleanJobQuery(raw: string): string {
  return raw
    .replace(/\s+(at|@|in|for|with|–|—|-)\s+.*/i, '')     // "at Company"
    .replace(/\b(experienced|passionate|driven|results-oriented|motivated|skilled)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 60);
}

/**
 * Strip "Egypt", country names for APIs that need just city,
 * or return empty string for remote-first search.
 */
function cleanLocation(raw: string): string {
  if (!raw) return '';
  // Many job APIs work better with city only
  const parts = raw.split(',').map(p => p.trim());
  return parts[0] || '';
}

function generateFallbackJobs(query: string, skills: string[], location: string): JobListing[] {
  const q   = encodeURIComponent(query);
  const loc = encodeURIComponent(location || 'remote');
  const skillsText = skills.slice(0, 4).join(', ');

  return [
    {
      title:       query,
      company:     'Search on LinkedIn',
      location:    location || 'Remote / Worldwide',
      remote:      true,
      applyLink:   `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${loc}`,
      source:      'LinkedIn Jobs',
      description: `Find ${query} positions on LinkedIn. Key skills: ${skillsText}`,
    },
    {
      title:       query,
      company:     'Search on Indeed',
      location:    location || 'Remote / Worldwide',
      remote:      true,
      applyLink:   `https://www.indeed.com/jobs?q=${q}&l=${loc}`,
      source:      'Indeed',
      description: `Browse ${query} jobs on Indeed. Skills: ${skillsText}`,
    },
    {
      title:       query,
      company:     'Search on Glassdoor',
      location:    location || 'Remote / Worldwide',
      remote:      true,
      applyLink:   `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}`,
      source:      'Glassdoor',
      description: `Find ${query} roles with salary insights. Skills: ${skillsText}`,
    },
    {
      title:       `Remote ${query}`,
      company:     'Search on RemoteOK',
      location:    'Remote',
      remote:      true,
      applyLink:   `https://remoteok.com/remote-jobs?q=${q}`,
      source:      'RemoteOK',
      description: `Search remote ${query} positions worldwide. Skills: ${skillsText}`,
    },
    {
      title:       query,
      company:     'Search on Wellfound (AngelList)',
      location:    location || 'Remote / Worldwide',
      remote:      true,
      applyLink:   `https://wellfound.com/jobs?q=${q}`,
      source:      'Wellfound',
      description: `Find startup ${query} opportunities. Skills: ${skillsText}`,
    },
    {
      title:       query,
      company:     'Search on We Work Remotely',
      location:    'Remote',
      remote:      true,
      applyLink:   `https://weworkremotely.com/remote-jobs/search?term=${q}`,
      source:      'We Work Remotely',
      description: `Remote-first ${query} jobs. Skills: ${skillsText}`,
    },
  ];
}

async function searchAdzuna(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) return [];

  try {
    const res = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id:           process.env.ADZUNA_APP_ID,
        app_key:          process.env.ADZUNA_APP_KEY,
        results_per_page: MAX_JOBS,
        what:             q,
        where:            loc === 'remote' || !loc ? '' : loc,
      },
      timeout: TIMEOUT,
    });

    return (res.data.results || []).map((j: any) => ({
      title:       j.title,
      company:     j.company.display_name,
      location:    j.location.display_name,
      remote:      j.location.display_name.toLowerCase().includes('remote'),
      applyLink:   j.redirect_url,
      source:      'Adzuna',
      description: j.description?.substring(0, 200),
    }));
  } catch {
    return [];
  }
}

async function searchJSearch(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.RAPIDAPI_KEY) return [];

  try {
    const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query:     loc ? `${q} in ${loc}` : q,
        page:      '1',
        num_pages: '1',
      },
      headers: {
        'X-RapidAPI-Key':  process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
      timeout: TIMEOUT,
    });

    return (res.data.data || []).slice(0, MAX_JOBS).map((j: any) => ({
      title:       j.job_title,
      company:     j.employer_name,
      location:    j.job_city || j.job_country || 'Remote',
      remote:      j.job_is_remote || false,
      applyLink:   j.job_apply_link,
      source:      'JSearch',
      description: j.job_description?.substring(0, 200),
    }));
  } catch {
    return [];
  }
}
