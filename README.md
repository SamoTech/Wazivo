# Wazivo - AI-Powered Resume Analyzer

> **Get Hired, Get Wazivo** ⚡

Lightning-fast AI resume analysis powered by Groq's LLaMA 3.3 70B model. Upload your CV or LinkedIn profile and get instant career insights, skill gap analysis, personalized course recommendations, and matching job opportunities.

[![CI/CD](https://github.com/SamoTech/Wazivo/actions/workflows/ci.yml/badge.svg)](https://github.com/SamoTech/Wazivo/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

```bash
docker build -t wazivo .
docker run -p 3000:3000 --env-file .env.local wazivo
```

## 📊 Performance

- **AI Analysis**: < 3 seconds (Groq LLaMA 3.3)
- **CV Parsing**: < 1 second (local processing)
- **Job Search**: < 5 seconds (parallel API calls)
- **Total Time**: ~5-8 seconds end-to-end

## 🛡️ Security Features

- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Content Security Policy headers
- ✅ Input validation and sanitization
- ✅ XSS protection headers
- ✅ CORS configuration
- ✅ Environment-based secrets

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) - Ultra-fast AI inference
- [Jina Reader](https://jina.ai/reader) - Web content extraction
- [Adzuna](https://www.adzuna.com/) - Job search API
- [JSearch (RapidAPI)](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) - Job aggregation

## 💬 Support

- 📧 Email: samo.hossam@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/SamoTech/Wazivo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/SamoTech/Wazivo/discussions)

---

**Built with ❤️ by [SamoTech](https://github.com/SamoTech)**
