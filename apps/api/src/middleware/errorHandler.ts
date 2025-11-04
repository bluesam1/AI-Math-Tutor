import type { Request, Response, NextFunction } from 'express';
import type { ApiErrorResponse } from '../types/api';

/**
 * Error handling middleware for Express
 */
export const errorHandler = (
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error response
  const errorResponse: ApiErrorResponse = {
    error: err.name || 'Error',
    message: err.message || 'An unexpected error occurred',
    statusCode: err.statusCode || 500,
  };

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(errorResponse.statusCode).json(errorResponse);
};

