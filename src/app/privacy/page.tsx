import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Wazivo',
  description: 'Privacy policy for Wazivo - AI-powered resume analyzer',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: February 28, 2026</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Wazivo ("we", "our", or "us"). We are committed to protecting your personal
              information and your right to privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.1 Information You Provide
            </h3>
            <p className="text-gray-700 leading-relaxed">When you use Wazivo, we may collect:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Resume/CV Content:</strong> Text extracted from uploaded files or URLs
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with our service
              </li>
              <li>
                <strong>Technical Data:</strong> Browser type, IP address, device information
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Device information and unique identifiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed">We use the collected information to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide and improve our AI-powered resume analysis service</li>
              <li>Generate personalized job recommendations</li>
              <li>Identify skill gaps and suggest relevant courses</li>
              <li>Maintain and improve website functionality</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Data Sharing and Disclosure
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4.1 Third-Party Services
            </h3>
            <p className="text-gray-700 leading-relaxed">We may share your information with:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Groq (AI Analysis):</strong> Resume text for AI-powered analysis
              </li>
              <li>
                <strong>Adzuna/JSearch (Job APIs):</strong> Skills and preferences for job matching
              </li>
              <li>
                <strong>Jina AI (URL Fetching):</strong> URLs you provide for content extraction
              </li>
              <li>
                <strong>Vercel (Hosting):</strong> Technical data for website hosting
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 We Do NOT Share:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Your personal information with advertisers</li>
              <li>Your resume content with employers without consent</li>
              <li>Data with third parties for marketing purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Important:</strong> Wazivo does NOT store your uploaded resumes or analysis
              results on our servers. All processing happens in real-time, and data is discarded
              after analysis completion.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Resume data: Processed and immediately discarded</li>
              <li>Technical logs: Retained for 30 days for debugging</li>
              <li>Analytics: Anonymized and aggregated indefinitely</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Your Rights (GDPR & CCPA)
            </h2>
            <p className="text-gray-700 leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Access:</strong> Request copies of your personal data
              </li>
              <li>
                <strong>Rectification:</strong> Correct inaccurate data
              </li>
              <li>
                <strong>Erasure:</strong> Request deletion of your data
              </li>
              <li>
                <strong>Restriction:</strong> Limit how we process your data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a machine-readable format
              </li>
              <li>
                <strong>Object:</strong> Opt-out of certain data processing
              </li>
              <li>
                <strong>Withdraw Consent:</strong> At any time
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at:{' '}
              <a href="mailto:samo.hossam@gmail.com" className="text-blue-600 hover:underline">
                samo.hossam@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">We use essential cookies for:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Session management</li>
              <li>Security and fraud prevention</li>
              <li>Analytics (anonymized)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may
              affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure file parsing (no server storage)</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Wazivo is not intended for users under 16 years of age. We do not knowingly collect
              personal information from children. If you believe we have collected data from a
              child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be transferred to and processed in countries outside your residence. We
              ensure appropriate safeguards are in place to protect your data in accordance with
              this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page with an updated "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:samo.hossam@gmail.com" className="text-blue-600 hover:underline">
                  samo.hossam@gmail.com
                </a>
              </li>
              <li>
                <strong>Website:</strong>{' '}
                <a href="https://wazivo.vercel.app" className="text-blue-600 hover:underline">
                  wazivo.vercel.app
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
