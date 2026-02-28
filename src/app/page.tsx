'use client';
import { useState } from 'react';
import FileUpload from './components/FileUpload';
import LoadingState from './components/LoadingState';
import AnalysisResults from './components/AnalysisResults';
import ErrorBoundary from './components/ErrorBoundary';
import { AnalysisReport } from './types';
import { Briefcase } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[Home] Starting analysis...');

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      setProgress(100);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Analysis failed' }));
        const errorMessage = errorData.error || 'Analysis failed';
        console.error('[Home] Analysis failed:', errorMessage, res.status);
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log('[Home] Analysis successful');
      setResult(data);
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred';
      console.error('[Home] Error during analysis:', errorMessage, e);
      setError(errorMessage);

      // Send to error monitoring if configured
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(e, {
          tags: { component: 'Home', action: 'analyze' },
        });
      }
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-12 h-12 text-blue-600" aria-hidden="true" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Wazivo
              </h1>
            </div>
            <p className="text-2xl font-semibold text-gray-700 mb-2">Get Hired, Get Wazivo</p>
            <p className="text-lg text-gray-600">
              Lightning-fast AI resume analysis powered by Groq
            </p>
          </header>

          {error && (
            <div
              className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4"
              role="alert"
            >
              <p className="text-red-700 font-medium">❌ {error}</p>
              <p className="text-red-600 text-sm mt-1">Please try again or contact support</p>
            </div>
          )}

          {/* Progress bar */}
          {loading && progress > 0 && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {loading ? (
            <LoadingState />
          ) : result ? (
            <>
              <button
                onClick={handleReset}
                className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                aria-label="Analyze another CV"
              >
                ← Analyze Another CV
              </button>
              <AnalysisResults report={result} />
            </>
          ) : (
            <FileUpload onUpload={handleAnalyze} onProgress={setProgress} />
          )}

          <footer className="mt-16 text-center text-gray-500 text-sm">
            <p>Built with ❤️ by SamoTech | Powered by Groq's Lightning-Fast AI ⚡</p>
          </footer>
        </div>
      </main>
    </ErrorBoundary>
  );
}
