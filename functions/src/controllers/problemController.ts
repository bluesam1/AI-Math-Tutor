/**
 * Problem Controller
 * 
 * Handles problem-related API endpoints
 */

import type { Request, Response } from 'express';
import { extractTextFromImage, validateMathContent } from '../services/visionService';
import type { ParseImageResponse, ParseImageErrorResponse } from '../types/api';

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

