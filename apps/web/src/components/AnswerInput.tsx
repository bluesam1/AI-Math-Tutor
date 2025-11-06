import React, { useState, useRef, useCallback, useEffect } from 'react';
import CelebrationMessage from './CelebrationMessage';
import EncouragementMessage from './EncouragementMessage';
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { ProblemType } from '../types';
import { apiClient } from '../services/api';
import {
  validateFileFormat,
  validateFileSize,
  getSupportedFormatsText,
  MAX_FILE_SIZE_MB,
} from '../utils/fileUtils';

export interface AnswerInputProps {
  /**
   * Current problem text
   */
  problemText: string;

  /**
   * Current problem type
   */
  problemType: ProblemType;

  /**
   * Whether the answer input is disabled
   */
  disabled?: boolean;

  /**
   * Callback when answer is checked successfully
   */
  onAnswerChecked?: (result: {
    isCorrect: boolean;
    isPartial?: boolean;
    feedback?: string;
    studentAnswer?: string;
  }) => void;

  /**
   * Callback to add student message to chat
   */
  onAddStudentMessage?: (message: string, isAnswer?: boolean) => void;

  /**
   * Callback when typing state changes
   */
  onTypingChange?: (isTyping: boolean) => void;
}

/**
 * Answer state types
 */
type AnswerState =
  | 'empty'
  | 'typing'
  | 'checking'
  | 'correct'
  | 'incorrect'
  | 'partial'
  | 'error';

/**
 * AnswerInput Component
 *
 * Dedicated answer input field for students to submit their final answers.
 * Supports both text input and image upload for handwritten answers.
 * Provides clear visual feedback for answer validation.
 *
 * Designed for 6th grade students (ages 11-12) with age-appropriate styling.
 */
