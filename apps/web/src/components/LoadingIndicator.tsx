import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export interface LoadingIndicatorProps {
  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Whether to show full-screen overlay
   */
  fullScreen?: boolean;

  /**
   * CSS class name
   */
  className?: string;

  /**
   * Size of spinner
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * LoadingIndicator Component
 *
 * Displays loading state with spinner and optional message
 * Age-appropriate for 6th grade students (ages 11-12)
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message,
  fullScreen = false,
  className = '',
  size = 'md',
}) => {
  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message || 'Loading'}
    >
      <LoadingSpinner size={size} ariaLabel={message || 'Loading'} />
      {message && (
        <p className="text-sm text-text-secondary font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingIndicator;

