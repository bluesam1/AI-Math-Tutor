/**
 * Answer Blocking Service
 *
 * Combines keyword-based detection and LLM-based validation to determine if a response
 * contains direct answers, and if so, blocks it and rewrites it using the LLM service.
 */

import { detectDirectAnswers } from './answerDetectionService';
import { validateResponseForAnswers } from './answerValidationService';
import {
  generateSocraticDialogue,
  type ProblemType,
  type ConversationMessage,
} from './llmService';

/**
 * Blocking result
 */
export interface BlockingResult {
  blocked: boolean;
  rewrittenResponse?: string;
  originalResponse: string;
  detectionMethod: 'keyword' | 'llm' | 'both' | 'none';
  confidence: number;
}

/**
 * Block and rewrite response if it contains direct answers
 *
 * @param responseText - Original response text to check
 * @param problemText - Problem text for context
 * @param problemType - Problem type for context
 * @param conversationHistory - Conversation history for rewriting context
 * @returns Blocking result with rewritten response if blocked
 */
export const blockAndRewriteAnswer = async (
  responseText: string,
  problemText: string,
  problemType: ProblemType,
  conversationHistory?: ConversationMessage[]
): Promise<BlockingResult> => {
  const startTime = Date.now();

  try {
    // Step 1: Keyword-based detection
    const keywordDetection = detectDirectAnswers(responseText);
    const keywordDetected = keywordDetection.detected;
    const keywordConfidence = keywordDetection.confidence;

    console.log('[Answer Blocking Service] Keyword detection result', {
      detected: keywordDetected,
      confidence: keywordConfidence,
      patternsFound: keywordDetection.patterns.length,
    });

    // Step 2: LLM-based validation
    let llmValidation;
    let llmDetected = false;
    let llmConfidence = 0;

    try {
      llmValidation = await validateResponseForAnswers(
        responseText,
        problemText,
        problemType
      );
      llmDetected = llmValidation.containsAnswer;
      llmConfidence = llmValidation.confidence;
    } catch (error) {
      console.error('[Answer Blocking Service] LLM validation failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      // If LLM validation fails, rely on keyword detection
      // Default to blocking if keyword detection found something
      llmDetected = keywordDetected;
      llmConfidence = keywordConfidence;
    }

    console.log('[Answer Blocking Service] LLM validation result', {
      detected: llmDetected,
      confidence: llmConfidence,
      reasoning: llmValidation?.reasoning,
    });

    // Step 3: Determine if response should be blocked
    // Block if either detection method finds an answer
    const shouldBlock = keywordDetected || llmDetected;
    const combinedConfidence = Math.max(keywordConfidence, llmConfidence);

    // Determine which method detected the answer
    let detectionMethod: 'keyword' | 'llm' | 'both' | 'none';
    if (keywordDetected && llmDetected) {
      detectionMethod = 'both';
    } else if (keywordDetected) {
      detectionMethod = 'keyword';
    } else if (llmDetected) {
      detectionMethod = 'llm';
    } else {
      detectionMethod = 'none';
    }

    if (!shouldBlock) {
      console.log('[Answer Blocking Service] Response passed validation', {
        detectionMethod,
        confidence: combinedConfidence,
      });
      return {
        blocked: false,
        originalResponse: responseText,
        detectionMethod,
        confidence: combinedConfidence,
      };
    }

    // Step 4: Block and rewrite response
    console.log('[Answer Blocking Service] Blocking response and rewriting', {
      originalResponse: responseText.substring(0, 100),
      detectionMethod,
      confidence: combinedConfidence,
    });

    // Get the last user message from conversation history for context
    const lastUserMessage =
      conversationHistory
        ?.slice()
        .reverse()
        .find(msg => msg.role === 'user')?.content ||
      'I need help with this problem';

    // Generate rewritten response using LLM
    let rewrittenResponse: string;
    try {
      const rewriteResponse = await generateSocraticDialogue({
        problemText,
        problemType,
        studentMessage: lastUserMessage,
        conversationHistory: conversationHistory || [],
        helpLevel: 'normal',
      });

      rewrittenResponse = rewriteResponse.response;
      console.log('[Answer Blocking Service] Response rewritten successfully', {
        rewrittenResponse: rewrittenResponse.substring(0, 100),
      });
    } catch (error) {
      console.error('[Answer Blocking Service] Failed to rewrite response', {
        error: error instanceof Error ? error.message : String(error),
      });
      // Fallback to generic Socratic question
      rewrittenResponse =
        "Let's think about this step by step. What do you think we should consider first?";
      console.log('[Answer Blocking Service] Using fallback response', {
        fallbackResponse: rewrittenResponse,
      });
    }

    const blockingTime = Date.now() - startTime;
    console.log('[Answer Blocking Service] Blocking complete', {
      blockingTime: `${blockingTime}ms`,
      blocked: true,
      detectionMethod,
      confidence: combinedConfidence,
      originalLength: responseText.length,
      rewrittenLength: rewrittenResponse.length,
    });

    return {
      blocked: true,
      rewrittenResponse,
      originalResponse: responseText,
      detectionMethod,
      confidence: combinedConfidence,
    };
  } catch (error) {
    const blockingTime = Date.now() - startTime;
    console.error('[Answer Blocking Service] Error in blocking process', {
      blockingTime: `${blockingTime}ms`,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    // On error, default to blocking with generic response
    return {
      blocked: true,
      rewrittenResponse:
        "Let's think about this step by step. What do you think we should consider first?",
      originalResponse: responseText,
      detectionMethod: 'none',
      confidence: 0.5,
    };
  }
};
