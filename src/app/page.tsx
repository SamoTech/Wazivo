'use client';
import { useState } from 'react';
import FileUpload from './components/FileUpload';
import LoadingState from './components/LoadingState';
import AnalysisResults from './components/AnalysisResults';
import { AnalysisReport } from './types';
import { Brain } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      if (!res.ok) throw new Error((await res.json()).error || 'Analysis failed');
      setResult(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-600"/>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AI Resume Analyzer
            </h1>
          </div>
          <p className="text-xl text-gray-600">AI-powered CV analysis, job matching & career recommendations</p>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? <LoadingState/> : result ? (
          <>
            <button onClick={() => setResult(null)}
              className="mb-8 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
              ← Analyze Another CV
            </button>
            <AnalysisResults report={result}/>
          </>
        ) : <FileUpload onUpload={handleAnalyze}/>}
      </div>
    </main>
  );
}
