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

  // Detect if this is structured LinkedIn data or a regular CV
  const isLinkedIn = cvText.includes('LINKEDIN PROFILE DATA') ||
                     cvText.startsWith('NAME:') ||
                     cvText.includes('\nEXPERIENCE:') ||
                     cvText.includes('\nSKILLS:');

  const sourceContext = isLinkedIn
    ? 'This is structured data extracted from a LinkedIn profile.'
    : 'This is a CV/resume document.';

  const systemPrompt = `You are an expert career analyst. ${sourceContext}

Analyze the provided profile data and return a JSON object with EXACTLY this structure:
{
  "candidateSummary": {
    "name": "full name or empty string",
    "title": "current or most recent job title",
    "experience": "X years in [field]",
    "keySkills": ["skill1", "skill2", ...up to 12 skills],
    "location": "city, country or empty string",
    "yearsOfExperience": number,
    "industries": ["industry1", "industry2"],
    "seniority": "Junior|Mid|Senior|Lead|Executive"
  },
  "weaknessesAndGaps": [
    {
      "category": "Technical Skills|Soft Skills|Certifications|Experience|Education",
      "gap": "specific missing skill or gap description",
      "impact": "why this gap matters for their career",
      "priority": "high|medium|low"
    }
    ...4-6 items
  ],
  "recommendedCourses": [
    {
      "title": "exact course name",
      "platform": "Coursera|Udemy|edX|LinkedIn Learning|Pluralsight|Google|AWS|Microsoft",
      "duration": "X hours or X weeks",
      "level": "Beginner|Intermediate|Advanced",
      "link": "https://real-url-to-course",
      "addressesGap": "which skill gap this fixes",
      "skills": ["skill1", "skill2"],
      "cost": "Free|$X|Subscription"
    }
    ...5-7 items
  ],
  "marketInsights": {
    "demandLevel": "High|Medium|Low",
    "avgSalaryRange": "$X - $Y per year",
    "trendingSkills": ["skill1", "skill2", "skill3"],
    "topIndustries": ["industry1", "industry2"],
    "careerPaths": ["path1", "path2"]
  }
}

Rules:
- Extract ALL work history, education, skills from the profile data
- For LinkedIn profiles: pay attention to job titles, companies, dates, and the skills section
- Identify gaps by comparing their skills to what their target role/industry requires
- Recommend REAL courses with accurate links (Coursera, Udemy, etc.)
- Be specific — no generic advice
- Return ONLY the JSON object, no markdown, no explanation`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this profile and return the JSON:\n\n${cvText}` },
    ],
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0].message.content || '{}';
  const analysis: AnalysisReport = JSON.parse(raw);
  analysis.jobOpportunities = [];
  return analysis;
}

export async function enhanceJobMatching(cvText: string, skills: string[], title?: string) {
  return {
    searchQuery: title || skills.slice(0, 3).join(' '),
    enhancedSkills: skills,
  };
}
