import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { MIN_CV_TEXT_LENGTH, MIN_URL_TEXT_LENGTH, getPlatformHint } from './constants';

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
// Check if URL is from a known protected platform
// ─────────────────────────────────────────────────────────
function isProtectedPlatform(url: string): boolean {
  const protectedDomains = ['linkedin.com', 'glassdoor.com', 'indeed.com', 'ziprecruiter.com', 'monster.com'];
  const lower = url.toLowerCase();
  return protectedDomains.some(domain => lower.includes(domain));
}

function isLinkedIn(url: string): boolean {
  return url.toLowerCase().includes('linkedin.com');
}

// ─────────────────────────────────────────────────────────
// Fetch via Jina Reader API (External Service - No Python Needed)
// Jina Reader: https://jina.ai/reader
// Free tier: 20 requests/minute (no API key needed)
// With API key: 200 requests/minute
// ─────────────────────────────────────────────────────────
async function fetchViaJinaReader(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  
  const headers: Record<string, string> = {
    'Accept': 'text/plain',
    'X-Return-Format': 'markdown',
    'X-Remove-Selector': 'nav, footer, header, .nav, .footer, .header, .sidebar, #sidebar, .ads, .cookie-banner',
    'User-Agent': 'Mozilla/5.0 (compatible; Wazivo/1.0)',
  };

  // Optional: Add API key for higher rate limits
  const jinaApiKey = process.env.JINA_API_KEY;
  if (jinaApiKey) {
    headers['Authorization'] = `Bearer ${jinaApiKey}`;
  }

  // For LinkedIn, wait for dynamic content
  if (isLinkedIn(url)) {
    headers['X-Wait-For-Selector'] = 'main';
    headers['X-Timeout'] = '30';
  }

  try {
    console.log('[cvParser] Fetching via Jina Reader:', url);
    
    const response = await axios.get(jinaUrl, {
      headers,
      timeout: 45000,
      validateStatus: (status) => status < 500,
    });

    if (response.status !== 200) {
      throw new Error(`Jina Reader returned HTTP ${response.status}`);
    }

    const content = response.data.trim();

    if (!content || content.length < 100) {
      throw new Error('Page returned too little content. It may require login or be empty.');
    }

    // Detect LinkedIn login wall
    if (isLinkedIn(url)) {
      const lower = content.toLowerCase();
      const loginSignals = [
        'sign in to linkedin',
        'join linkedin',
        'authwall',
        'be the first',
        'create your free account',
        'sign up'
      ];
      
      if (loginSignals.some(signal => lower.includes(signal)) && content.length < 1000) {
        throw new Error(
          'LinkedIn requires login to view this profile. '
          + 'Please go to your profile → click "More" → "Save to PDF" → upload the PDF here.'
        );
      }
    }

    console.log('[cvParser] Successfully fetched via Jina Reader');
    return content.slice(0, 15000);

  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 422) {
        throw new Error('Jina Reader could not process this URL. Please upload the file directly.');
      }
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw new Error('Access denied. The page requires authentication.');
      }
    }
    
    throw err;
  }
}

// ─────────────────────────────────────────────────────────
// Fast path: Try direct PDF/DOCX download first
// ─────────────────────────────────────────────────────────
async function tryDirectFileFetch(url: string): Promise<string | null> {
  // Only try for URLs that look like direct file links
  if (!/\.(pdf|docx?)(\?.*)?$/i.test(url)) {
    return null;
  }

  try {
    console.log('[cvParser] Attempting direct file download');
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      timeout: 20000,
      responseType: 'arraybuffer',
      maxRedirects: 5,
      validateStatus: (s) => s < 500,
    });

    if (response.status !== 200) return null;

    const ct: string = response.headers['content-type'] || '';
    let mimeType: string | null = null;

    if (ct.includes('pdf') || /\.pdf(\?.*)?$/i.test(url)) {
      mimeType = 'application/pdf';
    } else if (ct.includes('wordprocessingml') || ct.includes('msword') || /\.docx?(\?.*)?$/i.test(url)) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    if (!mimeType) return null;

    const text = await parseCV(Buffer.from(response.data), mimeType);
    if (text.length >= MIN_CV_TEXT_LENGTH) {
      console.log('[cvParser] Direct file fetch succeeded');
      return text;
    }

  } catch (err) {
    // Silent fail - will try Jina Reader next
    console.log('[cvParser] Direct fetch failed, will try Jina Reader');
  }

  return null;
}

// ─────────────────────────────────────────────────────────
// Main export: Accept ANY URL
// Strategy: Direct file download → Jina Reader API → Helpful error
// ─────────────────────────────────────────────────────────
export async function fetchCVFromURL(url: string): Promise<string> {
  // 1. Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL. Please provide a full URL starting with https://');
  }

  // 2. Try direct file download first (fast path for .pdf/.docx)
  const directText = await tryDirectFileFetch(url);
  if (directText) {
    return directText;
  }

  // 3. Use Jina Reader for everything else (LinkedIn, Indeed, web pages, etc.)
  try {
    const text = await fetchViaJinaReader(url);
    
    if (text.length < MIN_URL_TEXT_LENGTH) {
      throw new Error(
        'Page loaded but not enough text was extracted. '
        + 'The content may require a login or be JavaScript-rendered.'
      );
    }

    return text;

  } catch (err: any) {
    const msg: string = err.message || '';

    // Add platform-specific help if available
    const hint = getPlatformHint(url);
    const tipSuffix = hint
      ? `\n\n💡 ${hint.exportTip}`
      : '\n\n💡 Try downloading the file and uploading it directly using the "File Upload" tab.';

    // Don't double-wrap errors that already have instructions
    if (msg.includes('upload') || msg.includes('directly') || msg.includes('PDF') || msg.includes('💡')) {
      throw err;
    }

    throw new Error(`Failed to fetch CV: ${msg}${tipSuffix}`);
  }
}
