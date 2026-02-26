'use client';
import { Upload, FileText, Link as LinkIcon, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';

// Sites where we show a warning but still ALLOW the attempt
const WARNED_PLATFORMS = [
  { match: 'linkedin.com', name: 'LinkedIn', tip: 'LinkedIn may require login. We\'ll try our best — if it fails, use "Save to PDF" from your profile.' },
  { match: 'glassdoor.com', name: 'Glassdoor', tip: 'Glassdoor may block access. If it fails, download your CV as PDF and upload directly.' },
  { match: 'indeed.com/resume', name: 'Indeed', tip: 'Indeed résumé pages may require login. If it fails, export as PDF from Indeed settings.' },
];

function getWarning(url: string) {
  const lower = url.toLowerCase();
  return WARNED_PLATFORMS.find(p => lower.includes(p.match)) || null;
}

export default function FileUpload({ onUpload }: { onUpload: (data: FormData) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
  const [warning, setWarning] = useState<{ name: string; tip: string } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const formData = new FormData();
    formData.append('type', 'file');
    formData.append('file', file);
    onUpload(formData);
  };

  const handleURLChange = (val: string) => {
    setUrl(val);
    setWarning(val ? getWarning(val) : null);
  };

  const handleURLSubmit = () => {
    if (!url.trim()) return;
    const formData = new FormData();
    formData.append('type', 'url');
    formData.append('url', url.trim());
    onUpload(formData);
  };

  const switchToFile = () => {
    setUploadType('file');
    setUrl('');
    setWarning(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={switchToFile}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
            uploadType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />File Upload
        </button>
        <button
          onClick={() => setUploadType('url')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
            uploadType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <LinkIcon className="w-4 h-4" />URL
        </button>
      </div>

      {/* File upload tab */}
      {uploadType === 'file' ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">Drag & drop your CV or</p>
          <label className="cursor-pointer inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc,image/*"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
          </label>
          <p className="text-sm text-gray-500 mt-4">PDF, DOCX, DOC, or images (max 10MB)</p>
          <div className="mt-5 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 text-left">
            <p className="font-semibold mb-1">💡 Have a LinkedIn profile?</p>
            <p>Go to your profile → click <strong>More</strong> → <strong>Save to PDF</strong> → upload here for best results.</p>
          </div>
        </div>
      ) : (
        /* URL tab */
        <div className="border-2 border-gray-300 rounded-xl p-8">
          <input
            type="url"
            value={url}
            onChange={(e) => handleURLChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleURLSubmit()}
            placeholder="https://example.com/resume.pdf"
            className={`w-full px-4 py-3 border rounded-lg mb-3 outline-none transition ${
              warning
                ? 'border-yellow-400 bg-yellow-50 focus:border-yellow-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />

          {/* Soft warning — still allows submission */}
          {warning && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <span className="font-semibold">{warning.name} detected: </span>
                {warning.tip}
              </div>
            </div>
          )}

          {/* Normal info box */}
          {!warning && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Supported URLs:</p>
                  <p>Direct links to PDF/DOCX files work best. For protected pages (LinkedIn, etc.) we'll attempt stealth fetching automatically.</p>
                </div>
              </div>
            </div>
          )}

          {/* Always-enabled submit button */}
          <button
            onClick={handleURLSubmit}
            disabled={!url.trim()}
            className={`w-full px-6 py-3 rounded-lg font-medium transition ${
              url.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {warning ? `Try Fetching ${warning.name} Profile →` : 'Analyze from URL'}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Having issues?{' '}
            <button onClick={switchToFile} className="text-blue-600 hover:underline">
              Upload file directly
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
