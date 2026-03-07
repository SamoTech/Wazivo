type ScoreCardProps = {
  score: number;
  careerLevel: string;
  summary: string;
};

export default function ScoreCard({ score, careerLevel, summary }: ScoreCardProps) {
  const tone = score >= 80 ? 'emerald' : score >= 60 ? 'amber' : 'rose';
  const toneMap = {
    emerald: 'from-emerald-400/20 to-emerald-500/5 text-emerald-200 border-emerald-400/20',
    amber: 'from-amber-400/20 to-amber-500/5 text-amber-200 border-amber-400/20',
    rose: 'from-rose-400/20 to-rose-500/5 text-rose-200 border-rose-400/20',
  } as const;

  return (
    <div className={`rounded-3xl border bg-gradient-to-br p-6 ${toneMap[tone]}`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Resume score</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-5xl font-semibold text-white">{score}</span>
            <span className="pb-1 text-sm text-slate-300">/ 100</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Career level</p>
          <p className="mt-1 text-lg font-medium text-white">{careerLevel}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-200">{summary}</p>
    </div>
  );
}
