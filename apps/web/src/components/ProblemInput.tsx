import React, { useState, KeyboardEvent, FormEvent } from 'react';
import type { ProblemInputProps } from '../types/problem';

const ProblemInput: React.FC<ProblemInputProps> = ({ onSubmit, disabled = false }) => {
  const [problemText, setProblemText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateInput = (text: string): boolean => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      setError('Please enter a math problem before submitting');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (disabled) {
      return;
    }

    if (validateInput(problemText)) {
      onSubmit(problemText.trim());
      setProblemText('');
      setError(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Enter key submission (Ctrl/Cmd + Enter)
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
    // Handle Escape key to clear input
    if (e.key === 'Escape') {
      setProblemText('');
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setProblemText(value);
    // Clear error when user starts typing
    if (error && value.trim().length > 0) {
      setError(null);
    }
  };

  const isButtonDisabled = disabled || problemText.trim().length === 0;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="problem-input"
            className="block text-text-primary text-lg font-medium mb-2"
          >
            Enter Math Problem
          </label>
          <textarea
            id="problem-input"
            value={problemText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste your math problem here..."
            disabled={disabled}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg text-base resize-y focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-input focus:border-primary'
            } ${
              disabled
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-white text-text-primary'
            }`}
            aria-label="Enter math problem"
            aria-required="true"
            aria-invalid={error !== null}
            aria-describedby={error ? 'error-message' : undefined}
          />
          {error && (
            <div
              id="error-message"
              role="alert"
              aria-live="polite"
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </div>
          )}
          <p className="mt-1 text-xs text-text-secondary">
            Press Ctrl+Enter (or Cmd+Enter on Mac) to submit, or Escape to clear
          </p>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`px-6 py-3 rounded-lg font-medium text-base transition-all ${
              isButtonDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            }`}
            aria-label="Submit math problem"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProblemInput;

