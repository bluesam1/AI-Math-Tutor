/**
 * File utility functions for Story 1.5: Image Upload UI Component
 * Provides validation functions for file format and size
 */

/**
 * Supported image MIME types
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
] as const;

/**
 * Supported image file extensions
 */
export const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
] as const;

/**
 * Maximum file size in bytes (10MB)
 */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Maximum file size in megabytes
 */
export const MAX_FILE_SIZE_MB = 10;

/**
 * Get file extension from a file name or path
 * @param file - File object or file name string
 * @returns File extension in lowercase with leading dot (e.g., '.jpg')
 */
export const getFileExtension = (file: File | string): string => {
  const fileName = typeof file === 'string' ? file : file.name;
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return extension || '';
};

/**
 * Validate file format (MIME type and extension)
 * @param file - File object to validate
 * @returns true if file format is supported, false otherwise
 */
export const validateFileFormat = (file: File): boolean => {
  // Check MIME type
  const isValidMimeType = SUPPORTED_IMAGE_TYPES.includes(
    file.type.toLowerCase() as (typeof SUPPORTED_IMAGE_TYPES)[number]
  );

  // Check file extension as fallback
  const extension = getFileExtension(file);
  const isValidExtension = SUPPORTED_IMAGE_EXTENSIONS.includes(
    extension as (typeof SUPPORTED_IMAGE_EXTENSIONS)[number]
  );

  return isValidMimeType || isValidExtension;
};

/**
 * Validate file size
 * @param file - File object to validate
 * @param maxSizeBytes - Maximum file size in bytes (default: MAX_FILE_SIZE_BYTES)
 * @returns true if file size is within limit, false otherwise
 */
export const validateFileSize = (
  file: File,
  maxSizeBytes: number = MAX_FILE_SIZE_BYTES
): boolean => {
  return file.size <= maxSizeBytes;
};

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get human-readable list of supported formats
 * @returns String like "JPG, PNG, GIF"
 */
export const getSupportedFormatsText = (): string => {
  return 'JPG, PNG, GIF';
};
