'use client';

import { useMemo } from 'react';

import { buildJobSearchLinks, type JobSearchLink } from '../lib/careerResources';

type JobMatchesProps = {
  roles: string[];
  links: JobSearchLink[];
  skills: string[];
  careerLevel: string;
};

const REGIONS = ['Egypt', 'Gulf', 'Remote'] as const;

export default function JobMatches({ roles, links, skills, careerLevel }: JobMatchesProps) {
  const resolvedLinks = useMemo(() => {
    if (links.length) {
      return links;
    }

    return buildJobSearchLinks(roles, skills, careerLevel);
  }, [careerLevel, links, roles, skills]);

  function openJobLink(url: string) {
    const newTab = window.open(url, '_blank', 'noopener,noreferrer');

    if (!newTab) {
      window.location.href = url;
    }
  }

  if (!roles.length && !resolvedLinks.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Find jobs</h3>
          <p className="mt-1 text-sm text-slate-400">
            Smart job-search links generated from your CV for Egypt, Gulf, and remote markets.
          </p>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
          Smart links
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {roles.map((role) => (
          <span
            key={role}
            className="rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200"
          >
            {role}
          </span>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {REGIONS.map((region) => {
          const regionLinks = resolvedLinks.filter((link) => link.region === region);

          return (
            <div key={region} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div className="mb-4">
                <h4 className="text-base font-semibold text-white">{region}</h4>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Search using the strongest role detected from the CV.
                </p>
              </div>
              {regionLinks.length ? (
                <div className="flex flex-wrap gap-2">
                  {regionLinks.map((link) => (
                    <button
                      key={`${region}-${link.platform}`}
                      type="button"
                      onClick={() => openJobLink(link.url)}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-200 transition hover:bg-white/10"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs leading-6 text-slate-500">
                  Job links will appear after the role and market query are generated.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
