import { isValidFile, isValidURL, sanitizeInput, hasValidExtension, checkRateLimit, clearRateLimit } from '../validation';

describe('isValidFile', () => {
  const makeFile = (name: string, type: string, size: number) =>
    new File([new ArrayBuffer(size)], name, { type });

  it('returns invalid for zero-size file', () => {
    const file = makeFile('empty.pdf', 'application/pdf', 0);
    expect(isValidFile(file).valid).toBe(false);
  });

  it('returns invalid for oversized file', () => {
    const file = makeFile('big.pdf', 'application/pdf', 11 * 1024 * 1024);
    expect(isValidFile(file).valid).toBe(false);
  });

  it('returns valid for a normal PDF', () => {
    const file = makeFile('cv.pdf', 'application/pdf', 100_000);
    expect(isValidFile(file).valid).toBe(true);
  });

  it('returns valid for a DOCX file', () => {
    const file = makeFile(
      'cv.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      100_000
    );
    expect(isValidFile(file).valid).toBe(true);
  });

  it('returns valid for an image file', () => {
    const file = makeFile('cv.png', 'image/png', 50_000);
    expect(isValidFile(file).valid).toBe(true);
  });

  it('returns invalid for unsupported type', () => {
    const file = makeFile('cv.exe', 'application/octet-stream', 100_000);
    expect(isValidFile(file).valid).toBe(false);
  });
});

describe('isValidURL', () => {
  it('accepts https URLs', () => {
    expect(isValidURL('https://example.com/resume.pdf')).toBe(true);
  });

  it('accepts http URLs', () => {
    expect(isValidURL('http://example.com')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidURL('')).toBe(false);
  });

  it('rejects plain text without protocol', () => {
    expect(isValidURL('not-a-url')).toBe(false);
  });
});

describe('sanitizeInput', () => {
  it('removes < > characters', () => {
    expect(sanitizeInput('<script>')).not.toContain('<');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('truncates to 1000 chars', () => {
    const long = 'a'.repeat(2000);
    expect(sanitizeInput(long).length).toBe(1000);
  });
});

describe('hasValidExtension', () => {
  it('accepts .pdf', () => expect(hasValidExtension('file.pdf')).toBe(true));
  it('accepts .docx', () => expect(hasValidExtension('file.docx')).toBe(true));
  it('accepts .png', () => expect(hasValidExtension('file.png')).toBe(true));
  it('rejects .exe', () => expect(hasValidExtension('file.exe')).toBe(false));
  it('is case-insensitive', () => expect(hasValidExtension('FILE.PDF')).toBe(true));
});

describe('checkRateLimit', () => {
  beforeEach(() => {
    clearRateLimit('test_action');
  });

  it('allows requests under the limit', () => {
    expect(checkRateLimit('test_action', 3, 60000)).toBe(true);
  });

  it('blocks requests over the limit', () => {
    checkRateLimit('test_action', 2, 60000);
    checkRateLimit('test_action', 2, 60000);
    expect(checkRateLimit('test_action', 2, 60000)).toBe(false);
  });
});
