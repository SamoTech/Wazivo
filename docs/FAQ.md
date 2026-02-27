# ❓ Frequently Asked Questions

Common questions about Wazivo.

## General

### What is Wazivo?

Wazivo is an AI-powered resume analyzer that helps job seekers:
- Analyze their CV with AI
- Find matching job opportunities
- Identify skill gaps
- Get personalized course recommendations

### Is Wazivo free?

Yes! Wazivo is completely free and open-source. You only need a free Groq API key to run it.

### Do I need to create an account?

No. Wazivo doesn't require any account or login. Just upload your CV and get instant analysis.

### Is my CV data stored?

No. Your CV is processed in real-time and never stored on our servers. All processing is ephemeral.

### What languages does Wazivo support?

Wazivo works with CVs in any language, but the AI analysis is performed in English. Best results are achieved with English CVs.

## Usage

### What file formats are supported?

- **PDF** (.pdf)
- **Word Documents** (.docx, .doc)
- **Images** (.jpg, .jpeg, .png, .gif, .bmp, .webp)

### What's the maximum file size?

10 MB. Most CVs are under 1 MB, so this should be plenty.

### Can I upload my LinkedIn profile?

Yes! Two ways:
1. **Export as PDF**: LinkedIn → Profile → More → Save to PDF → Upload the PDF
2. **Use URL**: Paste your LinkedIn profile URL (results may vary)

### How long does analysis take?

- **File upload**: 10-30 seconds
- **URL fetch**: 15-45 seconds

Time depends on file size and Groq API response time.

### Why did my analysis fail?

**Common reasons**:
- File is corrupt or unreadable
- Image quality too low (for OCR)
- CV is password-protected
- Groq API rate limit reached
- Network connection issue

**Solutions**:
- Try a different file format
- Use a high-quality scan for images
- Remove password protection
- Wait a minute and try again

### Can I analyze multiple CVs?

Yes! There's no limit. However, there's a rate limit of 10 uploads per minute per device to prevent abuse.

## Job Search

### How does job matching work?

Wazivo extracts your skills and job title from your CV, then searches multiple job platforms:
- Adzuna (if configured)
- JSearch (if configured)
- Mock data (fallback)

### Why aren't there any jobs in my results?

**Possible reasons**:
- Job APIs not configured (using mock data)
- No matching jobs found for your skills
- API rate limit reached

**Solutions**:
- Add Adzuna/RapidAPI keys to `.env`
- Try again later
- Broaden your skills in your CV

### Can I filter jobs by location?

Currently, Wazivo shows a mix of on-site and remote jobs based on your skills. Location filtering is a planned feature.

### Are the job links real?

Yes, if you've configured job search APIs. Otherwise, the system shows example jobs to demonstrate the feature.

## AI Analysis

### What AI model does Wazivo use?

Wazivo uses Groq's API with **LLaMA 3.3 70B** by default. You can switch to other models like Mixtral or Gemma.

### Why Groq instead of OpenAI?

- **10-100x faster** inference
- **Free tier** with 14,400 requests/day
- **Same quality** as GPT models
- **Lower latency** globally

### How accurate is the AI analysis?

The AI is very good at:
- Extracting skills and experience
- Identifying job opportunities
- Spotting skill gaps

However, it's AI-generated and should be used as guidance, not absolute truth.

### Can I customize the AI prompt?

Yes! If you're self-hosting, edit the prompt in `src/app/lib/openaiService.ts`.

## Technical

### What tech stack does Wazivo use?

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Edge Functions
- **AI**: Groq API (LLaMA 3.3 70B)
- **Parsing**: pdf-parse, mammoth, tesseract.js

### Can I self-host Wazivo?

Yes! Wazivo is open-source. See the [Installation Guide](Installation.md) and [Deployment Guide](Deployment.md).

### What are the hosting requirements?

- **Node.js** 18+
- **Memory**: 512 MB minimum
- **Storage**: ~100 MB
- **Bandwidth**: Depends on usage

Vercel, Netlify, and Railway free tiers work perfectly.

### Can I use Wazivo offline?

No. Wazivo requires internet access to:
- Call Groq API for AI analysis
- Fetch job listings
- Fetch CVs from URLs

However, file uploads work without external APIs if you configure it.

### Is Wazivo mobile-friendly?

Yes! Wazivo is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Large screens

## Development

### How do I contribute?

See our [Contributing Guidelines](../CONTRIBUTING.md)!

### How do I report a bug?

Open an issue on [GitHub](https://github.com/SamoTech/Wazivo/issues) with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node version)

### How do I request a feature?

Open an issue on [GitHub](https://github.com/SamoTech/Wazivo/issues) with:
- Clear title
- Detailed description of the feature
- Why it would be useful
- Examples (if applicable)

### Can I use Wazivo commercially?

Yes! Wazivo is licensed under MIT. You can:
- Use it commercially
- Modify it
- Distribute it
- Sell services based on it

Just keep the original MIT license notice.

## Privacy & Security

### Is my data secure?

Yes:
- ✅ CVs are never stored
- ✅ Processing is ephemeral
- ✅ No user tracking
- ✅ No cookies (except essential)
- ✅ API keys never exposed to clients

### Is Wazivo GDPR compliant?

Yes. Wazivo:
- Doesn't store personal data
- Doesn't track users
- Processes data in real-time only
- Doesn't share data with third parties (except Groq API)

### Can I see the source code?

Yes! Wazivo is fully open-source: [github.com/SamoTech/Wazivo](https://github.com/SamoTech/Wazivo)

## Pricing

### How much does Wazivo cost?

**$0/month** - Completely free!

| Service | Cost | Notes |
|---------|------|-------|
| Groq API | Free | 14,400 requests/day |
| Job APIs | Free | Free tiers available |
| Hosting | Free | Vercel/Netlify free tier |
| **Total** | **$0** | 🎉 |

### What if I exceed the free tier?

**Groq API**:
- Free tier: 14,400 requests/day
- Paid tier: $0.05-$0.10 per 1M tokens

**Job APIs**:
- Adzuna: Free tier 1,000 calls/month, then paid
- JSearch: Free tier 100 calls/month, then paid

**Hosting**:
- Vercel: Free for hobby projects, paid for commercial
- Netlify: Similar to Vercel

For typical usage, free tiers are more than enough.

## Support

### How do I get help?

1. **Check this FAQ**
2. **Read the [Documentation](README.md)**
3. **Search [existing issues](https://github.com/SamoTech/Wazivo/issues)**
4. **Ask in [Discussions](https://github.com/SamoTech/Wazivo/discussions)**
5. **Open a new issue** if nothing helps

### How do I contact the developer?

- **GitHub**: [@SamoTech](https://github.com/SamoTech)
- **Twitter**: [@OssamaHashim](https://twitter.com/OssamaHashim)
- **LinkedIn**: [Ossama Hashim](https://www.linkedin.com/in/ossamahashim/)

### Can I hire you for custom development?

Yes! Reach out via [LinkedIn](https://www.linkedin.com/in/ossamahashim/) or [GitHub](https://github.com/SamoTech).

---

**Still have questions?** Open an issue or discussion on [GitHub](https://github.com/SamoTech/Wazivo)! 💙
