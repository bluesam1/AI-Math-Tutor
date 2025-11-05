/**
 * LLM Service
 *
 * Handles integration with LLM API (OpenAI GPT-4) for problem validation, type identification,
 * and Socratic dialogue generation
 */

import OpenAI from 'openai';
import { env } from '../config/env';

/**
 * Problem type categories
 */
export type ProblemType =
  | 'arithmetic'
  | 'algebra'
  | 'geometry'
  | 'word'
  | 'multi-step';

/**
 * Validation result from LLM
 */
export interface ValidationResult {
  valid: boolean;
  problemType?: ProblemType;
  cleanedProblemText?: string;
  error?: string;
}

/**
 * Conversation message for context management
 */
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Socratic dialogue generation options
 */
export interface SocraticDialogueOptions {
  problemText: string;
  problemType: ProblemType;
  studentMessage: string;
  conversationHistory?: ConversationMessage[];
  helpLevel?: 'normal' | 'escalated';
}

/**
 * Socratic dialogue response
 */
export interface SocraticDialogueResponse {
  response: string;
  metadata: {
    type: 'question' | 'hint' | 'encouragement';
    helpLevel: 'normal' | 'escalated';
  };
}

/**
 * Initialize OpenAI client
 * API key is loaded from environment variables
 */
const getOpenAIClient = (): OpenAI => {
  if (!env.openaiApiKey) {
    console.error('[LLM Service] OPENAI_API_KEY is not set', {
      hasApiKey: !!env.openaiApiKey,
      nodeEnv: process.env.NODE_ENV,
      functionsEmulator: !!process.env.FUNCTIONS_EMULATOR,
    });
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  console.log('[LLM Service] OpenAI client initialized', {
    apiKeyLength: env.openaiApiKey.length,
    apiKeyPrefix: env.openaiApiKey.substring(0, 7) + '...',
  });
  return new OpenAI({
    apiKey: env.openaiApiKey,
  });
};

/**
 * Validate problem text and identify problem type using LLM
 *
 * @param problemText - Problem text to validate
 * @returns Validation result with problem type if valid
 */
export const validateProblem = async (
  problemText: string
): Promise<ValidationResult> => {
  const client = getOpenAIClient();

  // Check if problem text is empty or whitespace-only
  if (!problemText || problemText.trim().length === 0) {
    return {
      valid: false,
      error: 'Please enter a math problem.',
    };
  }

  const prompt = `You are a math tutor for 6th grade students (ages 11-12). Analyze the following text and determine if it is a valid math problem appropriate for 6th grade level.

If the text is a valid 6th grade math problem, identify its type from these categories:
- "arithmetic": Basic operations (addition, subtraction, multiplication, division) with whole numbers, fractions, or decimals
- "algebra": Variables, equations, expressions (introductory algebra)
- "geometry": Shapes, area, perimeter, volume (basic geometry)
- "word": Real-world math problems requiring problem-solving
- "multi-step": Problems requiring multiple steps to solve

If the text is NOT a valid math problem, return valid: false with an appropriate error message.

Return your response as JSON with this exact structure:
{
  "valid": true or false,
  "problemType": "arithmetic" | "algebra" | "geometry" | "word" | "multi-step" (only if valid is true),
  "cleanedProblemText": string (optional, only if the problem text needs cleaning/formatting),
  "error": string (only if valid is false, should be age-appropriate and friendly)
}

Problem text to analyze:
"${problemText}"

Important:
- Be strict about what constitutes a 6th grade math problem
- Reject non-math content (e.g., "What is the capital of France?")
- Reject unclear problems (e.g., "Solve this")
- Reject problems that are too advanced for 6th grade
- Provide friendly, encouraging error messages for 6th grade students
- If the problem is valid but needs minor formatting, provide cleanedProblemText`;

  try {
    console.log('[LLM Service] Calling OpenAI API', {
      model: 'gpt-4o',
      problemTextLength: problemText.length,
      promptLength: prompt.length,
    });

    const response = await client.chat.completions.create({
      model: 'gpt-4o', // Use gpt-4o which supports JSON mode (or gpt-4-turbo)
      messages: [
        {
          role: 'system',
          content:
            'You are a math tutor assistant that validates math problems and identifies their types. Always return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for more consistent validation
      response_format: { type: 'json_object' }, // Request JSON response
    });

    console.log('[LLM Service] OpenAI API response received', {
      hasResponse: !!response,
      choicesCount: response.choices?.length || 0,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    });

    const responseText = response.choices[0]?.message?.content?.trim();

    if (!responseText) {
      console.error('[LLM Service] No response text from OpenAI API', {
        response: JSON.stringify(response, null, 2),
      });
      throw new Error('No response from LLM API');
    }

    console.log('[LLM Service] Response text received', {
      responseLength: responseText.length,
      responsePreview: responseText.substring(0, 200),
    });

    // Parse JSON response
    let validationResult: ValidationResult;
    try {
      validationResult = JSON.parse(responseText);
      console.log('[LLM Service] JSON parsed successfully', {
        valid: validationResult.valid,
        problemType: validationResult.problemType,
        hasError: !!validationResult.error,
        hasCleanedText: !!validationResult.cleanedProblemText,
      });
    } catch (parseError) {
      // If JSON parsing fails, try to extract from text
      console.error('[LLM Service] Failed to parse JSON response', {
        parseError:
          parseError instanceof Error ? parseError.message : String(parseError),
        responseText: responseText.substring(0, 500),
      });
      throw new Error('Invalid response format from LLM API');
    }

    // Validate response structure
    if (typeof validationResult.valid !== 'boolean') {
      console.error('[LLM Service] Invalid response structure', {
        validationResult: JSON.stringify(validationResult, null, 2),
      });
      throw new Error('Invalid response structure from LLM API');
    }

    // If valid, ensure problemType is one of the supported types
    if (validationResult.valid && validationResult.problemType) {
      const validTypes: ProblemType[] = [
        'arithmetic',
        'algebra',
        'geometry',
        'word',
        'multi-step',
      ];
      if (!validTypes.includes(validationResult.problemType)) {
        console.warn(
          `Invalid problem type from LLM: ${validationResult.problemType}`
        );
        // Default to arithmetic if invalid type is returned
        validationResult.problemType = 'arithmetic';
      }
    }

    return validationResult;
  } catch (error) {
    // Log error details for debugging
    console.error('[LLM Service] Error occurred', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      isOpenAIError: error instanceof OpenAI.APIError,
      statusCode: error instanceof OpenAI.APIError ? error.status : undefined,
      errorCode: error instanceof OpenAI.APIError ? error.code : undefined,
      errorType: error instanceof OpenAI.APIError ? error.type : undefined,
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      // Handle rate limit errors
      if (error.status === 429) {
        console.error('[LLM Service] Rate limit error', {
          status: error.status,
          message: error.message,
        });
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }

      // Handle authentication errors
      if (error.status === 401) {
        console.error('[LLM Service] Authentication error', {
          status: error.status,
          message: error.message,
          hasApiKey: !!env.openaiApiKey,
          apiKeyLength: env.openaiApiKey?.length || 0,
        });
        throw new Error('Invalid API key. Please check your configuration.');
      }

      // Handle other API errors
      console.error('[LLM Service] OpenAI API error', {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });
      throw new Error(
        `LLM API error: ${error.message || 'Unknown error occurred'}`
      );
    }

    // Handle network errors and other errors
    if (error instanceof Error) {
      console.error('[LLM Service] General error', {
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to validate problem: ${error.message}`);
    }

    console.error('[LLM Service] Unknown error type', {
      error: String(error),
    });
    throw new Error(
      'An unexpected error occurred while validating the problem'
    );
  }
};

/**
 * Generate Socratic dialogue response using LLM
 *
 * @param options - Dialogue generation options including problem context and conversation history
 * @returns Socratic dialogue response with metadata
 */
export const generateSocraticDialogue = async (
  options: SocraticDialogueOptions
): Promise<SocraticDialogueResponse> => {
  const client = getOpenAIClient();
  const startTime = Date.now();

  try {
    // Build conversation history for context
    const conversationMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [];

    // System message with Socratic principles
    const systemMessage = `You are a patient, encouraging math tutor for 6th grade students (ages 11-12). Your role is to guide students through math problems using the Socratic method - asking guiding questions that help them discover solutions themselves.

CRITICAL RULES - NEVER VIOLATE THESE:
1. NEVER give direct answers or final solutions
2. NEVER say "the answer is X" or "the solution is Y"
3. NEVER provide numerical results (e.g., "42", "x = 5")
4. ALWAYS ask guiding questions that lead students to think
5. Use progressive disclosure - break problems into smaller steps
6. Use chain-of-thought strategies - guide students to think through each step
7. Be encouraging and positive, especially when students struggle
8. Adapt your questions to the student's understanding level

When a student is stuck (after 2+ turns without progress), provide more concrete hints while STILL asking questions - never give answers.

Problem Type: ${options.problemType}
Current Problem: ${options.problemText}`;

    conversationMessages.push({
      role: 'system',
      content: systemMessage,
    });

    // Add conversation history if available
    if (options.conversationHistory && options.conversationHistory.length > 0) {
      // Convert conversation history to OpenAI format
      for (const msg of options.conversationHistory) {
        conversationMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    // Add help level context if escalated
    if (options.helpLevel === 'escalated') {
      conversationMessages.push({
        role: 'system',
        content:
          'The student has been stuck for multiple turns. Provide more concrete hints and specific guidance, but STILL ask questions - never give direct answers. Break down the problem into smaller, more manageable steps.',
      });
    }

    // Add current student message
    conversationMessages.push({
      role: 'user',
      content: options.studentMessage,
    });

    console.log('[LLM Service] Generating Socratic dialogue', {
      model: 'gpt-4o',
      problemType: options.problemType,
      studentMessageLength: options.studentMessage.length,
      conversationHistoryLength: options.conversationHistory?.length || 0,
      helpLevel: options.helpLevel || 'normal',
    });

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: conversationMessages,
      max_tokens: 500,
      temperature: 0.7, // Slightly higher for more natural dialogue
    });

    const responseTime = Date.now() - startTime;
    console.log('[LLM Service] Socratic dialogue response received', {
      responseTime: `${responseTime}ms`,
      hasResponse: !!response,
      choicesCount: response.choices?.length || 0,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    });

    const responseText = response.choices[0]?.message?.content?.trim();

    if (!responseText) {
      console.error('[LLM Service] No response text from OpenAI API', {
        response: JSON.stringify(response, null, 2),
      });
      throw new Error('No response from LLM API');
    }

    // Determine response metadata (type and help level)
    // Simple heuristics to classify response type
    const lowerResponse = responseText.toLowerCase();
    let responseType: 'question' | 'hint' | 'encouragement' = 'question';
    if (
      lowerResponse.includes('?') ||
      lowerResponse.startsWith('what') ||
      lowerResponse.startsWith('how') ||
      lowerResponse.startsWith('why') ||
      lowerResponse.startsWith('can you') ||
      lowerResponse.startsWith('think about')
    ) {
      responseType = 'question';
    } else if (
      lowerResponse.includes('hint') ||
      lowerResponse.includes('consider') ||
      lowerResponse.includes('remember') ||
      lowerResponse.includes('try')
    ) {
      responseType = 'hint';
    } else if (
      lowerResponse.includes('great') ||
      lowerResponse.includes('good') ||
      lowerResponse.includes('excellent') ||
      lowerResponse.includes('well done') ||
      lowerResponse.includes('keep going')
    ) {
      responseType = 'encouragement';
    }

    return {
      response: responseText,
      metadata: {
        type: responseType,
        helpLevel: options.helpLevel || 'normal',
      },
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[LLM Service] Error generating Socratic dialogue', {
      responseTime: `${responseTime}ms`,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      isOpenAIError: error instanceof OpenAI.APIError,
      statusCode: error instanceof OpenAI.APIError ? error.status : undefined,
      errorCode: error instanceof OpenAI.APIError ? error.code : undefined,
      errorType: error instanceof OpenAI.APIError ? error.type : undefined,
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      // Handle rate limit errors with retry logic
      if (error.status === 429) {
        console.error('[LLM Service] Rate limit error', {
          status: error.status,
          message: error.message,
        });
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }

      // Handle authentication errors
      if (error.status === 401) {
        console.error('[LLM Service] Authentication error', {
          status: error.status,
          message: error.message,
          hasApiKey: !!env.openaiApiKey,
          apiKeyLength: env.openaiApiKey?.length || 0,
        });
        throw new Error('Invalid API key. Please check your configuration.');
      }

      // Handle other API errors
      console.error('[LLM Service] OpenAI API error', {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });
      throw new Error(
        `LLM API error: ${error.message || 'Unknown error occurred'}`
      );
    }

    // Handle network errors and other errors
    if (error instanceof Error) {
      console.error('[LLM Service] General error', {
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to generate dialogue: ${error.message}`);
    }

    console.error('[LLM Service] Unknown error type', {
      error: String(error),
    });
    throw new Error('An unexpected error occurred while generating dialogue');
  }
};
