# 📦 Installation Guide

This guide will walk you through installing and setting up Wazivo on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** ([Download](https://git-scm.com/))
- A **Groq API key** (free at [console.groq.com](https://console.groq.com))

## Step 1: Clone the Repository

```bash
git clone https://github.com/SamoTech/Wazivo.git
cd Wazivo
```

## Step 2: Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and add your API keys:

```env
# Required
GROQ_API_KEY=gsk-your-groq-api-key-here

# Optional
GROQ_MODEL=llama-3.3-70b-versatile
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_APP_KEY=your-adzuna-api-key
RAPIDAPI_KEY=your-rapidapi-key
```

### Getting API Keys

#### Groq API Key (Required)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste into `.env`

**Free tier includes**: 14,400 requests/day

#### Adzuna API (Optional)

1. Go to [developer.adzuna.com](https://developer.adzuna.com)
2. Sign up for a developer account
3. Create an application
4. Copy your App ID and API Key

#### RapidAPI Key (Optional)

1. Go to [rapidapi.com](https://rapidapi.com)
2. Sign up and subscribe to JSearch API
3. Copy your API key from the dashboard

## Step 4: Run Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Step 5: Verify Installation

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the Wazivo homepage
3. Try uploading a sample CV to test functionality

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run end-to-end tests
```

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Groq API Errors

Verify your API key:

```bash
# Test your API key
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

## Next Steps

- Read the [Quick Start Guide](Quick-Start.md)
- Learn about [Configuration Options](Configuration.md)
- Check out the [User Guide](User-Guide.md)
- Read [Contributing Guidelines](../CONTRIBUTING.md) if you want to contribute

---

**Need help?** Open an issue on [GitHub](https://github.com/SamoTech/Wazivo/issues)
