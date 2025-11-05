import type { Request, Response, NextFunction } from 'express';
import type { ApiErrorResponse } from '../types/api';

/**
 * Error handling middleware for Express
 *
 * Firebase Functions automatically logs errors, but we should still log them
 * for debugging purposes in both development and production
 */
export const errorHandler = (
  err: Error | { name?: string; message?: string; statusCode?: number },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Check if error has statusCode property (custom error object)
  const hasStatusCode = (
    error: Error | { name?: string; message?: string; statusCode?: number }
  ): error is { name?: string; message?: string; statusCode?: number } => {
    return 'statusCode' in error;
  };

  // Default error response
  const statusCode = hasStatusCode(err) ? err.statusCode || 500 : 500;
  const errorResponse: ApiErrorResponse = {
    error: err.name || 'Error',
    message: err.message || 'An unexpected error occurred',
    statusCode,
  };

  // Log error (Firebase Functions will automatically capture these logs)
  // In production, these appear in Firebase Functions logs
  // In emulator, they appear in console
  console.error('API Error:', {
    error: err.name || 'Error',
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(statusCode).json(errorResponse);
};
