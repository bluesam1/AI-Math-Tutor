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

/**
 * Problem Type Categories
 */
export type ProblemType =
  | 'arithmetic'
  | 'algebra'
  | 'geometry'
  | 'word'
  | 'multi-step';

/**
 * Validate Problem API Request Types
 */

export interface ValidateProblemRequest {
  problemText: string;
}

/**
 * Validate Problem API Response Types
 */

export interface ValidateProblemResponse {
  success: true;
  valid: true;
  problemType: ProblemType;
  cleanedProblemText?: string;
}

export interface ValidateProblemInvalidResponse {
  success: true;
  valid: false;
  error: string;
}

export interface ValidateProblemErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type ValidateProblemApiResponse =
  | ValidateProblemResponse
  | ValidateProblemInvalidResponse
  | ValidateProblemErrorResponse;

/**
 * Chat Message API Request Types
 */

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMessageRequest {
  message: string;
  problemText: string;
  problemType: ProblemType;
  conversationHistory?: ConversationMessage[];
  sessionId?: string;
}

/**
 * Chat Message API Response Types
 */

export interface ChatMessageResponse {
  success: true;
  response: string;
  metadata: {
    type: 'question' | 'hint' | 'encouragement';
    helpLevel: 'normal' | 'escalated';
  };
  sessionId?: string;
}

export interface ChatMessageErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}
