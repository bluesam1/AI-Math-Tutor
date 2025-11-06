import React, { useState, useEffect } from 'react';
import ProblemInput from './ProblemInput';
import ProblemTypeBadge from './ProblemTypeBadge';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import MathRenderer from './MathRenderer';
import AnswerInput from './AnswerInput';
import ExampleProblems from './ExampleProblems';
import { RotateCcw } from 'lucide-react';
import type { ProblemPanelProps } from '../types';
import type { ProblemType } from '../types';

interface ExtendedProblemPanelProps extends ProblemPanelProps {
  onProblemSubmit?: (problem: string) => void;
  onImageSubmit?: (file: File) => void;
  onClearProblem?: () => void;
  validationError?: string | null;
  isValidating?: boolean;
  isSubmitting?: boolean;
  isUploading?: boolean;
  isProcessing?: boolean;
  onAnswerChecked?: (result: {
    isCorrect: boolean;
    isPartial?: boolean;
    feedback?: string;
    studentAnswer?: string;
  }) => void;
  onAddStudentMessage?: (message: string, isAnswer?: boolean) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

const ProblemPanel: React.FC<ExtendedProblemPanelProps> = ({
  problem,
  problemType,
  onProblemSubmit,
  onImageSubmit,
  onClearProblem,
  validationError,
  isValidating,
  isSubmitting = false,
  isUploading = false,
  isProcessing = false,
  onAnswerChecked,
  onAddStudentMessage,
  onTypingChange,
}) => {
  const [isInputExpanded, setIsInputExpanded] = useState(!problem);

  // Auto-collapse input when problem is loaded
  useEffect(() => {
    if (problem) {
      setIsInputExpanded(false);
    } else {
      setIsInputExpanded(true);
    }
  }, [problem]);

  const handleChangeProblem = () => {
    // Clear the problem to reset everything to empty state
    if (onClearProblem) {
      onClearProblem();
    }
    setIsInputExpanded(true);
  };

  const isLoading = isSubmitting || isUploading || isProcessing || isValidating;

  return (
    <div
      className={`flex h-full flex-col bg-gradient-to-br from-background-secondary to-gray-50 overflow-y-auto ${
        problem ? 'p-4 sm:p-6 lg:p-8' : ''
      }`}
      role="region"
      aria-label="Problem input and display"
    >
      {/* Header - only show when problem is set */}
      {problem && (
        <div className="mb-4 sm:mb-6">
          <h2 className="text-text-primary text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
            Math Problem
          </h2>
        </div>
      )}

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

          {/* Expanded State: Show Input Controls (only when problem exists and input is expanded) */}
          {problem && isInputExpanded && (
            <div
              className="mb-6 space-y-4 transition-all duration-300"
              aria-expanded={isInputExpanded}
            >
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <LoadingSpinner size="sm" ariaLabel="Processing" />
                  <p className="text-sm text-blue-800">
                    {isUploading
                      ? 'Uploading problem...'
                      : isProcessing
                        ? 'Processing problem...'
                        : isSubmitting || isValidating
                          ? 'Validating problem...'
                          : 'Processing...'}
                  </p>
                </div>
              )}

              {/* Problem Input (handles both text and image) */}
              {onProblemSubmit && (
                <ProblemInput
                  onSubmit={onProblemSubmit}
                  onImageSubmit={onImageSubmit}
                  disabled={isLoading}
                  validationError={validationError}
                  isSubmitting={isSubmitting}
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
                className="text-text-primary text-base sm:text-lg md:text-xl leading-relaxed break-words"
                role="text"
                aria-label="Math problem statement"
              >
                <MathRenderer content={problem} />
              </p>
            </div>
          </article>

          {/* Answer Input Section */}
          {problem && problemType && (
            <AnswerInput
              problemText={problem}
              problemType={problemType as ProblemType}
              disabled={isLoading}
              onAnswerChecked={onAnswerChecked}
              onAddStudentMessage={onAddStudentMessage}
              onTypingChange={onTypingChange}
            />
          )}
        </div>
      ) : (
        /* Empty State: Center content vertically and horizontally */
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="w-full max-w-2xl mx-auto px-4">
            {/* Problem Input (handles both text and image) */}
            {onProblemSubmit && (
              <>
                <ProblemInput
                  onSubmit={onProblemSubmit}
                  onImageSubmit={onImageSubmit}
                  disabled={isLoading}
                  validationError={validationError}
                  isSubmitting={isSubmitting}
                />
                {/* Example Problems - only show in empty state when not loading */}
                {!isLoading && (
                  <ExampleProblems
                    onSelectProblem={onProblemSubmit}
                    disabled={isLoading}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPanel;
