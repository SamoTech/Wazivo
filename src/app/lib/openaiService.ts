import OpenAI from 'openai';
import { AnalysisReport } from '../types';

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';

let groqClient: OpenAI | null = null;

function getGroqClient(): OpenAI {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is required. Get your key from https://console.groq.com');
    groqClient = new OpenAI({ apiKey, baseURL: GROQ_API_BASE });
  }
  return groqClient;
}

export async function analyzeResume(cvText: string): Promise<AnalysisReport> {
  const groq = getGroqClient();

  const isLinkedIn =
    cvText.includes('LINKEDIN PROFILE DATA') ||
    cvText.startsWith('NAME:') ||
    cvText.includes('\nEXPERIENCE:') ||
    cvText.includes('\nSKILLS:');

  const sourceContext = isLinkedIn
    ? 'This is structured data extracted from a LinkedIn profile.'
    : 'This is a CV/resume document.';

  const systemPrompt = `You are an expert career analyst and recruiter. ${sourceContext}

Analyze the profile and return a JSON object with EXACTLY this structure — no extra keys, no markdown:

{
  "candidateSummary": {
    "name": "full name or empty string",
    "title": "clean job title only, NO company name (e.g. 'Senior Software Engineer' NOT 'Engineer at Google')",
    "experience": "X years in [field]",
    "keySkills": ["skill1", "skill2"],
    "location": "City, Country or empty string",
    "yearsOfExperience": 0,
    "industries": ["industry1"],
    "seniority": "Junior|Mid|Senior|Lead|Executive"
  },
  "jobSearch": {
    "primaryQuery": "2-4 word job search query (e.g. 'Senior React Developer', 'Data Scientist', 'Product Manager')",
    "alternativeQueries": ["alternative title 1", "alternative title 2", "alternative title 3"],
    "requiredSkills": ["most important skill for this role", "skill2", "skill3"],
    "targetIndustries": ["industry1", "industry2"],
    "experienceLevel": "Entry|Junior|Mid|Senior|Lead|Executive",
    "remote": true
  },
  "weaknessesAndGaps": [
    {
      "category": "Technical Skills|Soft Skills|Certifications|Experience|Education",
      "gap": "specific missing skill or area",
      "impact": "why this gap matters",
      "priority": "high|medium|low"
    }
  ],
  "recommendedCourses": [
    {
      "title": "exact real course name",
      "platform": "Coursera|Udemy|edX|LinkedIn Learning|Pluralsight|Google|AWS|Microsoft|freeCodeCamp",
      "duration": "X hours or X weeks",
      "level": "Beginner|Intermediate|Advanced",
      "link": "https://actual-url",
      "addressesGap": "which gap this fixes",
      "skills": ["skill1", "skill2"],
      "cost": "Free|Paid|Subscription"
    }
  ],
  "marketInsights": {
    "demandLevel": "High|Medium|Low",
    "avgSalaryRange": "$X - $Y per year",
    "trendingSkills": ["skill1", "skill2", "skill3"],
    "topIndustries": ["industry1", "industry2"],
    "careerPaths": ["path1", "path2"]
  }
}

CRITICAL RULES:
1. "title" in candidateSummary = CLEAN job title ONLY. Never include company name, "at Company", or descriptions.
   WRONG: "Software Engineer at Meta" → RIGHT: "Software Engineer"
   WRONG: "Experienced Marketing Professional" → RIGHT: "Marketing Manager"

2. "primaryQuery" in jobSearch = what you would type into LinkedIn Jobs or Indeed to find their next role.
   Must be 2-4 words, a real job title, no filler words.
   Examples: "React Frontend Developer", "DevOps Engineer", "UX Designer", "Data Analyst"

3. "alternativeQueries" = 3 variations or related titles they should also search for.

4. Extract ALL work history, education, skills visible in the profile.

5. Recommend 5-7 REAL courses with accurate platform URLs.

6. Return ONLY valid JSON — no explanation, no markdown fences.`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this profile:\n\n${cvText.slice(0, 12000)}` },
    ],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0].message.content || '{}';
  const analysis = JSON.parse(raw) as AnalysisReport & {
    jobSearch?: {
      primaryQuery: string;
      alternativeQueries: string[];
      requiredSkills: string[];
      targetIndustries: string[];
      experienceLevel: string;
      remote: boolean;
    };
  };

  // Attach jobSearch to the report so route.ts can use it
  analysis.jobOpportunities = [];
  return analysis;
}

export async function enhanceJobMatching(
  cvText: string,
  skills: string[],
  title?: string,
  jobSearch?: {
    primaryQuery?: string;
    alternativeQueries?: string[];
    requiredSkills?: string[];
  }
) {
  // Use AI-generated primaryQuery if available — it's always better than raw title
  const primaryQuery = jobSearch?.primaryQuery || cleanTitle(title || '') || skills.slice(0, 2).join(' ');
  const alternativeQueries = jobSearch?.alternativeQueries || [];
  const enhancedSkills = jobSearch?.requiredSkills || skills;

  return {
    searchQuery: primaryQuery,
    alternativeQueries,
    enhancedSkills,
  };
}

/**
 * Strip company names and filler from a raw title string.
 * "Software Engineer at Google" → "Software Engineer"
 */
function cleanTitle(raw: string): string {
  return raw
    .replace(/\s+(at|@|in|for|with|–|—|-)\s+.*/i, '')  // strip "at Company"
    .replace(/\b(experienced|passionate|driven|results-oriented|motivated)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 60);
}
