# 🤖 AI Resume Analyzer

AI-powered CV analysis, job matching, and career intelligence tool built with Next.js 14, TypeScript, and OpenAI GPT.

## ✨ Features

- 📄 Multi-format CV parsing (PDF, DOCX, images with OCR)
- 🤖 AI-powered analysis with OpenAI GPT
- 💼 Real-time job search across 10+ platforms
- 🎯 Skill gap identification
- 📚 Personalized course recommendations
- 🌐 Beautiful responsive UI

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your OpenAI API key to .env
# OPENAI_API_KEY=sk-your-key-here

# Run development server
npm run dev
```

Open http://localhost:3000

## 🔑 Environment Variables

Required:
- `OPENAI_API_KEY` - Get from https://platform.openai.com
- `OPENAI_MODEL` - Default: gpt-3.5-turbo

Optional (for more job results):
- `ADZUNA_APP_ID` & `ADZUNA_APP_KEY` - From https://developer.adzuna.com
- `RAPIDAPI_KEY` - From https://rapidapi.com

## 📦 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API
- PDF/DOCX parsing
- Tesseract OCR

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```

Add environment variables in Vercel dashboard, then deploy.

## 💰 Cost

- ~$0.002 per CV analysis
- Free APIs available (Adzuna, JSearch)
- Vercel free tier included

## 📖 Documentation

- Setup: See INSTALLATION.md
- Architecture: See TECHNICAL_NOTES.md
- Deploy: See GITHUB_VERCEL_DEPLOY.md

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push and create a PR

## 📝 License

MIT License - feel free to use for personal or commercial projects

---

Built with ❤️ using Next.js, TypeScript & AI
