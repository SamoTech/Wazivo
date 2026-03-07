import { buildReportSections } from '../lib/reportGenerator';
import type { ResumeAnalysis } from '../lib/resumeAnalyzer';

type ReportProps = {
  analysis: ResumeAnalysis;
};

export default function Report({ analysis }: ReportProps) {
  const sections = buildReportSections(analysis);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Professional report</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Candidate readiness snapshot</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
          Score: <span className="font-medium text-white">{analysis.score}/100</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
          >
            <h4 className="text-base font-semibold text-white">{section.title}</h4>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {section.items.map((item) => (
                <li key={item} className="rounded-xl bg-white/5 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
