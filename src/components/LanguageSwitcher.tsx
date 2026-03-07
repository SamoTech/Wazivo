import Link from 'next/link';

import { getDictionary, type Locale } from '../lib/i18n';

type LanguageSwitcherProps = {
  locale: Locale;
};

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const dict = getDictionary(locale);

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
      <span className="text-slate-500">{dict.languageSwitch.current}</span>
      <Link
        href="/en"
        className={`rounded-xl px-3 py-1 transition ${locale === 'en' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
      >
        {dict.languageSwitch.en}
      </Link>
      <Link
        href="/ar"
        className={`rounded-xl px-3 py-1 transition ${locale === 'ar' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
      >
        {dict.languageSwitch.ar}
      </Link>
    </div>
  );
}
