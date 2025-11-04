/**
 * File type definitions for Story 1.5: Image Upload UI Component
 */

export interface ImageUploadProps {
  /**
   * Callback when a valid image file is selected
   * @param file - The selected file object
   */
  onFileSelect: (file: File) => void;
  
  /**
   * Whether the upload component is disabled
   */
  disabled?: boolean;
  
  /**
   * Optional callback when an error occurs
   * @param error - Error message
   */
  onError?: (error: string) => void;
}

export interface ImageUploadState {
  /**
   * Selected file object
   */
  selectedFile: File | null;
  
  /**
   * Preview URL for the selected image
   */
  previewUrl: string | null;
  
  /**
   * Whether the component is in a loading state
   */
  isLoading: boolean;
  
  /**
   * Error message if validation fails
   */
  error: string | null;
  
  /**
   * Whether a file is being dragged over the drop zone
   */
  isDragging: boolean;
}

export interface FileValidationResult {
  /**
   * Whether the file is valid
   */
  isValid: boolean;
  
  /**
   * Error message if validation fails
   */
  error: string | null;
}

