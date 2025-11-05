/**
 * Problem Controller
 * 
 * Handles problem-related API endpoints
 */

import type { Request, Response } from 'express';
import { extractTextFromImage, validateMathContent } from '../services/visionService';
import { validateProblem } from '../services/llmService';
import type {
  ParseImageResponse,
  ParseImageErrorResponse,
  ValidateProblemApiResponse,
  ValidateProblemRequest,
} from '../types/api';

/**
 * Parse image endpoint handler
 * 
 * POST /api/problem/parse-image
 * Accepts multipart/form-data with image file
 * Returns extracted problem text
 */
export const parseImage = async (
  req: Request,
  res: Response<ParseImageResponse | ParseImageErrorResponse>
): Promise<void> => {
  try {
    // File should be validated by middleware before reaching here
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please upload an image file',
      });
      return;
    }

    const { file } = req;

    // Extract text from image using Vision API
    const extractedText = await extractTextFromImage(
      file.buffer,
      file.mimetype
    );

    // Validate that extracted text contains mathematical content
    const isValidMathContent = validateMathContent(extractedText);

    if (!isValidMathContent) {
      res.status(400).json({
        success: false,
        error: 'Invalid math content',
        message:
          'The extracted text does not appear to be a math problem. Please ensure the image contains a clear math problem.',
      });
      return;
    }

    // Return successful response with extracted text
    res.status(200).json({
      success: true,
      problemText: extractedText,
    });
  } catch (error) {
    // Handle Vision API errors
    if (error instanceof Error) {
      // Check for rate limit errors
      if (error.message.includes('Rate limit')) {
        res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: error.message,
          code: 'RATE_LIMIT',
        });
        return;
      }

      // Check for authentication errors
      if (error.message.includes('API key') || error.message.includes('Invalid')) {
        res.status(500).json({
          success: false,
          error: 'Configuration error',
          message: 'Vision API configuration error. Please contact support.',
          code: 'CONFIG_ERROR',
        });
        return;
      }

      // Other errors
      res.status(500).json({
        success: false,
        error: 'Processing error',
        message: error.message || 'Failed to process image',
        code: 'PROCESSING_ERROR',
      });
      return;
    }

    // Unknown error
    res.status(500).json({
      success: false,
      error: 'Unknown error',
      message: 'An unexpected error occurred while processing the image',
      code: 'UNKNOWN_ERROR',
    });
  }
};

/**
 * Validate problem endpoint handler
 * 
 * POST /api/problem/validate
 * Accepts JSON with problem text
 * Returns validation result with problem type if valid
 */
export const validate = async (
  req: Request<{}, ValidateProblemApiResponse, ValidateProblemRequest>,
  res: Response<ValidateProblemApiResponse>
): Promise<void> => {
  try {
    const { problemText } = req.body;

    console.log('[Problem Validation] Starting validation', {
      problemTextLength: problemText?.length || 0,
      hasProblemText: !!problemText,
    });

    // Validate request body
    if (!problemText || typeof problemText !== 'string') {
      console.warn('[Problem Validation] Invalid request body', {
        problemText: typeof problemText,
        hasProblemText: !!problemText,
      });
      res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Please provide a problem text in the request body.',
        code: 'INVALID_REQUEST',
      });
      return;
    }

    // Validate problem using LLM
    console.log('[Problem Validation] Calling LLM service', {
      problemTextPreview: problemText.substring(0, 100),
    });
    const validationResult = await validateProblem(problemText);

    // Handle validation result
    if (validationResult.valid) {
      // Problem is valid - return success with problem type
      console.log('[Problem Validation] Validation successful', {
        problemType: validationResult.problemType,
        hasCleanedText: !!validationResult.cleanedProblemText,
      });
      const response: ValidateProblemApiResponse = {
        success: true,
        valid: true,
        problemType: validationResult.problemType!,
      };

      // Include cleaned problem text if provided
      if (validationResult.cleanedProblemText) {
        response.cleanedProblemText = validationResult.cleanedProblemText;
      }

      res.status(200).json(response);
      return;
    } else {
      // Problem is invalid - return error message
      console.log('[Problem Validation] Validation failed - invalid problem', {
        error: validationResult.error,
      });
      res.status(200).json({
        success: true,
        valid: false,
        error: validationResult.error || 'This does not appear to be a valid math problem.',
      });
      return;
    }
  } catch (error) {
    // Log error details for debugging
    console.error('[Problem Validation] Error occurred', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      isOpenAIError: error instanceof Error && 'status' in error,
      statusCode: error instanceof Error && 'status' in error ? (error as { status?: number }).status : undefined,
    });

    // Handle LLM API errors
    if (error instanceof Error) {
      // Check for rate limit errors
      if (error.message.includes('Rate limit')) {
        console.error('[Problem Validation] Rate limit error');
        res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: error.message,
          code: 'RATE_LIMIT',
        });
        return;
      }

      // Check for authentication errors
      if (error.message.includes('API key') || error.message.includes('Invalid') || error.message.includes('OPENAI_API_KEY')) {
        console.error('[Problem Validation] API key configuration error', {
          errorMessage: error.message,
          hasApiKey: !!process.env.OPENAI_API_KEY,
          apiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
        });
        res.status(500).json({
          success: false,
          error: 'Configuration error',
          message: 'LLM API configuration error. Please contact support.',
          code: 'CONFIG_ERROR',
        });
        return;
      }

      // Other errors
      console.error('[Problem Validation] Validation error', {
        errorMessage: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'Validation error',
        message: error.message || 'Failed to validate problem',
        code: 'VALIDATION_ERROR',
      });
      return;
    }

    // Unknown error
    console.error('[Problem Validation] Unknown error', {
      error: String(error),
    });
    res.status(500).json({
      success: false,
      error: 'Unknown error',
      message: 'An unexpected error occurred while validating the problem',
      code: 'UNKNOWN_ERROR',
    });
  }
};

