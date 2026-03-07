'use client';

import { useMemo } from 'react';

import {
  buildBaytAffiliateUrl,
  getBaytAffiliateName,
  getBaytCountryCode,
  trackAffiliateClick,
} from '../lib/affiliates';
import { buildJobSearchLinks, type JobSearchLink } from '../lib/careerResources';
import { getDictionary, type Locale } from '../lib/i18n';

type JobMatchesProps = {
  locale: Locale;
  roles: string[];
  links: JobSearchLink[];
  skills: string[];
  careerLevel: string;
};

const REGIONS = ['Egypt', 'Gulf', 'Remote'] as const;

export default function JobMatches({ locale, roles, links, skills, careerLevel }: JobMatchesProps) {
  const dict = getDictionary(locale);

  const resolvedLinks = useMemo(() => {
    if (links.length) {
      return links;
    }
    return buildJobSearchLinks(roles, skills, careerLevel);
  }, [careerLevel, links, roles, skills]);

  function handleAffiliateClick(url: string, platform: string, region: string, query: string) {
    // Track click for analytics
    trackAffiliateClick(platform, region, query);

    // Open in new tab
    const newTab = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newTab) {
      // Fallback if popup blocked
      window.location.href = url;
    }
  }

  if (!roles.length && !resolvedLinks.length) {
    return null;
  }

  const primaryRole = roles[0] || 'Software Engineer';
  const topSkills = skills.slice(0, 2).join(' ');

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{dict.jobs.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{dict.jobs.description}</p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">
          {dict.jobs.badge}
        </span>
      </div>

      {/* Recommended roles */}
      {roles.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {roles.map((role) => (
            <span
              key={role}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              {role}
            </span>
          ))}
        </div>
      )}

      {/* Job search by region */}
      <div className="grid gap-5 lg:grid-cols-3">
        {REGIONS.map((region) => {
          const regionLinks = resolvedLinks.filter((link) => link.region === region);
          const searchQuery = `${careerLevel} ${primaryRole} ${topSkills}`.trim();
          const baytCountry = getBaytCountryCode(region);
          const baytUrl = buildBaytAffiliateUrl(searchQuery, baytCountry);

          return (
            <div key={region} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {/* Region header */}
              <div className="mb-4">
                <h4 className="text-base font-semibold text-slate-900">
                  {dict.jobs.regions[region]}
                </h4>
                <p className="mt-1 text-xs leading-5 text-slate-600">{dict.jobs.regionHint}</p>
              </div>

              {/* Primary: Bayt.com Affiliate Link */}
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() =>
                    handleAffiliateClick(baytUrl, getBaytAffiliateName(), region, searchQuery)
                  }
                  className="group relative w-full overflow-hidden rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-emerald-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-base">🎯</span>
                    {getBaytAffiliateName()}
                    <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      TOP CHOICE
                    </span>
                  </span>
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
                <p className="mt-1.5 text-center text-[10px] leading-tight text-slate-600">
                  5,000+ active {region} jobs • Free to apply
                </p>
              </div>

              {/* Secondary: Other platforms */}
              {regionLinks.length > 0 && (
                <>
                  <div className="mb-2 border-t border-slate-200 pt-3">
                    <p className="text-xs font-medium text-slate-500">Also try:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {regionLinks.slice(0, 4).map((link) => (
                      <button
                        key={`${region}-${link.platform}`}
                        type="button"
                        onClick={() =>
                          handleAffiliateClick(link.url, link.platform, region, link.query)
                        }
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Empty state */}
              {regionLinks.length === 0 && (
                <p className="mt-2 text-center text-xs text-slate-500">
                  More platforms coming soon
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Affiliate disclosure */}
      <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-3">
        <p className="text-xs leading-relaxed text-blue-900">
          💡 <strong>How Wazivo stays free:</strong> We earn a small commission when you apply
          through our job links (at no extra cost to you). This helps us keep all features 100%
          free.{' '}
          <a href="/affiliate-disclosure" className="font-medium underline hover:text-blue-700">
            Learn more
          </a>
        </p>
      </div>
    </section>
  );
}
