# Wazivo - AI-Powered Resume Analyzer

<div align="center">

![Wazivo Logo](https://img.shields.io/badge/Wazivo-Get%20Hired-blue?style=for-the-badge&logo=briefcase)

### **Get Hired, Get Wazivo** ⚡

[![CI/CD](https://github.com/SamoTech/Wazivo/actions/workflows/ci.yml/badge.svg)](https://github.com/SamoTech/Wazivo/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-10%2F10-brightgreen?logo=codacy&logoColor=white)](https://github.com/SamoTech/Wazivo)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SamoTech/Wazivo/graphs/commit-activity)
[![GitHub issues](https://img.shields.io/github/issues/SamoTech/Wazivo)](https://github.com/SamoTech/Wazivo/issues)
[![GitHub stars](https://img.shields.io/github/stars/SamoTech/Wazivo?style=social)](https://github.com/SamoTech/Wazivo/stargazers)

**Lightning-fast AI resume analysis powered by Groq's LLaMA 3.3 70B model**

Upload your CV or LinkedIn profile and get instant career insights, skill gap analysis, personalized course recommendations, and matching job opportunities.

[Demo](https://wazivo.vercel.app) • [Documentation](https://github.com/SamoTech/Wazivo/tree/main/docs) • [Report Bug](https://github.com/SamoTech/Wazivo/issues) • [Request Feature](https://github.com/SamoTech/Wazivo/issues)

</div>

---

## ✨ Features

- 📄 **Multi-Format CV Upload** - PDF, DOCX, DOC, or images (OCR supported)
- 🔗 **URL Support** - Direct LinkedIn profiles, Indeed, or file URLs
- 🤖 **AI Analysis** - Powered by Groq's ultra-fast LLaMA 3.3 70B
- 💼 **Job Matching** - Real-time job search via Adzuna & JSearch APIs
- 📚 **Course Recommendations** - Personalized learning paths from top platforms
- 📊 **Market Insights** - Salary ranges, trending skills, career paths
- ⚡ **Lightning Fast** - Sub-3-second AI responses
- 🔒 **Secure** - Rate limiting, CSP headers, input validation

## 🚀 Quick Start

### Prerequisites

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-8%2B-red?logo=npm&logoColor=white)](https://www.npmjs.com/)

- Node.js 18+ and npm
- Groq API Key ([get one free](https://console.groq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/SamoTech/Wazivo.git
cd Wazivo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional - Job Search APIs
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
RAPIDAPI_KEY=your_rapidapi_key

# Optional - URL Fetching
JINA_API_KEY=your_jina_reader_key  # Higher rate limits

# Optional - Configuration
GROQ_MODEL=llama-3.3-70b-versatile  # Default model
MAX_JOBS_PER_SEARCH=10
JOB_SEARCH_TIMEOUT=5000
```

## 📁 Project Structure

```
Wazivo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts          # Main API endpoint
│   │   ├── components/               # React components
│   │   ├── config/                   # Platform configurations
│   │   ├── lib/
│   │   │   ├── services/            # Service modules
│   │   │   │   ├── cv-processing.service.ts
│   │   │   │   └── job-enrichment.service.ts
│   │   │   ├── cvParser.ts          # CV text extraction
│   │   │   ├── openaiService.ts     # AI analysis
│   │   │   ├── jobSearchService.ts  # Job search APIs
│   │   │   ├── errors.ts            # Custom error classes
│   │   │   ├── logger.ts            # Structured logging
│   │   │   └── validation.ts        # Input validation
│   │   └── types/                   # TypeScript definitions
│   └── middleware.ts                # Rate limiting & security
├── public/                          # Static assets
├── tests/                           # Test files
└── package.json
```

## 🏗️ Architecture

### Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-3.22-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3-orange?logoColor=white)](https://groq.com/)

### Request Flow

```
User Upload → Middleware (Rate Limit) → API Route → Services
                                            ↓
                                    CV Processing
                                            ↓
                                      AI Analysis
                                            ↓
                                   Job Enrichment
                                            ↓
                                    JSON Response
```

### Service Modules

- **CV Processing Service**: Handles file/URL parsing and text extraction
- **AI Analysis Service**: Groq LLM integration with Zod validation
- **Job Enrichment Service**: Multi-API job search with deduplication

## 🧪 Testing

[![Jest](https://img.shields.io/badge/Jest-29-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![Playwright](https://img.shields.io/badge/Playwright-1.41-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Testing Library](https://img.shields.io/badge/Testing%20Library-14-E33332?logo=testing-library&logoColor=white)](https://testing-library.com/)

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SamoTech/Wazivo)

1. Click the button above
2. Add environment variables
3. Deploy!

### Docker

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

```bash
docker build -t wazivo .
docker run -p 3000:3000 --env-file .env.local wazivo
```

## 📊 Performance

![Performance](https://img.shields.io/badge/Performance-⚡%20Lightning%20Fast-success)

- **AI Analysis**: < 3 seconds (Groq LLaMA 3.3)
- **CV Parsing**: < 1 second (local processing)
- **Job Search**: < 5 seconds (parallel API calls)
- **Total Time**: ~5-8 seconds end-to-end

## 🛡️ Security Features

[![Security](https://img.shields.io/badge/Security-Hardened-green?logo=security&logoColor=white)](https://github.com/SamoTech/Wazivo)

- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Content Security Policy headers
- ✅ Input validation and sanitization
- ✅ XSS protection headers
- ✅ CORS configuration
- ✅ Environment-based secrets

## 🤝 Contributing

[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/SamoTech/Wazivo/issues)

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) - Ultra-fast AI inference
- [Jina Reader](https://jina.ai/reader) - Web content extraction
- [Adzuna](https://www.adzuna.com/) - Job search API
- [JSearch (RapidAPI)](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) - Job aggregation

## 💬 Support

[![Email](https://img.shields.io/badge/Email-samo.hossam%40gmail.com-red?logo=gmail&logoColor=white)](mailto:samo.hossam@gmail.com)
[![GitHub Issues](https://img.shields.io/github/issues/SamoTech/Wazivo)](https://github.com/SamoTech/Wazivo/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/SamoTech/Wazivo)](https://github.com/SamoTech/Wazivo/discussions)

- 📧 Email: samo.hossam@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/SamoTech/Wazivo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/SamoTech/Wazivo/discussions)

---

<div align="center">

**Built with ❤️ by [SamoTech](https://github.com/SamoTech)**

[![GitHub followers](https://img.shields.io/github/followers/SamoTech?style=social)](https://github.com/SamoTech)

If you find this project helpful, please consider giving it a ⭐!

</div>
