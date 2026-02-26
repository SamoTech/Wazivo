'use client';
import { useState } from 'react';
import FileUpload from './components/FileUpload';
import LoadingState from './components/LoadingState';
import AnalysisResults from './components/AnalysisResults';
import { AnalysisReport } from './types';
import { Briefcase } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-12 h-12 text-blue-600"/>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Wazivo
            </h1>
          </div>
          <p className="text-2xl font-semibold text-gray-700 mb-2">Get Hired, Get Wazivo</p>
          <p className="text-lg text-gray-600">AI-powered resume analysis, job matching & career intelligence</p>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 font-medium">❌ {error}</p>
            <p className="text-red-600 text-sm mt-1">Please try again or contact support</p>
          </div>
        )}

        {loading ? <LoadingState/> : result ? (
          <>
            <button onClick={() => setResult(null)}
              className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
              ← Analyze Another CV
            </button>
            <AnalysisResults report={result}/>
          </>
        ) : <FileUpload onUpload={handleAnalyze}/>}

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with ❤️ by SamoTech | Powered by AI</p>
        </footer>
      </div>
    </main>
  );
}
