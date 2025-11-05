/**
 * API Client for AI Math Tutor Backend
 * 
 * Handles all API requests to the Firebase Functions backend
 */

// Get API base URL from environment variable or use default
// In development with emulators, use localhost:5000 (Firebase Hosting emulator)
// In production, this will be the Firebase Hosting domain
const getApiBaseUrl = (): string => {
  // Prefer explicit environment variable (build-time override)
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isHostedEnvironment =
      hostname.endsWith('web.app') ||
      hostname.endsWith('firebaseapp.com') ||
      hostname.endsWith('.run.app');

    if (isHostedEnvironment) {
      // Use Hosting rewrite `/api` → Cloud Function
      return '/api';
    }
  }

  // Fallback to local emulator (default dev experience)
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  environment: string;
}

/**
 * Problem Validation API Types
 */
export type ProblemType =
  | 'arithmetic'
  | 'algebra'
  | 'geometry'
  | 'word'
  | 'multi-step';

export interface ValidateProblemRequest {
  problemText: string;
}

export interface ValidateProblemResponse {
  success: true;
  valid: true;
  problemType: ProblemType;
  cleanedProblemText?: string;
}

export interface ValidateProblemInvalidResponse {
  success: true;
  valid: false;
  error: string;
}

export interface ValidateProblemErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type ValidateProblemApiResponse =
  | ValidateProblemResponse
  | ValidateProblemInvalidResponse
  | ValidateProblemErrorResponse;

/**
 * Parse Image API Types
 */
export interface ParseImageResponse {
  success: true;
  problemText: string;
}

export interface ParseImageErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type ParseImageApiResponse =
  | ParseImageResponse
  | ParseImageErrorResponse;

/**
 * API Client class
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Error',
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      }));

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthResponse> {
    return this.get<HealthResponse>('/health');
  }

  /**
   * Validate problem endpoint
   * POST /api/problem/validate
   */
  async validateProblem(
    problemText: string
  ): Promise<ValidateProblemApiResponse> {
    return this.post<ValidateProblemApiResponse>('/problem/validate', {
      problemText,
    });
  }

  /**
   * Parse image endpoint
   * POST /api/problem/parse-image
   */
  async parseImage(file: File): Promise<ParseImageApiResponse> {
    // Validate the file before sending
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file object provided');
    }

    // Check if file has valid size
    if (file.size === 0) {
      throw new Error('File is empty. Please select a valid image file.');
    }

    // Check if file has a valid name
    if (!file.name || file.name.trim().length === 0) {
      throw new Error('File name is missing. Please select a valid image file.');
    }

    const formData = new FormData();
    // Ensure the file has a proper name for multer
    // Multer expects the field name to match what we're looking for ('image')
    // IMPORTANT: Pass the File object directly - don't convert it
    formData.append('image', file, file.name);

    // Verify the FormData was created correctly
    // Note: FormData.entries() is not available in all environments, but we can check size
    if (!formData.has('image')) {
      throw new Error('Failed to add file to FormData');
    }

    const url = `${this.baseUrl}/problem/parse-image`;
    
    // Log file details before sending (for debugging)
    console.log('[API Client] Sending file', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      formDataHasImage: formData.has('image'),
    });

    // Use fetch directly - don't set Content-Type header, let browser set it with boundary
    // This is critical for multipart/form-data to work correctly
    // The browser will automatically set Content-Type with the correct boundary
    const response = await fetch(url, {
      method: 'POST',
      // Don't set headers - browser will automatically set Content-Type with boundary for FormData
      // This ensures the multipart boundary is set correctly
      body: formData,
      // Don't set any headers manually - let the browser handle Content-Type
      // The browser will automatically add the boundary parameter
    });

    if (!response.ok) {
      let errorData: ParseImageErrorResponse;
      
      try {
        errorData = await response.json();
      } catch {
        // If response is not JSON, create error from status
        errorData = {
          success: false,
          error: 'Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR',
        };
      }

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export default ApiClient;

