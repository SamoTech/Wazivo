import axios from 'axios';
import { JobListing } from '../types';

const MAX_JOBS = 10;
const TIMEOUT = 5000;

export async function searchJobs(skills: string[], title?: string, location?: string): Promise<JobListing[]> {
  const query = title || skills.slice(0, 3).join(' ');
  
  // Run searches in parallel with error handling
  const results = await Promise.allSettled([
    searchAdzuna(query, location || 'remote'),
    searchJSearch(query, location || 'remote'),
  ]);

  const jobs: JobListing[] = [];
  results.forEach(r => { 
    if (r.status === 'fulfilled') {
      jobs.push(...r.value); 
    }
  });

  // If no jobs found from APIs, provide fallback
  if (jobs.length === 0) {
    return generateFallbackJobs(query, skills, location);
  }
  
  return jobs.slice(0, 30);
}

function generateFallbackJobs(query: string, skills: string[], location?: string): JobListing[] {
  const searchQuery = encodeURIComponent(query);
  const loc = location || 'remote';
  
  return [
    {
      title: query,
      company: 'Multiple Companies',
      location: loc,
      remote: true,
      applyLink: `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`,
      source: 'LinkedIn',
      description: `Search LinkedIn for: ${skills.join(', ')}`
    },
    {
      title: query,
      company: 'Various',
      location: loc,
      remote: true,
      applyLink: `https://www.indeed.com/jobs?q=${searchQuery}`,
      source: 'Indeed',
      description: `Search Indeed for: ${skills.join(', ')}`
    },
    {
      title: query,
      company: 'Tech Companies',
      location: loc,
      remote: true,
      applyLink: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${searchQuery}`,
      source: 'Glassdoor',
      description: `Search Glassdoor for: ${skills.join(', ')}`
    },
    {
      title: query,
      company: 'Startups & Tech',
      location: loc,
      remote: true,
      applyLink: `https://www.wellfound.com/jobs?q=${searchQuery}`,
      source: 'Wellfound',
      description: `Search Wellfound (AngelList) for: ${skills.join(', ')}`
    },
    {
      title: query,
      company: 'Remote Companies',
      location: 'Remote',
      remote: true,
      applyLink: `https://remoteok.com/remote-jobs?q=${searchQuery}`,
      source: 'RemoteOK',
      description: `Search RemoteOK for: ${skills.join(', ')}`
    }
  ];
}

async function searchAdzuna(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) return [];
  
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
    console.error('Adzuna search failed:', error);
    return [];
  }
}

async function searchJSearch(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.RAPIDAPI_KEY) return [];
  
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
    console.error('JSearch search failed:', error);
    return [];
  }
}
