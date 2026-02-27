# ⚙️ Configuration

Complete guide to configuring Wazivo for your environment.

## Environment Variables

### Required Variables

#### `GROQ_API_KEY`

**Description**: API key for Groq's AI inference service

**How to get**: 
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Create a new API key
4. Copy and paste into `.env`

**Format**: `gsk-xxxxxxxxxxxxxxxxxxxxx`

**Free tier**: 14,400 requests/day (more than enough for most use cases)

**Example**:
```env
GROQ_API_KEY=gsk-your-actual-key-here
```

### Optional Variables

#### `GROQ_MODEL`

**Description**: Which Groq AI model to use

**Default**: `llama-3.3-70b-versatile`

**Options**:
- `llama-3.3-70b-versatile` - Best quality, slower (recommended)
- `mixtral-8x7b-32768` - Fast with long context window
- `gemma2-9b-it` - Lightweight and fast

**Example**:
```env
GROQ_MODEL=llama-3.3-70b-versatile
```

#### `ADZUNA_APP_ID` & `ADZUNA_APP_KEY`

**Description**: Adzuna job search API credentials

**How to get**:
1. Go to [developer.adzuna.com](https://developer.adzuna.com)
2. Sign up for a developer account
3. Create a new application
4. Copy both App ID and API Key

**Why optional**: Wazivo falls back to mock job data if not configured

**Free tier**: 1,000 calls/month

**Example**:
```env
ADZUNA_APP_ID=12345678
ADZUNA_APP_KEY=abcdef1234567890abcdef1234567890
```

#### `RAPIDAPI_KEY`

**Description**: RapidAPI key for JSearch job API

**How to get**:
1. Go to [rapidapi.com](https://rapidapi.com)
2. Sign up or log in
3. Subscribe to JSearch API
4. Copy your API key from the dashboard

**Why optional**: Adds more job sources if configured

**Free tier**: 100 requests/month

**Example**:
```env
RAPIDAPI_KEY=1234567890abcdef1234567890abcdef
```

## Configuration Files

### `.env`

**Location**: Root directory (`.env`)

**Purpose**: Environment-specific configuration

**Template** (`.env.example`):
```env
# Required - Groq AI API Key
GROQ_API_KEY=gsk-your-groq-api-key-here

# Optional - AI Model Selection
GROQ_MODEL=llama-3.3-70b-versatile

# Optional - Job Search APIs
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_APP_KEY=your-adzuna-api-key
RAPIDAPI_KEY=your-rapidapi-key

# Optional - Node Environment
NODE_ENV=development
```

**Important**: Never commit `.env` to git!

### `next.config.js`

**Location**: Root directory

**Purpose**: Next.js framework configuration

**Current settings**:
```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_MODEL: process.env.GROQ_MODEL,
  },
};
```

### `tailwind.config.ts`

**Location**: Root directory

**Purpose**: Tailwind CSS styling configuration

**Customizations**:
- Custom color scheme
- Animation utilities
- Custom breakpoints

### `tsconfig.json`

**Location**: Root directory

**Purpose**: TypeScript compiler configuration

**Key settings**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Runtime Configuration

### File Upload Limits

**Location**: `src/app/lib/constants.ts`

```typescript
export const FILE_SIZE = {
  MAX_BYTES: 10 * 1024 * 1024, // 10 MB
  MAX_MB: 10,
};
```

**To change**: Edit the values in `constants.ts`

### Rate Limiting

**Location**: `src/app/lib/validation.ts`

**Defaults**:
- File uploads: 10 per minute
- URL fetches: 5 per minute

**To change**: Modify `checkRateLimit()` calls in components

### Supported File Types

**Location**: `src/app/lib/validation.ts`

```typescript
const validTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  // Plus all image/* types
];
```

## Platform-Specific Configuration

### Vercel

**Environment Variables**: Add in Vercel Dashboard → Settings → Environment Variables

**Recommended settings**:
```
NODE_ENV=production
GROQ_API_KEY=gsk-your-key
GROQ_MODEL=llama-3.3-70b-versatile
```

**Edge Runtime**: Automatically enabled for API routes

### Netlify

**Environment Variables**: Add in Netlify Dashboard → Site settings → Environment variables

**Build command**: `npm run build`

**Publish directory**: `.next`

### Railway

**Environment Variables**: Add in Railway Dashboard → Variables

**Start command**: `npm run start`

**Port**: Automatically detected

## Advanced Configuration

### Custom Groq Models

To use a different Groq model:

1. Check available models at [console.groq.com/docs/models](https://console.groq.com/docs/models)
2. Update `GROQ_MODEL` in `.env`
3. Optionally adjust token limits in `src/app/lib/openaiService.ts`

### Custom Job Sources

To add additional job search APIs:

1. Add API credentials to `.env`
2. Create a new function in `src/app/lib/jobSearchService.ts`
3. Call from `searchJobs()` function

### Custom Parsing

To support additional file formats:

1. Install parser library: `npm install <parser>`
2. Add parser function in `src/app/lib/cvParser.ts`
3. Update file type validation in `src/app/lib/validation.ts`

## Troubleshooting

### API Key Not Working

**Check**:
1. Key is correctly copied (no extra spaces)
2. Key is in `.env` file, not `.env.example`
3. Development server was restarted after adding key
4. Key has not expired or been revoked

**Test your key**:
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

### Environment Variables Not Loading

**Solution**:
1. Ensure `.env` is in root directory
2. Restart dev server: `npm run dev`
3. Check for typos in variable names
4. Verify Next.js is reading from `.env`

### Rate Limit Errors

**Solutions**:
- Wait a few minutes before retrying
- Upgrade to paid Groq tier
- Implement client-side caching
- Reduce number of requests

## Security Best Practices

### Environment Variables

✅ **Do**:
- Use `.env` for local development
- Use platform's secret management for production
- Rotate API keys regularly
- Use different keys for dev/staging/prod

❌ **Don't**:
- Commit `.env` to git
- Share API keys publicly
- Hardcode keys in source code
- Use production keys in development

### API Keys

- Store in environment variables only
- Never expose to client-side code
- Use API key restrictions when available
- Monitor usage for anomalies

---

**Need help?** Check the [FAQ](FAQ.md) or open an issue on [GitHub](https://github.com/SamoTech/Wazivo/issues)!
