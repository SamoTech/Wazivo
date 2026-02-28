'use client';
import { Briefcase, AlertCircle, BookOpen, TrendingUp } from 'lucide-react';
import { AnalysisReport } from '../types';

export default function AnalysisResults({ report }: { report: AnalysisReport }) {
  const { candidateSummary, jobOpportunities, weaknessesAndGaps, recommendedCourses } = report;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4">{candidateSummary.title || 'Professional'}</h2>
        <div className="flex flex-wrap gap-2">
          {candidateSummary.keySkills.map((s, i) => (
            <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {s}
            </span>
          ))}
        </div>
      </div>

      <section>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          Job Opportunities ({jobOpportunities.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {jobOpportunities.slice(0, 10).map((job, i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-lg transition">
              <h4 className="font-bold mb-2">{job.title}</h4>
              <p className="text-sm text-gray-600 mb-1">
                {job.company} • {job.location}
              </p>
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener"
                className="text-blue-600 hover:underline text-sm"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          Skill Gaps ({weaknessesAndGaps.length})
        </h3>
        <div className="space-y-3">
          {weaknessesAndGaps.map((gap, i) => (
            <div key={i} className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">{gap.category}</h4>
                <span className="text-xs px-2 py-1 bg-yellow-200 rounded">{gap.priority}</span>
              </div>
              <p className="text-sm text-gray-700">{gap.gap}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Recommended Courses ({recommendedCourses.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendedCourses.map((course, i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">{course.title}</h4>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                  {course.cost}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {course.platform} • {course.duration}
              </p>
              <p className="text-sm text-gray-700 mb-3">{course.addressesGap}</p>
              <a
                href={course.link}
                target="_blank"
                rel="noopener"
                className="text-blue-600 hover:underline text-sm"
              >
                View Course →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
