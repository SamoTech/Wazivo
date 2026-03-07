import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getDictionary, isRTL, isSupportedLocale, type Locale } from '../../lib/i18n';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isSupportedLocale(params.lang)) {
    notFound();
  }

  const lang = params.lang as Locale;
  const dict = getDictionary(lang);
  const rtl = isRTL(lang);

  return (
    <div lang={lang} dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">
      <main className="flex-grow">{children}</main>

      <footer className="mt-auto bg-slate-100 py-8 text-slate-700">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 font-semibold text-slate-900">{dict.footer.aboutTitle}</h3>
              <p className="text-sm text-slate-600">{dict.footer.aboutText}</p>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-slate-900">{dict.footer.legal}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="transition hover:text-slate-900">
                    {dict.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-slate-900">
                    {dict.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-slate-900">
                    {dict.footer.contact}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-slate-900">{dict.footer.resources}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/SamoTech/Wazivo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-slate-900"
                  >
                    {dict.footer.github}
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-slate-900">
                    {dict.footer.support}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/SamoTech/Wazivo/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-slate-900"
                  >
                    {dict.footer.reportIssue}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm md:flex-row">
            <p className="text-slate-600">
              © {new Date().getFullYear()} Wazivo. {dict.footer.rights}
            </p>
            <div className="flex gap-6 text-slate-600">
              <Link href="/privacy" className="transition hover:text-slate-900">
                {dict.footer.privacy}
              </Link>
              <Link href="/terms" className="transition hover:text-slate-900">
                {dict.footer.terms}
              </Link>
              <Link href="/contact" className="transition hover:text-slate-900">
                {dict.footer.contact}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
