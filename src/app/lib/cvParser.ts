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

  // Check if it's a direct file URL (common patterns)
  const isDirectFile = url.match(/\.(pdf|docx?|txt)$/i) || 
                       url.includes('drive.google.com') ||
                       url.includes('dropbox.com') ||
                       url.includes('onedrive.live.com');

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 15000,
      responseType: 'arraybuffer',
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // Accept 4xx but not 5xx
    });

    // Check response status
    if (response.status === 403) {
      throw new Error('Access denied. The website blocks automated access. Please download the file and upload it directly.');
    }
    if (response.status === 404) {
      throw new Error('File not found (404). Please check the URL.');
    }
    if (response.status === 999) {
      throw new Error('Request blocked by website (999). This often happens with LinkedIn profiles. Please download your CV and upload it as a file instead.');
    }
    if (response.status >= 400) {
      throw new Error(`Failed to fetch URL (status ${response.status}). Please try uploading the file directly.`);
    }

    const contentType = response.headers['content-type'] || '';
    
    // Handle PDF
    if (contentType.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
      try {
        return await parseCV(Buffer.from(response.data), 'application/pdf');
      } catch (pdfError) {
        throw new Error('Failed to parse PDF. The file may be corrupted or password-protected.');
      }
    } 
    
    // Handle DOCX
    if (contentType.includes('wordprocessingml') || 
        contentType.includes('msword') ||
        url.toLowerCase().match(/\.docx?$/)) {
      try {
        return await parseCV(Buffer.from(response.data), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      } catch (docError) {
        throw new Error('Failed to parse Word document. The file may be corrupted.');
      }
    }
    
    // Handle HTML (web pages)
    if (contentType.includes('html') || contentType.includes('text/html')) {
      let html = response.data.toString();
      
      // Check if it's a cloud storage login/download page
      if (html.includes('google.com/drive') || 
          html.includes('dropbox.com/login') ||
          html.includes('onedrive.live.com')) {
        throw new Error('This appears to be a cloud storage link that requires authentication. Please make the file publicly accessible or download and upload it directly.');
      }
      
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
      
      if (html.length < 100) {
        throw new Error('Could not extract meaningful text from the webpage. Please ensure the URL points directly to your CV (PDF/DOCX) or upload the file directly.');
      }
      
      return html;
    }
    
    // Handle plain text
    if (contentType.includes('text/plain') || contentType.includes('text/')) {
      return response.data.toString();
    }
    
    // Unknown content type
    throw new Error(`Unsupported content type: ${contentType}. Please provide a direct link to a PDF, DOCX, or text file, or upload the file directly.`);
    
  } catch (error: any) {
    // Re-throw our custom errors
    if (error.message.includes('denied') || 
        error.message.includes('blocked') ||
        error.message.includes('404') ||
        error.message.includes('999') ||
        error.message.includes('cloud storage') ||
        error.message.includes('Unsupported')) {
      throw error;
    }
    
    // Network/timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timed out. The server is taking too long to respond. Please try again or upload the file directly.');
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      throw new Error('Could not reach the server. Please check the URL or your internet connection.');
    }
    
    // Generic error
    throw new Error(`Failed to fetch URL: ${error.message}. Please try uploading the file directly instead.`);
  }
}
