import { Metadata } from 'next';
import { Mail, Github, Globe, Shield, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Wazivo',
  description: 'Contact Wazivo for support, privacy inquiries, and data rights requests',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">We're here to help with any questions or concerns</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">General Support</h3>
                  <a href="mailto:support@wazivo.com" className="text-blue-600 hover:underline">
                    support@wazivo.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">For technical issues and general inquiries</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Privacy & Data Protection</h3>
                  <a href="mailto:privacy@wazivo.com" className="text-blue-600 hover:underline">
                    privacy@wazivo.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">For GDPR/CCPA requests and privacy concerns</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Github className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Open Source</h3>
                  <a href="https://github.com/SamoTech/Wazivo" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    github.com/SamoTech/Wazivo
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Contribute or report issues</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Globe className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Website</h3>
                  <a href="https://wazivo.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    wazivo.vercel.app
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Visit our main website</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Response Time</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• General inquiries: 24-48 hours</li>
                <li>• Privacy requests: Within 30 days (GDPR/CCPA compliance)</li>
                <li>• Technical issues: 12-24 hours</li>
              </ul>
            </div>
          </div>

          {/* Data Rights Requests */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Data Rights Requests</h2>
            </div>
            
            <p className="text-gray-700 mb-6">
              Under GDPR and CCPA, you have the right to:
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Access Your Data</h3>
                <p className="text-sm text-gray-600">Request copies of personal information we hold about you</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Data Portability</h3>
                <p className="text-sm text-gray-600">Receive your data in a machine-readable format</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Erasure ("Right to be Forgotten")</h3>
                <p className="text-sm text-gray-600">Request deletion of your personal data</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Rectification</h3>
                <p className="text-sm text-gray-600">Correct inaccurate personal information</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Object to Processing</h3>
                <p className="text-sm text-gray-600">Opt-out of certain data processing activities</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Wazivo does NOT store uploaded resumes. All processing is done in real-time
                and data is immediately discarded after analysis. Therefore, there is no stored resume data to access or delete.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">How to Submit a Request</h3>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Email us at <a href="mailto:privacy@wazivo.com" className="text-blue-600 hover:underline">privacy@wazivo.com</a></li>
                <li>Specify which right you wish to exercise</li>
                <li>Provide identification (to verify your identity)</li>
                <li>We will respond within 30 days</li>
              </ol>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you store my resume?</h3>
              <p className="text-gray-700">No. All resume processing is done in real-time, and data is immediately discarded after analysis completion. We do not store uploaded files or analysis results.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Who can see my data?</h3>
              <p className="text-gray-700">Your resume data is only processed by our AI service (Groq) during analysis. No human reviews your data, and it's not shared with employers or third parties without your consent.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-700">Yes. All data transmission uses HTTPS encryption. Processing happens in secure serverless functions, and data is never stored on our servers.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How long does it take to respond to privacy requests?</h3>
              <p className="text-gray-700">We respond to all GDPR/CCPA data rights requests within 30 days, as required by law. Most requests are processed much faster.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I request a copy of my data?</h3>
              <p className="text-gray-700">Since we don't store resume data, there's nothing to retrieve. However, we can provide any analytics or log data associated with your usage (minimal and anonymized).</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
