import { calculateATSScore } from './atsScore';
import {
  buildJobSearchLinks,
  buildMissingSkillResources,
  inferRecommendedRoles,
  type JobSearchLink,
  type MissingSkillResource,
} from './careerResources';
import {
  cover_letter_prompt,
  resume_analysis_prompt,
  resume_rewrite_prompt,
  AI_MODEL,
} from './promptTemplates';
import { extractSkillsFromText, inferCareerLevel, suggestMissingSkills } from './skillExtractor';

export type ResumeAnalysis = {
  score: number;
  career_level: string;
  skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  summary: string;
  recommended_roles: string[];
  job_search_links: JobSearchLink[];
  missing_skill_resources: MissingSkillResource[];
};

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function uniqueStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];

  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
}

function extractJson(content: string) {
  const cleaned = content.replace(/```json|```/gi, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('Model did not return valid JSON');
  }

  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as Partial<ResumeAnalysis>;
}

function enrichAnalysis(
  resumeText: string,
  skills: string[],
  careerLevel: string,
  missingSkills: string[],
  strengths: string[],
  weaknesses: string[],
  summary: string,
  parsedRoles: string[] = []
): ResumeAnalysis {
  const recommendedRoles = [
    ...new Set([...parsedRoles, ...inferRecommendedRoles(resumeText, skills, careerLevel)]),
  ].slice(0, 4);
  const jobSearchLinks = buildJobSearchLinks(recommendedRoles, skills, careerLevel);
  const missingSkillResources = buildMissingSkillResources(missingSkills);
  const score = calculateATSScore(resumeText, {
    skills,
    missing_skills: missingSkills,
    strengths,
    weaknesses,
  });

  return {
    score,
    career_level: careerLevel,
    skills,
    missing_skills: missingSkills,
    strengths,
    weaknesses,
    summary,
    recommended_roles: recommendedRoles,
    job_search_links: jobSearchLinks,
    missing_skill_resources: missingSkillResources,
  };
}

function buildFallbackAnalysis(resumeText: string): ResumeAnalysis {
  const skills = extractSkillsFromText(resumeText);
  const careerLevel = inferCareerLevel(resumeText);
  const missingSkills = suggestMissingSkills(skills, careerLevel);

  const strengths = [
    skills.length
      ? `Shows evidence of ${skills.slice(0, 3).join(', ')} capabilities.`
      : 'Shows practical experience but could surface more explicit skill keywords.',
    /\b(project|portfolio|product|platform)\b/i.test(resumeText)
      ? 'Mentions hands-on project or product work.'
      : 'Would benefit from stronger project and impact storytelling.',
    /\b\d+%|\b\d+\+|\$\d+/i.test(resumeText)
      ? 'Includes measurable outcomes that improve recruiter trust.'
      : 'Could become stronger with quantified achievements.',
  ];

  const weaknesses = [
    missingSkills.length
      ? `Missing or under-emphasized market skills such as ${missingSkills.slice(0, 3).join(', ')}.`
      : '',
    /summary|profile/i.test(resumeText) ? '' : 'Resume lacks a clear professional summary section.',
    /skills/i.test(resumeText)
      ? ''
      : 'Resume should include a dedicated skills section for ATS readability.',
  ].filter(Boolean);

  return enrichAnalysis(
    resumeText,
    skills,
    careerLevel,
    missingSkills,
    strengths,
    weaknesses,
    'This resume shows a usable professional baseline, but clearer positioning, stronger keyword coverage, and more quantified achievements would improve ATS performance and recruiter clarity.'
  );
}

async function callGroq(prompt: string, temperature = 0.2) {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY');
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    cache: 'no-store',
    body: JSON.stringify({
      model: AI_MODEL,
      temperature,
      messages: [
        {
          role: 'system',
          content:
            'You are Wazivo, a precise resume analysis engine. Follow instructions exactly and keep outputs production-ready.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq request failed: ${text}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const heuristic = buildFallbackAnalysis(resumeText);

  try {
    const content = await callGroq(resume_analysis_prompt(resumeText));
    const parsed = extractJson(content);
    const skills = [...new Set([...uniqueStrings(parsed.skills), ...heuristic.skills])].sort(
      (a, b) => a.localeCompare(b)
    );
    const careerLevel =
      String(parsed.career_level || heuristic.career_level).trim() || heuristic.career_level;
    const missingSkills = uniqueStrings(parsed.missing_skills).length
      ? uniqueStrings(parsed.missing_skills)
      : suggestMissingSkills(skills, careerLevel);
    const strengths = uniqueStrings(parsed.strengths).length
      ? uniqueStrings(parsed.strengths)
      : heuristic.strengths;
    const weaknesses = uniqueStrings(parsed.weaknesses).length
      ? uniqueStrings(parsed.weaknesses)
      : heuristic.weaknesses;
    const summary = String(parsed.summary || heuristic.summary).trim();

    return enrichAnalysis(
      resumeText,
      skills,
      careerLevel,
      missingSkills,
      strengths,
      weaknesses,
      summary,
      uniqueStrings(parsed.recommended_roles)
    );
  } catch {
    return heuristic;
  }
}

function fallbackRewrite(resumeText: string) {
  return [
    'PROFESSIONAL SUMMARY',
    'Results-driven candidate with practical experience extracted from the source resume. Rewrite this draft further once a Groq API key is configured.',
    '',
    'CORE SKILLS',
    extractSkillsFromText(resumeText).join(', ') || 'Add technical and functional skills here.',
    '',
    'EXPERIENCE',
    '- Rewrite each experience bullet with action + impact + tools used.',
    '- Quantify outcomes wherever possible.',
    '',
    'EDUCATION',
    '- Add degree, institution, and dates.',
    '',
    'SOURCE RESUME',
    resumeText,
  ].join('\n');
}

export async function rewriteResumeForATS(resumeText: string) {
  try {
    return await callGroq(resume_rewrite_prompt(resumeText), 0.4);
  } catch {
    return fallbackRewrite(resumeText);
  }
}

function inferRoleFromJobDescription(jobDescription: string) {
  const match = jobDescription.match(
    /(?:for|as|role of|position of)\s+([A-Z][A-Za-z0-9 \-/]{3,60})/i
  );
  return match?.[1]?.trim() || 'the role';
}

export async function generateCoverLetter(resumeText: string, jobDescription: string) {
  try {
    return await callGroq(cover_letter_prompt(resumeText, jobDescription), 0.5);
  } catch {
    const role = inferRoleFromJobDescription(jobDescription);
    return `Dear Hiring Manager,\n\nI am excited to apply for ${role}. My background reflects hands-on experience, adaptable execution, and a strong motivation to contribute quickly. I have developed practical skills that align with modern team needs, including delivery focus, collaboration, and the ability to learn new tools fast.\n\nWhat stands out most in my experience is my ability to turn responsibilities into outcomes while staying user- and business-focused. I would welcome the opportunity to bring that mindset to your team and contribute with professionalism from day one.\n\nThank you for your time and consideration.\n\nSincerely,\nCandidate`;
  }
}
