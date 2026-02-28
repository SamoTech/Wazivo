/**
 * Service for processing CV input (file or URL)
 */
import { parseCV, fetchCVFromURL } from '../cvParser';
import { UPLOAD_TYPE, MIN_CV_TEXT_LENGTH } from '../constants';
import { CVParsingError, ErrorCodes } from '../errors';
import { logger } from '../logger';

export interface CVInput {
  type: string;
  file?: File;
  url?: string;
}

/**
 * Process CV from FormData and extract text
 */
export async function processCVInput(formData: FormData): Promise<string> {
  const type = formData.get('type') as string;

  logger.info('Processing CV input', { type });

  let cvText: string;

  try {
    if (type === UPLOAD_TYPE.FILE) {
      cvText = await processFileUpload(formData);
    } else if (type === UPLOAD_TYPE.URL) {
      cvText = await processURLUpload(formData);
    } else {
      throw new CVParsingError(
        ErrorCodes.INVALID_FILE,
        `Invalid upload type: ${type}`,
        { type }
      );
    }
  } catch (error) {
    if (error instanceof CVParsingError) throw error;
    
    logger.error('CV processing failed', { error, type });
    throw new CVParsingError(
      ErrorCodes.PARSE_FAILED,
      'Failed to process CV input',
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }

  // Validate minimum text length
  if (cvText.length < MIN_CV_TEXT_LENGTH) {
    throw new CVParsingError(
      ErrorCodes.INSUFFICIENT_TEXT,
      'Not enough text extracted from CV',
      { textLength: cvText.length, minRequired: MIN_CV_TEXT_LENGTH }
    );
  }

  logger.info('CV processed successfully', { textLength: cvText.length });
  return cvText;
}

/**
 * Process file upload from FormData
 */
async function processFileUpload(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new CVParsingError(ErrorCodes.INVALID_FILE, 'No file provided');
  }

  logger.debug('Processing file upload', {
    filename: file.name,
    type: file.type,
    size: file.size,
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  return await parseCV(buffer, file.type);
}

/**
 * Process URL upload from FormData
 */
async function processURLUpload(formData: FormData): Promise<string> {
  const url = formData.get('url') as string;
  
  if (!url) {
    throw new CVParsingError(ErrorCodes.INVALID_URL, 'No URL provided');
  }

  logger.debug('Processing URL upload', { url: url.substring(0, 50) });
  return await fetchCVFromURL(url);
}
