# 🚀 Quick Start Guide

Get Wazivo running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Groq API key ([Get it free](https://console.groq.com))

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/SamoTech/Wazivo.git
cd Wazivo

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 4. Start the server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## First Analysis

### Option 1: Upload a File

1. Go to the homepage
2. Click **"Browse Files"** or drag & drop your CV
3. Supported formats: PDF, DOCX, DOC, or images
4. Wait for AI analysis (10-30 seconds)
5. View your results!

### Option 2: Use a URL

1. Click the **"URL"** tab
2. Paste a link to:
   - Your LinkedIn profile PDF
   - A direct CV link (PDF/DOCX)
   - Any web page with your resume
3. Click **"Analyze from URL"**
4. View your results!

## Understanding Your Results

Your analysis includes:

### 📊 Candidate Summary
- Professional title
- Key skills extracted from your CV
- Years of experience

### 💼 Job Opportunities (Top 10)
- Job title and company
- Location (or Remote)
- Direct apply link

### 🎯 Skill Gaps
- Missing skills for your target roles
- Priority level (High/Medium/Low)
- Category (Technical/Soft Skills)

### 📚 Course Recommendations
- Personalized learning paths
- Platform (Udemy, Coursera, edX)
- Duration and cost
- Direct course link

## Tips for Best Results

### ✅ Good CV Practices

- **Clear structure** with sections (Experience, Education, Skills)
- **Quantifiable achievements** ("Increased sales by 30%")
- **Relevant keywords** for your industry
- **Updated contact info** and professional summary

### 🚫 What to Avoid

- Overly designed CVs (stick to clean formats)
- Images with low resolution (use 300 DPI+)
- Password-protected PDFs
- Extremely long CVs (keep it 2-3 pages)

## Common Issues

### File Upload Fails

**Cause**: File too large or unsupported format

**Solution**:
- Max file size: 10 MB
- Compress large PDFs using online tools
- Convert to PDF if using an uncommon format

### "Analysis Failed" Error

**Cause**: CV couldn't be parsed or Groq API error

**Solution**:
- Try a different file format
- Ensure your CV has readable text (not just images)
- Check your Groq API key is valid

### No Job Results

**Cause**: No matching jobs found or API limits reached

**Solution**:
- Try again in a few minutes
- Add optional job search API keys (Adzuna, RapidAPI)
- Check your CV has clear job titles/skills

## Next Steps

### For Users
- Read the complete [User Guide](User-Guide.md)
- Learn about [Supported File Formats](File-Formats.md)
- Check the [FAQ](FAQ.md)

### For Developers
- Explore the [Architecture](Architecture.md)
- Set up [Development Environment](Development.md)
- Read [Contributing Guidelines](../CONTRIBUTING.md)

### Deploy Your Own
- Follow the [Deployment Guide](Deployment.md)
- Configure [Environment Variables](Configuration.md)

## Need Help?

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/SamoTech/Wazivo/issues)
- 💬 [Discussions](https://github.com/SamoTech/Wazivo/discussions)
- 📧 Contact: [@SamoTech](https://github.com/SamoTech)

---

**Ready to get hired? Upload your CV now!** 💼
