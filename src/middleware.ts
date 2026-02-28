import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate limiting store with automatic cleanup
 * Note: In production, use Redis or Upstash for distributed rate limiting
 */
interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

const RATE_LIMITS = {
  '/api/analyze': { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
} as const;

// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * Clean up expired rate limit entries to prevent memory leaks
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();

  // Only cleanup if enough time has passed
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  let removedCount = 0;
  for (const [key, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(key);
      removedCount++;
    }
  }

  lastCleanup = now;

  if (removedCount > 0) {
    console.log(`[Middleware] Cleaned up ${removedCount} expired rate limit entries`);
  }
}

/**
 * Check and update rate limit for a request
 */
function checkRateLimit(pathname: string, ip: string): { allowed: boolean; retryAfter?: number } {
  const limit = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS];

  if (!limit) {
    return { allowed: true };
  }

  const key = `${pathname}:${ip}`;
  const now = Date.now();
  const rateLimitData = rateLimitMap.get(key);

  if (!rateLimitData) {
    // First request from this IP
    rateLimitMap.set(key, { count: 1, resetTime: now + limit.windowMs });
    return { allowed: true };
  }

  // Check if window has expired
  if (now > rateLimitData.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + limit.windowMs });
    return { allowed: true };
  }

  // Check if limit exceeded
  if (rateLimitData.count >= limit.maxRequests) {
    const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment count
  rateLimitData.count++;
  return { allowed: true };
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.groq.com https://va.vercel-scripts.com",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Periodic cleanup of expired entries
  cleanupExpiredEntries();

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed, retryAfter } = checkRateLimit(pathname, ip);

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(
              RATE_LIMITS[pathname as keyof typeof RATE_LIMITS]?.maxRequests || 0
            ),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(
              rateLimitMap.get(`${pathname}:${ip}`)?.resetTime || Date.now()
            ),
          },
        }
      );
    }
  }

  // Add security headers
  const response = NextResponse.next();
  addSecurityHeaders(response);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
