import { NextRequest, NextResponse } from 'next/server';
import { parseCV, fetchCVFromURL } from '@/app/lib/cvParser';
import { analyzeResume, enhanceJobMatching } from '@/app/lib/openaiService';
import { searchJobs } from '@/app/lib/jobSearchService';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    let cvText: string;

    // Step 1: Parse CV
    try {
      if (type === 'file') {
        const file = formData.get('file') as File;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        const buffer = Buffer.from(await file.arrayBuffer());
        cvText = await parseCV(buffer, file.type);
      } else {
        const url = formData.get('url') as string;
        if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
        cvText = await fetchCVFromURL(url);
      }
    } catch (parseError: any) {
      console.error('CV parsing error:', parseError);
      return NextResponse.json({ 
        error: `Failed to parse CV: ${parseError.message}` 
      }, { status: 400 });
    }

    if (cvText.length < 100) {
      return NextResponse.json({ 
        error: 'Insufficient text extracted from CV. Please ensure the file is readable.' 
      }, { status: 400 });
    }

    // Step 2: AI Analysis (most important)
    let analysis;
    try {
      analysis = await analyzeResume(cvText);
    } catch (aiError: any) {
      console.error('AI analysis error:', aiError);
      return NextResponse.json({ 
        error: `AI analysis failed: ${aiError.message}. Please check your GROQ_API_KEY.` 
      }, { status: 500 });
    }

    // Step 3: Job Matching (optional - don't fail if this errors)
    try {
      const { enhancedSkills } = await enhanceJobMatching(
        cvText, 
        analysis.candidateSummary.keySkills, 
        analysis.candidateSummary.title
      );
      const jobs = await searchJobs(
        enhancedSkills, 
        analysis.candidateSummary.title, 
        analysis.candidateSummary.location
      );
      analysis.jobOpportunities = jobs;
    } catch (jobError: any) {
      console.error('Job search error:', jobError);
      // Don't fail - just provide empty jobs or fallback
      analysis.jobOpportunities = [];
    }

    return NextResponse.json(analysis);
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error.message || 'Analysis failed unexpectedly. Please try again.' 
    }, { status: 500 });
  }
}
