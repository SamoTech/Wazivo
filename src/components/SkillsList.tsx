type SkillsListProps = {
  skills: string[];
};

export default function SkillsList({ skills }: SkillsListProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Detected skills</h3>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
          {skills.length} total
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-400">No explicit skills were extracted yet.</p>
        )}
      </div>
    </section>
  );
}
