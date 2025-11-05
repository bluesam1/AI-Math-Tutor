/**
 * File validation middleware for image uploads
 *
 * Validates file format, size, and content before processing
 */

import type { Request, Response, NextFunction } from 'express';
import type { MulterError } from 'multer';

/**
 * Allowed image MIME types
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

/**
 * Maximum file size (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Validate file format
 */
const validateFileFormat = (mimeType: string): boolean => {
  return ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase());
};

/**
 * Validate file size
 */
const validateFileSize = (size: number): boolean => {
  return size > 0 && size <= MAX_FILE_SIZE;
};

/**
 * Validate file signature (magic numbers) to ensure it's actually an image
 * This helps prevent file extension spoofing
 */
const validateFileSignature = (buffer: Buffer, mimeType: string): boolean => {
  // Check file signature based on MIME type
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    // JPEG files start with FF D8 FF
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === 'image/png') {
    // PNG files start with 89 50 4E 47
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  if (mimeType === 'image/gif') {
    // GIF files start with GIF87a or GIF89a
    const signature = buffer.toString('ascii', 0, 6);
    return signature === 'GIF87a' || signature === 'GIF89a';
  }

  // Unknown type, reject
  return false;
};

/**
 * File validation middleware
 *
 * Validates uploaded file after multer processing
 * Checks format, size, and file signature
 */
export const validateUploadedFile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if file was uploaded (multer attaches it to req.file)
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: 'No file uploaded',
      message: 'Please upload an image file',
    });
    return;
  }

  const { file } = req;

  // Validate file format
  if (!validateFileFormat(file.mimetype)) {
    res.status(400).json({
      success: false,
      error: 'Invalid file format',
      message: 'Only JPG, PNG, and GIF image files are allowed',
    });
    return;
  }

  // Validate file size
  if (!validateFileSize(file.size)) {
    res.status(400).json({
      success: false,
      error: 'File too large',
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    });
    return;
  }

  // Validate file signature (check if file is actually an image)
  if (!validateFileSignature(file.buffer, file.mimetype)) {
    res.status(400).json({
      success: false,
      error: 'Invalid file content',
      message: 'The uploaded file does not appear to be a valid image',
    });
    return;
  }

  // File is valid, proceed to next middleware
  next();
};

/**
 * Handle multer errors
 *
 * Catches multer-specific errors and returns user-friendly messages
 */
export const handleMulterError = (
  err: Error | MulterError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if ('code' in err) {
    // Multer error
    const multerError = err as MulterError;

    switch (multerError.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(400).json({
          success: false,
          error: 'File too large',
          message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
        return;

      case 'LIMIT_FILE_COUNT':
        res.status(400).json({
          success: false,
          error: 'Too many files',
          message: 'Please upload only one image file',
        });
        return;

      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).json({
          success: false,
          error: 'Unexpected file field',
          message: 'Please upload the image using the "image" field name',
        });
        return;

      case 'MISSING_FIELD_NAME':
        res.status(400).json({
          success: false,
          error: 'Missing field name',
          message: 'Please upload the image using the "image" field name',
        });
        return;

      default: {
        // Handle "Unexpected end of form" and other multer errors
        const errorMessage =
          multerError.message || 'An error occurred while uploading the file';

        // Check for common multer error messages
        if (
          errorMessage.includes('Unexpected end of form') ||
          errorMessage.includes('Unexpected')
        ) {
          res.status(400).json({
            success: false,
            error: 'File upload error',
            message:
              'The file upload was incomplete. Please try again with a smaller file or check your connection.',
            code: 'UPLOAD_INCOMPLETE',
          });
        } else {
          res.status(400).json({
            success: false,
            error: 'File upload error',
            message: errorMessage,
            code: multerError.code,
          });
        }
        return;
      }
    }
  }

  // Not a multer error, pass to next error handler
  next(err);
};
