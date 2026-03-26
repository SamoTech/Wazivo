# Repository Review — March 26, 2026

## Scope
This review focuses on the current `main` Next.js application code, API routes, shared runtime utilities, and test/tooling setup.

## What is working well
- **Core quality checks are healthy**: linting, type-checking, and current Jest suites pass.
- **API routes are guarded** with reusable input normalization and length validation.
- **Operational guardrails exist**: basic rate limiting and response caching are implemented.
- **Graceful degradation** is present for AI features (fallback analysis/rewrite/cover letter behavior when provider calls fail).

## Key risks and observations

### 1) Architectural duplication and drift risk
There are two parallel backend utility stacks in the repo:
- `src/lib/*` (used by `src/app/api/*` routes)
- `src/app/lib/*` (contains separate analysis/error/service logic)

This creates a long-term maintenance risk where improvements and bug fixes can be applied to one path but not the other.

**Recommendation**: pick one canonical backend layer and progressively migrate imports/callers to it; then deprecate the unused path.

### 2) Silent failure paths hide operational issues
Several `catch {}` blocks intentionally swallow provider/cache/rate-limit errors and quietly fall back to memory or heuristic behavior.

This is resilient for end users, but it can hide production incidents (e.g., broken Redis credentials or degraded external API behavior) unless external monitoring catches it.

**Recommendation**: keep graceful fallback, but emit structured warning logs on fallback activation for observability.

### 3) Test coverage is narrowly focused
Current tests are concentrated on validation/helpers, while API route behavior and AI-adjacent flows have limited direct coverage.

**Recommendation**: add route-level tests for:
- status code behavior for invalid payloads/oversized payloads,
- rate-limit responses and headers,
- cache-hit vs cache-miss behavior for analyze endpoint,
- fallback-mode responses when AI provider errors occur.

### 4) Configuration/docs inconsistency risk
The repository contains multiple docs and summaries (`README`, `docs/*`, refactor summaries, audit checkpoint). As the codebase evolves, this can drift.

**Recommendation**: define one “source of truth” for runtime architecture and environment contract, and link the rest back to it.

## Suggested priority plan
1. **P1 (Reliability)**: add fallback warning logs + route-level tests for error/rate-limit/cache paths.
2. **P2 (Maintainability)**: consolidate duplicate backend utility layers.
3. **P3 (Docs quality)**: align architecture docs and remove stale overlap.

## Commands used for this review
- `rg --files`
- `sed -n '1,220p' README.md`
- `sed -n '1,220p' package.json`
- `sed -n '1,260p' src/app/api/analyze/route.ts`
- `sed -n '1,260p' src/app/api/rewrite/route.ts`
- `sed -n '1,260p' src/app/api/cover-letter/route.ts`
- `sed -n '1,320p' src/lib/runtime.ts`
- `sed -n '1,420p' src/app/lib/openaiService.ts`
- `sed -n '1,260p' src/lib/resumeAnalyzer.ts`
- `npm run test -- --runInBand`
- `npm run type-check`
- `npm run lint`
