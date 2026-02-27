'use client';
import { Upload, FileText, Link as LinkIcon, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { getPlatformConfig } from '../config/platforms';
import { isValidURL, isValidFile, checkRateLimit } from '../lib/validation';

export default function FileUpload({ 
  onUpload,
  onProgress 
}: { 
  onUpload: (data: FormData) => void;
  onProgress?: (progress: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [warning, setWarning] = useState<{ name: string; tip: string } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    // Validate file
    const validation = isValidFile(file);
    if (!validation.valid) {
      console.error('[FileUpload] File validation failed:', validation.error);
      alert(validation.error);
      return;
    }

    // Check rate limit
    if (!checkRateLimit('file_upload', 10, 60000)) {
      console.warn('[FileUpload] Rate limit exceeded');
      alert('Too many uploads. Please wait a minute and try again.');
      return;
    }

    console.log('[FileUpload] Processing file:', file.name, file.type, file.size);
    
    const formData = new FormData();
    formData.append('type', 'file');
    formData.append('file', file);
    
    // Simulate progress for file upload
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 90) clearInterval(interval);
      }, 100);
    }
    
    onUpload(formData);
  };

  const handleURLChange = (val: string) => {
    setUrl(val);
    setUrlError(null);
    
    if (val && !isValidURL(val)) {
      setUrlError('Please enter a valid URL starting with http:// or https://');
      setWarning(null);
      return;
    }
    
    setWarning(val ? getPlatformConfig(val) : null);
  };

  const handleURLSubmit = () => {
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) return;

    // Validate URL
    if (!isValidURL(trimmedUrl)) {
      setUrlError('Please enter a valid URL');
      console.error('[FileUpload] Invalid URL:', trimmedUrl);
      return;
    }

    // Check rate limit
    if (!checkRateLimit('url_fetch', 5, 60000)) {
      setUrlError('Too many requests. Please wait a minute and try again.');
      console.warn('[FileUpload] Rate limit exceeded for URL fetch');
      return;
    }

    console.log('[FileUpload] Submitting URL:', trimmedUrl);
    
    const formData = new FormData();
    formData.append('type', 'url');
    formData.append('url', trimmedUrl);
    
    // Simulate progress for URL fetch
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 90) clearInterval(interval);
      }, 150);
    }
    
    onUpload(formData);
  };

  const switchToFile = () => {
    setUploadType('file');
    setUrl('');
    setUrlError(null);
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
          aria-label="Switch to file upload"
        >
          <FileText className="w-4 h-4" />File Upload
        </button>
        <button
          onClick={() => setUploadType('url')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
            uploadType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          aria-label="Switch to URL input"
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
              aria-label="Upload file"
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
              urlError
                ? 'border-red-400 bg-red-50 focus:border-red-500'
                : warning
                ? 'border-yellow-400 bg-yellow-50 focus:border-yellow-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            aria-label="Enter CV URL"
            aria-invalid={!!urlError}
            aria-describedby={urlError ? 'url-error' : undefined}
          />

          {/* URL validation error */}
          {urlError && (
            <div id="url-error" className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg flex items-start gap-2" role="alert">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{urlError}</p>
            </div>
          )}

          {/* Platform warning */}
          {!urlError && warning && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <span className="font-semibold">{warning.name} detected: </span>
                {warning.tip}
              </div>
            </div>
          )}

          {/* Info box */}
          {!urlError && !warning && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Supported URLs:</p>
                  <p>Direct links to PDF/DOCX files work best. For web pages, we'll extract the visible text content.</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleURLSubmit}
            disabled={!url.trim() || !!urlError}
            className={`w-full px-6 py-3 rounded-lg font-medium transition ${
              url.trim() && !urlError
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Analyze from URL"
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
