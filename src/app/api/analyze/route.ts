import { NextRequest, NextResponse } from 'next/server';

import { analyzeResume, type ResumeAnalysis } from '../../../lib/resumeAnalyzer';
import {
  ensureTextLength,
  getCachedJSON,
  getRequesterId,
  hashText,
  normalizeResumeInput,
  rateLimit,
  setCachedJSON,
} from '../../../lib/runtime';

export async function POST(request: NextRequest) {
  try {
    const identifier = getRequesterId(request);
    const limit = await rateLimit(identifier, 'analyze', 3, 60 * 60 * 24);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Daily analysis limit reached. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': String(limit.remaining) } },
      );
    }

    const body = (await request.json().catch(() => null)) as { resumeText?: string } | null;
    const resumeText = normalizeResumeInput(body?.resumeText || '');

    ensureTextLength(resumeText, 'Resume text', 120, 12000);

    const cacheKey = `analysis:${hashText(resumeText)}`;
    const cached = await getCachedJSON<ResumeAnalysis>(cacheKey);

    if (cached) {
      return NextResponse.json(
        { data: cached, cached: true },
        { headers: { 'X-RateLimit-Remaining': String(limit.remaining) } },
      );
    }

    const analysis = await analyzeResume(resumeText);
    await setCachedJSON(cacheKey, analysis, 60 * 60 * 24);

    return NextResponse.json(
      { data: analysis, cached: false },
      { headers: { 'X-RateLimit-Remaining': String(limit.remaining) } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to analyze resume.';
    const status = /at most/.test(message) ? 413 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
