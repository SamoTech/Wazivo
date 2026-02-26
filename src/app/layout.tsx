import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wazivo - Get Hired, Get Wazivo | AI Resume Analyzer',
  description: 'AI-powered CV analysis, job matching, and career intelligence. Upload your resume and find your dream job with Wazivo.',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
