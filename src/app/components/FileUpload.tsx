'use client';
import { Upload, FileText, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function FileUpload({ onUpload }: { onUpload: (data: FormData) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');

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

  const handleURLSubmit = () => {
    if (!url) return;
    const formData = new FormData();
    formData.append('type', 'url');
    formData.append('url', url);
    onUpload(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setUploadType('file')}
          className={`px-4 py-2 rounded-lg ${uploadType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
          <FileText className="w-4 h-4 inline mr-2"/>File Upload
        </button>
        <button onClick={() => setUploadType('url')}
          className={`px-4 py-2 rounded-lg ${uploadType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
          <LinkIcon className="w-4 h-4 inline mr-2"/>URL
        </button>
      </div>

      {uploadType === 'file' ? (
        <div onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400"/>
          <p className="text-lg mb-2">Drag & drop your CV or</p>
          <label className="cursor-pointer inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Files
            <input type="file" className="hidden" accept=".pdf,.docx,.doc,image/*"
              onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}/>
          </label>
          <p className="text-sm text-gray-500 mt-4">PDF, DOCX, DOC, or images (max 10MB)</p>
          <div className="mt-6 text-xs text-gray-400">
            <p>✨ Recommended: Upload files directly for best results</p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-gray-300 rounded-xl p-8">
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/resume.pdf"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"/>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-left">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"/>
              <div className="text-blue-800">
                <p className="font-medium mb-1">URL Requirements:</p>
                <ul className="text-xs space-y-1 text-blue-700">
                  <li>• Must be a direct link to a PDF or DOCX file</li>
                  <li>• File must be publicly accessible (no login required)</li>
                  <li>• LinkedIn profiles don't work (download your CV first)</li>
                  <li>• Example: https://yoursite.com/resume.pdf</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button onClick={handleURLSubmit}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Analyze from URL
          </button>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Having issues? <button onClick={() => setUploadType('file')} className="text-blue-600 hover:underline">Upload file directly instead</button>
          </p>
        </div>
      )}
    </div>
  );
}
