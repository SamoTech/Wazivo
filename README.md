# Wazivo

Wazivo is a production-ready MVP for AI-powered resume analysis, ATS optimization, and cover-letter generation built with Next.js 14, TypeScript, Tailwind CSS, and Groq.

## What it does

- Analyze resumes and return a structured score
- Detect core skills and missing market skills
- Generate strengths, weaknesses, and career insights
- Rewrite resumes for ATS systems
- Generate tailored cover letters from a resume and job description
- Cache resume analysis results and apply API rate limiting

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Groq API (`llama-3.3-70b-versatile` by default)
- Optional Upstash Redis for cache and rate limiting

## Project structure

```text
src
├ app
│ ├ api
│ │ ├ analyze/route.ts
│ │ ├ rewrite/route.ts
│ │ └ cover-letter/route.ts
│ └ page.tsx
├ components
│ ├ ResumeUpload.tsx
│ ├ ScoreCard.tsx
│ ├ SkillsList.tsx
│ ├ MissingSkills.tsx
│ └ Report.tsx
└ lib
  ├ atsScore.ts
  ├ promptTemplates.ts
  ├ reportGenerator.ts
  ├ resumeAnalyzer.ts
  ├ runtime.ts
  └ skillExtractor.ts
```

## Environment variables

Create `.env.local` and add:

```bash
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

`UPSTASH_REDIS_*` is optional. Without it, Wazivo falls back to in-memory caching and rate limiting for local development.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Product notes

- No user accounts are required in this MVP.
- Resume analysis is cached by a SHA-256 hash of the resume text.
- API routes validate input size, sanitize text, and return safe errors.
- The analyze route is rate limited for anonymous usage and can support a future free/pro tier model.
