'use client';

import { useMemo, useState } from 'react';

import { getDictionary, isRTL, type Locale } from '../lib/i18n';
import type { ResumeAnalysis } from '../lib/resumeAnalyzer';
import JobMatches from './JobMatches';
import MissingSkills from './MissingSkills';
import Report from './Report';
import ScoreCard from './ScoreCard';
import SkillsList from './SkillsList';

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

export default function ResumeUpload({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);
  const textAlign = rtl ? 'text-right' : 'text-left';
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
        throw new Error(dict.upload.clipboardUnsupported);
      }

      const clipboardText = normalizePastedText(await navigator.clipboard.readText());

      if (!clipboardText.trim()) {
        throw new Error(dict.upload.clipboardEmpty);
      }

      if (target === 'resume') {
        setResumeText(clipboardText);
      } else {
        setJobDescription(clipboardText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.upload.clipboardFailed);
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
        throw new Error('error' in payload ? payload.error : dict.upload.analyzeError);
      }

      setAnalysis(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.upload.analyzeError);
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
        throw new Error(payload.error || dict.upload.rewriteError);
      }

      setRewrittenResume(payload.data.rewritten);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.upload.rewriteError);
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
        throw new Error(payload.error || dict.upload.coverError);
      }

      setCoverLetter(payload.data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.upload.coverError);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <section className={`rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-7 ${textAlign}`}>
        <div className="mb-6 space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{dict.upload.eyebrow}</p>
          <h2 className="text-2xl font-semibold text-white">{dict.upload.title}</h2>
          <p className="text-sm leading-6 text-slate-300">{dict.upload.description}</p>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="resume" className="block text-sm font-medium text-slate-200">
                {dict.upload.resumeLabel}
              </label>
              <button
                type="button"
                onClick={() => pasteFromClipboard('resume')}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10"
              >
                {dict.upload.resumePaste}
              </button>
            </div>
            <textarea
              id="resume"
              dir={rtl ? 'rtl' : 'ltr'}
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              onPaste={(event) => handleNativePaste(event, 'resume')}
              placeholder={dict.upload.resumePlaceholder}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-h-[300px] w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
            <p className="mt-2 text-xs text-slate-400">{dict.upload.resumeHint}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-200">
                {dict.upload.jobLabel}
              </label>
              <button
                type="button"
                onClick={() => pasteFromClipboard('jobDescription')}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10"
              >
                {dict.upload.jobPaste}
              </button>
            </div>
            <textarea
              id="jobDescription"
              dir={rtl ? 'rtl' : 'ltr'}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              onPaste={(event) => handleNativePaste(event, 'jobDescription')}
              placeholder={dict.upload.jobPlaceholder}
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
              {loadingAction === 'analyze' ? dict.upload.analyzing : dict.upload.analyze}
            </button>
            <button
              type="button"
              onClick={handleRewrite}
              disabled={!canAnalyze || loadingAction !== null}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-slate-500"
            >
              {loadingAction === 'rewrite' ? dict.upload.rewriting : dict.upload.rewrite}
            </button>
            <button
              type="button"
              onClick={handleCoverLetter}
              disabled={!canCreateCoverLetter || loadingAction !== null}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-violet-500/10 px-5 py-3 text-sm font-medium text-violet-100 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-slate-500"
            >
              {loadingAction === 'cover-letter' ? dict.upload.generating : dict.upload.coverLetter}
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
              locale={locale}
              score={analysis.score}
              careerLevel={analysis.career_level}
              summary={analysis.summary}
            />
            <JobMatches
              locale={locale}
              roles={analysis.recommended_roles ?? []}
              links={analysis.job_search_links ?? []}
              skills={analysis.skills ?? []}
              careerLevel={analysis.career_level ?? 'Mid-level'}
            />
            <div className="grid gap-6 xl:grid-cols-2">
              <SkillsList skills={analysis.skills} />
              <MissingSkills
                locale={locale}
                skills={analysis.missing_skills}
                resources={analysis.missing_skill_resources ?? []}
              />
            </div>
            <Report analysis={analysis} />
          </>
        ) : (
          <div className={`rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-sm leading-7 text-slate-300 ${textAlign}`}>
            {dict.upload.emptyState}
          </div>
        )}

        {rewrittenResume ? (
          <div className={`rounded-[2rem] border border-white/10 bg-white/5 p-6 ${textAlign}`}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">{dict.upload.atsRewrite}</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-200">{dict.upload.plainText}</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950/90 p-4 text-sm leading-7 text-slate-200">
              {rewrittenResume}
            </pre>
          </div>
        ) : null}

        {coverLetter ? (
          <div className={`rounded-[2rem] border border-white/10 bg-white/5 p-6 ${textAlign}`}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">{dict.upload.coverLetterTitle}</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-violet-200">{dict.upload.generated}</span>
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
