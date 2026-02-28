'use client';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Target, Users, Zap, Heart, Code, TrendingUp } from 'lucide-react';

export default function AboutPage() {
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
            <Sparkles className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">About Wazivo</h1>
          </div>
          <p className="text-xl text-gray-600">
            Get Hired, Get Wazivo - Your AI-Powered Career Assistant
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Mission */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Wazivo exists to democratize career success through AI. We believe everyone deserves
              access to professional career guidance, regardless of their background or budget. By
              leveraging cutting-edge AI technology, we provide instant, personalized insights that
              help job seekers stand out in competitive markets and advance their careers.
            </p>
          </div>

          {/* What We Do */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🤖 AI Resume Analysis</h3>
                <p className="text-blue-800 text-sm">
                  Advanced AI (LLaMA 3.3 70B) analyzes your resume to identify strengths,
                  weaknesses, and opportunities.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">🎯 Skill Gap Identification</h3>
                <p className="text-green-800 text-sm">
                  Discover exactly which skills you need to develop to reach your career goals.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">💼 Job Matching</h3>
                <p className="text-purple-800 text-sm">
                  Find relevant job opportunities that match your skills and experience level.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">📚 Learning Recommendations</h3>
                <p className="text-orange-800 text-sm">
                  Get personalized course suggestions from top platforms to bridge your skill gaps.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Why Choose Wazivo?</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">100% Free Forever</h3>
                  <p className="text-gray-700 text-sm mt-1">
                    No hidden fees, no credit card required, no premium tiers. Access all features
                    completely free.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Privacy First</h3>
                  <p className="text-gray-700 text-sm mt-1">
                    Your resume is never stored permanently. We process it in real-time and discard
                    it immediately.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
                  <p className="text-gray-700 text-sm mt-1">
                    Get comprehensive analysis in 30-60 seconds. No waiting, no queues, just instant
                    insights.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Open Source</h3>
                  <p className="text-gray-700 text-sm mt-1">
                    Fully transparent codebase on{' '}
                    <a
                      href="https://github.com/SamoTech/Wazivo"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub
                    </a>
                    . See exactly how your data is processed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Technology Stack</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 text-sm">Frontend</p>
                <p className="text-gray-600 text-xs mt-1">
                  Next.js 14, React, TypeScript, Tailwind CSS
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 text-sm">AI Engine</p>
                <p className="text-gray-600 text-xs mt-1">Groq (LLaMA 3.3 70B)</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 text-sm">Parsing</p>
                <p className="text-gray-600 text-xs mt-1">pdf-parse, mammoth, tesseract.js</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 text-sm">Job APIs</p>
                <p className="text-gray-600 text-xs mt-1">Adzuna, JSearch, RapidAPI</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 text-sm">Web Scraping</p>
                <p className="text-gray-600 text-xs mt-1">Jina Reader API</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 text-sm">Hosting</p>
                <p className="text-gray-600 text-xs mt-1">Vercel (Serverless)</p>
              </div>
            </div>
          </div>

          {/* The Story */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">The Story</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wazivo was born from a simple observation: career services are often expensive,
              time-consuming, and inaccessible to most job seekers. Traditional resume review
              services can cost hundreds of dollars, and results take days or weeks.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a developer passionate about AI and helping others, I saw an opportunity to
              leverage modern AI technology to solve this problem. By building Wazivo, I wanted to
              create a tool that gives everyone instant access to professional-grade career
              insights—completely free.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, Wazivo serves job seekers worldwide, analyzing thousands of resumes and helping
              people land their dream jobs. And it's just getting started.
            </p>
            <p className="text-gray-600 text-sm mt-4 italic">— Ossama Hashim, Creator of Wazivo</p>
          </div>

          {/* Future Plans */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">What's Next?</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We're constantly improving Wazivo. Here's what's coming:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">▶</span>
                <span className="text-gray-700">
                  <strong>Resume Builder:</strong> Create ATS-optimized resumes from scratch
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">▶</span>
                <span className="text-gray-700">
                  <strong>Cover Letter Generator:</strong> AI-powered cover letters tailored to job
                  postings
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">▶</span>
                <span className="text-gray-700">
                  <strong>Interview Prep:</strong> Common interview questions based on your role
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">▶</span>
                <span className="text-gray-700">
                  <strong>Career Path Simulator:</strong> Explore different career trajectories
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">▶</span>
                <span className="text-gray-700">
                  <strong>Salary Insights:</strong> Market data for your role and location
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to Get Hired?</h2>
            <p className="mb-6 text-blue-100">
              Upload your resume now and get instant AI-powered insights
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Analyze My Resume
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-blue-600">
            Contact
          </Link>
          <span>•</span>
          <Link href="/faq" className="hover:text-blue-600">
            FAQ
          </Link>
        </div>
      </div>
    </main>
  );
}
