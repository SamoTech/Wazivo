import { NextRequest, NextResponse } from 'next/server';

import { generateCoverLetter } from '../../../../lib/resumeAnalyzer';
import { ensureTextLength, getRequesterId, normalizeResumeInput, rateLimit } from '../../../../lib/runtime';

export async function POST(request: NextRequest) {
  try {
    const identifier = getRequesterId(request);
    const limit = await rateLimit(identifier, 'cover-letter', 10, 60 * 60);

    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many cover letter requests. Please try again soon.' }, { status: 429 });
    }

    const body = (await request.json().catch(() => null)) as {
      resumeText?: string;
      jobDescription?: string;
    } | null;

    const resumeText = normalizeResumeInput(body?.resumeText || '');
    const jobDescription = normalizeResumeInput(body?.jobDescription || '');

    ensureTextLength(resumeText, 'Resume text', 120, 12000);
    ensureTextLength(jobDescription, 'Job description', 80, 8000);

    const coverLetter = await generateCoverLetter(resumeText, jobDescription);

    return NextResponse.json({ data: { coverLetter } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate cover letter.';
    const status = /at most/.test(message) ? 413 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
