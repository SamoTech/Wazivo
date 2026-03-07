/**
 * Bayt.com Affiliate Integration
 * Account ID: 1514103
 * Tracks job search referrals for commission
 */

export type AffiliatePlatform = 'bayt';

interface BaytAffiliateConfig {
  name: string;
  baseUrl: string;
  affiliateId: string;
}

const BAYT_CONFIG: BaytAffiliateConfig = {
  name: 'Bayt.com',
  baseUrl: 'https://www.bayt.com/en',
  affiliateId: process.env.NEXT_PUBLIC_BAYT_AFFILIATE_ID || '1514103',
};

/**
 * Build Bayt.com affiliate tracking URL
 * @param searchQuery - Job search keywords (e.g., "Senior React Developer TypeScript")
 * @param country - Country code (egypt, uae, saudi-arabia, etc.)
 * @returns Full affiliate tracking URL
 */
export function buildBaytAffiliateUrl(
  searchQuery: string,
  country: string = 'egypt'
): string {
  const url = new URL(`${BAYT_CONFIG.baseUrl}/${country}/jobs/`);
  
  // Add search query
  url.searchParams.set('q', searchQuery.trim());
  
  // Add affiliate tracking (THIS IS CRITICAL FOR COMMISSION)
  url.searchParams.set('a', BAYT_CONFIG.affiliateId);
  
  // Add UTM tracking for analytics
  url.searchParams.set('utm_source', 'wazivo');
  url.searchParams.set('utm_medium', 'resume_analyzer');
  url.searchParams.set('utm_campaign', 'job_match');
  
  // Add timestamp for unique tracking
  url.searchParams.set('ts', Date.now().toString());
  
  return url.toString();
}

/**
 * Get platform display name
 */
export function getBaytAffiliateName(): string {
  return BAYT_CONFIG.name;
}

/**
 * Map Wazivo regions to Bayt.com country codes
 */
export function getBaytCountryCode(region: string): string {
  const countryMap: Record<string, string> = {
    Egypt: 'egypt',
    Gulf: 'uae', // Default Gulf to UAE (largest Bayt market)
    Remote: 'international',
  };
  
  return countryMap[region] || 'egypt';
}

/**
 * Track affiliate click event (for internal analytics)
 */
export function trackAffiliateClick(
  platform: string,
  region: string,
  query: string
): void {
  try {
    // Store in localStorage for admin dashboard
    const clickData = {
      platform,
      region,
      query,
      timestamp: new Date().toISOString(),
    };
    
    const stored = localStorage.getItem('wazivo_affiliate_clicks');
    const clicks = stored ? JSON.parse(stored) : [];
    clicks.push(clickData);
    
    // Keep only last 1000 clicks to avoid storage bloat
    if (clicks.length > 1000) {
      clicks.shift();
    }
    
    localStorage.setItem('wazivo_affiliate_clicks', JSON.stringify(clicks));
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Affiliate Click:', clickData);
    }
  } catch (error) {
    console.error('Failed to track affiliate click:', error);
  }
}
