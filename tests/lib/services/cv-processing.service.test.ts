/**
 * Unit tests for CV Processing Service
 */
import { processCVInput } from '@/app/lib/services/cv-processing.service';
import { CVParsingError, ErrorCodes } from '@/app/lib/errors';
import { UPLOAD_TYPE } from '@/app/lib/constants';

// Mock dependencies
jest.mock('@/app/lib/cvParser', () => ({
  parseCV: jest.fn(),
  fetchCVFromURL: jest.fn(),
}));

import { parseCV, fetchCVFromURL } from '@/app/lib/cvParser';

const mockParseCV = parseCV as jest.MockedFunction<typeof parseCV>;
const mockFetchCVFromURL = fetchCVFromURL as jest.MockedFunction<typeof fetchCVFromURL>;

describe('CV Processing Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processCVInput - File Upload', () => {
    it('should process file upload successfully', async () => {
      const mockFile = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
      const formData = new FormData();
      formData.set('type', UPLOAD_TYPE.FILE);
      formData.set('file', mockFile);

      mockParseCV.mockResolvedValue('Extracted CV text content that is long enough');

      const result = await processCVInput(formData);

      expect(result).toBe('Extracted CV text content that is long enough');
      expect(mockParseCV).toHaveBeenCalledWith(
        expect.any(Buffer),
        'application/pdf'
      );
    });

    it('should throw error when file is missing', async () => {
      const formData = new FormData();
      formData.set('type', UPLOAD_TYPE.FILE);

      await expect(processCVInput(formData)).rejects.toThrow(CVParsingError);
    });

    it('should throw error when text is too short', async () => {
      const mockFile = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
      const formData = new FormData();
      formData.set('type', UPLOAD_TYPE.FILE);
      formData.set('file', mockFile);

      mockParseCV.mockResolvedValue('short');

      await expect(processCVInput(formData)).rejects.toThrow(CVParsingError);
    });
  });

  describe('processCVInput - URL Upload', () => {
    it('should process URL upload successfully', async () => {
      const formData = new FormData();
      formData.set('type', UPLOAD_TYPE.URL);
      formData.set('url', 'https://example.com/resume.pdf');

      mockFetchCVFromURL.mockResolvedValue('Extracted CV text from URL that is long enough');

      const result = await processCVInput(formData);

      expect(result).toBe('Extracted CV text from URL that is long enough');
      expect(mockFetchCVFromURL).toHaveBeenCalledWith('https://example.com/resume.pdf');
    });

    it('should throw error when URL is missing', async () => {
      const formData = new FormData();
      formData.set('type', UPLOAD_TYPE.URL);

      await expect(processCVInput(formData)).rejects.toThrow(CVParsingError);
    });
  });

  describe('processCVInput - Invalid Type', () => {
    it('should throw error for invalid upload type', async () => {
      const formData = new FormData();
      formData.set('type', 'INVALID_TYPE');

      await expect(processCVInput(formData)).rejects.toThrow(CVParsingError);
    });
  });
});
