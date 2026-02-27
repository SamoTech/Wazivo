# 🏗️ Architecture

Wazivo is built with modern web technologies for performance, scalability, and maintainability.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript 5.3** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first styling
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Groq API** - Lightning-fast AI inference
- **Vercel Edge Functions** - Global edge deployment

### Parsing
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX parsing
- **tesseract.js** - OCR for images

### Job Search
- **Adzuna API** - Job listings
- **JSearch API** - Additional job sources

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  FileUpload  │  │ LoadingState │  │   Results    │  │
│  │  Component   │  │  Component   │  │  Component   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js App Router                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │          API Route: /api/analyze                 │  │
│  │                                                  │  │
│  │  1. Receive file/URL                            │  │
│  │  2. Parse CV content                            │  │
│  │  3. Send to Groq AI                             │  │
│  │  4. Search for jobs                             │  │
│  │  5. Return analysis                             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   CV Parser  │  │  Groq API    │  │  Job Search APIs │
│              │  │              │  │                  │
│  - PDF Parse │  │  - LLaMA 3.3 │  │  - Adzuna       │
│  - DOCX      │  │  - Fast AI   │  │  - JSearch      │
│  - OCR       │  │  - Analysis  │  │  - Real-time    │
└──────────────┘  └──────────────┘  └──────────────────┘
```

## Data Flow

### 1. File Upload Flow

```typescript
User uploads CV
  ↓
FileUpload component validates file
  ↓
Send to /api/analyze endpoint
  ↓
cvParser extracts text
  ↓
openaiService analyzes with Groq
  ↓
jobSearchService finds jobs
  ↓
Return AnalysisReport to frontend
  ↓
Display in AnalysisResults component
```

### 2. URL Fetch Flow

```typescript
User submits URL
  ↓
Validate URL format
  ↓
Fetch content via axios
  ↓
Extract text (HTML parsing)
  ↓
[Continue same as file flow]
```

## Core Components

### Frontend Components

#### `FileUpload.tsx`
**Purpose**: Handle CV uploads and URL inputs

**Features**:
- Drag & drop file upload
- URL input with validation
- Platform detection (LinkedIn, etc.)
- Progress tracking
- Rate limiting

**Props**:
```typescript
interface FileUploadProps {
  onUpload: (data: FormData) => void;
  onProgress?: (progress: number) => void;
}
```

#### `AnalysisResults.tsx`
**Purpose**: Display AI analysis results

**Features**:
- Candidate summary with skills
- Job opportunities grid
- Skill gaps with priorities
- Course recommendations

**Props**:
```typescript
interface AnalysisResultsProps {
  report: AnalysisReport;
}
```

#### `LoadingState.tsx`
**Purpose**: Show loading animation during analysis

**Features**:
- Animated briefcase icon
- Progress messages
- Estimated time remaining

### Backend Services

#### `cvParser.ts`
**Purpose**: Extract text from various file formats

**Functions**:
```typescript
export async function parseCV(file: File): Promise<string>
export async function parsePDF(buffer: Buffer): Promise<string>
export async function parseDOCX(buffer: Buffer): Promise<string>
export async function parseImage(buffer: Buffer): Promise<string>
export async function fetchFromURL(url: string): Promise<string>
```

#### `openaiService.ts`
**Purpose**: AI-powered CV analysis using Groq

**Functions**:
```typescript
export async function analyzeCV(
  cvText: string
): Promise<AnalysisReport>
```

**Process**:
1. Send CV text to Groq API
2. Use LLaMA 3.3 70B model
3. Request structured JSON output
4. Parse and validate response
5. Return AnalysisReport

#### `jobSearchService.ts`
**Purpose**: Find matching job opportunities

**Functions**:
```typescript
export async function searchJobs(
  skills: string[],
  title: string
): Promise<JobOpportunity[]>
```

**Sources**:
- Adzuna API (if configured)
- JSearch API (if configured)
- Fallback mock data

## API Endpoints

### `POST /api/analyze`

**Purpose**: Main endpoint for CV analysis

**Request**:
```typescript
// FormData with either:
{
  type: 'file',
  file: File
}
// or
{
  type: 'url',
  url: string
}
```

**Response**:
```typescript
interface AnalysisReport {
  candidateSummary: {
    title: string;
    keySkills: string[];
    yearsOfExperience: number;
  };
  jobOpportunities: JobOpportunity[];
  weaknessesAndGaps: SkillGap[];
  recommendedCourses: Course[];
}
```

**Error Handling**:
```typescript
{
  error: string;
  details?: string;
}
```

## Type Definitions

See [`src/app/types/index.ts`](../src/app/types/index.ts) for complete type definitions:

```typescript
export interface AnalysisReport {
  candidateSummary: CandidateSummary;
  jobOpportunities: JobOpportunity[];
  weaknessesAndGaps: SkillGap[];
  recommendedCourses: Course[];
}

export interface JobOpportunity {
  title: string;
  company: string;
  location: string;
  applyLink: string;
}

export interface SkillGap {
  category: string;
  gap: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Course {
  title: string;
  platform: string;
  duration: string;
  cost: string;
  addressesGap: string;
  link: string;
}
```

## Performance Optimizations

### Frontend
- **React Server Components** for faster initial load
- **Code splitting** via Next.js dynamic imports
- **Image optimization** with next/image
- **Tailwind CSS purging** for minimal CSS bundle

### Backend
- **Edge runtime** for global low latency
- **Streaming responses** for large AI outputs
- **Caching** for repeated job searches
- **Rate limiting** to prevent abuse

### AI Inference
- **Groq** provides 10-100x faster inference than OpenAI
- **Token optimization** in prompts
- **Structured output** for reliable parsing

## Security

### Input Validation
- File size limits (10 MB)
- File type whitelist
- URL validation
- Rate limiting per client

### API Security
- API keys in environment variables
- No API keys exposed to client
- CORS configuration
- Error message sanitization

### Data Privacy
- No CV storage on servers
- Ephemeral processing only
- No user tracking
- GDPR compliant

## Scalability

### Current Architecture
- **Serverless**: Auto-scales with traffic
- **Edge deployment**: Global distribution
- **Stateless**: No database required

### Future Enhancements
- Redis caching for job results
- Database for user accounts (optional)
- Background job processing
- Webhook notifications

## Testing Strategy

### Unit Tests
- Validation functions
- Utility functions
- Type safety

### Integration Tests
- API endpoints
- CV parsing
- AI service integration

### E2E Tests
- Full user flow
- File upload
- Result display

## Deployment

See [Deployment Guide](Deployment.md) for production deployment instructions.

---

**Questions?** Open an issue or discussion on [GitHub](https://github.com/SamoTech/Wazivo)!
