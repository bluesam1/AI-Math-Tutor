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

