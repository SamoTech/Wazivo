import OpenAI from 'openai';
import { AnalysisReport } from '../types';

const MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Lazy initialization - only create client when needed
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export async function analyzeResume(cvText: string): Promise<AnalysisReport> {
  const openai = getOpenAIClient();
  
  const systemPrompt = `Analyze this CV and return JSON with: candidateSummary{name,title,experience,keySkills[],location}, weaknessesAndGaps[{category,gap,impact,priority}], recommendedCourses[{title,platform,duration,level,link,addressesGap,skills[],cost}], marketInsights{demandLevel,avgSalaryRange,trendingSkills[]}. Be specific with real course links.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze: ${cvText}` }
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  const analysis: AnalysisReport = JSON.parse(response.choices[0].message.content || '{}');
  analysis.jobOpportunities = [];
  return analysis;
}

export async function enhanceJobMatching(cvText: string, skills: string[], title?: string) {
  return { searchQuery: title || skills.slice(0, 3).join(' '), enhancedSkills: skills };
}
