'use client';
import Link from 'next/link';
import { Briefcase, ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">Last updated: February 27, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Wazivo ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our AI-powered resume 
              analysis service at wazivo.vercel.app.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">1.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Resume/CV Content:</strong> Text and information extracted from your uploaded resume files</li>
              <li><strong>URLs:</strong> Web addresses you provide for resume fetching</li>
              <li><strong>Analysis Results:</strong> AI-generated insights, skill assessments, and recommendations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">1.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Performance Data:</strong> Error logs, loading times, API response times</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use your information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Resume Analysis:</strong> Process your CV using AI to provide career insights</li>
              <li><strong>Job Matching:</strong> Search for relevant job opportunities based on your skills</li>
              <li><strong>Course Recommendations:</strong> Suggest learning resources to fill skill gaps</li>
              <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance our platform</li>
              <li><strong>Technical Support:</strong> Diagnose and resolve technical issues</li>
              <li><strong>Security:</strong> Protect against fraud, abuse, and security threats</li>
            </ul>
          </section>

          {/* Data Storage and Processing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Storage and Processing</h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-blue-900 font-semibold">⚡ Important: We Do NOT Store Your Resume</p>
              <p className="text-blue-800 mt-2">
                Your resume is processed in real-time and is NOT permanently stored on our servers. 
                Once the analysis is complete, the resume data is discarded.
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Resume content is processed in memory only</li>
              <li>Analysis results are displayed in your browser session</li>
              <li>No database storage of personal CV information</li>
              <li>Server logs are retained for 30 days for debugging purposes</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-700 mb-3">We use the following third-party services:</p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">Groq AI (LLaMA 3.3)</h4>
                <p className="text-gray-700 text-sm">Purpose: AI-powered resume analysis</p>
                <p className="text-gray-700 text-sm">Data shared: Resume text content</p>
                <p className="text-gray-700 text-sm">Privacy: <a href="https://groq.com/privacy-policy/" target="_blank" className="text-blue-600 hover:underline">Groq Privacy Policy</a></p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800">Jina Reader API</h4>
                <p className="text-gray-700 text-sm">Purpose: Web page content extraction (for URL uploads)</p>
                <p className="text-gray-700 text-sm">Data shared: URLs you provide</p>
                <p className="text-gray-700 text-sm">Privacy: <a href="https://jina.ai/privacy/" target="_blank" className="text-blue-600 hover:underline">Jina AI Privacy Policy</a></p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800">Job Search APIs (Adzuna, JSearch)</h4>
                <p className="text-gray-700 text-sm">Purpose: Job opportunity matching</p>
                <p className="text-gray-700 text-sm">Data shared: Skills and job titles extracted from your resume</p>
                <p className="text-gray-700 text-sm">Privacy: No personal information is shared</p>
              </div>

              <div className="border-l-4 border-gray-500 pl-4">
                <h4 className="font-semibold text-gray-800">Vercel (Hosting)</h4>
                <p className="text-gray-700 text-sm">Purpose: Website hosting and delivery</p>
                <p className="text-gray-700 text-sm">Data shared: Anonymous usage metrics</p>
                <p className="text-gray-700 text-sm">Privacy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" className="text-blue-600 hover:underline">Vercel Privacy Policy</a></p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-3">
              We use browser localStorage for rate limiting purposes only. No cookies are used for tracking or advertising.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>localStorage:</strong> Rate limiting (prevents abuse)</li>
              <li><strong>Session Storage:</strong> Temporary analysis results (cleared on tab close)</li>
              <li><strong>No third-party tracking cookies</strong></li>
              <li><strong>No advertising cookies</strong></li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-3">You have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request information about data we process</li>
              <li><strong>Deletion:</strong> Request deletion of your data (though we don't store resumes)</li>
              <li><strong>Correction:</strong> Correct any inaccurate information</li>
              <li><strong>Opt-out:</strong> Stop using our service at any time</li>
              <li><strong>Data Portability:</strong> Download your analysis results</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, contact us at: <a href="mailto:samo.hossam@gmail.com" className="text-blue-600 hover:underline">samo.hossam@gmail.com</a>
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
            <p className="text-gray-700 mb-3">We implement security measures including:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure API key management</li>
              <li>Regular security audits</li>
              <li>No permanent storage of sensitive resume data</li>
              <li>Rate limiting to prevent abuse</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700">
              Our service is not intended for individuals under 16 years of age. We do not knowingly collect 
              personal information from children. If you believe we have collected data from a child, please 
              contact us immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700">
              Our service is hosted on Vercel's global infrastructure. Your data may be processed in countries 
              outside your residence. We ensure appropriate safeguards are in place for international transfers.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this privacy policy from time to time. The "Last updated" date at the top will 
              reflect the latest revision. Continued use of Wazivo after changes constitutes acceptance of 
              the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">If you have questions about this privacy policy, please contact:</p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Developer:</strong> Ossama Hashim (SamoTech)</p>
                <p><strong>Email:</strong> <a href="mailto:samo.hossam@gmail.com" className="text-blue-600 hover:underline">samo.hossam@gmail.com</a></p>
                <p><strong>GitHub:</strong> <a href="https://github.com/SamoTech/Wazivo" target="_blank" className="text-blue-600 hover:underline">github.com/SamoTech/Wazivo</a></p>
                <p><strong>Website:</strong> <a href="https://wazivo.vercel.app" className="text-blue-600 hover:underline">wazivo.vercel.app</a></p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-4 text-sm text-gray-600">
          <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          <span>•</span>
          <Link href="/" className="hover:text-blue-600">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
