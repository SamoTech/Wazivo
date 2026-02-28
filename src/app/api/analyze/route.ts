import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/app/lib/openaiService';
import { processCVInput } from '@/app/lib/services/cv-processing.service';
import { enrichWithJobOpportunities } from '@/app/lib/services/job-enrichment.service';
import { getUserFriendlyMessage } from '@/app/lib/errors';
import { logger } from '@/app/lib/logger';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Main API route for CV analysis
 * 
 * Flow:
 * 1. Parse CV (file or URL)
 * 2. AI analysis (resume breakdown)
 * 3. Job enrichment (search matching opportunities)
 * 4. Return comprehensive report
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  
  logger.info('CV analysis request started', { requestId });

  try {
    const formData = await request.formData();

    // Step 1: Parse CV text
    const cvText = await processCVInput(formData);

    // Step 2: AI Analysis
    const analysis = await analyzeResume(cvText);

    // Step 3: Job Enrichment
    const { jobs, metadata } = await enrichWithJobOpportunities(
      cvText,
      analysis.candidateSummary,
      (analysis as any).jobSearch
    );

    analysis.jobOpportunities = jobs;

    // Expose search metadata for debugging/display
    (analysis as any).jobSearchMeta = metadata;

    logger.info('CV analysis completed successfully', {
      requestId,
      jobsFound: jobs.length,
      skillsIdentified: analysis.candidateSummary.keySkills.length,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    return handleError(error, requestId);
  }
}

/**
 * Generate unique request ID for tracking
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Handle errors and return appropriate responses
 */
function handleError(error: unknown, requestId: string): NextResponse {
  logger.error('CV analysis failed', {
    requestId,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Convert to user-friendly message
  const userMessage =
    error instanceof Error ? getUserFriendlyMessage(error) : 'An unexpected error occurred';

  // Determine appropriate status code
  let statusCode = 500;
  if (error instanceof Error) {
    const errorName = error.constructor.name;
    if (errorName === 'CVParsingError' || errorName === 'ValidationError') {
      statusCode = 400;
    } else if (errorName === 'RateLimitError') {
      statusCode = 429;
    }
  }

  return NextResponse.json(
    {
      error: userMessage,
      requestId,
    },
    { status: statusCode }
  );
}
