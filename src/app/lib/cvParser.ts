import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 10000,
    responseType: 'arraybuffer',
  });
  const contentType = response.headers['content-type'] || '';
  if (contentType.includes('pdf')) {
    return await parseCV(Buffer.from(response.data), 'application/pdf');
  } else if (contentType.includes('html')) {
    const $ = cheerio.load(response.data.toString());
    $('script, style, nav, footer').remove();
    return $('body').text().replace(/\s+/g, ' ').trim();
  }
  return response.data.toString();
}
