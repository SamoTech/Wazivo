import axios from 'axios';
import * as cheerio from 'cheerio';
import { JobListing } from '../types';

const MAX_JOBS = 10;

export async function searchJobs(skills: string[], title?: string, location?: string): Promise<JobListing[]> {
  const query = title || skills.slice(0, 3).join(' ');
  const results = await Promise.allSettled([
    searchAdzuna(query, location || 'remote'),
    searchJSearch(query, location || 'remote'),
    searchWuzzuf(query, location || 'remote'),
  ]);

  const jobs: JobListing[] = [];
  results.forEach(r => { if (r.status === 'fulfilled') jobs.push(...r.value); });

  if (jobs.length === 0) {
    return [{
      title: query, company: 'Various', location: 'Multiple', remote: true,
      applyLink: 'https://www.linkedin.com/jobs/',
      source: 'AI-suggested (live search unavailable)',
      description: `Search for: ${skills.join(', ')}`
    }];
  }
  return jobs.slice(0, 30);
}

async function searchAdzuna(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.ADZUNA_APP_ID) return [];
  try {
    const res = await axios.get(`https://api.adzuna.com/v1/api/jobs/us/search/1`, {
      params: { app_id: process.env.ADZUNA_APP_ID, app_key: process.env.ADZUNA_APP_KEY, results_per_page: MAX_JOBS, what: q },
      timeout: 8000
    });
    return res.data.results.map((j: any) => ({
      title: j.title, company: j.company.display_name, location: j.location.display_name,
      remote: j.location.display_name.toLowerCase().includes('remote'),
      applyLink: j.redirect_url, source: 'Adzuna'
    }));
  } catch { return []; }
}

async function searchJSearch(q: string, loc: string): Promise<JobListing[]> {
  if (!process.env.RAPIDAPI_KEY) return [];
  try {
    const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: { query: `${q} in ${loc}` },
      headers: { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
      timeout: 8000
    });
    return (res.data.data || []).slice(0, MAX_JOBS).map((j: any) => ({
      title: j.job_title, company: j.employer_name, location: j.job_city || 'Remote',
      remote: j.job_is_remote, applyLink: j.job_apply_link, source: 'JSearch'
    }));
  } catch { return []; }
}

async function searchWuzzuf(q: string, loc: string): Promise<JobListing[]> {
  try {
    const res = await axios.get(`https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000
    });
    const $ = cheerio.load(res.data);
    const jobs: JobListing[] = [];
    $('.css-1gatmva').each((i, el) => {
      if (i >= MAX_JOBS) return;
      const title = $(el).find('h2 a').text().trim();
      const company = $(el).find('.css-d7j1kk').first().text().trim();
      const link = $(el).find('h2 a').attr('href');
      if (title && link) jobs.push({
        title, company, location: 'Egypt', remote: false,
        applyLink: link.startsWith('http') ? link : `https://wuzzuf.net${link}`,
        source: 'Wuzzuf'
      });
    });
    return jobs;
  } catch { return []; }
}
