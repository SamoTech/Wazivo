import { notFound } from 'next/navigation';

import LanguageSwitcher from '../../components/LanguageSwitcher';
import ResumeUpload from '../../components/ResumeUpload';
import { getDictionary, isRTL, isSupportedLocale, type Locale } from '../../lib/i18n';

export default function LocalizedHomePage({ params }: { params: { lang: string } }) {
  if (!isSupportedLocale(params.lang)) {
    notFound();
  }

  const lang = params.lang as Locale;
  const dict = getDictionary(lang);
  const rtl = isRTL(lang);
  const textAlign = rtl ? 'text-right' : 'text-left';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex justify-end">
          <LanguageSwitcher locale={lang} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className={`space-y-6 ${textAlign}`}>
            <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
              {dict.hero.badge}
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {dict.hero.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {dict.hero.description}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {dict.hero.highlights.map((item) => (
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
            <div
              className={`space-y-5 rounded-[1.35rem] border border-white/10 bg-slate-950/70 p-6 ${textAlign}`}
            >
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                  {dict.hero.trustEyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{dict.hero.trustTitle}</h2>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-slate-300">
                {dict.hero.trustItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ResumeUpload locale={lang} />
      </section>
    </main>
  );
}
