'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'General',
    question: 'What is Wazivo?',
    answer: 'Wazivo is a free, AI-powered resume analysis tool that helps job seekers improve their resumes, identify skill gaps, and find relevant job opportunities. We use advanced AI (LLaMA 3.3 70B) to provide instant, personalized career insights.'
  },
  {
    category: 'General',
    question: 'Is Wazivo really free?',
    answer: 'Yes! Wazivo is 100% free with no hidden costs, premium tiers, or credit card requirements. We believe career guidance should be accessible to everyone.'
  },
  {
    category: 'Privacy',
    question: 'Do you store my resume?',
    answer: 'No! Your resume is processed in real-time and is never permanently stored on our servers. Once the analysis is complete, your resume data is discarded. We take your privacy seriously.'
  },
  {
    category: 'Privacy',
    question: 'Is my data secure?',
    answer: 'Yes. We use HTTPS encryption for all data transmission, secure API key management, and follow industry best practices. Your resume is only processed temporarily in memory and is never saved to a database.'
  },
  {
    category: 'Usage',
    question: 'What file formats are supported?',
    answer: 'We support PDF (.pdf), Word documents (.doc, .docx), and images (with OCR). For best results, upload a PDF or Word document.'
  },
  {
    category: 'Usage',
    question: 'Can I upload a resume from a URL?',
    answer: 'Yes! You can paste a direct link to a PDF/DOCX file, or a web page URL. We use Jina Reader API to extract content from web pages. However, pages requiring login (like private LinkedIn profiles) won\'t work.'
  },
  {
    category: 'Usage',
    question: 'How long does analysis take?',
    answer: 'Analysis typically takes 30-60 seconds depending on your resume length and current server load. The process includes CV parsing, AI analysis, job searching, and course recommendations.'
  },
  {
    category: 'Usage',
    question: 'Is there a file size limit?',
    answer: 'Yes, the maximum file size is 10 MB. Most resumes are well under this limit (typically 100-500 KB).'
  },
  {
    category: 'Features',
    question: 'What does the analysis include?',
    answer: 'Our AI analysis provides: (1) Candidate summary with key skills and experience level, (2) Skill gap identification, (3) Personalized learning recommendations, (4) Relevant job opportunities from multiple sources, and (5) Career advancement insights.'
  },
  {
    category: 'Features',
    question: 'Where do job listings come from?',
    answer: 'We aggregate jobs from multiple sources including Adzuna, JSearch, and other job APIs. Results are filtered and ranked based on your skills and experience.'
  },
  {
    category: 'Features',
    question: 'Can I download my analysis results?',
    answer: 'Currently, results are displayed in your browser. You can copy the text or take screenshots. A PDF export feature is planned for a future update.'
  },
  {
    category: 'Technical',
    question: 'Which AI model powers Wazivo?',
    answer: 'We use Groq\'s LLaMA 3.3 70B model, one of the most advanced open-source AI models available. It\'s fast, accurate, and specifically optimized for understanding resumes and providing career guidance.'
  },
  {
    category: 'Technical',
    question: 'Why did my analysis fail?',
    answer: 'Common reasons: (1) File is corrupted or unreadable, (2) Resume has too little text (scanned image quality), (3) URL requires login, (4) Rate limit exceeded (try again in a minute), or (5) Temporary API issue. Try uploading a different format or contact us if the problem persists.'
  },
  {
    category: 'Technical',
    question: 'Is there a rate limit?',
    answer: 'Yes, to prevent abuse: 10 file uploads per minute and 5 URL fetches per minute per user. This is generous enough for normal use but prevents automated scraping.'
  },
  {
    category: 'Accuracy',
    question: 'How accurate is the AI analysis?',
    answer: 'Our AI provides highly relevant insights based on millions of resume patterns. However, AI is not perfect—treat results as guidance, not absolute truth. Always verify recommendations and use your judgment.'
  },
  {
    category: 'Accuracy',
    question: 'Will this guarantee me a job?',
    answer: 'No. Wazivo provides insights and recommendations to improve your chances, but hiring decisions are made by humans. Use our analysis as one tool in your job search strategy.'
  },
  {
    category: 'Support',
    question: 'I found a bug. How do I report it?',
    answer: 'Please report bugs via GitHub Issues (github.com/SamoTech/Wazivo/issues) or email samo.hossam@gmail.com. Include: what you did, what happened, what you expected, and your browser/device info.'
  },
  {
    category: 'Support',
    question: 'Can I request a feature?',
    answer: 'Absolutely! We love feedback. Submit feature requests via GitHub Issues or email. We prioritize features based on community demand and feasibility.'
  },
  {
    category: 'Support',
    question: 'How can I contribute?',
    answer: 'Wazivo is open-source! You can contribute code, report bugs, suggest features, or help with documentation. Visit our GitHub repository to get started.'
  },
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

function FAQAccordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-700 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

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
            <HelpCircle className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-gray-600">Find answers to common questions about Wazivo</p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({faqs.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category} ({faqs.filter(f => f.category === category).length})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredFAQs.map((faq, index) => (
            <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
          <p className="mb-6 text-blue-100">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </div>
      </div>
    </main>
  );
}