const AnswerInput: React.FC<AnswerInputProps> = ({
  problemText,
  problemType,
  disabled = false,
  onAnswerChecked,
  onAddStudentMessage,
  onTypingChange,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('empty');
  const [error, setError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const dragCounterRef = useRef(0);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset state when problem changes
  useEffect(() => {
    setAnswerText('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnswerState('empty');
    setError(null);
    setFeedbackMessage(null);
    // Notify parent that typing has stopped
    if (onTypingChange) {
      onTypingChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemText, problemType]); // Only reset when problem changes, not when callback changes

  // Track typing state and notify parent
  useEffect(() => {
    const isTyping = answerText.trim().length > 0 || selectedFile !== null;
    if (onTypingChange) {
      onTypingChange(isTyping);
    }
  }, [answerText, selectedFile, onTypingChange]);

  // Validate and set file
  const validateAndSetFile = useCallback((file: File): boolean => {
    setError(null);

    // Validate file format
    if (!validateFileFormat(file)) {
      const errorMessage = `Please select a ${getSupportedFormatsText()} image`;
      setError(errorMessage);
      return false;
    }

    // Validate file size
    if (!validateFileSize(file)) {
      const errorMessage = `This file is too large. Please select an image smaller than ${MAX_FILE_SIZE_MB}MB`;
      setError(errorMessage);
      return false;
    }

    // File is valid
    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return true;
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndSetFile(file);
        // Clear text input when image is selected
        setAnswerText('');
      }
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [validateAndSetFile]
  );

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSetFile(file);
        // Clear text input when image is selected
        setAnswerText('');
      }
    },
    [validateAndSetFile]
  );

  // Handle text input change
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setAnswerText(value);
      // Clear image when text is entered
      if (value.trim().length > 0 && selectedFile) {
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }
      // Update state
      if (value.trim().length === 0) {
        setAnswerState('empty');
      } else {
        setAnswerState('typing');
      }
      setError(null);
      // Typing state is tracked in useEffect, so we don't need to call onTypingChange here
    },
    [selectedFile, previewUrl]
  );

  // Remove selected file
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
    if (answerText.trim().length === 0) {
      setAnswerState('empty');
    }
  }, [previewUrl, answerText]);

  // Check answer
  const handleCheckAnswer = useCallback(async () => {
    // Validate input
    if (!answerText.trim() && !selectedFile) {
      setError('Please enter your answer or upload an image');
      return;
    }

    if (!problemText || !problemType) {
      setError('Please set a problem before checking your answer');
      return;
    }

    // Set checking state
    setAnswerState('checking');
    setError(null);
    setFeedbackMessage(null);

    try {
      // For now, we'll use text input only
      // TODO: Support image upload for handwritten answers (requires Vision API)
      const answerToCheck = answerText.trim();

      if (!answerToCheck) {
        setError('Please enter your answer');
        setAnswerState('typing');
        return;
      }

      // Call answer checking API FIRST - before adding to chat
      const result = await apiClient.checkAnswer(
        answerToCheck,
        problemText,
        problemType
      );

      if (result.success) {
        // Handle successful validation
        if (result.isCorrect) {
          setAnswerState('correct');
          setFeedbackMessage(result.feedback || 'That\'s correct! Great job!');
          
          // Add student's correct answer to chat with "Answered" badge
          if (onAddStudentMessage) {
            onAddStudentMessage(answerToCheck, true); // Mark as answer submission
          }
          
          // Clear answer after successful validation (after delay)
          setTimeout(() => {
            setAnswerText('');
            setAnswerState('empty');
            setFeedbackMessage(null);
          }, 3000);
        } else if (result.isPartial) {
          setAnswerState('partial');
          setFeedbackMessage(
            result.feedback || 'You\'re on the right track! Keep going!'
          );
          // For partial answers, don't add to chat - let them try again
        } else {
          setAnswerState('incorrect');
          // Show encouraging but simple feedback - the tutor will provide detailed guidance via chat
          setFeedbackMessage("Nice try! Check with the tutor for help.");
          
          // Add student's incorrect answer to chat with "Answered" badge (simple version)
          if (onAddStudentMessage) {
            onAddStudentMessage(answerToCheck, true); // Mark as answer submission
          }
          
          // Clear answer text immediately after submission so typing state is reset
          // This allows the tutor response to be generated
          setAnswerText('');
        }

        // Notify parent component (for both correct and incorrect)
        if (onAnswerChecked) {
          onAnswerChecked({
            isCorrect: result.isCorrect,
            isPartial: result.isPartial,
            feedback: result.feedback,
            studentAnswer: answerToCheck,
          });
        }
      } else {
        // Handle API error
        setAnswerState('error');
        setError(result.message || 'Failed to check answer. Please try again.');
      }
    } catch (error) {
      // Handle network or other errors
      setAnswerState('error');
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to check answer. Please check your connection and try again.'
      );
    }
  }, [
    answerText,
    selectedFile,
    problemText,
    problemType,
    onAnswerChecked,
    onAddStudentMessage,
  ]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl/Cmd + Enter to submit
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (answerState !== 'checking' && answerState !== 'correct') {
          handleCheckAnswer();
        }
      }
      // Escape to clear
      if (e.key === 'Escape') {
        setAnswerText('');
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setAnswerState('empty');
        setError(null);
        setFeedbackMessage(null);
      }
    },
    [answerState, handleCheckAnswer, previewUrl]
  );

  // Check if button should be disabled
  const isButtonDisabled =
    disabled ||
    answerState === 'checking' ||
    answerState === 'correct' ||
    (!answerText.trim() && !selectedFile);

  // Check if input should be disabled
  const isInputDisabled =
    disabled || answerState === 'checking' || answerState === 'correct';

  return (
    <div
      className="mt-6 p-5 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
      role="region"
      aria-label="Answer submission section"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary">
          Your Answer
        </h3>
        {/* Image upload toggle button */}
        {!selectedFile && (
          <button
            type="button"
            onClick={() => {
              if (!isInputDisabled && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            disabled={isInputDisabled}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 hover:text-white hover:shadow-md active:scale-[0.98] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            aria-label="Upload handwritten answer"
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Upload Image</span>
            <span className="sm:hidden">Upload</span>
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="answer-image-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileInputChange}
        disabled={isInputDisabled}
        className="hidden"
        aria-label="Upload answer image"
      />

      {/* Error message */}
      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Celebration message for correct answers */}
      {answerState === 'correct' && feedbackMessage && (
        <div className="mb-4">
          <CelebrationMessage
            message={feedbackMessage}
            onAnimationComplete={() => {
              // Celebration will auto-dismiss
            }}
          />
        </div>
      )}

      {/* Encouragement message for incorrect/partial answers */}
      {(answerState === 'incorrect' || answerState === 'partial') &&
        feedbackMessage && (
          <div className="mb-4">
            <EncouragementMessage
              type={answerState === 'partial' ? 'progress' : 'effort'}
              message={feedbackMessage}
            />
          </div>
        )}

      {/* Image preview (if uploaded) */}
      {previewUrl && selectedFile && (
        <div className="mb-4 relative group">
          <div className="relative border-2 border-primary/20 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={previewUrl}
              alt="Answer preview"
              className="max-h-64 w-full object-contain"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={isInputDisabled}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      )}

      {/* Main answer input area */}
      <div 
        className="space-y-3"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Text input */}
        {!selectedFile && (
          <div className="relative">
            <textarea
              id="answer-text-input"
              ref={textInputRef}
              value={answerText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here (e.g., 5, x = 3)"
              disabled={isInputDisabled}
              rows={4}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-base resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all ${
                error
                  ? 'border-red-400 focus:ring-red-500'
                  : isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 focus:border-primary'
              } ${
                isInputDisabled
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-text-primary'
              }`}
              aria-label="Enter your answer"
              aria-required="true"
              aria-invalid={error !== null}
              aria-describedby={error ? 'answer-error-message' : undefined}
            />
            {/* Quick action hint */}
            {!isInputDisabled && !isDragging && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-text-secondary bg-gray-100 rounded border border-gray-300">
                  <span className="text-[10px]">⌘</span>
                  <span>Enter</span>
                </kbd>
              </div>
            )}
            {/* Drag hint */}
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-xl pointer-events-none">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-primary">Drop image here</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Helper text and action buttons */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-text-secondary">
            {selectedFile 
              ? "You can add text to accompany your image"
              : "Press Ctrl+Enter (or Cmd+Enter) to check, Escape to clear"}
          </p>
          
          {/* Check Answer button */}
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={isButtonDisabled}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-base transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary min-h-[44px] shadow-sm ${
              isButtonDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-md active:scale-[0.98]'
            }`}
            aria-label="Check answer"
            aria-busy={answerState === 'checking'}
          >
            {answerState === 'checking' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Checking...</span>
              </>
            ) : answerState === 'correct' ? (
              <>
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <span>Check Answer</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerInput;

