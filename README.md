<div align="center">

<img src="https://wazivo.vercel.app/favicon.ico" alt="Wazivo Logo" width="64" height="64" />

# Wazivo — وظيفو

### Your Intelligent Career Companion

**AI-powered resume analysis, ATS optimization, smart job discovery, and guided skill improvement.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-wazivo.vercel.app-22c55e?style=for-the-badge)](https://wazivo.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-FF6B00?style=for-the-badge)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

[![GitHub Stars](https://img.shields.io/github/stars/SamoTech/Wazivo?style=social)](https://github.com/SamoTech/Wazivo/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/SamoTech/Wazivo?style=social)](https://github.com/SamoTech/Wazivo/network/members)
[![Follow @SamoTech](https://img.shields.io/github/followers/SamoTech?style=social)](https://github.com/SamoTech)
[![Sponsor](https://img.shields.io/badge/💖_Sponsor-SamoTech-ea4aaa?style=flat-square&logo=githubsponsors)](https://github.com/sponsors/SamoTech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/SamoTech/Wazivo/blob/main/LICENSE)

[🌐 Live Product](https://wazivo.vercel.app/) · [🐛 Report Bug](https://github.com/SamoTech/Wazivo/issues/new) · [✨ Request Feature](https://github.com/SamoTech/Wazivo/issues/new) · [💖 Sponsor](https://github.com/sponsors/SamoTech)

</div>

---

## 🚀 What is Wazivo?

Wazivo is a production-ready AI career toolkit that helps job seekers analyze their CV, improve ATS readiness, generate better application material, discover relevant jobs, and learn missing skills faster.

It combines resume scoring, skill-gap detection, ATS rewriting, cover-letter generation, smart job-search links for Egypt, Gulf, and remote markets, plus free-first course recommendations — all in one guided flow.

> **Try it now → [wazivo.vercel.app](https://wazivo.vercel.app/)**

---

## ✨ Features

- 📊 **Resume Scoring** — Analyze resume text and generate a structured hiring-readiness score
- 🔍 **Skill Gap Detection** — Detect core skills, career level, strengths, weaknesses, and missing market skills
- 🤖 **ATS Rewriting** — Rewrite resumes for ATS-friendly formatting and keyword coverage
- ✉️ **Cover Letter Generator** — Generate tailored cover letters from resume text and job descriptions
- 🌍 **Smart Job Links** — Instant search links for Egypt, Gulf, and remote opportunities
- 📚 **Learning Paths** — Free-first course recommendations for every missing skill
- 📋 **CV Paste Support** — Direct clipboard paste from the homepage
- ⚡ **Caching & Rate Limiting** — Analysis results cached, anonymous usage rate-limited

---

## 🌍 Supported Job Platforms

Wazivo generates targeted search links across 11 job platforms using the strongest detected role from your CV:

| Platform | Region |
|---|---|
| LinkedIn | Global |
| Indeed | Global |
| Glassdoor | Global |
| Wellfound | Global / Startups |
| Remote OK | Remote |
| Remotive | Remote |
| Bayt | MENA |
| Wuzzuf | Egypt |
| Naukrigulf | Gulf |
| GulfTalent | Gulf |
| Monster Gulf | Gulf |

---

## 🛠️ Tech Stack

### App Framework
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS

### AI & Processing
- Groq API (llama-3.3-70b-versatile)
- OpenAI SDK client utilities
- Zod · Axios · pdf-parse · Mammoth · Tesseract.js

### Quality & Tooling
- Jest · Playwright · ESLint · Prettier

---

## 📁 Project Structure

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

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A free [Groq API key](https://console.groq.com/)

### Environment Variables

Create a `.env.local` file:

```bash
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile

# Optional — falls back to in-memory if not set
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Run Locally

```bash
git clone https://github.com/SamoTech/Wazivo.git
cd Wazivo
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev            # Start development server
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
npm run test           # Run unit tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
npm run test:e2e       # End-to-end tests
npm run type-check     # TypeScript check
npm run format         # Prettier format
npm run format:check   # Check formatting
```

---

## 🔄 Product Flow

1. **Paste** your resume into the main workspace
2. **Analyze** — get your score, skills, weaknesses, and summary
3. **Explore** recommended roles and smart job links
4. **Review** missing skills and open free-first learning suggestions
5. **Rewrite** your resume for ATS
6. **Generate** a tailored cover letter from a target job description

---

## 🗺️ Roadmap

- [ ] User accounts and saved resumes
- [ ] Role-specific optimization profiles
- [ ] PDF/DOCX export
- [ ] Recruiter dashboard
- [ ] Premium subscription plans
- [ ] Arabic language support

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 💖 Sponsor

If Wazivo saves you time or helps your job search, consider supporting the project:

[![Sponsor SamoTech](https://img.shields.io/badge/💖_Sponsor_SamoTech-GitHub_Sponsors-ea4aaa?style=for-the-badge&logo=githubsponsors)](https://github.com/sponsors/SamoTech)

Your sponsorship helps fund continued development, new features, and keeping the live demo free.

---

## 📬 Contact

| | |
|---|---|
| **GitHub** | [@SamoTech](https://github.com/SamoTech) |
| **Twitter / X** | [@OssamaHashim](https://twitter.com/OssamaHashim) |
| **Email** | samo.hossam@gmail.com |
| **Live Product** | [wazivo.vercel.app](https://wazivo.vercel.app/) |
| **Sponsor** | [github.com/sponsors/SamoTech](https://github.com/sponsors/SamoTech) |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Ossama Hashim](https://github.com/SamoTech) · Cairo, Egypt

⭐ Star this repo if you find it useful!

</div>
