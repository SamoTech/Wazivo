import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Wazivo',
  description: 'Terms of Service for Wazivo - AI-powered resume analyzer',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: February 28, 2026</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Wazivo ("the Service"), you accept and agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Wazivo is an AI-powered resume analysis platform that provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Resume/CV parsing and analysis</li>
              <li>Skill gap identification</li>
              <li>Job recommendations</li>
              <li>Course suggestions</li>
              <li>Career insights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 You Agree To:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate and truthful information</li>
              <li>Use the Service for lawful purposes only</li>
              <li>Not upload malicious files or code</li>
              <li>Not attempt to breach security measures</li>
              <li>Not abuse or overload the Service</li>
              <li>Respect intellectual property rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 You Must NOT:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Upload viruses, malware, or harmful code</li>
              <li>Attempt to reverse engineer the Service</li>
              <li>Scrape or harvest data from the Service</li>
              <li>Impersonate others or misrepresent yourself</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Your Content</h3>
            <p className="text-gray-700 leading-relaxed">
              You retain all ownership rights to the resumes and content you upload. By using the
              Service, you grant us a temporary license to process your content solely for providing
              the analysis service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Our Content</h3>
            <p className="text-gray-700 leading-relaxed">
              All Service content, features, and functionality (including but not limited to text,
              graphics, logos, and software) are owned by Wazivo and protected by international
              copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Disclaimer of Warranties
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>IMPORTANT:</strong> The Service is provided "AS IS" and "AS AVAILABLE"
                without warranties of any kind, either express or implied.
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We do not guarantee accuracy of AI-generated analysis</li>
              <li>Job recommendations are suggestions, not guarantees</li>
              <li>Course recommendations are informational only</li>
              <li>We do not warrant uninterrupted or error-free service</li>
              <li>Analysis results should not be solely relied upon for career decisions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Wazivo shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Damages resulting from use or inability to use the Service</li>
              <li>Damages from job application outcomes</li>
              <li>Damages from third-party services (job APIs, AI providers)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service integrates with third-party providers:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Groq:</strong> AI analysis
              </li>
              <li>
                <strong>Adzuna & JSearch:</strong> Job listings
              </li>
              <li>
                <strong>Jina AI:</strong> URL content extraction
              </li>
              <li>
                <strong>Udemy:</strong> Course recommendations
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We are not responsible for the availability, content, or practices of these
              third-party services. Your use of third-party services is subject to their respective
              terms and policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Data and Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of the Service is also governed by our{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              . Key points:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We do NOT store your uploaded resumes</li>
              <li>Processing is done in real-time and data is immediately discarded</li>
              <li>We collect minimal analytics for service improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              9. Rate Limiting and Fair Use
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To ensure service availability for all users:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>File uploads: 10 per minute per user</li>
              <li>URL fetches: 5 per minute per user</li>
              <li>File size limit: 10 MB per upload</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Excessive use or abuse may result in temporary or permanent service suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your access to the Service:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>For violation of these Terms</li>
              <li>For abusive or fraudulent behavior</li>
              <li>For excessive use that degrades service for others</li>
              <li>At our discretion for any reason</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms at any time. Changes become effective upon posting.
              Continued use of the Service after changes constitutes acceptance of the modified
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of your
              jurisdiction, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms, contact us:
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
