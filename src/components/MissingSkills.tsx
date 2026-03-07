type MissingSkillsProps = {
  skills: string[];
};

export default function MissingSkills({ skills }: MissingSkillsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Missing market skills</h3>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
          Priority gaps
        </span>
      </div>
      <div className="space-y-3">
        {skills.length ? (
          skills.map((skill) => (
            <div key={skill} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
              {skill}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No major missing skills detected for the current profile.</p>
        )}
      </div>
    </section>
  );
}
