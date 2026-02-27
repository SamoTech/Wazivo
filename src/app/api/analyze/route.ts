import { NextRequest, NextResponse } from 'next/server';
import { parseCV, fetchCVFromURL } from '@/app/lib/cvParser';
import { analyzeResume, enhanceJobMatching } from '@/app/lib/openaiService';
import { searchJobs } from '@/app/lib/jobSearchService';
import { UPLOAD_TYPE, MIN_CV_TEXT_LENGTH } from '@/app/lib/constants';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    let cvText: string;

    // ── Step 1: Parse CV ──────────────────────────────────────────
    try {
      if (type === UPLOAD_TYPE.FILE) {
        const file = formData.get('file') as File;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        const buffer = Buffer.from(await file.arrayBuffer());
        cvText = await parseCV(buffer, file.type);
      } else if (type === UPLOAD_TYPE.URL) {
        const url = formData.get('url') as string;
        if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
        cvText = await fetchCVFromURL(url);
      } else {
        return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
      }
    } catch (parseError: any) {
      return NextResponse.json({ error: `Failed to parse CV: ${parseError.message}` }, { status: 400 });
    }

    if (cvText.length < MIN_CV_TEXT_LENGTH) {
      return NextResponse.json({
        error: 'Insufficient text extracted from CV. Please ensure the file is readable.',
      }, { status: 400 });
    }

    // ── Step 2: AI Analysis ───────────────────────────────────────────
    let analysis: any;
    try {
      analysis = await analyzeResume(cvText);
    } catch (aiError: any) {
      return NextResponse.json({
        error: `AI analysis failed: ${aiError.message}. Please check your GROQ_API_KEY.`,
      }, { status: 500 });
    }

    // ── Step 3: Job Search ────────────────────────────────────────────
    try {
      const jobSearch = analysis.jobSearch;  // AI-generated search block
      const summary   = analysis.candidateSummary;

      const { searchQuery, alternativeQueries, enhancedSkills } = await enhanceJobMatching(
        cvText,
        summary?.keySkills || [],
        summary?.title,
        jobSearch,
      );

      // Search with primary query + top alternative
      const queriesToSearch = [searchQuery, ...(alternativeQueries || []).slice(0, 1)];
      const location = summary?.location || '';

      const jobResults = await Promise.allSettled(
        queriesToSearch.map(q => searchJobs(enhancedSkills, q, location))
      );

      // Merge and deduplicate results
      const allJobs: any[] = [];
      const seen = new Set<string>();
      for (const result of jobResults) {
        if (result.status === 'fulfilled') {
          for (const job of result.value) {
            const key = `${job.title}|${job.company}`;
            if (!seen.has(key)) {
              seen.add(key);
              allJobs.push(job);
            }
          }
        }
      }

      analysis.jobOpportunities = allJobs;

      // Expose search metadata for debugging / display
      analysis.jobSearchMeta = {
        primaryQuery: searchQuery,
        alternativeQueries,
        location,
      };

    } catch (jobError: any) {
      console.error('Job search error:', jobError);
      analysis.jobOpportunities = [];
    }

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      error: error.message || 'Analysis failed unexpectedly. Please try again.',
    }, { status: 500 });
  }
}
