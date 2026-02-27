'use client';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
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
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600">Last updated: February 27, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using Wazivo ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree with any part of these terms, you may not use our Service.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Description</h2>
            <p className="text-gray-700 mb-3">
              Wazivo is an AI-powered resume analysis tool that provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Automated CV/resume analysis using artificial intelligence</li>
              <li>Skill gap identification and recommendations</li>
              <li>Job opportunity matching based on your profile</li>
              <li>Personalized course recommendations for career development</li>
              <li>Career insights and market analysis</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
            <p className="text-gray-700 mb-3">As a user of Wazivo, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate and truthful information in your resume</li>
              <li>Only upload resumes that you own or have permission to analyze</li>
              <li>Not use the Service for any illegal or unauthorized purpose</li>
              <li>Not attempt to bypass rate limits or abuse the Service</li>
              <li>Not reverse engineer or attempt to extract our AI models</li>
              <li>Respect intellectual property rights</li>
              <li>Not upload malicious files or content</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Acceptable Use Policy</h2>
            <p className="text-gray-700 mb-3">You may NOT use Wazivo to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Upload resumes containing false, misleading, or fraudulent information</li>
              <li>Analyze resumes of other individuals without their consent</li>
              <li>Scrape, harvest, or collect data from the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Transmit viruses, malware, or harmful code</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on others' privacy or intellectual property rights</li>
            </ul>
          </section>

          {/* AI-Generated Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. AI-Generated Content Disclaimer</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-4">
              <p className="text-yellow-900 font-semibold">⚠️ Important Notice</p>
              <p className="text-yellow-800 mt-2">
                Our AI analysis is provided for informational purposes only. We do not guarantee:
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Accuracy or completeness of AI-generated insights</li>
              <li>Success in job applications or career advancement</li>
              <li>Suitability of recommended courses or jobs for your situation</li>
              <li>Hiring decisions by employers based on our analysis</li>
            </ul>
            <p className="text-gray-700 mt-4">
              AI outputs should be used as guidance only. Always verify information and make informed decisions.
            </p>
          </section>

          {/* No Warranty */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Service Availability</h2>
            <p className="text-gray-700 mb-3">
              We strive to maintain high availability but cannot guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Uninterrupted access to the Service</li>
              <li>Error-free operation at all times</li>
              <li>Compatibility with all devices and browsers</li>
              <li>Availability of third-party services (AI, job APIs)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We may modify, suspend, or discontinue the Service at any time without notice.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1 Your Content</h3>
                <p className="text-gray-700">
                  You retain all rights to your resume and personal information. By using our Service, 
                  you grant us a temporary, non-exclusive license to process your resume for analysis purposes only.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2 Our Content</h3>
                <p className="text-gray-700">
                  All Service code, design, branding, and features are owned by Wazivo/SamoTech. 
                  Our source code is open-source under the MIT License.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">6.3 AI-Generated Content</h3>
                <p className="text-gray-700">
                  Analysis results generated by our AI are provided to you for your personal use. 
                  You may use them for your career development but may not resell or republish them.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links and Services</h2>
            <p className="text-gray-700 mb-3">
              Our Service may contain links to third-party websites and services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Job boards (LinkedIn, Indeed, Glassdoor, etc.)</li>
              <li>Online learning platforms (Coursera, Udemy, edX, etc.)</li>
              <li>External resources and documentation</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We are not responsible for the content, privacy practices, or terms of these third-party services. 
              Use them at your own risk.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-4">
              <p className="text-red-900 font-semibold">IMPORTANT LEGAL NOTICE</p>
              <p className="text-red-800 mt-2">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WAZIVO AND ITS DEVELOPERS SHALL NOT BE LIABLE FOR:
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from use or inability to use the Service</li>
              <li>Reliance on AI-generated recommendations</li>
              <li>Job application rejections or career outcomes</li>
              <li>Actions by third-party services or employers</li>
            </ul>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
            <p className="text-gray-700">
              Your use of the Service is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. 
              Please review it to understand how we collect, use, and protect your information.
            </p>
          </section>

          {/* Free Service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Free Service</h2>
            <p className="text-gray-700">
              Wazivo is currently provided free of charge. We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Introduce paid features or subscriptions in the future</li>
              <li>Implement usage limits or rate restrictions</li>
              <li>Change pricing models with reasonable notice</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 mb-3">
              We may terminate or suspend your access to the Service immediately, without notice, for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Abusive or fraudulent behavior</li>
              <li>Attempts to harm or disrupt the Service</li>
              <li>Any other reason at our sole discretion</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of Egypt, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">Questions about these Terms? Contact us:</p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Developer:</strong> Ossama Hashim (SamoTech)</p>
                <p><strong>Email:</strong> <a href="mailto:samo.hossam@gmail.com" className="text-blue-600 hover:underline">samo.hossam@gmail.com</a></p>
                <p><strong>GitHub:</strong> <a href="https://github.com/SamoTech/Wazivo" target="_blank" className="text-blue-600 hover:underline">github.com/SamoTech/Wazivo</a></p>
              </div>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-3">By Using Wazivo, You Acknowledge:</h2>
            <ul className="list-disc list-inside space-y-2 text-blue-800">
              <li>You have read and understood these Terms of Service</li>
              <li>You agree to be bound by these terms</li>
              <li>You accept the risks and limitations described herein</li>
              <li>You will use the Service responsibly and ethically</li>
            </ul>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-4 text-sm text-gray-600">
          <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          <span>•</span>
          <Link href="/" className="hover:text-blue-600">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
