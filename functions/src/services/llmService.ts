/**
 * LLM Service
 * 
 * Handles integration with LLM API (OpenAI GPT-4) for problem validation and type identification
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
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
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
        parseError: parseError instanceof Error ? parseError.message : String(parseError),
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
        throw new Error(
          'Rate limit exceeded. Please try again in a moment.'
        );
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
    throw new Error('An unexpected error occurred while validating the problem');
  }
};

