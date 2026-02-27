import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { MIN_CV_TEXT_LENGTH, getPlatformHint } from './constants';

// ─────────────────────────────────────────────────────────
// Parse a local file buffer into text
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// Direct file fetch: Download PDF/DOCX from direct URLs
// Only works for direct file links (e.g., https://example.com/cv.pdf)
// Does NOT work for LinkedIn, Indeed, or other profile pages
// ─────────────────────────────────────────────────────────
export async function fetchCVFromURL(url: string): Promise<string> {
  // 1. Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL. Please provide a full URL starting with https://');
  }

  // 2. Check if it's a direct file link
  if (!/\.(pdf|docx?)(\?.*)?$/i.test(url)) {
    const hint = getPlatformHint(url);
    if (hint) {
      throw new Error(
        `This appears to be a ${hint.name} profile page.\n\n💡 ${hint.exportTip}`
      );
    }
    throw new Error(
      'Only direct links to PDF or DOCX files are supported.\n\n' +
      '💡 Please download the file and upload it using the "File Upload" tab.'
    );
  }

  // 3. Try to download the file
  try {
    console.log('[cvParser] Attempting direct file download:', url);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      timeout: 20000,
      responseType: 'arraybuffer',
      maxRedirects: 5,
      validateStatus: (s) => s < 500,
    });

    if (response.status !== 200) {
      throw new Error(`File download failed with status ${response.status}`);
    }

    // Determine file type
    const ct: string = response.headers['content-type'] || '';
    let mimeType: string;

    if (ct.includes('pdf') || /\.pdf(\?.*)?$/i.test(url)) {
      mimeType = 'application/pdf';
    } else if (
      ct.includes('wordprocessingml') ||
      ct.includes('msword') ||
      /\.docx?(\?.*)?$/i.test(url)
    ) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      throw new Error('Downloaded file is not a valid PDF or DOCX');
    }

    // Parse the downloaded file
    const text = await parseCV(Buffer.from(response.data), mimeType);

    if (text.length < MIN_CV_TEXT_LENGTH) {
      throw new Error('Insufficient text extracted from file. The file may be empty or corrupted.');
    }

    console.log('[cvParser] Successfully downloaded and parsed file');
    return text;

  } catch (err: any) {
    const msg: string = err.message || 'Download failed';

    // Provide helpful error messages
    if (msg.includes('timeout') || msg.includes('ETIMEDOUT')) {
      throw new Error(
        'Download timed out. The file may be too large or the server is slow.\n\n' +
        '💡 Please download the file manually and upload it using the "File Upload" tab.'
      );
    }

    if (msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED')) {
      throw new Error(
        'Could not reach the server. Please check the URL.\n\n' +
        '💡 Try downloading the file manually and uploading it.'
      );
    }

    if (msg.includes('403') || msg.includes('401')) {
      throw new Error(
        'Access denied. The file requires authentication.\n\n' +
        '💡 Please download the file manually and upload it using the "File Upload" tab.'
      );
    }

    // Don't double-wrap already helpful errors
    if (msg.includes('💡') || msg.includes('upload')) {
      throw err;
    }

    throw new Error(
      `Failed to download file: ${msg}\n\n` +
      '💡 Please download the file and upload it using the "File Upload" tab.'
    );
  }
}
