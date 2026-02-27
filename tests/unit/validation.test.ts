import { isValidURL, isValidFile, sanitizeURL, checkRateLimit, MAX_FILE_SIZE } from '@/app/lib/validation';

describe('Validation Utils', () => {
  describe('isValidURL', () => {
    it('should validate correct URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://example.com')).toBe(true);
      expect(isValidURL('https://example.com/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('ftp://example.com')).toBe(false);
      expect(isValidURL('javascript:alert(1)')).toBe(false);
      expect(isValidURL('')).toBe(false);
    });
  });

  describe('isValidFile', () => {
    it('should validate correct files', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      
      const result = isValidFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject files exceeding size limit', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 });
      
      const result = isValidFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    it('should reject unsupported file types', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 });
      
      const result = isValidFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file type');
    });
  });

  describe('sanitizeURL', () => {
    it('should sanitize valid URLs', () => {
      expect(sanitizeURL('https://example.com')).toBe('https://example.com/');
      expect(sanitizeURL('http://example.com/path')).toBe('http://example.com/path');
    });

    it('should reject dangerous URLs', () => {
      expect(() => sanitizeURL('javascript:alert(1)')).toThrow('Invalid protocol');
      expect(() => sanitizeURL('data:text/html,<script>alert(1)</script>')).toThrow('Invalid protocol');
      expect(() => sanitizeURL('not-a-url')).toThrow('Invalid URL format');
    });
  });

  describe('checkRateLimit', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should allow requests within limit', () => {
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
    });

    it('should block requests exceeding limit', () => {
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit('test', 5, 60000)).toBe(true);
      }
      expect(checkRateLimit('test', 5, 60000)).toBe(false);
    });
  });
});
