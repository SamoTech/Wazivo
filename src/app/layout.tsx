import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wazivo - Get Hired, Get Wazivo | AI Resume Analyzer',
  description:
    'AI-powered CV analysis, job matching, and career intelligence. Upload your resume and find your dream job with Wazivo.',
  keywords: 'resume analyzer, CV analysis, job search, AI career tool, Wazivo, وظيفو, get hired',
  authors: [{ name: 'SamoTech' }],
  openGraph: {
    title: 'Wazivo - Get Hired, Get Wazivo',
    description: 'AI-powered resume analysis and job matching platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>

          <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                {/* About */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Wazivo</h3>
                  <p className="text-sm text-gray-400">
                    AI-powered resume analysis and job matching platform. Get hired faster with
                    intelligent career insights.
                  </p>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Legal</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/privacy" className="hover:text-white transition">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="hover:text-white transition">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-white transition">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="https://github.com/SamoTech/Wazivo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition"
                      >
                        GitHub
                      </a>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-white transition">
                        Support
                      </Link>
                    </li>
                    <li>
                      <a
                        href="https://github.com/SamoTech/Wazivo/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition"
                      >
                        Report Issue
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
                <p className="text-gray-400 mb-4 md:mb-0">
                  © {new Date().getFullYear()} Wazivo. All rights reserved.
                </p>
                <div className="flex space-x-6 text-gray-400">
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy
                  </Link>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms
                  </Link>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
