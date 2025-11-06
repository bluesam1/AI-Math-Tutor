/**
 * Answer Checking Service
 *
 * Validates student answers against math problems using LLM-based validation.
 * Compares student answers with correct solutions and handles multiple answer formats.
 */

import OpenAI from 'openai';
import { env } from '../config/env';
import type { ProblemType } from './llmService';

/**
 * Answer validation result
 */
export interface AnswerValidationResult {
  /**
   * Whether the answer is correct
   */
  isCorrect: boolean;

  /**
   * Whether the answer is partially correct
   */
  isPartial?: boolean;

  /**
   * Confidence score (0.0 to 1.0)
   */
  confidence: number;

  /**
   * Feedback message (optional)
   */
  feedback?: string;

  /**
   * Reasoning for the validation result
   */
  reasoning?: string;
}

/**
 * Answer checking options
 */
export interface AnswerCheckingOptions {
  /**
   * Student's answer
   */
  studentAnswer: string;

  /**
   * Problem text
   */
  problemText: string;

  /**
   * Problem type
   */
  problemType: ProblemType;
}

/**
 * Initialize OpenAI client for answer checking
 */
const getOpenAIClient = (): OpenAI => {
  if (!env.openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: env.openaiApiKey,
  });
};

/**
 * Normalize answer format for comparison
 * Handles various formats: "5", "x = 5", "the answer is five", etc.
 */
