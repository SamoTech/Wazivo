import Link from 'next/link';

import { getDictionary, type Locale } from '../lib/i18n';

type LanguageSwitcherProps = {
  locale: Locale;
};

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const dict = getDictionary(locale);

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
      <span className="text-slate-400">{dict.languageSwitch.current}</span>
      <Link
        href="/en"
        className={`rounded-xl px-3 py-1 transition ${locale === 'en' ? 'bg-white text-slate-950' : 'hover:bg-white/10'}`}
      >
        {dict.languageSwitch.en}
      </Link>
      <Link
        href="/ar"
        className={`rounded-xl px-3 py-1 transition ${locale === 'ar' ? 'bg-white text-slate-950' : 'hover:bg-white/10'}`}
      >
        {dict.languageSwitch.ar}
      </Link>
    </div>
  );
}
