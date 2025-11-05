import React, { useState, useEffect } from 'react';
import ProblemInput from './ProblemInput';
import ImageUpload from './ImageUpload';
import ProblemTypeBadge from './ProblemTypeBadge';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import { RotateCcw } from 'lucide-react';
import type { ProblemPanelProps } from '../types';

type InputMode = 'text' | 'image';

interface ExtendedProblemPanelProps extends ProblemPanelProps {
  onProblemSubmit?: (problem: string) => void;
  onImageSubmit?: (file: File) => void;
  validationError?: string | null;
  isValidating?: boolean;
  isSubmitting?: boolean;
  isUploading?: boolean;
  isProcessing?: boolean;
}

const ProblemPanel: React.FC<ExtendedProblemPanelProps> = ({
  problem,
  problemType,
  onProblemSubmit,
  onImageSubmit,
  validationError,
  isValidating,
  isSubmitting = false,
  isUploading = false,
  isProcessing = false,
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [isInputExpanded, setIsInputExpanded] = useState(!problem);

  // Auto-collapse input when problem is loaded
  useEffect(() => {
    if (problem) {
      setIsInputExpanded(false);
    }
  }, [problem]);

  const handleImageFileSelect = (file: File) => {
    // Auto-submit if onImageSubmit is available and not loading
    if (onImageSubmit && !isLoading) {
      setTimeout(() => {
        onImageSubmit(file);
      }, 100);
    }
  };

  const handleChangeProblem = () => {
    setIsInputExpanded(true);
    setInputMode('text');
  };

  const isLoading = isSubmitting || isUploading || isProcessing || isValidating;

  return (
    <div
      className="flex h-full flex-col bg-gradient-to-br from-background-secondary to-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto"
      role="region"
      aria-label="Problem input and display"
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-text-primary text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
          Math Problem
        </h2>
      </div>

      {/* Problem Input Section */}
      {(onProblemSubmit || onImageSubmit) && (
        <>
          {/* Collapsed State: Show "Change Problem" Button */}
          {problem && !isInputExpanded && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleChangeProblem}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-base transition-all bg-gray-100 text-text-secondary hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Change problem"
                aria-expanded="false"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Change Problem
              </button>
            </div>
          )}

          {/* Expanded State: Show Input Controls */}
          {(!problem || isInputExpanded) && (
            <div
              className={`mb-6 space-y-4 transition-all duration-300 ${
                isInputExpanded ? 'opacity-100 max-h-none' : 'opacity-0 max-h-0 overflow-hidden'
              }`}
              aria-expanded={isInputExpanded}
            >
              {/* Toggle Buttons */}
              <div className="flex gap-2 border-b border-border pb-4">
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('text');
                  }}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium text-base transition-all ${
                    inputMode === 'text'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-pressed={inputMode === 'text'}
                >
                  Enter Problem
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('image');
                  }}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium text-base transition-all ${
                    inputMode === 'image'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-pressed={inputMode === 'image'}
                >
                  Upload Image
                </button>
              </div>

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <LoadingSpinner size="sm" ariaLabel="Processing" />
                  <p className="text-sm text-blue-800">
                    {isUploading
                      ? 'Uploading image...'
                      : isProcessing
                      ? 'Processing image...'
                      : isSubmitting || isValidating
                      ? 'Validating problem...'
                      : 'Processing...'}
                  </p>
                </div>
              )}

              {/* Text Input Mode */}
              {inputMode === 'text' && onProblemSubmit && (
                <ProblemInput 
                  onSubmit={onProblemSubmit} 
                  disabled={isLoading}
                  validationError={validationError}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* Image Upload Mode */}
              {inputMode === 'image' && onImageSubmit && (
                <ImageUpload
                  onFileSelect={handleImageFileSelect}
                  disabled={isLoading}
                  onError={validationError ? () => {} : undefined}
                  autoSubmit={true}
                  isUploading={isUploading}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* Problem Display Section */}
      {problem ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Problem Type Badge */}
          {problemType && (
            <div className="mb-3">
              <ProblemTypeBadge problemType={problemType} />
            </div>
          )}
          
          {/* Problem Statement */}
          <article
            className="flex-1 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border-2 border-primary/20 min-h-0 overflow-y-auto focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2"
            aria-labelledby="problem-heading"
            tabIndex={0}
          >
            <h3 id="problem-heading" className="sr-only">
              Problem Statement
            </h3>
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              <p
                className="text-text-primary text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-wrap break-words"
                role="text"
                aria-label="Math problem statement"
              >
                {problem}
              </p>
            </div>
          </article>
        </div>
      ) : (
        <div
          className="flex-1 flex items-center justify-center bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-border"
          role="status"
          aria-live="polite"
        >
          <EmptyState showInput={!!onProblemSubmit} />
        </div>
      )}
    </div>
  );
};

export default ProblemPanel;
