import React, { useState, useRef, useCallback, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { ImageUploadProps } from '../types/file';
import {
  validateFileFormat,
  validateFileSize,
  formatFileSize,
  getSupportedFormatsText,
  MAX_FILE_SIZE_MB,
} from '../utils/fileUtils';

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  disabled = false,
  onError,
  autoSubmit = false,
  isUploading = false,
  isProcessing = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Validate file and handle errors
  const validateAndSetFile = useCallback(
    (file: File) => {
      // Clear previous error
      setError(null);

      // Validate file format
      if (!validateFileFormat(file)) {
        const errorMessage = `Please select a ${getSupportedFormatsText()} image`;
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        return false;
      }

      // Validate file size
      if (!validateFileSize(file)) {
        const errorMessage = `This file is too large. Please select an image smaller than ${MAX_FILE_SIZE_MB}MB`;
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        return false;
      }

      // File is valid
      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Notify parent component
      // If auto-submit is enabled, parent will handle submission
      // Otherwise, parent will show submit button
      onFileSelect(file);

      return true;
    },
    [onFileSelect, onError]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndSetFile(file);
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

      if (disabled) {
        return;
      }

      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSetFile(file);
      }
    },
    [disabled, validateAndSetFile]
  );

  // Handle button click to trigger file input
  const handleButtonClick = useCallback(() => {
    if (disabled) {
      return;
    }
    fileInputRef.current?.click();
  }, [disabled]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleButtonClick();
      }
    },
    [handleButtonClick]
  );

  // Clear selected file
  const handleClear = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl]);

  // Handle image loading error
  const handleImageError = useCallback(() => {
    const errorMessage = 'Failed to load image preview';
    setError(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
  }, [onError]);

  return (
    <div className="w-full">
      {!selectedFile ? (
        // Upload Zone
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-input hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload image by clicking or dragging and dropping"
          aria-disabled={disabled}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleButtonClick();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileInputChange}
            disabled={disabled}
            className="hidden"
            aria-label="Select image file"
          />
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-text-primary text-lg font-medium mb-2">
              {autoSubmit
                ? 'Drop image here or click to upload'
                : 'Drag image here or click to select'}
            </p>
            <p className="text-text-secondary text-sm">
              {getSupportedFormatsText()} (max {MAX_FILE_SIZE_MB}MB)
            </p>
            <button
              type="button"
              onClick={handleButtonClick}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={`mt-4 px-6 py-2 rounded-lg font-medium text-base transition-all ${
                disabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              }`}
              aria-label="Select image file"
            >
              Choose File
            </button>
          </div>
        </div>
      ) : (
        // Image Preview
        <div className="space-y-4">
          <div className="relative border border-border rounded-lg p-4 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src={previewUrl || ''}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-border"
                  onError={handleImageError}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  {formatFileSize(selectedFile.size)}
                </p>
                {(isUploading || isProcessing) && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                    <LoadingSpinner size="sm" ariaLabel="Processing" />
                    <span>
                      {isUploading
                        ? 'Uploading...'
                        : isProcessing
                          ? 'Processing...'
                          : ''}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled || isUploading || isProcessing}
                className="flex-shrink-0 p-2 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove selected image"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
