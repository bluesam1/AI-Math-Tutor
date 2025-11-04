/**
 * API request and response types
 */

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  environment: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Parse Image API Response Types
 */

export interface ParseImageResponse {
  success: true;
  problemText: string;
}

export interface ParseImageErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}