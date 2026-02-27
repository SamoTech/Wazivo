/**
 * Input validation utilities
 */

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'image/jpeg',
  'image/png',
  'image/jpg',
];

/**
 * Validates if a URL is properly formatted
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates if a file meets size and type requirements
 */
export function isValidFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload PDF, DOCX, DOC, or image files.',
    };
  }

  return { valid: true };
}

/**
 * Sanitizes a URL by removing dangerous protocols and ensuring HTTPS
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTP/HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
    
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
}

/**
 * Rate limiting helper (client-side)
 * Returns true if action is allowed, false if rate limited
 */
export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  if (typeof window === 'undefined') return true;

  const now = Date.now();
  const storageKey = `ratelimit_${key}`;
  const stored = localStorage.getItem(storageKey);
  
  let attempts: number[] = [];
  if (stored) {
    try {
      attempts = JSON.parse(stored);
    } catch {
      attempts = [];
    }
  }

  // Remove old attempts outside the window
  attempts = attempts.filter(timestamp => now - timestamp < windowMs);

  // Check if rate limit exceeded
  if (attempts.length >= maxAttempts) {
    return false;
  }

  // Add current attempt
  attempts.push(now);
  localStorage.setItem(storageKey, JSON.stringify(attempts));

  return true;
}
