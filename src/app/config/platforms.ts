/**
 * Platform-specific configuration for CV URL fetching
 */

export interface PlatformConfig {
  match: string;
  name: string;
  tip: string;
  requiresAuth?: boolean;
}

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    match: 'linkedin.com',
    name: 'LinkedIn',
    tip: 'LinkedIn may require login. We\'ll try our best — if it fails, use "Save to PDF" from your profile.',
    requiresAuth: true,
  },
  {
    match: 'glassdoor.com',
    name: 'Glassdoor',
    tip: 'Glassdoor may block access. If it fails, download your CV as PDF and upload directly.',
    requiresAuth: true,
  },
  {
    match: 'indeed.com/resume',
    name: 'Indeed',
    tip: 'Indeed résumé pages may require login. If it fails, export as PDF from Indeed settings.',
    requiresAuth: true,
  },
  {
    match: 'github.com',
    name: 'GitHub',
    tip: 'GitHub profiles work well. We\'ll extract your README or profile information.',
    requiresAuth: false,
  },
];

/**
 * Get platform configuration for a given URL
 */
export function getPlatformConfig(url: string): PlatformConfig | null {
  const lower = url.toLowerCase();
  return PLATFORM_CONFIGS.find(p => lower.includes(p.match)) || null;
}

/**
 * Check if URL is likely to require authentication
 */
export function requiresAuth(url: string): boolean {
  const config = getPlatformConfig(url);
  return config?.requiresAuth || false;
}
