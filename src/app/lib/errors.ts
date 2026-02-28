/**
 * Custom error classes for better error handling and debugging
 */

export class CVParsingError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'CVParsingError';
  }
}

export class AIAnalysisError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AIAnalysisError';
  }
}

export class JobSearchError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'JobSearchError';
  }
}

export class ValidationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfter: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Error codes for consistent handling
export const ErrorCodes = {
  // CV Parsing
  INSUFFICIENT_TEXT: 'INSUFFICIENT_TEXT',
  UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FETCH_FAILED: 'FETCH_FAILED',
  PARSE_FAILED: 'PARSE_FAILED',
  LOGIN_REQUIRED: 'LOGIN_REQUIRED',
  
  // AI Analysis
  API_KEY_MISSING: 'API_KEY_MISSING',
  AI_REQUEST_FAILED: 'AI_REQUEST_FAILED',
  INVALID_AI_RESPONSE: 'INVALID_AI_RESPONSE',
  AI_TIMEOUT: 'AI_TIMEOUT',
  
  // Job Search
  JOB_API_FAILED: 'JOB_API_FAILED',
  NO_JOBS_FOUND: 'NO_JOBS_FOUND',
  
  // Validation
  INVALID_URL: 'INVALID_URL',
  INVALID_FILE: 'INVALID_FILE',
  MISSING_FIELD: 'MISSING_FIELD',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

/**
 * Convert error to user-friendly message
 */
export function getUserFriendlyMessage(error: Error): string {
  if (error instanceof CVParsingError) {
    switch (error.code) {
      case ErrorCodes.INSUFFICIENT_TEXT:
        return 'Not enough text could be extracted. Please ensure the file is readable.';
      case ErrorCodes.UNSUPPORTED_FILE_TYPE:
        return 'File type not supported. Please upload PDF, DOCX, DOC, or image files.';
      case ErrorCodes.FILE_TOO_LARGE:
        return 'File is too large. Maximum size is 10MB.';
      case ErrorCodes.LOGIN_REQUIRED:
        return 'This page requires login. Please download and upload the file directly.';
      default:
        return 'Failed to parse CV. Please try a different format.';
    }
  }
  
  if (error instanceof AIAnalysisError) {
    switch (error.code) {
      case ErrorCodes.API_KEY_MISSING:
        return 'Service temporarily unavailable. Please try again later.';
      case ErrorCodes.AI_TIMEOUT:
        return 'Analysis took too long. Please try again with a shorter CV.';
      default:
        return 'AI analysis failed. Please try again.';
    }
  }
  
  if (error instanceof ValidationError) {
    return error.message; // Validation messages are already user-friendly
  }
  
  if (error instanceof RateLimitError) {
    return `Too many requests. Please wait ${error.retryAfter} seconds and try again.`;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
