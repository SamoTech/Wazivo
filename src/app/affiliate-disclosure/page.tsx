import Link from 'next/link';

export const metadata = {
  title: 'Affiliate Disclosure | Wazivo',
  description: 'How Wazivo earns commission to stay free forever',
};

export default function AffiliateDisclosure() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
        >
          ← Back to Wazivo
        </Link>

        {/* Content card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">Affiliate Disclosure</h1>

          <div className="prose prose-slate max-w-none">
            <h2 className="mt-8 text-xl font-semibold text-slate-900">
              How Wazivo Stays 100% Free
            </h2>
            <p className="leading-relaxed text-slate-700">
              Wazivo is completely free for all users—no paywalls, no hidden fees, no credit cards
              required, forever. To sustain this mission, we partner with trusted job boards and
              earn a small referral commission when you apply for jobs through our links.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">What This Means for You</h2>
            <ul className="space-y-2 text-slate-700">
              <li>
                <strong>You pay nothing extra.</strong> Job applications are always free on our
                partner platforms.
              </li>
              <li>
                <strong>We earn a referral fee.</strong> When you click our job links and complete
                your profile or apply, our partners compensate us.
              </li>
              <li>
                <strong>Your data stays private.</strong> We never sell your resume or personal
                information to third parties.
              </li>
              <li>
                <strong>No impact on your applications.</strong> Employers see your application
                exactly the same way as any other candidate.
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">Our Promise</h2>
            <p className="leading-relaxed text-slate-700">
              We only recommend job platforms we genuinely believe are valuable for job seekers in
              Egypt, the Gulf, and remote positions. Commission never influences our core resume
              analysis—your ATS score, skills assessment, and feedback are always calculated
              objectively using AI.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">Current Partners</h2>
            <ul className="space-y-2 text-slate-700">
              <li>
                <strong>Bayt.com:</strong> The Middle East's largest job board with 5+ million
                listings across Egypt, UAE, Saudi Arabia, and more.
              </li>
              <li>
                <em>More partners coming soon as we grow.</em>
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">Transparency</h2>
            <p className="leading-relaxed text-slate-700">
              This disclosure is made in accordance with the Federal Trade Commission's guidelines
              on endorsements and testimonials. We believe in full transparency about how we sustain
              our free service.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">Questions?</h2>
            <p className="leading-relaxed text-slate-700">
              If you have any questions about our affiliate relationships or how we operate, please
              reach out:
            </p>
            <ul className="space-y-2 text-slate-700">
              <li>
                Email:{' '}
                <a
                  href="mailto:hello@wazivo.app"
                  className="font-medium text-emerald-600 hover:underline"
                >
                  hello@wazivo.app
                </a>
              </li>
              <li>
                GitHub:{' '}
                <a
                  href="https://github.com/SamoTech/Wazivo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-600 hover:underline"
                >
                  SamoTech/Wazivo
                </a>
              </li>
            </ul>

            <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-sm font-medium text-emerald-900">
                ✅ Updated: March 2026
                <br />✅ Affiliate Program: Bayt.com (Account ID: 1514103)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
