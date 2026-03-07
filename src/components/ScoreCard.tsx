import { getDictionary, type Locale } from '../lib/i18n';

type ScoreCardProps = {
  locale: Locale;
  score: number;
  careerLevel: string;
  summary: string;
};

export default function ScoreCard({ locale, score, careerLevel, summary }: ScoreCardProps) {
  const dict = getDictionary(locale);
  const tone = score >= 80 ? 'emerald' : score >= 60 ? 'amber' : 'rose';
  const toneMap = {
    emerald: 'from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'from-amber-100 to-amber-50 text-amber-700 border-amber-200',
    rose: 'from-rose-100 to-rose-50 text-rose-700 border-rose-200',
  } as const;

  return (
    <div className={`rounded-3xl border bg-gradient-to-br p-6 shadow-sm ${toneMap[tone]}`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{dict.scoreCard.score}</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-5xl font-semibold text-slate-900">{score}</span>
            <span className="pb-1 text-sm text-slate-600">/ 100</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{dict.scoreCard.careerLevel}</p>
          <p className="mt-1 text-lg font-medium text-slate-900">{careerLevel}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-700">{summary}</p>
    </div>
  );
}
