# 💼 Wazivo - Get Hired, Get Wazivo

AI-powered resume analyzer that helps you land your dream job. Built with Next.js 14, TypeScript, and OpenAI GPT.

## 🎯 What is Wazivo?

**Wazivo** (وظيفو) is your intelligent career companion. Upload your CV, get AI-powered insights, discover matching jobs, identify skill gaps, and receive personalized course recommendations.

## ✨ Key Features

- 📄 **Multi-format CV parsing** - PDF, DOCX, images (with OCR)
- 🤖 **AI-powered analysis** - Deep insights using OpenAI GPT
- 💼 **Real-time job search** - Finds opportunities across 10+ platforms
- 🎯 **Skill gap identification** - Know exactly what to improve
- 📚 **Course recommendations** - Personalized learning paths
- 🌐 **Beautiful UI** - Responsive, modern design

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

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

**Required:**
- `OPENAI_API_KEY` - Get from https://platform.openai.com
- `OPENAI_MODEL` - Default: gpt-3.5-turbo

**Optional (for better job results):**
- `ADZUNA_APP_ID` & `ADZUNA_APP_KEY` - From https://developer.adzuna.com
- `RAPIDAPI_KEY` - From https://rapidapi.com

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI API
- **Parsing:** pdf-parse, mammoth, tesseract.js
- **Job Search:** Multiple APIs + web scraping
- **Icons:** Lucide React

## 🏗️ Project Structure

```
wazivo/
├── src/
│   └── app/
│       ├── api/analyze/         # API endpoint
│       ├── components/          # React components
│       ├── lib/                 # Business logic
│       ├── types/               # TypeScript types
│       └── page.tsx             # Main page
├── package.json
└── next.config.js
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

Your app will be live at: `https://wazivo.vercel.app`

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 💰 Cost Estimate

- **OpenAI API:** ~$0.002 per CV analysis
- **Job APIs:** Free tiers available
- **Hosting:** Free on Vercel/Netlify

**Monthly estimate:** $5-20 depending on usage

## 🎨 Branding

**Name:** Wazivo (وظيفو)  
**Meaning:** From "وظيفة" (Job) + modern tech ending  
**Tagline:** "Get Hired, Get Wazivo"  
**Colors:** Blue (#0066FF) + Orange (#FF6B35)  

## 📖 How It Works

1. **Upload CV** - User uploads PDF/DOCX or provides URL
2. **Parse Content** - Extract text using specialized parsers
3. **AI Analysis** - OpenAI analyzes skills, experience, gaps
4. **Job Search** - Search across multiple platforms
5. **Generate Report** - Display jobs, gaps, and courses
6. **Take Action** - Apply to jobs, enroll in courses

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 🌟 Support

If you find Wazivo helpful, please:
- ⭐ Star the repo
- 🐛 Report bugs
- 💡 Suggest features
- 📢 Share with friends

## 🔗 Links

- **GitHub:** https://github.com/SamoTech/Wazivo
- **Docs:** See INSTALLATION.md

---

**Built with ❤️ by SamoTech**

Get Hired, Get Wazivo 💼