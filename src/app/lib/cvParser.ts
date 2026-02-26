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
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 10000,
    responseType: 'arraybuffer',
  });
  
  const contentType = response.headers['content-type'] || '';
  
  if (contentType.includes('pdf')) {
    return await parseCV(Buffer.from(response.data), 'application/pdf');
  } else if (contentType.includes('html')) {
    // Simple HTML to text conversion without cheerio
    let html = response.data.toString();
    
    // Remove script and style tags
    html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
    html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '');
    html = html.replace(/<nav[^>]*>([\s\S]*?)<\/nav>/gi, '');
    html = html.replace(/<footer[^>]*>([\s\S]*?)<\/footer>/gi, '');
    html = html.replace(/<header[^>]*>([\s\S]*?)<\/header>/gi, '');
    
    // Remove all HTML tags
    html = html.replace(/<[^>]+>/g, ' ');
    
    // Decode HTML entities
    html = html.replace(/&nbsp;/g, ' ');
    html = html.replace(/&amp;/g, '&');
    html = html.replace(/&lt;/g, '<');
    html = html.replace(/&gt;/g, '>');
    html = html.replace(/&quot;/g, '"');
    html = html.replace(/&#39;/g, "'");
    
    // Normalize whitespace
    html = html.replace(/\s+/g, ' ').trim();
    
    return html;
  }
  
  return response.data.toString();
}
