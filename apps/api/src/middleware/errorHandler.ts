import type { Request, Response, NextFunction } from 'express';
import type { ApiErrorResponse } from '../types/api';

/**
 * Error handling middleware for Express
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
  const errorResponse: ApiErrorResponse = {
    error: err.name || 'Error',
    message: err.message || 'An unexpected error occurred',
    statusCode: hasStatusCode(err) ? err.statusCode || 500 : 500,
  };

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(errorResponse.statusCode).json(errorResponse);
};
