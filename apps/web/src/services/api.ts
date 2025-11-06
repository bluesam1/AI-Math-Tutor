/**
 * API Client for AI Math Tutor Backend
 *
 * Handles all API requests to the Firebase Functions backend
 */

// Get API base URL from environment variable or use default
// In development with emulators:
// - If running through Firebase Hosting emulator: use localhost:5000/api
// - If running frontend separately (Vite dev server): use localhost:5001/api (Functions emulator directly)
// In production, this will be the Firebase Hosting domain
const getApiBaseUrl = (): string => {
  // Prefer explicit environment variable (build-time override)
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port;
      const isHostedEnvironment =
        hostname.endsWith('web.app') ||
        hostname.endsWith('firebaseapp.com') ||
        hostname.endsWith('.run.app') ||
        hostname === 'learnmath.app' ||
        hostname.endsWith('.learnmath.app');

      if (isHostedEnvironment) {
        // Use Hosting rewrite `/api` → Cloud Function
        return '/api';
      }

    // If frontend is running on a different port (e.g., Vite dev server on 3000),
    // use the Hosting emulator on port 5000 which handles rewrites to Functions emulator
    // The Hosting emulator rewrites /api/** to the Functions emulator and handles CORS properly
    if (port && port !== '5000' && port !== '') {
      // Frontend running separately (likely Vite dev server)
      // Use Hosting emulator which handles API rewrites and CORS
      return 'http://localhost:5000/api';
    }
  }

  // Fallback to local Hosting emulator (handles rewrites)
  // If hosting emulator is not running, this will fail and user should use Functions emulator directly
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
 * Chat Message API Types
 */
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMessageRequest {
  message: string;
  problemText: string;
  problemType: ProblemType;
  conversationHistory?: ConversationMessage[];
  sessionId?: string;
}

export interface ChatMessageResponse {
  success: true;
  response: string;
  metadata: {
    type: 'question' | 'hint' | 'encouragement';
    helpLevel: 'normal' | 'escalated';
  };
  sessionId?: string;
}

export interface ChatMessageErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type ChatMessageApiResponse =
  | ChatMessageResponse
  | ChatMessageErrorResponse;

/**
 * Answer Checking API Types
 */
export interface AnswerCheckRequest {
  studentAnswer: string;
  problemText: string;
  problemType: ProblemType;
}

export interface AnswerCheckResponse {
  success: true;
  isCorrect: boolean;
  isPartial?: boolean;
  confidence: number;
  feedback?: string;
  reasoning?: string;
  shouldGenerateFollowUp?: boolean;
  answerValidationContext?: {
    result: 'correct' | 'incorrect' | 'partial';
    studentAnswer: string;
  };
}

export interface AnswerCheckErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type AnswerCheckApiResponse =
  | AnswerCheckResponse
  | AnswerCheckErrorResponse;

/**
 * Follow-Up Generation API Types
 */
export interface FollowUpRequest {
  problemText: string;
  problemType: ProblemType;
  answerValidationContext: {
    result: 'correct' | 'incorrect' | 'partial';
    studentAnswer: string;
  };
  conversationHistory?: ConversationMessage[];
}

export interface FollowUpResponse {
  success: true;
  followUpMessage: string;
}

export interface FollowUpErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type FollowUpApiResponse = FollowUpResponse | FollowUpErrorResponse;

/**
 * Step-by-Step Guidance API Types
 */
export interface StepByStepGuidanceRequest {
  problemText: string;
  problemType: ProblemType;
  conversationHistory?: ConversationMessage[];
}

export interface StepByStepGuidanceResponse {
  success: true;
  guidanceMessage: string;
}

export interface StepByStepGuidanceErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type StepByStepGuidanceApiResponse =
  | StepByStepGuidanceResponse
  | StepByStepGuidanceErrorResponse;

/**
 * Initial Greeting API Types
 */
export interface InitialGreetingRequest {
  problemText: string;
  problemType: ProblemType;
  promptType: 'initial' | 'follow-up-1' | 'follow-up-2' | 'follow-up-3';
  conversationHistory?: ConversationMessage[];
}

