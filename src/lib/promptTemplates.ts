export const AI_MODEL = process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile';

const analysisSchema = `Return strict JSON only with this exact shape:
{
  "score": number,
  "career_level": string,
  "skills": string[],
  "missing_skills": string[],
  "strengths": string[],
  "weaknesses": string[],
  "summary": string
}
Rules:
- score must be an integer from 0 to 100.
- career_level must be one short label such as Entry-level, Mid-level, Senior, Lead, Executive.
- Arrays must contain concise unique strings.
- summary must be 2-4 sentences.
- Do not wrap JSON in markdown fences.`;

export const resume_analysis_prompt = (
  resumeText: string
) => `You are Wazivo, an expert AI resume reviewer and ATS specialist.
Analyze the resume below for hiring readiness, ATS compatibility, transferable skills, missing market skills, and role positioning.
Prioritize practical hiring feedback over generic advice.

Resume:
"""
${resumeText}
"""

${analysisSchema}`;

export const resume_rewrite_prompt = (resumeText: string) => `You are an elite resume writer.
Rewrite the following resume into a cleaner, ATS-optimized version.
Requirements:
- Keep claims realistic and grounded in the source resume.
- Use strong action verbs.
- Improve structure and clarity.
- Keep output in plain text.
- Include these sections when the source supports them: Summary, Core Skills, Experience, Projects, Education, Certifications.
- Use concise bullet points and measurable impact where possible.

Resume:
"""
${resumeText}
"""`;

export const cover_letter_prompt = (
  resumeText: string,
  jobDescription: string
) => `You are a professional career coach.
Write a tailored, persuasive cover letter in plain text based on the resume and job description below.
Requirements:
- Keep it professional, modern, and concise.
- Focus on fit, outcomes, and relevant strengths.
- Use a confident but not exaggerated tone.
- Do not invent experiences that are not supported by the resume.

Resume:
"""
${resumeText}
"""

Job description:
"""
${jobDescription}
"""`;
