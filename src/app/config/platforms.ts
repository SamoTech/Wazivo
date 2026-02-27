/**
 * Platform-specific configuration for URL fetching
 * Used to show appropriate warnings and guidance to users
 */

export interface PlatformConfig {
  name: string;
  tip: string;
}

const PLATFORM_CONFIGS: { match: string; config: PlatformConfig }[] = [
  {
    match: 'linkedin.com',
    config: {
      name: 'LinkedIn',
      tip: "LinkedIn may require login. We'll try our best — if it fails, use \"Save to PDF\" from your profile.",
    },
  },
  {
    match: 'glassdoor.com',
    config: {
      name: 'Glassdoor',
      tip: 'Glassdoor may block access. If it fails, download your CV as PDF and upload directly.',
    },
  },
  {
    match: 'indeed.com/resume',
    config: {
      name: 'Indeed',
      tip: 'Indeed résumé pages may require login. If it fails, export as PDF from Indeed settings.',
    },
  },
  {
    match: 'monster.com',
    config: {
      name: 'Monster',
      tip: 'Monster profiles may be protected. If it fails, save your profile as PDF and upload.',
    },
  },
  {
    match: 'ziprecruiter.com',
    config: {
      name: 'ZipRecruiter',
      tip: 'ZipRecruiter may require authentication. Download your profile and upload the file.',
    },
  },
];

/**
 * Get platform-specific configuration for a URL
 */
export function getPlatformConfig(url: string): PlatformConfig | null {
  if (!url) return null;
  
  const lower = url.toLowerCase();
  const match = PLATFORM_CONFIGS.find(p => lower.includes(p.match));
  
  return match ? match.config : null;
}

/**
 * Check if URL is from a known career platform
 */
export function isCareerPlatform(url: string): boolean {
  return getPlatformConfig(url) !== null;
}

/**
 * Get all supported platform names
 */
export function getSupportedPlatforms(): string[] {
  return PLATFORM_CONFIGS.map(p => p.config.name);
}
