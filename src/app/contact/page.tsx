'use client';
import Link from 'next/link';
import { ArrowLeft, Mail, Github, Linkedin, Globe, MessageSquare, Bug, Lightbulb } from 'lucide-react';

export default function ContactPage() {
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
            <MessageSquare className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
          </div>
          <p className="text-gray-600">Have questions, feedback, or found a bug? We'd love to hear from you!</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Developer Info */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Developer Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  OH
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Ossama Hashim</h3>
                  <p className="text-gray-600">Full-Stack Developer & AI Enthusiast</p>
                  <p className="text-gray-500 text-sm mt-1">SamoTech | Giza, Egypt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Methods</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <a 
                href="mailto:samo.hossam@gmail.com"
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <Mail className="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Email</h3>
                  <p className="text-gray-600 text-sm mt-1">samo.hossam@gmail.com</p>
                  <p className="text-gray-500 text-xs mt-2">For general inquiries and support</p>
                </div>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/SamoTech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <Github className="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">GitHub</h3>
                  <p className="text-gray-600 text-sm mt-1">@SamoTech</p>
                  <p className="text-gray-500 text-xs mt-2">View projects and contributions</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/in/ossama-hashim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <Linkedin className="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">LinkedIn</h3>
                  <p className="text-gray-600 text-sm mt-1">Ossama Hashim</p>
                  <p className="text-gray-500 text-xs mt-2">Professional networking</p>
                </div>
              </a>

              {/* Website */}
              <a 
                href="https://github.com/SamoTech/Wazivo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <Globe className="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Project Repository</h3>
                  <p className="text-gray-600 text-sm mt-1">github.com/SamoTech/Wazivo</p>
                  <p className="text-gray-500 text-xs mt-2">Open-source code and documentation</p>
                </div>
              </a>
            </div>
          </div>

          {/* What to Contact About */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
            <div className="space-y-4">
              {/* Bug Reports */}
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <Bug className="w-6 h-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">Report a Bug</h3>
                  <p className="text-red-700 text-sm mt-1">
                    Found a bug? Please report it via <a href="https://github.com/SamoTech/Wazivo/issues" target="_blank" className="underline font-medium">GitHub Issues</a> or email.
                  </p>
                  <p className="text-red-600 text-xs mt-2">Include: Steps to reproduce, browser info, screenshots if possible</p>
                </div>
              </div>

              {/* Feature Requests */}
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <Lightbulb className="w-6 h-6 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">Feature Requests</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Have an idea to improve Wazivo? Share it via <a href="https://github.com/SamoTech/Wazivo/issues" target="_blank" className="underline font-medium">GitHub Issues</a>.
                  </p>
                  <p className="text-blue-600 text-xs mt-2">We love community feedback and suggestions!</p>
                </div>
              </div>

              {/* General Support */}
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <MessageSquare className="w-6 h-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">General Questions</h3>
                  <p className="text-green-700 text-sm mt-1">
                    Questions about how to use Wazivo? Check our <Link href="/faq" className="underline font-medium">FAQ</Link> or email us.
                  </p>
                  <p className="text-green-600 text-xs mt-2">We typically respond within 1-2 business days</p>
                </div>
              </div>

              {/* Business Inquiries */}
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <Mail className="w-6 h-6 text-purple-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900">Business Inquiries</h3>
                  <p className="text-purple-700 text-sm mt-1">
                    Interested in collaboration or custom features? Reach out via email.
                  </p>
                  <p className="text-purple-600 text-xs mt-2">Open to partnerships and API integrations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/faq" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                <h3 className="font-semibold text-blue-900">FAQ</h3>
                <p className="text-blue-700 text-sm mt-1">Common questions</p>
              </Link>
              <Link href="/privacy" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                <h3 className="font-semibold text-blue-900">Privacy Policy</h3>
                <p className="text-blue-700 text-sm mt-1">How we protect data</p>
              </Link>
              <Link href="/terms" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                <h3 className="font-semibold text-blue-900">Terms of Service</h3>
                <p className="text-blue-700 text-sm mt-1">Usage guidelines</p>
              </Link>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">⏰ Response Time</h3>
            <p className="text-yellow-800 text-sm">
              This is a personal project maintained by one developer. While I strive to respond promptly, 
              please allow 1-3 business days for email replies. For urgent issues, use GitHub Issues for faster community support.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <span>•</span>
          <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
        </div>
      </div>
    </main>
  );
}
