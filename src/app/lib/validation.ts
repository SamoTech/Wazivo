import { FILE_SIZE, validateUrl } from './constants';

/**
 * Validate file size and type
 */
export function isValidFile(file: File): { valid: boolean; error?: string } {
  // Check file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  if (file.size > FILE_SIZE.MAX_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed size of ${FILE_SIZE.MAX_MB} MB`,
    };
  }

  // Check file type
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  const isValidType = validTypes.includes(file.type) || file.type.startsWith('image/');

  if (!isValidType) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PDF, DOCX, DOC, or image files.',
    };
  }

  return { valid: true };
}

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  return validateUrl(url).valid;
}

/**
 * Simple rate limiting using localStorage
 * @param key - Unique key for the action
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  if (typeof window === 'undefined') return true; // Server-side always allowed

  const now = Date.now();
  const storageKey = `ratelimit_${key}`;

  try {
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : { attempts: [], firstAttempt: now };

    // Filter out attempts outside the time window
    data.attempts = data.attempts.filter((time: number) => now - time < windowMs);

    // Check if limit exceeded
    if (data.attempts.length >= maxAttempts) {
      return false;
    }

    // Add current attempt
    data.attempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(data));

    return true;
  } catch (error) {
    // If localStorage fails (privacy mode, etc.), allow the request
    console.warn('Rate limiting unavailable:', error);
    return true;
  }
}

/**
 * Clear rate limit for a specific key (useful for testing)
 */
export function clearRateLimit(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(`ratelimit_${key}`);
  } catch (error) {
    console.warn('Could not clear rate limit:', error);
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>"']/g, '') // Remove potentially dangerous characters
    .slice(0, 1000); // Limit length
}

/**
 * Validate file extension
 */
export function hasValidExtension(filename: string): boolean {
  const validExtensions = [
    '.pdf',
    '.docx',
    '.doc',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
  ];
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(ext);
}
