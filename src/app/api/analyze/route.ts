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

    if (cvText.length < 100) {
      return NextResponse.json({ error: 'Insufficient text extracted' }, { status: 400 });
    }

    const analysis = await analyzeResume(cvText);
    const { enhancedSkills } = await enhanceJobMatching(cvText, analysis.candidateSummary.keySkills, analysis.candidateSummary.title);
    const jobs = await searchJobs(enhancedSkills, analysis.candidateSummary.title, analysis.candidateSummary.location);
    analysis.jobOpportunities = jobs;

    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
