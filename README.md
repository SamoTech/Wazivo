# Wazivo

<div align="center">

### Get Hired, Get Wazivo

AI-powered resume analysis, ATS optimization, smart job discovery, and guided skill improvement built with Next.js, TypeScript, Tailwind CSS, and Groq.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-20232A?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-AI-orange)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![Repo Stars](https://img.shields.io/github/stars/SamoTech/Wazivo?style=social)](https://github.com/SamoTech/Wazivo/stargazers)
[![Follow @SamoTech](https://img.shields.io/github/followers/SamoTech?style=social)](https://github.com/SamoTech)
[![Sponsor](https://img.shields.io/badge/Sponsor-SamoTech-pink?logo=githubsponsors)](https://github.com/sponsors/SamoTech)

</div>

## Overview

Wazivo is a production-ready AI resume toolkit that helps candidates analyze their CV, improve ATS readiness, generate better application material, discover relevant jobs, and learn missing skills faster.

It now combines resume scoring, skill-gap detection, ATS rewriting, cover-letter generation, smart job-search links for Egypt, Gulf, and remote markets, plus free-first course recommendations directly inside the analysis flow.

## Highlights

- Analyze resume text and generate a structured hiring-readiness score.
- Detect core skills, career level, strengths, weaknesses, and missing market skills.
- Rewrite resumes for ATS-friendly formatting and keyword coverage.
- Generate tailored cover letters from resume text and job descriptions.
- Create smart job-search links for Egypt, Gulf, and remote opportunities.
- Suggest free courses first, then paid learning paths for each missing skill.
- Support direct CV paste from the homepage with explicit clipboard actions.
- Cache analysis results and rate limit anonymous usage.

## What changed

The latest product flow extends the original resume analyzer into a guided job-readiness workspace.

- Smart job links are generated during CV analysis.
- Missing skills now include learning resources inside the same section.
- Separate platform buttons are shown for job search destinations.
- Clipboard paste support was improved for CV and job description inputs.
- Analysis caching was versioned to support the expanded response schema.

## Job platforms

Wazivo generates separate search links across multiple job destinations using the strongest detected role from the CV.

- LinkedIn
- Indeed
- Bayt
- Glassdoor
- Wuzzuf
- Naukrigulf
- GulfTalent
- Monster Gulf
- Wellfound
- Remote OK
- Remotive

## Tech stack

### App framework

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS

### AI and processing

- Groq API
- OpenAI SDK client utilities
- Zod
- Axios
- pdf-parse
- Mammoth
- Tesseract.js

### Quality and tooling

- Jest
- Playwright
- ESLint
- Prettier

## Project structure

```text
src
├── app
│   ├── api
│   │   ├── analyze/route.ts
│   │   ├── rewrite/route.ts
│   │   └── cover-letter/route.ts
│   └── page.tsx
├── components
│   ├── JobMatches.tsx
│   ├── ResumeUpload.tsx
│   ├── ScoreCard.tsx
│   ├── SkillsList.tsx
│   ├── MissingSkills.tsx
│   └── Report.tsx
└── lib
    ├── atsScore.ts
    ├── careerResources.ts
    ├── promptTemplates.ts
    ├── reportGenerator.ts
    ├── resumeAnalyzer.ts
    ├── runtime.ts
    └── skillExtractor.ts
```

## Environment variables

Create a `.env.local` file and add the following:

```bash
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

`UPSTASH_REDIS_*` values are optional. Without them, Wazivo falls back to in-memory caching and rate limiting for local development.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run type-check
npm run format
npm run format:check
```

## Product flow

1. Paste a resume into the main workspace.
2. Run CV analysis to get the score, skills, weaknesses, and summary.
3. Explore recommended roles and smart job links.
4. Review missing skills and open free-first learning suggestions.
5. Rewrite the resume for ATS.
6. Generate a tailored cover letter from a target job description.

## Sponsor and profiles

Support the project and follow the builder here:

- GitHub profile: [github.com/SamoTech](https://github.com/SamoTech)
- GitHub Sponsors: [github.com/sponsors/SamoTech](https://github.com/sponsors/SamoTech)
- Repository: [github.com/SamoTech/Wazivo](https://github.com/SamoTech/Wazivo)

## Why Wazivo

Wazivo is designed as an MVP that feels immediately useful to candidates, while staying practical to deploy and extend.

It is a strong base for future upgrades such as account systems, saved resumes, role-specific optimization, exports, recruiter dashboards, and premium plans.
