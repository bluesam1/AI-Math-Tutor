/**
 * Answer Validation Service
 *
 * LLM-based answer detection guardrail for validating responses.
 * Uses a secondary LLM call to analyze response context and detect implicit answers
 * that keyword-based detection might miss.
 */

import OpenAI from 'openai';
import { env } from '../config/env';

/**
 * Validation result
 */
export interface ValidationResult {
  containsAnswer: boolean;
  confidence: number;
  reasoning?: string;
}

/**
 * Initialize OpenAI client for validation
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
 * Validate if a response contains a direct answer using LLM
 *
 * @param responseText - Response text to validate
 * @param problemText - Problem text for context
 * @param problemType - Problem type for context
 * @returns Validation result with detection status and confidence
 */
export const validateResponseForAnswers = async (
  responseText: string,
  problemText: string,
  problemType: string
): Promise<ValidationResult> => {
  const client = getOpenAIClient();
  const startTime = Date.now();

  try {
    const validationPrompt = `You are a math tutor assistant that helps ensure Socratic teaching principles are maintained.

Analyze the following response from a math tutor to a student and determine if it contains a direct answer to the math problem.

CRITICAL: The response should NEVER contain:
1. Direct numerical answers (e.g., "42", "5", "x = 5")
2. Final solutions (e.g., "the answer is X", "the solution is Y")
3. Complete answers that give away the solution without requiring student thinking
4. Implicit answers that reveal the solution

Problem Type: ${problemType}
Problem: ${problemText}

Tutor Response to Analyze:
"${responseText}"

Answer the following questions:
1. Does this response contain a direct answer to the math problem? (yes/no)
2. Would this response give away the solution without requiring student thinking? (yes/no)
3. What is your confidence level? (0.0 to 1.0, where 1.0 is certain it contains an answer)

Return your response as JSON with this exact structure:
{
  "containsAnswer": true or false,
  "wouldGiveAwaySolution": true or false,
  "confidence": 0.0 to 1.0,
  "reasoning": "brief explanation of your decision"
}

Important:
- Be strict: if there's any doubt, mark containsAnswer as true
- Consider both explicit and implicit answers
- Even if phrased as a question, check if it reveals the answer
- Focus on whether the student would know the answer after reading this response`;

    console.log('[Answer Validation Service] Validating response', {
      responseLength: responseText.length,
      problemType,
      problemLength: problemText.length,
    });

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a validation assistant that ensures Socratic teaching principles are maintained. Always return valid JSON.',
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
    console.log('[Answer Validation Service] Validation response received', {
      responseTime: `${responseTime}ms`,
      hasResponse: !!response,
      choicesCount: response.choices?.length || 0,
    });

    const responseText_fromLLM = response.choices[0]?.message?.content?.trim();

    if (!responseText_fromLLM) {
      console.error('[Answer Validation Service] No response text from LLM', {
        response: JSON.stringify(response, null, 2),
      });
      // Default to blocking when validation fails
      return {
        containsAnswer: true,
        confidence: 0.5,
        reasoning: 'Validation failed - defaulting to blocking',
      };
    }

    // Parse JSON response
    let validationResult: {
      containsAnswer: boolean;
      wouldGiveAwaySolution: boolean;
      confidence: number;
      reasoning?: string;
    };
    try {
      validationResult = JSON.parse(responseText_fromLLM);
    } catch (parseError) {
      console.error(
        '[Answer Validation Service] Failed to parse JSON response',
        {
          parseError:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          responseText: responseText_fromLLM.substring(0, 500),
        }
      );
      // Default to blocking when parsing fails
      return {
        containsAnswer: true,
        confidence: 0.5,
        reasoning:
          'Failed to parse validation response - defaulting to blocking',
      };
    }

    // Validate response structure
    if (typeof validationResult.containsAnswer !== 'boolean') {
      console.error('[Answer Validation Service] Invalid response structure', {
        validationResult: JSON.stringify(validationResult, null, 2),
      });
      // Default to blocking when structure is invalid
      return {
        containsAnswer: true,
        confidence: 0.5,
        reasoning:
          'Invalid validation response structure - defaulting to blocking',
      };
    }

    // Determine final result
    const containsAnswer =
      validationResult.containsAnswer ||
      validationResult.wouldGiveAwaySolution ||
      false;
    const confidence = Math.max(
      0,
      Math.min(1, validationResult.confidence || 0.5)
    );

    console.log('[Answer Validation Service] Validation complete', {
      containsAnswer,
      confidence,
      reasoning: validationResult.reasoning,
    });

    return {
      containsAnswer,
      confidence,
      reasoning: validationResult.reasoning,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[Answer Validation Service] Error validating response', {
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
        console.error('[Answer Validation Service] Rate limit error', {
          status: error.status,
          message: error.message,
        });
        // Default to blocking when rate limited
        return {
          containsAnswer: true,
          confidence: 0.5,
          reasoning: 'Rate limit exceeded - defaulting to blocking',
        };
      }

      // Handle authentication errors
      if (error.status === 401) {
        console.error('[Answer Validation Service] Authentication error', {
          status: error.status,
          message: error.message,
        });
        // Default to blocking when authentication fails
        return {
          containsAnswer: true,
          confidence: 0.5,
          reasoning: 'Authentication failed - defaulting to blocking',
        };
      }
    }

    // Default to blocking when validation cannot be performed
    console.warn(
      '[Answer Validation Service] Validation failed, defaulting to blocking',
      {
        error: error instanceof Error ? error.message : String(error),
      }
    );
    return {
      containsAnswer: true,
      confidence: 0.5,
      reasoning: 'Validation failed - defaulting to blocking for safety',
    };
  }
};
