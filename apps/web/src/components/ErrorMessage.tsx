import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import type { ErrorType } from '../utils/errorHandling';
import { createErrorInfo } from '../utils/errorHandling';

export interface ErrorMessageProps {
  /**
   * Error object or error message
   */
  error: unknown | string;

  /**
   * Whether to show dismiss button
   */
  dismissible?: boolean;

  /**
   * Callback when error is dismissed
   */
  onDismiss?: () => void;

  /**
   * Callback when retry is clicked
   */
  onRetry?: () => void;

  /**
   * CSS class name
   */
  className?: string;
}

/**
 * ErrorMessage Component
 *
 * Displays age-appropriate error messages for 6th grade students (ages 11-12)
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  dismissible = false,
  onDismiss,
  onRetry,
  className = '',
}) => {
  const errorInfo =
    typeof error === 'string'
      ? {
          type: 'unknown' as ErrorType,
          message: error,
          actionable: undefined,
          retryable: false,
        }
      : createErrorInfo(error);

  const getErrorColor = (): string => {
    switch (errorInfo.type) {
      case 'network-error':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'session-expired':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'rate-limit':
        return 'bg-blue-50 border-primary-light text-primary';
      case 'invalid-input':
        return 'bg-blue-50 border-primary-light text-primary';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  return (
    <div
      className={`rounded-lg p-4 border ${getErrorColor()} ${className}`}
      role="alert"
      aria-live="assertive"
      aria-label={`Error: ${errorInfo.message}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {errorInfo.message}
          </p>

          {errorInfo.actionable && (
            <p className="text-sm mt-2 opacity-90">{errorInfo.actionable}</p>
          )}

          {errorInfo.retryable && onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-primary"
              aria-label="Retry"
            >
              Try Again
            </button>
          )}
        </div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

