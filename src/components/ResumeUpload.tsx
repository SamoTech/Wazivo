'use client';

import { useMemo, useState } from 'react';

import JobMatches from './JobMatches';
import MissingSkills from './MissingSkills';
import Report from './Report';
import ScoreCard from './ScoreCard';
import SkillsList from './SkillsList';
import type { ResumeAnalysis } from '../lib/resumeAnalyzer';

type ApiError = {
  error: string;
};

type AnalyzeResponse = {
  data: ResumeAnalysis;
  cached?: boolean;
};

function normalizePastedText(value: string) {
  return value.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ');
}

export default function ResumeUpload() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [rewrittenResume, setRewrittenResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loadingAction, setLoadingAction] = useState<'analyze' | 'rewrite' | 'cover-letter' | null>(
    null
  );
  const [error, setError] = useState('');

  const canAnalyze = useMemo(() => resumeText.trim().length >= 120, [resumeText]);
  const canCreateCoverLetter = canAnalyze && jobDescription.trim().length >= 80;

  async function parseJson<T>(response: Response): Promise<T> {
    return (await response.json()) as T;
  }

  async function pasteFromClipboard(target: 'resume' | 'jobDescription') {
    setError('');

    try {
      if (!navigator.clipboard?.readText) {
        throw new Error('Clipboard paste is not supported in this browser.');
      }

      const clipboardText = normalizePastedText(await navigator.clipboard.readText());

      if (!clipboardText.trim()) {
        throw new Error('Clipboard is empty. Copy the CV first, then paste again.');
      }

      if (target === 'resume') {
        setResumeText(clipboardText);
      } else {
        setJobDescription(clipboardText);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to access clipboard. Try Ctrl+V or long-press paste.'
      );
    }
  }

  function handleNativePaste(
    event: React.ClipboardEvent<HTMLTextAreaElement>,
    target: 'resume' | 'jobDescription'
  ) {
    event.preventDefault();
    const pastedText = normalizePastedText(event.clipboardData.getData('text'));

    if (target === 'resume') {
      setResumeText(pastedText);
    } else {
      setJobDescription(pastedText);
    }
  }

  async function handleAnalyze() {
    setLoadingAction('analyze');
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const payload = await parseJson<AnalyzeResponse | ApiError>(response);

      if (!response.ok || 'error' in payload) {
        throw new Error('error' in payload ? payload.error : 'Unable to analyze resume.');
      }

      setAnalysis(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze resume.');
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleRewrite() {
    setLoadingAction('rewrite');
    setError('');

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const payload = (await response.json()) as { data?: { rewritten: string }; error?: string };

      if (!response.ok || payload.error || !payload.data) {
        throw new Error(payload.error || 'Unable to rewrite resume.');
      }

      setRewrittenResume(payload.data.rewritten);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to rewrite resume.');
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleCoverLetter() {
    setLoadingAction('cover-letter');
    setError('');

    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const payload = (await response.json()) as { data?: { coverLetter: string }; error?: string };

      if (!response.ok || payload.error || !payload.data) {
        throw new Error(payload.error || 'Unable to generate cover letter.');
      }

      setCoverLetter(payload.data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate cover letter.');
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-7">
        <div className="mb-6 space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Resume workspace</p>
          <h2 className="text-2xl font-semibold text-white">
            Analyze, rewrite, and tailor applications
          </h2>
          <p className="text-sm leading-6 text-slate-300">
            Paste a resume to generate a hiring-ready report. Add a job description to create a
            customized cover letter.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="resume" className="block text-sm font-medium text-slate-200">
                Resume text
              </label>
              <button
                type="button"
                onClick={() => pasteFromClipboard('resume')}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10"
              >
                Paste CV
              </button>
            </div>
            <textarea
              id="resume"
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              onPaste={(event) => handleNativePaste(event, 'resume')}
              placeholder="Paste the full resume here..."
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-h-[300px] w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
            <p className="mt-2 text-xs text-slate-400">
              Minimum 120 characters. Use Ctrl+V, long-press paste, or the Paste CV button.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-200">
                Job description for cover letter
              </label>
              <button
                type="button"
                onClick={() => pasteFromClipboard('jobDescription')}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10"
              >
                Paste JD
              </button>
            </div>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              onPaste={(event) => handleNativePaste(event, 'jobDescription')}
              placeholder="Paste the target job description here..."
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!canAnalyze || loadingAction !== null}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {loadingAction === 'analyze' ? 'Analyzing...' : 'Analyze resume'}
            </button>
            <button
              type="button"
              onClick={handleRewrite}
              disabled={!canAnalyze || loadingAction !== null}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-slate-500"
            >
              {loadingAction === 'rewrite' ? 'Rewriting...' : 'Rewrite for ATS'}
            </button>
            <button
              type="button"
              onClick={handleCoverLetter}
              disabled={!canCreateCoverLetter || loadingAction !== null}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-violet-500/10 px-5 py-3 text-sm font-medium text-violet-100 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-slate-500"
            >
              {loadingAction === 'cover-letter' ? 'Generating...' : 'Generate cover letter'}
            </button>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-6">
        {analysis ? (
          <>
            <ScoreCard
              score={analysis.score}
              careerLevel={analysis.career_level}
              summary={analysis.summary}
            />
            <JobMatches
              roles={analysis.recommended_roles ?? []}
              links={analysis.job_search_links ?? []}
            />
            <div className="grid gap-6 xl:grid-cols-2">
              <SkillsList skills={analysis.skills} />
              <MissingSkills
                skills={analysis.missing_skills}
                resources={analysis.missing_skill_resources ?? []}
              />
            </div>
            <Report analysis={analysis} />
          </>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-sm leading-7 text-slate-300">
            Results will appear here after analysis. You will get a score, detected skills, missing
            skill gaps, smart job links, free-first learning suggestions, strengths, weaknesses, and
            a professional readiness report.
          </div>
        )}

        {rewrittenResume ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">ATS rewrite</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-200">Plain text</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950/90 p-4 text-sm leading-7 text-slate-200">
              {rewrittenResume}
            </pre>
          </div>
        ) : null}

        {coverLetter ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">Cover letter</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-violet-200">Generated</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950/90 p-4 text-sm leading-7 text-slate-200">
              {coverLetter}
            </pre>
          </div>
        ) : null}
      </section>
    </div>
  );
}
