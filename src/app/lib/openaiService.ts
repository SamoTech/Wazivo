import OpenAI from 'openai';
import { z } from 'zod';
import { AnalysisReport } from '../types';
import { AIAnalysisError, ErrorCodes } from './errors';
import { logger } from './logger';

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
const MAX_CV_LENGTH = 50000;
const AI_TIMEOUT = 45000; // 45 seconds

let groqClient: OpenAI | null = null;

/**
 * Zod schema for AI response validation
 */
const JobSearchSchema = z.object({
  primaryQuery: z.string().min(2).max(100),
  alternativeQueries: z.array(z.string()).default([]),
  requiredSkills: z.array(z.string()).default([]),
  targetIndustries: z.array(z.string()).default([]),
  experienceLevel: z.string().default('Mid'),
  remote: z.boolean().default(true),
});

const CandidateSummarySchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  experience: z.string().optional(),
  keySkills: z.array(z.string()).default([]),
  location: z.string().optional(),
  yearsOfExperience: z.number().default(0),
  industries: z.array(z.string()).default([]),
  seniority: z.string().optional(),
});

const SkillGapSchema = z.object({
  category: z.string(),
  gap: z.string(),
  impact: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
});

const CourseRecommendationSchema = z.object({
  title: z.string(),
  platform: z.string(),
  duration: z.string(),
  level: z.string(),
  link: z.string().url(),
  addressesGap: z.string(),
  skills: z.array(z.string()).default([]),
  cost: z.string(),
});

const MarketInsightsSchema = z.object({
  demandLevel: z.string(),
  avgSalaryRange: z.string().optional(),
  trendingSkills: z.array(z.string()).default([]),
  topIndustries: z.array(z.string()).default([]),
  careerPaths: z.array(z.string()).default([]),
});

const AnalysisReportSchema = z.object({
  candidateSummary: CandidateSummarySchema,
  jobSearch: JobSearchSchema.optional(),
  weaknessesAndGaps: z.array(SkillGapSchema).default([]),
  recommendedCourses: z.array(CourseRecommendationSchema).default([]),
  marketInsights: MarketInsightsSchema.optional(),
});

function getGroqClient(): OpenAI {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      logger.error('GROQ_API_KEY not configured');
      throw new AIAnalysisError(
        ErrorCodes.API_KEY_MISSING,
        'AI service is not properly configured'
      );
    }
    groqClient = new OpenAI({ apiKey, baseURL: GROQ_API_BASE });
  }
  return groqClient;
}

/**
 * Detect if CV text is from LinkedIn
 */
function isLinkedInProfile(cvText: string): boolean {
  return /LINKEDIN PROFILE DATA|^NAME:|EXPERIENCE:|SKILLS:/m.test(cvText);
}

/**
 * Build system prompt for AI analysis
 */
function buildSystemPrompt(isLinkedIn: boolean): string {
  const sourceContext = isLinkedIn
    ? 'This is structured data extracted from a LinkedIn profile.'
    : 'This is a CV/resume document.';

  return `You are an expert career analyst and recruiter. ${sourceContext}

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
}

export async function analyzeResume(cvText: string): Promise<AnalysisReport> {
  // Validate input size
  if (!cvText || cvText.trim().length === 0) {
    throw new AIAnalysisError(ErrorCodes.INVALID_AI_RESPONSE, 'CV text is empty');
  }

  if (cvText.length > MAX_CV_LENGTH) {
    throw new AIAnalysisError(
      ErrorCodes.INVALID_AI_RESPONSE,
      'CV text is too long for analysis',
      { length: cvText.length, max: MAX_CV_LENGTH }
    );
  }

  const groq = getGroqClient();
  const isLinkedIn = isLinkedInProfile(cvText);
  const systemPrompt = buildSystemPrompt(isLinkedIn);

  logger.info('Starting AI analysis', {
    cvLength: cvText.length,
    isLinkedIn,
    model: MODEL,
  });

  try {
    const response = await Promise.race([
      groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this profile:\n\n${cvText.slice(0, 12000)}` },
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI request timeout')), AI_TIMEOUT)
      ),
    ]);

    const raw = response.choices[0].message.content || '{}';

    // Parse and validate response
    let parsedData: any;
    try {
      parsedData = JSON.parse(raw);
    } catch (error) {
      logger.error('Failed to parse AI response as JSON', { raw: raw.substring(0, 200) });
      throw new AIAnalysisError(
        ErrorCodes.INVALID_AI_RESPONSE,
        'AI returned invalid JSON response'
      );
    }

    // Validate with Zod
    const validatedAnalysis = AnalysisReportSchema.parse(parsedData);

    // Initialize empty job opportunities (will be filled by route handler)
    const analysis: AnalysisReport = {
      ...validatedAnalysis,
      jobOpportunities: [],
    };

    logger.info('AI analysis completed successfully', {
      skillsCount: analysis.candidateSummary.keySkills.length,
      gapsCount: analysis.weaknessesAndGaps.length,
      coursesCount: analysis.recommendedCourses.length,
    });

    return analysis;
  } catch (error) {
    if (error instanceof AIAnalysisError) throw error;

    if (error instanceof z.ZodError) {
      logger.error('AI response validation failed', { errors: error.errors });
      throw new AIAnalysisError(
        ErrorCodes.INVALID_AI_RESPONSE,
        'AI response format validation failed',
        { zodErrors: error.errors }
      );
    }

    if (error instanceof Error && error.message === 'AI request timeout') {
      logger.error('AI request timed out');
      throw new AIAnalysisError(
        ErrorCodes.AI_TIMEOUT,
        'AI analysis took too long. Please try with a shorter CV.'
      );
    }

    logger.error('AI analysis failed', { error });
    throw new AIAnalysisError(
      ErrorCodes.AI_REQUEST_FAILED,
      'AI analysis failed unexpectedly',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

/**
 * Enhance job matching with AI-generated queries
 */
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
  // Use AI-generated primaryQuery if available
  const primaryQuery =
    jobSearch?.primaryQuery || cleanTitle(title || '') || skills.slice(0, 2).join(' ');
  const alternativeQueries = jobSearch?.alternativeQueries || [];
  const enhancedSkills = jobSearch?.requiredSkills || skills;

  logger.debug('Job matching enhanced', {
    primaryQuery,
    alternativeQueriesCount: alternativeQueries.length,
    skillsCount: enhancedSkills.length,
  });

  return {
    searchQuery: primaryQuery,
    alternativeQueries,
    enhancedSkills,
  };
}

/**
 * Strip company names and filler from a raw title string
 */
function cleanTitle(raw: string): string {
  return raw
    .replace(/\s+(at|@|in|for|with|–|—|-)\s+.*/i, '') // strip "at Company"
    .replace(/\b(experienced|passionate|driven|results-oriented|motivated)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 60);
}
