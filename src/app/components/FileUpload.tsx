'use client';
import { Upload, FileText, Link as LinkIcon } from 'lucide-react';
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
        </div>
      ) : (
        <div className="border-2 border-gray-300 rounded-xl p-8">
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/cv.pdf"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"/>
          <button onClick={handleURLSubmit}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Analyze from URL
          </button>
        </div>
      )}
    </div>
  );
}
