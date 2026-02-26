import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import axios from 'axios';

export async function parseCV(file: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    const data = await pdf(file);
    return data.text;
  } else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
    const result = await mammoth.extractRawText({ buffer: file });
    return result.value;
  } else if (mimeType.startsWith('image/')) {
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    return text;
  }
  throw new Error('Unsupported file type');
}

export async function fetchCVFromURL(url: string): Promise<string> {
  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL format. Please provide a valid URL.');
  }

  // Check if it's a direct PDF/DOCX file
  const isDirectFile = url.match(/\.(pdf|docx?)$/i);

  // For direct PDF/DOCX files, try to fetch and parse them first
  if (isDirectFile) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 15000,
        responseType: 'arraybuffer',
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200) {
        const contentType = response.headers['content-type'] || '';
        
        if (contentType.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
          return await parseCV(Buffer.from(response.data), 'application/pdf');
        }
        
        if (contentType.includes('wordprocessingml') || contentType.includes('msword') || url.toLowerCase().match(/\.docx?$/)) {
          return await parseCV(Buffer.from(response.data), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        }
      }
    } catch (directError) {
      // If direct fetch fails, fall through to Scrapling service
      console.log('Direct fetch failed, using Scrapling service');
    }
  }

  // Use Scrapling service for web pages, protected sites, or if direct fetch failed
  try {
    const response = await fetch('/api/scrapling/extract-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, mode: 'auto' }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Scrapling service error: ${response.status}`);
    }

    const data = await response.json();
    const text = (data?.text || '').toString().trim();
    
    if (!text || text.length < 200) {
      throw new Error('Insufficient text extracted from URL. Please upload the file directly.');
    }

    return text;
  } catch (error: any) {
    throw new Error(
      `Failed to extract CV from URL: ${error.message}. ` +
      'Try uploading the file directly instead.'
    );
  }
}
