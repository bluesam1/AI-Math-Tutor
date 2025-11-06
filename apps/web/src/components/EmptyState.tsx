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
      <div className="mb-4 animate-fadeIn">
        <img
          src="/logo.png"
          alt="Learn Math Logo"
          className="mx-auto h-20 w-20 object-contain"
          aria-hidden="true"
        />
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
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30 shadow-card animate-scaleIn">
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
