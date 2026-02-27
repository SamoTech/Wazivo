/**
 * Error monitoring and analytics setup
 * Supports Sentry and Vercel Analytics
 */

export function initMonitoring() {
  if (typeof window === 'undefined') return;

  // Initialize Sentry if DSN is provided
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs').then(Sentry => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        integrations: [
          new Sentry.Replay({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
      });
      
      console.log('[Monitoring] Sentry initialized');
    }).catch(err => {
      console.error('[Monitoring] Failed to initialize Sentry:', err);
    });
  }

  // Initialize Vercel Analytics
  if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
    import('@vercel/analytics').then(({ Analytics }) => {
      console.log('[Monitoring] Vercel Analytics initialized');
    }).catch(err => {
      console.error('[Monitoring] Failed to initialize Vercel Analytics:', err);
    });
  }
}

/**
 * Track custom events
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Track with Vercel Analytics
  if ((window as any).va) {
    (window as any).va('event', eventName, properties);
  }

  // Track with Sentry
  if ((window as any).Sentry) {
    (window as any).Sentry.addBreadcrumb({
      category: 'user-action',
      message: eventName,
      data: properties,
      level: 'info',
    });
  }

  console.log('[Analytics] Event:', eventName, properties);
}

/**
 * Report error to monitoring service
 */
export function reportError(error: Error, context?: Record<string, any>) {
  console.error('[Error]', error, context);

  if (typeof window === 'undefined') return;

  if ((window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      extra: context,
    });
  }
}
