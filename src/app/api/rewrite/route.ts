import { NextRequest, NextResponse } from 'next/server';

import { rewriteResumeForATS } from '../../../../lib/resumeAnalyzer';
import { ensureTextLength, getRequesterId, normalizeResumeInput, rateLimit } from '../../../../lib/runtime';

export async function POST(request: NextRequest) {
  try {
    const identifier = getRequesterId(request);
    const limit = await rateLimit(identifier, 'rewrite', 10, 60 * 60);

    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many rewrite requests. Please try again soon.' }, { status: 429 });
    }

    const body = (await request.json().catch(() => null)) as { resumeText?: string } | null;
    const resumeText = normalizeResumeInput(body?.resumeText || '');

    ensureTextLength(resumeText, 'Resume text', 120, 12000);

    const rewritten = await rewriteResumeForATS(resumeText);

    return NextResponse.json({ data: { rewritten } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to rewrite resume.';
    const status = /at most/.test(message) ? 413 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
