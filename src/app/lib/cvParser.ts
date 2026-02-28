import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import axios, { AxiosError } from 'axios';
import { MIN_CV_TEXT_LENGTH, MIN_URL_TEXT_LENGTH, getPlatformHint } from './constants';
import { CVParsingError, ErrorCodes } from './errors';
import { logger } from './logger';

/**
 * Maximum CV text size to prevent abuse
 */
const MAX_CV_SIZE = 50000; // 50KB

/**
 * Parse a local file buffer into text
 */
export async function parseCV(file: Buffer, mimeType: string): Promise<string> {
  logger.info('Parsing CV file', { mimeType, size: file.length });

  try {
    let text: string;

    if (mimeType === 'application/pdf') {
      const data = await pdf(file);
      text = data.text;
    } else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
      const result = await mammoth.extractRawText({ buffer: file });
      text = result.value;
    } else if (mimeType.startsWith('image/')) {
      const { data: { text: extractedText } } = await Tesseract.recognize(file, 'eng');
      text = extractedText;
    } else {
      throw new CVParsingError(
        ErrorCodes.UNSUPPORTED_FILE_TYPE,
        `Unsupported file type: ${mimeType}`
      );
    }

    if (text.length > MAX_CV_SIZE) {
      throw new CVParsingError(
        ErrorCodes.FILE_TOO_LARGE,
        'CV content exceeds maximum size limit',
        { size: text.length, max: MAX_CV_SIZE }
      );
    }

    logger.info('CV parsed successfully', { textLength: text.length });
    return text;
  } catch (error) {
    if (error instanceof CVParsingError) throw error;
    
    logger.error('CV parsing failed', { error, mimeType });
    throw new CVParsingError(
      ErrorCodes.PARSE_FAILED,
      'Failed to extract text from file',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

/**
 * Check if URL is from a known protected platform
 */
function isProtectedPlatform(url: string): boolean {
  const protectedDomains = [
    'linkedin.com',
    'glassdoor.com',
    'indeed.com',
    'ziprecruiter.com',
    'monster.com',
  ];
  const lower = url.toLowerCase();
  return protectedDomains.some(domain => lower.includes(domain));
}

function isLinkedIn(url: string): boolean {
  return url.toLowerCase().includes('linkedin.com');
}

/**
 * Detect LinkedIn login wall from content
 */
function detectLinkedInLoginWall(content: string): boolean {
  const lower = content.toLowerCase();
  const loginSignals = [
    'sign in to linkedin',
    'join linkedin',
    'authwall',
    'be the first',
    'create your free account',
    'sign up',
  ];

  return loginSignals.some(signal => lower.includes(signal)) && content.length < 1000;
}

/**
 * Fetch via Jina Reader API
 * @see https://jina.ai/reader
 */
async function fetchViaJinaReader(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;

  const headers: Record<string, string> = {
    Accept: 'text/plain',
    'X-Return-Format': 'markdown',
    'X-Remove-Selector':
      'nav, footer, header, .nav, .footer, .header, .sidebar, #sidebar, .ads, .cookie-banner',
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
    logger.info('Fetching CV via Jina Reader', { url: url.substring(0, 50) });

    const response = await axios.get(jinaUrl, {
      headers,
      timeout: 45000,
      validateStatus: status => status === 200, // Only accept 200
    });

    const content = response.data.trim();

    if (!content || content.length < 100) {
      throw new CVParsingError(
        ErrorCodes.INSUFFICIENT_TEXT,
        'Page returned too little content',
        { contentLength: content.length }
      );
    }

    // Detect LinkedIn login wall
    if (isLinkedIn(url) && detectLinkedInLoginWall(content)) {
      throw new CVParsingError(
        ErrorCodes.LOGIN_REQUIRED,
        'LinkedIn requires login to view this profile. Please download as PDF and upload directly.',
        { platform: 'LinkedIn' }
      );
    }

    logger.info('Successfully fetched via Jina Reader', { contentLength: content.length });
    return content.slice(0, 15000);
  } catch (error) {
    if (error instanceof CVParsingError) throw error;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 422) {
        throw new CVParsingError(
          ErrorCodes.FETCH_FAILED,
          'Jina Reader could not process this URL',
          { status: 422 }
        );
      }

      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        throw new CVParsingError(
          ErrorCodes.LOGIN_REQUIRED,
          'The page requires authentication',
          { status: axiosError.response.status }
        );
      }

      if (axiosError.code === 'ECONNABORTED') {
        throw new CVParsingError(
          ErrorCodes.FETCH_FAILED,
          'Request timed out. The page took too long to load.',
          { timeout: true }
        );
      }
    }

    logger.error('Jina Reader fetch failed', { error, url: url.substring(0, 50) });
    throw new CVParsingError(
      ErrorCodes.FETCH_FAILED,
      'Failed to fetch CV from URL',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

/**
 * Try direct file download for PDF/DOCX URLs
 */
async function tryDirectFileFetch(url: string): Promise<string | null> {
  // Only try for URLs that look like direct file links
  if (!/\.(pdf|docx?)(\?.*)?$/i.test(url)) {
    return null;
  }

  try {
    logger.debug('Attempting direct file download', { url: url.substring(0, 50) });

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
      timeout: 20000,
      responseType: 'arraybuffer',
      maxRedirects: 5,
      validateStatus: status => status === 200,
    });

    const ct: string = response.headers['content-type'] || '';
    let mimeType: string | null = null;

    if (ct.includes('pdf') || /\.pdf(\?.*)?$/i.test(url)) {
      mimeType = 'application/pdf';
    } else if (
      ct.includes('wordprocessingml') ||
      ct.includes('msword') ||
      /\.docx?(\?.*)?$/i.test(url)
    ) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    if (!mimeType) return null;

    const text = await parseCV(Buffer.from(response.data), mimeType);
    if (text.length >= MIN_CV_TEXT_LENGTH) {
      logger.info('Direct file fetch succeeded', { textLength: text.length });
      return text;
    }
  } catch (error) {
    logger.debug('Direct fetch failed, will try Jina Reader', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return null;
}

/**
 * Main export: Fetch CV from any URL
 * Strategy: Direct file download → Jina Reader API → Helpful error
 */
export async function fetchCVFromURL(url: string): Promise<string> {
  // 1. Validate URL format
  try {
    new URL(url);
  } catch {
    throw new CVParsingError(
      ErrorCodes.INVALID_URL,
      'Invalid URL format. Please provide a full URL starting with https://'
    );
  }

  // 2. Try direct file download first (fast path for .pdf/.docx)
  const directText = await tryDirectFileFetch(url);
  if (directText) {
    return directText;
  }

  // 3. Use Jina Reader for everything else
  try {
    const text = await fetchViaJinaReader(url);

    if (text.length < MIN_URL_TEXT_LENGTH) {
      throw new CVParsingError(
        ErrorCodes.INSUFFICIENT_TEXT,
        'Not enough text extracted from page',
        { textLength: text.length, minRequired: MIN_URL_TEXT_LENGTH }
      );
    }

    return text;
  } catch (error) {
    if (error instanceof CVParsingError) {
      // Add platform-specific help if available
      const hint = getPlatformHint(url);
      if (hint && !error.message.includes('💡')) {
        error.message += `\n\n💡 ${hint.exportTip}`;
      }
      throw error;
    }

    throw error;
  }
}
