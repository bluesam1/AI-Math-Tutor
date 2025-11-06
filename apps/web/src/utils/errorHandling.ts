/**
 * Error Handling Utilities
 *
 * Provides utilities for handling and displaying age-appropriate error messages
 */

export type ErrorType =
  | 'api-failure'
  | 'network-error'
  | 'invalid-input'
  | 'session-expired'
  | 'rate-limit'
  | 'image-parse-failure'
  | 'unknown';

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  actionable?: string;
  retryable?: boolean;
}

/**
 * Age-appropriate error messages for 6th grade students (ages 11-12)
 */
const ERROR_MESSAGES: Record<
  ErrorType,
  { message: string; actionable: string }
> = {
  'api-failure': {
    message: 'Something went wrong. Please try again!',
    actionable: 'Try submitting your problem again.',
  },
  'network-error': {
    message:
      "Looks like you're not connected to the internet. Check your connection and try again!",
    actionable: 'Check your internet connection and try again.',
  },
  'invalid-input': {
    message: "Please check your problem and make sure it's a math problem.",
    actionable: 'Try entering a different math problem.',
  },
  'session-expired': {
    message: "Your session has expired. Let's start fresh!",
    actionable: 'Please submit a new problem to continue.',
  },
  'rate-limit': {
    message: "You're going a bit too fast! Please wait a moment and try again.",
    actionable: 'Wait a few seconds and try again.',
  },
  'image-parse-failure': {
    message:
      "We couldn't read your image. Make sure it's a clear photo of a math problem.",
    actionable: 'Try taking a clearer photo or type the problem instead.',
  },
  unknown: {
    message: "Something unexpected happened. Don't worry, just try again!",
    actionable: 'Try refreshing the page or submitting your problem again.',
  },
};

/**
 * Detects error type from error object
 */
export function detectErrorType(error: unknown): ErrorType {
  if (!error) {
    return 'unknown';
  }

  // Check for network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'network-error';
  }

  // Check for API errors (typically have status codes)
  if (typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: number }).status;
    if (status === 429) {
      return 'rate-limit';
    }
    if (status === 401 || status === 403) {
      return 'session-expired';
    }
    return 'api-failure';
  }

  // Check error message patterns
  if (typeof error === 'object' && 'message' in error) {
    const message = String(
      (error as { message?: string }).message
    ).toLowerCase();

    if (message.includes('network') || message.includes('connection')) {
      return 'network-error';
    }
    if (message.includes('session') || message.includes('expired')) {
      return 'session-expired';
    }
    if (message.includes('rate limit') || message.includes('too many')) {
      return 'rate-limit';
    }
    if (message.includes('invalid') || message.includes('validation')) {
      return 'invalid-input';
    }
    if (message.includes('image') || message.includes('parse')) {
      return 'image-parse-failure';
    }
  }

  return 'unknown';
}

/**
 * Creates error info from error object
 */
export function createErrorInfo(error: unknown): ErrorInfo {
  const type = detectErrorType(error);
  const errorData = ERROR_MESSAGES[type];

  return {
    type,
    message: errorData.message,
    actionable: errorData.actionable,
    retryable:
      type === 'network-error' ||
      type === 'api-failure' ||
      type === 'rate-limit',
  };
}

/**
 * Formats error message for display (age-appropriate)
 */
export function formatErrorMessage(error: unknown): string {
  const errorInfo = createErrorInfo(error);
  return errorInfo.message;
}

/**
 * Gets actionable guidance for error
 */
export function getActionableGuidance(error: unknown): string | undefined {
  const errorInfo = createErrorInfo(error);
  return errorInfo.actionable;
}
