import ResumeUpload from '../components/ResumeUpload';

const highlights = [
  'Structured AI resume scoring',
  'ATS rewrite generation',
  'Missing skill detection',
  'Cover letter creation',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
              AI career assistant for modern hiring
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Turn any resume into a clear, ATS-ready hiring story.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Wazivo analyzes resume quality, surfaces missing market skills, rewrites weak content, and helps candidates ship stronger applications without creating an account.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 via-cyan-400/10 to-violet-500/10 p-6 shadow-2xl shadow-cyan-950/30">
            <div className="space-y-5 rounded-[1.35rem] border border-white/10 bg-slate-950/70 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Why teams will trust it</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Built like a real product MVP</h2>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-slate-300">
                <li>Typed APIs with safe JSON responses</li>
                <li>Groq-backed analysis with heuristic fallback</li>
                <li>Hash-based caching and anonymous rate limiting</li>
                <li>Responsive dashboard UI for analysis, rewrite, and cover letters</li>
              </ul>
            </div>
          </div>
        </div>

        <ResumeUpload />
      </section>
    </main>
  );
}
