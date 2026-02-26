import axios from 'axios';
import { JobListing } from '../types';

const MAX_JOBS = 10;
const TIMEOUT = 3000; // Reduced timeout

export async function searchJobs(skills: string[], title?: string, location?: string): Promise<JobListing[]> {
  const query = title || skills.slice(0, 3).join(' ');
  const jobs: JobListing[] = [];
  
  // Try to get real jobs from APIs, but don't let failures block the app
  try {
    const results = await Promise.allSettled([
      searchAdzuna(query, location || 'remote'),
      searchJSearch(query, location || 'remote'),
    ]);

    results.forEach(r => { 
      if (r.status === 'fulfilled' && r.value.length > 0) {
        jobs.push(...r.value); 
      }
    });
  } catch (error) {
    // Silently continue to fallback
    console.log('Job API search failed, using fallback');
  }

  // Always include fallback jobs
  const fallbackJobs = generateFallbackJobs(query, skills, location);
  
  // If we got real jobs, add a few fallbacks. Otherwise, use all fallbacks.
  if (jobs.length > 0) {
    return [...jobs.slice(0, 20), ...fallbackJobs.slice(0, 3)];
  }
  
  return fallbackJobs;
}

function generateFallbackJobs(query: string, skills: string[], location?: string): JobListing[] {
  const searchQuery = encodeURIComponent(query);
  const loc = location || 'remote';
  const skillsText = skills.slice(0, 5).join(', ');
  
  return [
    {
      title: query,
      company: 'Multiple Companies',
      location: loc,
      remote: true,
      applyLink: `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`,
      source: 'LinkedIn',
      description: `Search LinkedIn for ${query} positions. Key skills: ${skillsText}`
    },
    {
      title: query,
      company: 'Various Employers',
      location: loc,
      remote: true,
      applyLink: `https://www.indeed.com/jobs?q=${searchQuery}`,
      source: 'Indeed',
      description: `Browse Indeed for ${query} opportunities. Relevant skills: ${skillsText}`
    },
    {
      title: query,
      company: 'Tech Companies',
      location: loc,
      remote: true,
      applyLink: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${searchQuery}`,
      source: 'Glassdoor',
      description: `Find ${query} roles on Glassdoor with salary insights. Skills: ${skillsText}`
    },
    {
      title: query,
      company: 'Startups & Scale-ups',
      location: loc,
      remote: true,
      applyLink: `https://www.wellfound.com/jobs?q=${searchQuery}`,
      source: 'Wellfound',
      description: `Discover startup opportunities for ${query}. Key skills: ${skillsText}`
    },
    {
      title: `Remote ${query}`,
      company: 'Remote-First Companies',
      location: 'Remote',
      remote: true,
      applyLink: `https://remoteok.com/remote-jobs?q=${searchQuery}`,
      source: 'RemoteOK',
      description: `Search remote ${query} positions worldwide. Skills: ${skillsText}`
    },
    {
      title: query,
      company: 'Global Employers',
      location: loc,
      remote: false,
      applyLink: `https://www.monster.com/jobs/search?q=${searchQuery}`,
      source: 'Monster',
      description: `Browse Monster.com for ${query} careers. Relevant skills: ${skillsText}`
    },
    {
      title: `${query} Opportunities`,
      company: 'Tech & Non-Tech',
      location: loc,
      remote: true,
      applyLink: `https://www.ziprecruiter.com/Jobs/-${searchQuery}`,
      source: 'ZipRecruiter',
      description: `Explore ${query} jobs on ZipRecruiter. Skills: ${skillsText}`
    }
  ];
}

async function searchAdzuna(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    return [];
  }
  
  try {
    const res = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: { 
        app_id: process.env.ADZUNA_APP_ID, 
        app_key: process.env.ADZUNA_APP_KEY, 
        results_per_page: MAX_JOBS, 
        what: q,
        where: loc === 'remote' ? '' : loc
      },
      timeout: TIMEOUT
    });
    
    return (res.data.results || []).map((j: any) => ({
      title: j.title,
      company: j.company.display_name,
      location: j.location.display_name,
      remote: j.location.display_name.toLowerCase().includes('remote'),
      applyLink: j.redirect_url,
      source: 'Adzuna',
      description: j.description?.substring(0, 200)
    }));
  } catch (error) {
    return [];
  }
}

async function searchJSearch(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.RAPIDAPI_KEY) {
    return [];
  }
  
  try {
    const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: { 
        query: `${q} in ${loc}`,
        page: '1',
        num_pages: '1'
      },
      headers: { 
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      timeout: TIMEOUT
    });
    
    return (res.data.data || []).slice(0, MAX_JOBS).map((j: any) => ({
      title: j.job_title,
      company: j.employer_name,
      location: j.job_city || j.job_country || 'Remote',
      remote: j.job_is_remote || false,
      applyLink: j.job_apply_link,
      source: 'JSearch',
      description: j.job_description?.substring(0, 200)
    }));
  } catch (error) {
    return [];
  }
}
