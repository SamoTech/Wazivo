'use client';
import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
      <h2 className="text-2xl font-bold mb-2">Analyzing Your CV...</h2>
      <p className="text-gray-600">This may take 30-60 seconds</p>
      <div className="mt-8 space-y-2">
        <div className="flex items-center justify-center text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
          Extracting CV content
        </div>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
          AI analysis in progress
        </div>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
          Searching job opportunities
        </div>
      </div>
    </div>
  );
}
