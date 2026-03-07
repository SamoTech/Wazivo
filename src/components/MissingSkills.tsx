import type { MissingSkillResource } from '../lib/careerResources';
import { getDictionary, type Locale } from '../lib/i18n';

type MissingSkillsProps = {
  locale: Locale;
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
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-violet-200 bg-violet-50 text-violet-700';

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${toneStyles}`}>
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
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            {item.provider}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function MissingSkills({ locale, skills, resources = [] }: MissingSkillsProps) {
  const dict = getDictionary(locale);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{dict.missingSkills.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{dict.missingSkills.description}</p>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-700">
          {dict.missingSkills.badge}
        </span>
      </div>
      <div className="space-y-4">
        {resources.length ? (
          resources.map((resource) => (
            <div
              key={resource.skill}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              <div className="mb-4">
                <h4 className="text-base font-semibold text-slate-900">{resource.skill}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{resource.reason}</p>
              </div>
              <div className="space-y-4">
                <ResourceLinks title={dict.missingSkills.free} items={resource.freeCourses} tone="free" />
                <ResourceLinks title={dict.missingSkills.paid} items={resource.paidCourses} tone="paid" />
              </div>
            </div>
          ))
        ) : skills.length ? (
          skills.map((skill) => (
            <div
              key={skill}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              {skill}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">{dict.missingSkills.empty}</p>
        )}
      </div>
    </section>
  );
}
