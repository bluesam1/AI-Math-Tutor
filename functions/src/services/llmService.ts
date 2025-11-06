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
  systemOverride?: string; // Optional system message override
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

  const prompt = `You are a math tutor assistant. Your job is to validate math problems and classify them by type.

VALIDATION RULES:
- If the text contains ANY mathematical equation, expression, or calculation, it is VALID.
- If the text contains variables (like x, y, z), it is ALWAYS valid and should be classified as "algebra".
- Equations with fractions are VALID algebra problems.
- LaTeX formatted equations (like \\( \\frac{3(x-4)}{4} = \\frac{5(2x-3)}{3} \\)) are VALID math problems.
- Only reject if the text is completely non-mathematical (e.g., "What is the capital of France?").

PROBLEM TYPES:
- "arithmetic": Basic operations (addition, subtraction, multiplication, division) with whole numbers, fractions, or decimals
- "algebra": ANY problem with variables, equations, or expressions. Examples include:
  * "x + 5 = 10"
  * "3(x-4)/4 = 5(2x-3)/3"
  * "\\( \\frac{3(x-4)}{4} = \\frac{5(2x-3)}{3} \\)"
  * "2x + 3 = 7"
  * Any equation solving for a variable
- "geometry": Shapes, area, perimeter, volume
- "word": Real-world math problems requiring problem-solving
- "multi-step": Problems requiring multiple steps to solve

EXAMPLES OF VALID PROBLEMS:
- "x + 5 = 10" → valid: true, problemType: "algebra"
- "3(x-4)/4 = 5(2x-3)/3" → valid: true, problemType: "algebra"
- "\\( \\frac{3(x-4)}{4} = \\frac{5(2x-3)}{3} \\)" → valid: true, problemType: "algebra"
- "2 + 2 = ?" → valid: true, problemType: "arithmetic"
- "What is the capital of France?" → valid: false, error: "This is not a math problem"

Return your response as JSON with this exact structure:
{
  "valid": true or false,
  "problemType": "arithmetic" | "algebra" | "geometry" | "word" | "multi-step" (only if valid is true),
  "cleanedProblemText": string (optional, only if the problem text needs cleaning/formatting - DO NOT include any delimiters like \\(, \\), \\[, \\], $, or $$),
  "error": string (only if valid is false, should be age-appropriate and friendly)
}

Problem text to analyze:
"${problemText}"

CRITICAL: 
- If you see variables (x, y, z, etc.) or an equation with an equals sign, it MUST be accepted as "algebra".
- Do NOT reject based on complexity, grade level, or whether it has fractions.
- Equations with fractions are VALID algebra problems.
- LaTeX format is still a valid math problem format.`;

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
            'You are a math tutor assistant that validates math problems and identifies their types. You MUST accept any valid math problem regardless of complexity, grade level, or whether it has fractions. Any equation with variables is a valid algebra problem. Always return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.2, // Lower temperature for more consistent validation
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

    // Clean up any delimiters from the cleanedProblemText if present
    if (validationResult.cleanedProblemText) {
      const originalText = validationResult.cleanedProblemText;
      console.log('[LLM Service] *** CLEANUP STARTING ***');
      console.log(
        '[LLM Service] Original cleanedProblemText:',
        JSON.stringify(originalText)
      );
      console.log('[LLM Service] Length:', originalText.length);
      console.log(
        '[LLM Service] First 20 chars:',
        originalText.substring(0, 20)
      );
      console.log(
        '[LLM Service] Last 20 chars:',
        originalText.substring(originalText.length - 20)
      );

      let cleaned = originalText;

      // Remove all types of math delimiters step by step with logging
      console.log(
        '[LLM Service] Step 1 - Before cleanup:',
        JSON.stringify(cleaned)
      );

      cleaned = cleaned.replace(/\\\[/g, '');
      console.log(
        '[LLM Service] Step 2 - After removing \\[:',
        JSON.stringify(cleaned)
      );

      cleaned = cleaned.replace(/\\\]/g, '');
      console.log(
        '[LLM Service] Step 3 - After removing \\]:',
        JSON.stringify(cleaned)
      );

      cleaned = cleaned.replace(/\\\(/g, '');
      console.log(
        '[LLM Service] Step 4 - After removing \\(:',
        JSON.stringify(cleaned)
      );

      cleaned = cleaned.replace(/\\\)/g, '');
      console.log(
        '[LLM Service] Step 5 - After removing \\):',
        JSON.stringify(cleaned)
      );

      cleaned = cleaned.replace(/\$\$/g, '');
      console.log(
        '[LLM Service] Step 6 - After removing $$:',
        JSON.stringify(cleaned)
      );

      cleaned = cleaned.replace(/\$/g, '');
      console.log(
        '[LLM Service] Step 7 - After removing $:',
        JSON.stringify(cleaned)
      );

      cleaned = cleaned.trim();
      console.log(
        '[LLM Service] Step 8 - After trim:',
        JSON.stringify(cleaned)
      );

      // Return cleaned text without wrapping in delimiters
      // The frontend will handle math rendering if needed
      validationResult.cleanedProblemText = cleaned;

      console.log('[LLM Service] *** CLEANUP COMPLETE ***');
      console.log(
        '[LLM Service] Final cleanedProblemText:',
        JSON.stringify(validationResult.cleanedProblemText)
      );
    } else {
      console.log('[LLM Service] No cleanedProblemText to clean');
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
    // Use override if provided, otherwise use default
    const systemMessage =
      options.systemOverride ||
      `You are a patient, encouraging math tutor for 6th grade students (ages 11-12). Your role is to guide students through math problems using the Socratic method - asking guiding questions that help them discover solutions themselves.

CRITICAL RULES - NEVER VIOLATE THESE:
1. NEVER give direct answers or final solutions
2. NEVER say "the answer is X" or "the solution is Y"
3. NEVER provide numerical results (e.g., "42", "x = 5")
4. ALWAYS ask guiding questions that lead students to think
5. Use progressive disclosure - break problems into smaller steps
6. Use chain-of-thought strategies - guide students to think through each step
7. Be encouraging and positive, especially when students struggle
8. Adapt your questions to the student's understanding level
9. When referencing mathematical expressions, use KaTeX format: wrap inline math with single dollar signs $...$ and block math with double dollar signs $$...$$. DO NOT use LaTeX delimiters \\(...\\) or \\[...\\].

When a student is stuck (after 2+ turns without progress), provide more concrete hints while STILL asking questions - never give answers.

CRITICAL: When referencing the problem text in your responses, PRESERVE ALL SPACES exactly as shown. Do not remove spaces between words or numbers. For example, if the problem says "Tom has $50. He spends $18.75", keep it exactly as "Tom has $50. He spends $18.75" with all spaces intact.

IMPORTANT: Do NOT wrap simple numbers (like 1, 2, 5, 10) in dollar signs ($1$, $2$, etc.) unless they are part of a mathematical expression. Simple numbers should be written as plain text: "1", "2", "5", not "$1$", "$2$", "$5$". Only use dollar signs for actual mathematical expressions like "$x + 5$" or "$\\frac{1}{2}$".

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

    let responseText = response.choices[0]?.message?.content?.trim();

    if (!responseText) {
      console.error('[LLM Service] No response text from OpenAI API', {
        response: JSON.stringify(response, null, 2),
      });
      throw new Error('No response from LLM API');
    }

    // Normalize math delimiters to KaTeX format
    // Convert LaTeX \(...\) to $...$ and \[...\] to $$...$$
    console.log('[LLM Service] *** NORMALIZING MATH DELIMITERS ***');
    console.log(
      '[LLM Service] Original response text:',
      JSON.stringify(responseText)
    );
    console.log('[LLM Service] Original length:', responseText.length);
    console.log(
      '[LLM Service] First 150 chars:',
      responseText.substring(0, 150)
    );
    console.log('[LLM Service] Contains \\(:', responseText.includes('\\('));
    console.log('[LLM Service] Contains \\):', responseText.includes('\\)'));
    console.log('[LLM Service] Contains \\[:', responseText.includes('\\['));
    console.log('[LLM Service] Contains \\]:', responseText.includes('\\]'));

    let normalized = responseText;

    // Convert LaTeX block math \[...\] to KaTeX $$...$$
    const beforeBlock = normalized;
    normalized = normalized.replace(
      /\\\[([\s\S]*?)\\\]/g,
      (_match, content) => {
        console.log(
          '[LLM Service] Found block math delimiter, content:',
          JSON.stringify(content)
        );
        return `$$${content}$$`;
      }
    );
    if (normalized !== beforeBlock) {
      console.log(
        '[LLM Service] After block math conversion:',
        JSON.stringify(normalized)
      );
    }

    // Convert LaTeX inline math \(...\) to KaTeX $...$
    const beforeInline = normalized;
    normalized = normalized.replace(
      /\\\(([\s\S]*?)\\\)/g,
      (_match, content) => {
        console.log(
          '[LLM Service] Found inline math delimiter, content:',
          JSON.stringify(content)
        );
        return `$${content}$`;
      }
    );
    if (normalized !== beforeInline) {
      console.log(
        '[LLM Service] After inline math conversion:',
        JSON.stringify(normalized)
      );
    }

    responseText = normalized;

    // Fix mangled problem text in response - if LLM removed spaces from problem text, restore them
    // This happens when the LLM includes the problem text in its response
    if (options.problemText) {
      // Create a version of the problem text without spaces (what LLM might generate)
      const problemWithoutSpaces = options.problemText.replace(/\s+/g, '');

      // Check if response contains the mangled version (without spaces)
      if (
        responseText.includes(problemWithoutSpaces) &&
        problemWithoutSpaces.length > 10
      ) {
        // Replace mangled version with correct version
        responseText = responseText.replace(
          problemWithoutSpaces,
          options.problemText
        );
        console.log(
          '[LLM Service] Fixed mangled problem text in response (no spaces)'
        );
      }

      // Also check for partial matches - if LLM includes parts of the problem text
      // Look for common patterns like "starts with 50" or "spends 18.75"
      const problemWords = options.problemText.split(/\s+/);
      if (problemWords.length > 3) {
        // Check for sequences of words that are missing spaces
        for (let i = 0; i < problemWords.length - 1; i++) {
          const word1 = problemWords[i];
          const word2 = problemWords[i + 1];
          const mangled = word1 + word2;
          const correct = word1 + ' ' + word2;

          // Only fix if both words are substantial (not just punctuation)
          if (
            word1.length > 2 &&
            word2.length > 2 &&
            responseText.includes(mangled)
          ) {
            // Use word boundaries to avoid partial matches
            const regex = new RegExp(
              `\\b${mangled.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
              'g'
            );
            responseText = responseText.replace(regex, correct);
            console.log(
              `[LLM Service] Fixed mangled words: "${mangled}" -> "${correct}"`
            );
          }
        }
      }
    }

    // Fix simple numbers wrapped in dollar signs (e.g., $1$, $2$, $5$)
    // These should be plain text, not math expressions
    // Pattern: $ followed by a simple number (digits only, possibly with decimal) followed by $
    const simpleNumberMathPattern = /\$(\d+\.?\d*)\$/g;
    responseText = responseText.replace(
      simpleNumberMathPattern,
      (match, number) => {
        // Only fix if it's a simple number (not a complex expression)
        // Check if it's just digits (possibly with decimal point)
        if (/^\d+\.?\d*$/.test(number)) {
          console.log(
            `[LLM Service] Fixed simple number in math delimiters: "${match}" -> "${number}"`
          );
          return number; // Remove dollar signs, keep the number
        }
        return match; // Keep complex expressions as-is
      }
    );

    console.log('[LLM Service] *** NORMALIZATION COMPLETE ***');
    console.log(
      '[LLM Service] Final response text:',
      JSON.stringify(responseText)
    );
    console.log('[LLM Service] Final length:', responseText.length);
    console.log(
      '[LLM Service] First 150 chars:',
      responseText.substring(0, 150)
    );

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
