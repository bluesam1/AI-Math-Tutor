import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  KeyboardEvent,
  FormEvent,
} from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Upload, X, AlertCircle } from 'lucide-react';
import type { ProblemInputProps } from '../types/problem';
import {
  validateFileFormat,
  validateFileSize,
  getSupportedFormatsText,
  MAX_FILE_SIZE_MB,
} from '../utils/fileUtils';

const ProblemInput: React.FC<ProblemInputProps> = ({
  onSubmit,
  onImageSubmit,
  disabled = false,
  validationError = null,
  isSubmitting = false,
}) => {
  const [problemText, setProblemText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  // Validate and set file
  const validateAndSetFile = useCallback(
    (file: File): boolean => {
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

      // Auto-submit image if onImageSubmit is provided
      if (onImageSubmit) {
        onImageSubmit(file);
      }

      return true;
    },
    [onImageSubmit]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndSetFile(file);
        // Clear text input when image is selected
        setProblemText('');
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
        setProblemText('');
      }
    },
    [validateAndSetFile]
  );

  // Remove selected file
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  }, [previewUrl]);

  // Use validation error from API if provided, otherwise use local validation error
  const displayError = validationError || error;

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

    // If there's a selected file, don't submit text (file submission is handled automatically)
    if (selectedFile) {
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
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setProblemText(value);
    // Clear image when text is entered
    if (value.trim().length > 0 && selectedFile) {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
    // Clear local error when user starts typing (validation error will be cleared by parent)
    if (error && value.trim().length > 0) {
      setError(null);
    }
  };

  const isButtonDisabled =
    disabled ||
    isSubmitting ||
    (problemText.trim().length === 0 && !selectedFile);

  const isInputDisabled = disabled || isSubmitting;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header - only show when no image is selected */}
        {!selectedFile && (
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="problem-input"
              className="block text-text-primary text-lg font-medium"
            >
              Enter Math Problem
            </label>
            {/* Image upload toggle button */}
            {onImageSubmit && (
              <button
                type="button"
                onClick={() => {
                  if (!isInputDisabled && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                disabled={isInputDisabled}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-accent active:scale-[0.98] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                aria-label="Upload problem image"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Upload Image</span>
                <span className="sm:hidden">Upload</span>
              </button>
            )}
          </div>
        )}

        {/* Hidden file input */}
        {onImageSubmit && (
          <input
            ref={fileInputRef}
            id="problem-image-input"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileInputChange}
            disabled={isInputDisabled}
            className="hidden"
            aria-label="Upload problem image"
          />
        )}

        {/* Error message */}
        {displayError && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{displayError}</p>
          </div>
        )}

        {/* Image preview (if uploaded) */}
        {previewUrl && selectedFile && (
          <div className="mb-4 relative group">
            <div className="relative border-2 border-primary/20 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={previewUrl}
                alt="Problem preview"
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
              {selectedFile.name} (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}

        {/* Main input area - only show when no image is selected */}
        {!selectedFile && (
          <div
            className="space-y-3"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Text input */}
            <div className="relative">
              <textarea
                id="problem-input"
                ref={textInputRef}
                value={problemText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type or paste your math problem here..."
                disabled={isInputDisabled}
                rows={4}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-base resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all ${
                  displayError
                    ? 'border-red-400 focus:ring-red-500'
                    : isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 focus:border-primary'
                } ${
                  isInputDisabled
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-text-primary'
                }`}
                aria-label="Enter math problem"
                aria-required="true"
                aria-invalid={displayError !== null}
                aria-describedby={displayError ? 'error-message' : undefined}
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
                    <p className="text-sm font-medium text-primary">
                      Drop image here
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Helper text and action buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-text-secondary">
                Press Ctrl+Enter (or Cmd+Enter) to submit, Escape to clear
              </p>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-base transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary min-h-[44px] shadow-sm ${
                  isButtonDisabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary active:scale-[0.98]'
                }`}
                aria-label="Submit math problem"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" ariaLabel="Submitting" />
                    <span>Submitting...</span>
                  </>
                ) : disabled ? (
                  'Validating...'
                ) : (
                  <>
                    <span>Submit</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProblemInput;
