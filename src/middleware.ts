import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory, will reset on deployment)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMITS = {
  '/api/analyze': { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const limit = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS];
    
    if (limit) {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
      const key = `${pathname}:${ip}`;
      const now = Date.now();
      
      const rateLimitData = rateLimitMap.get(key);
      
      if (rateLimitData) {
        // Check if window has expired
        if (now > rateLimitData.resetTime) {
          rateLimitMap.set(key, { count: 1, resetTime: now + limit.windowMs });
        } else if (rateLimitData.count >= limit.maxRequests) {
          // Rate limit exceeded
          return NextResponse.json(
            { 
              error: 'Too many requests. Please try again later.',
              retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
            },
            { 
              status: 429,
              headers: {
                'Retry-After': String(Math.ceil((rateLimitData.resetTime - now) / 1000)),
                'X-RateLimit-Limit': String(limit.maxRequests),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': String(rateLimitData.resetTime),
              }
            }
          );
        } else {
          // Increment count
          rateLimitData.count++;
        }
      } else {
        // First request
        rateLimitMap.set(key, { count: 1, resetTime: now + limit.windowMs });
      }
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP header
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.groq.com https://va.vercel-scripts.com",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
