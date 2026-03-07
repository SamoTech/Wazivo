import type { MissingSkillResource } from '../lib/careerResources';

type MissingSkillsProps = {
  skills: string[];
  resources?: MissingSkillResource[];
};

function ResourceLinks({
  title,
  items,
  tone,
}: {
  title: string;
  items: MissingSkillResource['freeCourses'];
  tone: 'free' | 'paid';
}) {
  const toneStyles =
    tone === 'free'
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
      : 'border-violet-400/20 bg-violet-400/10 text-violet-200';

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${toneStyles}`}
        >
          {title}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={`${title}-${item.provider}-${item.title}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            {item.provider}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function MissingSkills({ skills, resources = [] }: MissingSkillsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Missing market skills</h3>
          <p className="mt-1 text-sm text-slate-400">
            Prioritized gaps with free learning paths first, then paid options.
          </p>
        </div>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
          Priority gaps
        </span>
      </div>
      <div className="space-y-4">
        {resources.length ? (
          resources.map((resource) => (
            <div
              key={resource.skill}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200"
            >
              <div className="mb-4">
                <h4 className="text-base font-semibold text-white">{resource.skill}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">{resource.reason}</p>
              </div>
              <div className="space-y-4">
                <ResourceLinks
                  title="Free courses first"
                  items={resource.freeCourses}
                  tone="free"
                />
                <ResourceLinks title="Paid options" items={resource.paidCourses} tone="paid" />
              </div>
            </div>
          ))
        ) : skills.length ? (
          skills.map((skill) => (
            <div
              key={skill}
              className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
            >
              {skill}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No major missing skills detected for the current profile.
          </p>
        )}
      </div>
    </section>
  );
}
