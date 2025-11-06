import { Router, type Request, type Response } from 'express';
import { validate } from '../controllers/problemController';
import {
  extractTextFromImage,
  validateMathContent,
} from '../services/visionService';

const router = Router();

/**
 * Problem-related routes
 *
 * POST /api/problem/parse-image - Image parsing (Story 1.6)
 * POST /api/problem/validate - Problem validation (Story 1.7)
 */

// Note: We're using express-multipart-file-parser middleware (configured in server.ts)
// which is specifically designed for Firebase Functions v2

/**
 * POST /api/problem/parse-image
 *
 * Accepts multipart/form-data with image file
 * Field name: "image"
 *
 * Returns:
 * - Success: { success: true, problemText: string }
 * - Error: { success: false, error: string, message: string, code?: string }
 */
router.post('/parse-image', async (req: Request, res: Response) => {
  try {
    // Get uploaded files from express-multipart-file-parser
    // The type is defined in express-multipart-file-parser.d.ts
    // Type assertion needed because Express.Request.files type is ambiguous
    const files = req.files as
      | Array<{
          fieldname: string;
          originalname: string;
          mimetype: string;
          buffer: Buffer;
        }>
      | undefined;

    console.log('[Parse Image] Request received', {
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length'],
      method: req.method,
      path: req.path,
      hasFiles: !!files,
      filesLength: files?.length,
    });

    if (!files || files.length === 0) {
      console.error('[Parse Image] No file uploaded', {
        hasFiles: !!files,
        filesLength: files?.length,
      });
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please upload an image file',
      });
    }

    // Get the first uploaded file
    const file = files[0];

    console.log('[Parse Image] File received', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.buffer?.length,
    });

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type',
        message: 'Please upload an image file (PNG, JPG, etc.)',
      });
    }

    // Extract text from image using Vision API
    console.log('[Parse Image] Extracting text from image');
    const extractedText = await extractTextFromImage(
      file.buffer,
      file.mimetype
    );

    // Validate that extracted text contains mathematical content
    const isValidMathContent = validateMathContent(extractedText);

    if (!isValidMathContent) {
      return res.status(400).json({
        success: false,
        error: 'Invalid math content',
        message:
          'The extracted text does not appear to be a math problem. Please ensure the image contains a clear math problem.',
      });
    }

    // Return successful response with extracted text
    console.log('[Parse Image] Successfully extracted problem text');
    console.log('[Parse Image] *** RETURNING TO FRONTEND ***');
    console.log('[Parse Image] Extracted text:', JSON.stringify(extractedText));
    console.log('[Parse Image] Extracted text length:', extractedText.length);
    console.log('[Parse Image] First 30 chars:', extractedText.substring(0, 30));
    console.log('[Parse Image] Last 30 chars:', extractedText.substring(extractedText.length - 30));
    
    return res.status(200).json({
      success: true,
      problemText: extractedText,
    });
  } catch (error) {
    console.error('[Parse Image] Error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return res.status(500).json({
      success: false,
      error: 'File upload error',
      message:
        error instanceof Error ? error.message : 'Failed to process image',
    });
  }
});

/**
 * POST /api/problem/validate
 *
 * Accepts JSON with problem text
 * Field name: "problemText"
 *
 * Returns:
 * - Success (Valid): { success: true, valid: true, problemType: string, cleanedProblemText?: string }
 * - Success (Invalid): { success: true, valid: false, error: string }
 * - Error: { success: false, error: string, message: string, code?: string }
 */
router.post('/validate', validate);

export default router;