export interface InitialGreetingResponse {
  success: true;
  greetingMessage: string;
}

export interface InitialGreetingErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type InitialGreetingApiResponse =
  | InitialGreetingResponse
  | InitialGreetingErrorResponse;

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
      throw new Error(
        'File name is missing. Please select a valid image file.'
      );
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
        console.error('[API Client] parseImage error response:', errorData);
      } catch (parseError) {
        // If response is not JSON, create error from status
        console.error('[API Client] Failed to parse error response:', parseError);
        const responseText = await response.text().catch(() => 'Unable to read response');
        console.error('[API Client] Error response text:', responseText);
        errorData = {
          success: false,
          error: 'Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR',
        };
      }

      // Return error response instead of throwing to allow caller to handle it
      return errorData;
    }

    const result = await response.json();
    console.log('[API Client] parseImage success response:', result);
    return result;
  }

  /**
   * Send chat message endpoint
   * POST /api/chat/message
   */
  async sendChatMessage(
    message: string,
    problemText: string,
    problemType: ProblemType,
    conversationHistory?: ConversationMessage[],
    sessionId?: string
  ): Promise<ChatMessageApiResponse> {
    return this.post<ChatMessageApiResponse>('/chat/message', {
      message,
      problemText,
      problemType,
      conversationHistory,
      sessionId,
    });
  }

  /**
   * Check answer endpoint
   * POST /api/answer/check
   */
  async checkAnswer(
    studentAnswer: string,
    problemText: string,
    problemType: ProblemType
  ): Promise<AnswerCheckApiResponse> {
    console.log('[API Client] checkAnswer called', {
      studentAnswer,
      problemText,
      problemType,
      studentAnswerLength: studentAnswer.length,
      problemTextLength: problemText.length,
    });

    try {
      const result = await this.post<AnswerCheckApiResponse>('/answer/check', {
        studentAnswer,
        problemText,
        problemType,
      });

      console.log('[API Client] checkAnswer response received', {
        success: result.success,
        isCorrect: result.success ? result.isCorrect : undefined,
        isPartial: result.success ? result.isPartial : undefined,
        confidence: result.success ? result.confidence : undefined,
        feedback: result.success ? result.feedback : undefined,
        error: result.success ? undefined : result.error,
        message: result.success ? undefined : result.message,
        fullResponse: result,
      });

      return result;
    } catch (error) {
      console.error('[API Client] checkAnswer error', {
        studentAnswer,
        problemText,
        problemType,
        error: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : 'Unknown',
      });
      throw error;
    }
  }

  /**
   * Generate follow-up message endpoint
   * POST /api/chat/follow-up
   */
  async generateFollowUp(
    problemText: string,
    problemType: ProblemType,
    answerValidationContext: {
      result: 'correct' | 'incorrect' | 'partial';
      studentAnswer: string;
    },
    conversationHistory?: ConversationMessage[]
  ): Promise<FollowUpApiResponse> {
    return this.post<FollowUpApiResponse>('/chat/follow-up', {
      problemText,
      problemType,
      answerValidationContext,
      conversationHistory,
    });
  }

  /**
   * Generate step-by-step guidance endpoint
   * POST /api/chat/step-by-step-guidance
   */
  async generateStepByStepGuidance(
    problemText: string,
    problemType: ProblemType,
    conversationHistory?: ConversationMessage[]
  ): Promise<StepByStepGuidanceApiResponse> {
    return this.post<StepByStepGuidanceApiResponse>('/chat/step-by-step-guidance', {
      problemText,
      problemType,
      conversationHistory,
    });
  }

  /**
   * Generate initial greeting endpoint
   * POST /api/chat/initial-greeting
   */
  async generateInitialGreeting(
    problemText: string,
    problemType: ProblemType,
    promptType: 'initial' | 'follow-up-1' | 'follow-up-2' | 'follow-up-3',
    conversationHistory?: ConversationMessage[]
  ): Promise<InitialGreetingApiResponse> {
    return this.post<InitialGreetingApiResponse>('/chat/initial-greeting', {
      problemText,
      problemType,
      promptType,
      conversationHistory,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export default ApiClient;
