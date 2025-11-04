/**
 * API Client for AI Math Tutor Backend
 * 
 * Handles all API requests to the Firebase Functions backend
 */

// Get API base URL from environment variable or use default
// In development with emulators, use localhost:5000 (Firebase Hosting emulator)
// In production, this will be the Firebase Hosting domain
const getApiBaseUrl = (): string => {
  // Check for Vite environment variable
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Default to Firebase Hosting emulator in development
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
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export default ApiClient;

