# Installation Guide

## Prerequisites

- Node.js 18+
- npm or Bun
- OpenAI API key

## Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your `OPENAI_API_KEY`

3. **Run development:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   http://localhost:3000

## Troubleshooting

**Build failed?**
- Check environment variables
- Verify OpenAI API key is valid

**No jobs found?**
- Add optional API keys (Adzuna, RapidAPI)
- App will use AI suggestions as fallback

See README.md for full documentation.
