/**
 * Application-wide constants and configuration
 */

// ── Upload Types ──────────────────────────────────────────
export const UPLOAD_TYPE = {
  FILE: 'file',
  URL: 'url',
} as const;

export type UploadType = typeof UPLOAD_TYPE[keyof typeof UPLOAD_TYPE];

// ── File Size Limits ──────────────────────────────────────
export const FILE_SIZE = {
  MAX_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_MB: 10,
} as const;

// ── Supported File Types ──────────────────────────────────
export const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  IMAGE: 'image/*',
} as const;

export const ACCEPTED_FILE_EXTENSIONS = '.pdf,.docx,.doc,image/*';

// ── Platform Warnings ─────────────────────────────────────
export interface PlatformWarning {
  match: string;
  name: string;
  tip: string;
}

export const WARNED_PLATFORMS: PlatformWarning[] = [
  {
    match: 'linkedin.com',
    name: 'LinkedIn',
    tip: "LinkedIn may require login. We'll try our best — if it fails, use \"Save to PDF\" from your profile.",
  },
  {
    match: 'glassdoor.com',
    name: 'Glassdoor',
    tip: 'Glassdoor may block access. If it fails, download your CV as PDF and upload directly.',
  },
  {
    match: 'indeed.com/resume',
    name: 'Indeed',
    tip: 'Indeed résumé pages may require login. If it fails, export as PDF from Indeed settings.',
  },
];

// ── Platform Hints (for error messages) ──────────────────
export const PLATFORM_HINTS: { match: string; name: string; exportTip: string }[] = [
  {
    match: 'linkedin.com',
    name: 'LinkedIn',
    exportTip:
      'LinkedIn requires login to view full profiles. ' +
      'To get your CV: go to your profile → click "More" → "Save to PDF" → upload that PDF here.',
  },
  {
    match: 'indeed.com/resume',
    name: 'Indeed',
    exportTip: 'Export your résumé as PDF from Indeed settings and upload it directly.',
  },
  {
    match: 'glassdoor.com',
    name: 'Glassdoor',
    exportTip: 'Download your résumé as PDF from Glassdoor and upload it directly.',
  },
];

// ── API Configuration ─────────────────────────────────────
export const API = {
  ANALYZE_ENDPOINT: '/api/analyze',
  TIMEOUT_MS: 60000, // 60 seconds
} as const;

// ── Minimum Text Requirements ─────────────────────────────
export const MIN_CV_TEXT_LENGTH = 100;
export const MIN_URL_TEXT_LENGTH = 200;

// ── Job Search Configuration ──────────────────────────────
export const JOB_SEARCH = {
  MAX_JOBS: 10,
  TIMEOUT_MS: 5000,
  MAX_RESULTS_DISPLAY: 10,
} as const;

// ── Helper Functions ──────────────────────────────────────
export function getPlatformWarning(url: string): PlatformWarning | null {
  const lower = url.toLowerCase();
  return WARNED_PLATFORMS.find(p => lower.includes(p.match)) || null;
}

export function getPlatformHint(url: string): { match: string; name: string; exportTip: string } | null {
  const lower = url.toLowerCase();
  return PLATFORM_HINTS.find(p => lower.includes(p.match)) || null;
}

export function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function isFileSizeValid(bytes: number): boolean {
  return bytes > 0 && bytes <= FILE_SIZE.MAX_BYTES;
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url || !url.trim()) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    const parsed = new URL(url.trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must start with http:// or https://' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format. Please provide a full URL starting with https://' };
  }
}
