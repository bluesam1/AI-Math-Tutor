import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export interface LoadingProgressProps {
  message?: string;
  progress?: number; // 0-100
  showProgress?: boolean;
  className?: string;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  message = 'Loading...',
  progress,
  showProgress = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <LoadingSpinner size="lg" />
      <div className="text-center">
        <p className="text-text-primary text-base font-medium">{message}</p>
        {showProgress && progress !== undefined && (
          <div className="mt-2 w-48">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-text-secondary text-center">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingProgress;
