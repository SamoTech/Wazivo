import OpenAI from 'openai';
import { AnalysisReport } from '../types';

// Groq configuration
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';

// Lazy initialization - only create client when needed
let groqClient: OpenAI | null = null;

function getGroqClient(): OpenAI {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is required. Get your API key from https://console.groq.com');
    }
    // Groq uses OpenAI-compatible API
    groqClient = new OpenAI({ 
      apiKey,
      baseURL: GROQ_API_BASE
    });
  }
  return groqClient;
}

export async function analyzeResume(cvText: string): Promise<AnalysisReport> {
  const groq = getGroqClient();
  
  const systemPrompt = `Analyze this CV and return JSON with: candidateSummary{name,title,experience,keySkills[],location}, weaknessesAndGaps[{category,gap,impact,priority}], recommendedCourses[{title,platform,duration,level,link,addressesGap,skills[],cost}], marketInsights{demandLevel,avgSalaryRange,trendingSkills[]}. Be specific with real course links.`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze: ${cvText}` }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const analysis: AnalysisReport = JSON.parse(response.choices[0].message.content || '{}');
  analysis.jobOpportunities = [];
  return analysis;
}

export async function enhanceJobMatching(cvText: string, skills: string[], title?: string) {
  return { searchQuery: title || skills.slice(0, 3).join(' '), enhancedSkills: skills };
}
