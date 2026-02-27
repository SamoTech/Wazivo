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
// Resolve absolute base URL for internal service calls
// Works on Vercel (all env variants) and localhost
// ─────────────────────────────────────────────────────────
function getBaseUrl(): string {
  // Manually set in Vercel dashboard — most reliable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  // Auto-set by Vercel: always the production domain, no protocol
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // Auto-set by Vercel: current deployment URL, no protocol
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

// ─────────────────────────────────────────────────────────
// Fast path: fetch PDF/DOCX directly in Node (no Python needed)
// ─────────────────────────────────────────────────────────
async function tryDirectFileFetch(url: string): Promise<string | null> {
  if (!/\.(pdf|docx?)(\?.*)?$/i.test(url)) return null;

  try {
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

    if (response.status !== 200) return null;

    const ct: string = response.headers['content-type'] || '';
    if (ct.includes('pdf') || /\.pdf(\?.*)?$/i.test(url)) {
      return await parseCV(Buffer.from(response.data), 'application/pdf');
    }
    if (
      ct.includes('wordprocessingml') ||
      ct.includes('msword') ||
      /\.docx?(\?.*)?$/i.test(url)
    ) {
      return await parseCV(
        Buffer.from(response.data),
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
    }
  } catch {
    // silent fall-through to scraping
  }
  return null;
}

// ─────────────────────────────────────────────────────────
// Scraping path: call Python serverless function with absolute URL
// StealthyFetcher handles Cloudflare, LinkedIn, bot-protected pages
// ─────────────────────────────────────────────────────────
async function fetchViaScrapling(url: string): Promise<string> {
  const baseUrl = getBaseUrl();
  const scraplingUrl = `${baseUrl}/api/scrapling`;

  console.log(`[cvParser] Scrapling → ${scraplingUrl} for target: ${url}`);

  let response: Response;
  try {
    response = await fetch(scraplingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(55000),
    });
  } catch (err: any) {
    throw new Error(
      `Scraping service unreachable (${err.message}). ` +
      `Tried: ${scraplingUrl}. Please upload the file directly.`
    );
  }

  if (!response.ok) {
    let msg = `Scraping service error (HTTP ${response.status})`;
    try {
      const body = await response.json();
      msg = body.error || msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }

  const data = await response.json();
  const text = (data?.text || '').toString().trim();

  if (!text || text.length < MIN_URL_TEXT_LENGTH) {
    throw new Error(
      'Page loaded but not enough text was extracted. ' +
      'The content may require a login or be JavaScript-rendered.'
    );
  }

  return text;
}

// ─────────────────────────────────────────────────────────
// Main export
// Pipeline: validate → direct file fetch → Scrapling → helpful error
// LinkedIn and other "hard" sites are attempted via Scrapling,
// not pre-blocked. Only show the export tip if scraping actually fails.
// ─────────────────────────────────────────────────────────
export async function fetchCVFromURL(url: string): Promise<string> {
  // 1. Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL. Please provide a full URL starting with https://');
  }

  // 2. Fast path — direct PDF/DOCX download (no browser needed)
  const directText = await tryDirectFileFetch(url);
  if (directText && directText.length >= MIN_CV_TEXT_LENGTH) {
    console.log('[cvParser] Direct file fetch succeeded');
    return directText;
  }

  // 3. Scrapling path — StealthyFetcher tries everything including LinkedIn
  try {
    return await fetchViaScrapling(url);
  } catch (err: any) {
    const msg: string = err.message || '';

    // If Scrapling failed, append a platform-specific export tip if we know the site
    const hint = getPlatformHint(url);
    const tipSuffix = hint
      ? `\n\n💡 ${hint.exportTip}`
      : '\n\n💡 Try downloading the file and uploading it directly using the "File Upload" tab.';

    // Don't double-wrap errors that already have instructions
    if (msg.includes('upload') || msg.includes('directly') || msg.includes('PDF')) {
      throw err;
    }

    throw new Error(`Failed to fetch CV: ${msg}${tipSuffix}`);
  }
}
