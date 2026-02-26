import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import axios from 'axios';

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
// Blocked platform detection
// ─────────────────────────────────────────────────────────
const BLOCKED_PLATFORMS = [
  {
    match: 'linkedin.com',
    name: 'LinkedIn',
    instructions: 'Go to your LinkedIn profile → click "More" → "Save to PDF" → upload that PDF here.',
  },
  {
    match: 'indeed.com/resume',
    name: 'Indeed',
    instructions: 'Export your résumé as PDF from Indeed and upload it directly.',
  },
  {
    match: 'glassdoor.com',
    name: 'Glassdoor',
    instructions: 'Download your résumé as PDF from Glassdoor and upload it directly.',
  },
];

function isBlockedPlatform(url: string) {
  const lower = url.toLowerCase();
  return BLOCKED_PLATFORMS.find(p => lower.includes(p.match)) || null;
}

// ─────────────────────────────────────────────────────────
// Build the absolute base URL — works on Vercel + localhost
// VERCEL_PROJECT_PRODUCTION_URL  → always the prod domain (no protocol)
// VERCEL_URL                     → current deployment URL  (no protocol)
// NEXT_PUBLIC_APP_URL            → manually set override
// ─────────────────────────────────────────────────────────
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

// ─────────────────────────────────────────────────────────
// Step 1: Try fetching a direct PDF/DOCX URL in Node.js
// (fast, no Python needed for publicly accessible files)
// ─────────────────────────────────────────────────────────
async function tryDirectFileFetch(url: string): Promise<string | null> {
  const isDirectFile = /\.(pdf|docx?)(\?.*)?$/i.test(url);
  if (!isDirectFile) return null;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      timeout: 20000,
      responseType: 'arraybuffer',
      maxRedirects: 5,
      validateStatus: (s) => s < 500,
    });

    if (response.status !== 200) return null;

    const contentType: string = response.headers['content-type'] || '';
    const isPdf = contentType.includes('pdf') || /\.pdf(\?.*)?$/i.test(url);
    const isDocx = contentType.includes('wordprocessingml') || contentType.includes('msword') || /\.docx?(\?.*)?$/i.test(url);

    if (isPdf) {
      return await parseCV(Buffer.from(response.data), 'application/pdf');
    }
    if (isDocx) {
      return await parseCV(Buffer.from(response.data), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
  } catch {
    // silent — fall through to Scrapling
  }
  return null;
}

// ─────────────────────────────────────────────────────────
// Step 2: Call the Python Scrapling serverless function
// Uses an absolute URL so it works server-side on Vercel
// ─────────────────────────────────────────────────────────
async function fetchViaScrapling(url: string): Promise<string> {
  const baseUrl = getBaseUrl();
  const scraplingUrl = `${baseUrl}/api/scrapling`;

  console.log(`[cvParser] Calling Scrapling at: ${scraplingUrl}`);

  let response: Response;
  try {
    response = await fetch(scraplingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(55000),
    });
  } catch (networkErr: any) {
    throw new Error(
      `Could not reach the scraping service (${networkErr.message}). ` +
      `Scrapling URL tried: ${scraplingUrl}. Please upload the file directly.`
    );
  }

  if (!response.ok) {
    let errMsg = `Scraping service returned ${response.status}`;
    try {
      const errBody = await response.json();
      errMsg = errBody.error || errMsg;
    } catch { /* ignore */ }
    throw new Error(errMsg);
  }

  const data = await response.json();
  const text = (data?.text || '').toString().trim();

  if (!text || text.length < 200) {
    throw new Error(
      'The page was fetched but not enough text was extracted. ' +
      'The content may require a login or be JavaScript-rendered. Please upload the file directly.'
    );
  }

  return text;
}

// ─────────────────────────────────────────────────────────
// Main export — orchestrates the full fetch pipeline
// ─────────────────────────────────────────────────────────
export async function fetchCVFromURL(url: string): Promise<string> {
  // 1. Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL. Please provide a full URL starting with https://');
  }

  // 2. Fail fast for known-blocked platforms with helpful message
  const blocked = isBlockedPlatform(url);
  if (blocked) {
    throw new Error(
      `❌ ${blocked.name} profiles cannot be fetched automatically.\n\n` +
      `${blocked.instructions}\n\n` +
      `💡 Use the "File Upload" tab to upload the exported PDF.`
    );
  }

  // 3. Try direct Node.js fetch for PDF/DOCX URLs (fastest path)
  const directText = await tryDirectFileFetch(url);
  if (directText && directText.length >= 100) {
    console.log('[cvParser] Direct file fetch succeeded');
    return directText;
  }

  // 4. Fall back to Scrapling Python service (handles bot-protected HTML pages)
  console.log('[cvParser] Falling back to Scrapling service');
  try {
    return await fetchViaScrapling(url);
  } catch (err: any) {
    const msg: string = err.message || '';

    // Surface clean user-facing errors
    if (
      msg.includes('blocked') || msg.includes('login') ||
      msg.includes('upload') || msg.includes('403') ||
      msg.includes('999') || msg.includes('denied')
    ) {
      throw err;
    }

    throw new Error(
      `Failed to extract CV from URL: ${msg}. ` +
      'Please download the file and upload it directly.'
    );
  }
}
