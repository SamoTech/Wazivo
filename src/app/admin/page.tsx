'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AffiliateClick {
  platform: string;
  region: string;
  query: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wazivo_affiliate_clicks');
      if (stored) {
        setClicks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load clicks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const totalClicks = clicks.length;
  const baytClicks = clicks.filter((c) => c.platform === 'Bayt.com').length;
  const estimatedRevenue = baytClicks * 3; // Assume $3 avg commission

  const clicksByRegion = clicks.reduce(
    (acc, click) => {
      acc[click.region] = (acc[click.region] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Affiliate Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Track your Bayt.com referrals</p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Wazivo
          </Link>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Total Job Clicks</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">{totalClicks}</p>
            <p className="mt-1 text-xs text-slate-500">All platforms</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-emerald-700">Bayt.com Clicks</p>
            <p className="mt-2 text-4xl font-bold text-emerald-900">{baytClicks}</p>
            <p className="mt-1 text-xs text-emerald-600">
              {totalClicks > 0 ? Math.round((baytClicks / totalClicks) * 100) : 0}% of total
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-700">Estimated Revenue</p>
            <p className="mt-2 text-4xl font-bold text-blue-900">${estimatedRevenue}</p>
            <p className="mt-1 text-xs text-blue-600">@ $3/apply average</p>
          </div>
        </div>

        {/* Clicks by region */}
        {Object.keys(clicksByRegion).length > 0 && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Clicks by Region</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(clicksByRegion).map(([region, count]) => (
                <div key={region} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">{region}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent clicks */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Recent Clicks</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : clicks.length === 0 ? (
            <p className="text-sm text-slate-500">
              No clicks yet. Start by analyzing a resume and clicking job links!
            </p>
          ) : (
            <div className="space-y-3">
              {clicks
                .slice(-20)
                .reverse()
                .map((click, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{click.platform}</p>
                      <p className="text-sm text-slate-600">
                        {click.region} • {click.query}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(click.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm leading-relaxed text-blue-900">
            <strong>Note:</strong> This dashboard tracks clicks from your browser only. For official
            earnings and conversions, check your{' '}
            <a
              href="https://www.bayt.com/en/affiliates/reports/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              Bayt.com Affiliate Dashboard
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
