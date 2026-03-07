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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex justify-end">
          <LanguageSwitcher locale={lang} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className={`space-y-6 ${textAlign}`}>
            <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {dict.hero.badge}
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                {dict.hero.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {dict.hero.description}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {dict.hero.highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-cyan-50 to-violet-50 p-6 shadow-lg">
            <div
              className={`space-y-5 rounded-[1.35rem] border border-slate-200 bg-white p-6 ${textAlign}`}
            >
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  {dict.hero.trustEyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {dict.hero.trustTitle}
                </h2>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
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
