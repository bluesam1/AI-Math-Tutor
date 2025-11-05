import React from 'react';

export interface EmptyStateProps {
  showInput?: boolean;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  showInput = true,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="mb-4">
        <svg
          className="mx-auto h-16 w-16 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-text-primary text-xl font-semibold mb-2">
        Ready to learn? 📝
      </h3>
      <p className="text-text-secondary text-base mb-4 max-w-md">
        {showInput
          ? 'Get started by typing a math problem or uploading a photo of your homework.'
          : 'No problem loaded yet. Start chatting to get a problem!'}
      </p>
      {showInput && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-text-primary text-sm font-medium mb-1">
            Try an example:
          </p>
          <p className="text-text-secondary text-sm">2x + 5 = ?</p>
        </div>
      )}
    </div>
  );
};

export default EmptyState;

