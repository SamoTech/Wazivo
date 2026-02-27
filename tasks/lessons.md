# Lessons Learned - Wazivo Project

## 📚 Knowledge Base

This document captures patterns, solutions, and lessons learned during development to prevent repeating mistakes.

---

## 🔧 Technical Lessons

### Lesson 1: Vercel Python Configuration
**Date**: Feb 26, 2026
**Problem**: Used wrong `vercel.json` syntax for Python functions
**Solution**: Use `rewrites` pattern, not `builds` or `functions`
**Pattern**: Always check Vercel docs for serverless function configuration
**Code**:
```json
{
  "rewrites": [{
    "source": "/api/endpoint",
    "destination": "/api/file.py"
  }]
}
```

### Lesson 2: Cold Start Performance
**Date**: Feb 26, 2026
**Problem**: Didn't anticipate browser installation time in serverless
**Solution**: Add browser detection + auto-install with caching
**Pattern**: Plan for serverless constraints upfront (cold starts, timeouts)
**Prevention**: Always test cold start behavior in staging

### Lesson 3: Error Boundaries
**Date**: Feb 27, 2026
**Problem**: No React Error Boundary caused white screen on crashes
**Solution**: Wrap main app in ErrorBoundary component
**Pattern**: Always add Error Boundary at root level
**Code**:
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Lesson 4: Input Validation
**Date**: Feb 27, 2026
**Problem**: Missing client-side validation led to bad requests
**Solution**: Create reusable validation utilities
**Pattern**: Validate early, validate often (client AND server)
**Files**: `src/app/lib/validation.ts`

### Lesson 5: Rate Limiting
**Date**: Feb 27, 2026
**Problem**: No protection against abuse
**Solution**: Implement both client-side and server-side rate limiting
**Pattern**: Layer security (client check + middleware + API)
**Files**: `src/middleware.ts`, `src/app/lib/validation.ts`

---

## 🎯 Best Practices

### Code Organization
- ✅ Separate concerns: components / lib / config / types
- ✅ Use TypeScript interfaces for all data structures
- ✅ Extract reusable logic into utility functions
- ✅ Keep components small (<200 lines)

### Error Handling
- ✅ Always wrap async calls in try-catch
- ✅ Log errors with context (not just error message)
- ✅ Show user-friendly messages (not technical errors)
- ✅ Send critical errors to monitoring service

### Testing
- ✅ Write tests for validation logic first
- ✅ Use E2E tests for critical user flows
- ✅ Mock external APIs in unit tests
- ✅ Aim for 70%+ coverage

### Performance
- ✅ Show progress indicators for long operations
- ✅ Implement client-side caching when appropriate
- ✅ Use code splitting for large dependencies
- ✅ Monitor bundle size

### Security
- ✅ Sanitize all user inputs
- ✅ Implement rate limiting
- ✅ Add security headers (CSP, etc.)
- ✅ Never expose API keys in client code

---

## ❌ Common Mistakes

### 1. Forgetting Error Boundaries
**Impact**: White screen on component errors
**Fix**: Add ErrorBoundary wrapper
**Prevention**: Include in boilerplate

### 2. No Input Validation
**Impact**: Bad requests, security vulnerabilities
**Fix**: Add validation utilities
**Prevention**: Create validation checklist

### 3. Missing Progress Indicators
**Impact**: Poor UX, users think app is frozen
**Fix**: Add loading states and progress bars
**Prevention**: Include in component templates

### 4. Hardcoded Configuration
**Impact**: Hard to maintain, environment-specific
**Fix**: Extract to config files
**Prevention**: Review before merging

### 5. Console.log in Production
**Impact**: Performance, security (data leaks)
**Fix**: Use proper logger with levels
**Prevention**: Add lint rule

---

## 📈 Improvements Made

### Code Quality
- Added TypeScript strict mode
- Added ESLint + Prettier
- Added pre-commit hooks (future)
- Improved error messages

### Testing
- Jest configuration
- Unit tests for validation
- E2E tests for critical flows
- CI/CD pipeline

### Monitoring
- Sentry for error tracking
- Vercel Analytics for usage
- Structured logging
- Performance monitoring

### Security
- Rate limiting (client + server)
- Input sanitization
- Security headers (CSP, etc.)
- CSRF protection

---

## 📝 Action Items

### For Next PR
- [ ] Review this document before starting
- [ ] Apply relevant patterns
- [ ] Add tests for new features
- [ ] Update lessons if new patterns emerge

### For Code Review
- [ ] Check error handling
- [ ] Verify input validation
- [ ] Confirm logging added
- [ ] Test edge cases

---

**Last Updated**: Feb 27, 2026
**Next Review**: Weekly