function normalizeAnswer(answer: string): string {
  let normalized = answer.trim().toLowerCase();

  // Remove common prefixes
  normalized = normalized.replace(/^(the answer is|answer:|it's|it is)\s+/i, '');

  // Remove whitespace around equals signs
  normalized = normalized.replace(/\s*=\s*/g, '=');

  // Remove leading/trailing whitespace
  normalized = normalized.trim();

  return normalized;
}

/**
 * Validate student answer against problem using LLM
 *
 * @param options - Answer checking options
 * @returns Validation result with correctness, confidence, and feedback
 */
export const checkAnswer = async (
  options: AnswerCheckingOptions
): Promise<AnswerValidationResult> => {
  const client = getOpenAIClient();
  const startTime = Date.now();

  try {
    const { studentAnswer, problemText, problemType } = options;

    // Normalize student answer
    const normalizedAnswer = normalizeAnswer(studentAnswer);

    const validationPrompt = `You are a math tutor assistant that validates student answers to math problems.

Analyze the following student answer and determine if it is correct for the given problem.

CRITICAL RULES:
1. Be flexible with answer formats - accept numerical answers, algebraic answers, text-based answers, and expression-based answers
2. Consider equivalent forms (e.g., "5", "5.0", "five", "x = 5" for x=5 problems)
3. For algebraic problems, consider if the student's answer matches the solution (e.g., "x = 5" is correct for problems where x=5)
4. For partial answers, mark isPartial as true and provide encouraging feedback
5. Be strict but fair - if the answer is clearly wrong, mark isCorrect as false

Problem Type: ${problemType}
Problem: ${problemText}

Student Answer: "${studentAnswer}"

Return your response as JSON with this exact structure:
{
  "isCorrect": true or false,
  "isPartial": true or false (optional, only if partially correct),
  "confidence": 0.0 to 1.0 (where 1.0 is certain the answer is correct),
  "feedback": "brief, age-appropriate feedback message" (optional),
  "reasoning": "brief explanation of your decision"
}

Important:
- If the answer is correct, set isCorrect to true and confidence to 0.9-1.0
- If the answer is partially correct (e.g., correct approach but wrong final step), set isPartial to true and isCorrect to false
- If the answer is wrong, set isCorrect to false and confidence to 0.0-0.3
- Consider multiple valid answer formats (numerical, algebraic, text-based, expression-based)
- Be age-appropriate for 6th grade students (ages 11-12) in feedback messages`;

    console.log('[Answer Checking Service] Validating answer', {
      problemType,
      problemText,
      studentAnswer,
      studentAnswerLength: studentAnswer.length,
      normalizedAnswer,
      problemLength: problemText.length,
    });

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a validation assistant that validates student answers to math problems. Always return valid JSON.',
        },
        {
          role: 'user',
          content: validationPrompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.3, // Lower temperature for more consistent validation
      response_format: { type: 'json_object' },
    });

    const responseTime = Date.now() - startTime;
    console.log('[Answer Checking Service] Validation response received', {
      responseTime: `${responseTime}ms`,
      hasResponse: !!response,
      choicesCount: response.choices?.length || 0,
    });

    const responseText = response.choices[0]?.message?.content?.trim();

    console.log('[Answer Checking Service] LLM response received', {
      hasResponseText: !!responseText,
      responseTextLength: responseText?.length || 0,
      responseTextPreview: responseText?.substring(0, 200) || 'No response',
      problemText,
      studentAnswer,
    });

    if (!responseText) {
      console.error('[Answer Checking Service] No response text from LLM', {
        response: JSON.stringify(response, null, 2),
        problemText,
        studentAnswer,
      });
      // Default to incorrect when validation fails
      return {
        isCorrect: false,
        confidence: 0.5,
        reasoning: 'Validation failed - defaulting to incorrect',
      };
    }

    // Parse JSON response
    let validationResult: {
      isCorrect: boolean;
      isPartial?: boolean;
      confidence: number;
      feedback?: string;
      reasoning?: string;
    };
    try {
      console.log('[Answer Checking Service] Parsing JSON response', {
        responseText: responseText.substring(0, 500),
        problemText,
        studentAnswer,
      });
      validationResult = JSON.parse(responseText);
      console.log('[Answer Checking Service] JSON parsed successfully', {
        validationResult,
        problemText,
        studentAnswer,
      });
    } catch (parseError) {
      console.error(
        '[Answer Checking Service] Failed to parse JSON response',
        {
          parseError:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          responseText: responseText.substring(0, 500),
          problemText,
          studentAnswer,
        }
      );
      // Default to incorrect when parsing fails
      return {
        isCorrect: false,
        confidence: 0.5,
        reasoning: 'Failed to parse validation response - defaulting to incorrect',
      };
    }

    // Validate response structure
    if (typeof validationResult.isCorrect !== 'boolean') {
      console.error('[Answer Checking Service] Invalid response structure', {
        validationResult: JSON.stringify(validationResult, null, 2),
      });
      // Default to incorrect when structure is invalid
      return {
        isCorrect: false,
        confidence: 0.5,
        reasoning: 'Invalid validation response structure - defaulting to incorrect',
      };
    }

    // Ensure confidence is within valid range
    const confidence = Math.max(
      0,
      Math.min(1, validationResult.confidence || 0.5)
    );

    console.log('[Answer Checking Service] Validation complete', {
      problemText,
      studentAnswer,
      normalizedAnswer,
      isCorrect: validationResult.isCorrect,
      isPartial: validationResult.isPartial || false,
      confidence,
      hasFeedback: !!validationResult.feedback,
      feedback: validationResult.feedback,
      reasoning: validationResult.reasoning,
      fullResponse: validationResult,
    });

    return {
      isCorrect: validationResult.isCorrect,
      isPartial: validationResult.isPartial || false,
      confidence,
      feedback: validationResult.feedback,
      reasoning: validationResult.reasoning,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[Answer Checking Service] Error validating answer', {
      responseTime: `${responseTime}ms`,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      isOpenAIError: error instanceof OpenAI.APIError,
      statusCode: error instanceof OpenAI.APIError ? error.status : undefined,
    });

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      // Handle rate limit errors
      if (error.status === 429) {
        console.error('[Answer Checking Service] Rate limit error', {
          status: error.status,
          message: error.message,
        });
        // Default to incorrect when rate limited
        return {
          isCorrect: false,
          confidence: 0.5,
          reasoning: 'Rate limit exceeded - defaulting to incorrect',
        };
      }

      // Handle authentication errors
      if (error.status === 401) {
        console.error('[Answer Checking Service] Authentication error', {
          status: error.status,
          message: error.message,
        });
        // Default to incorrect when authentication fails
        return {
          isCorrect: false,
          confidence: 0.5,
          reasoning: 'Authentication failed - defaulting to incorrect',
        };
      }
    }

    // Default to incorrect when validation cannot be performed
    console.warn(
      '[Answer Checking Service] Validation failed, defaulting to incorrect',
      {
        error: error instanceof Error ? error.message : String(error),
      }
    );
    return {
      isCorrect: false,
      confidence: 0.5,
      reasoning: 'Validation failed - defaulting to incorrect for safety',
    };
  }
};

