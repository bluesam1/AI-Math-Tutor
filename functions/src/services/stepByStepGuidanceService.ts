/**
 * Step-by-Step Guidance Service
 *
 * Generates step-by-step Socratic guidance messages that maintain Socratic principles.
 * Provides structured guidance without giving direct answers.
 */

import {
  generateSocraticDialogue,
  type ProblemType,
  type ConversationMessage,
} from './llmService';
import { blockAndRewriteAnswer } from './answerBlockingService';

/**
 * Step-by-step guidance generation options
 */
export interface StepByStepGuidanceOptions {
  /**
   * Problem text
   */
  problemText: string;
  /**
   * Problem type
   */
  problemType: ProblemType;
  /**
   * Conversation history (optional)
   */
  conversationHistory?: ConversationMessage[];
}

/**
 * Step-by-step guidance result
 */
export interface StepByStepGuidanceResult {
  /**
   * Generated guidance message
   */
  guidanceMessage: string;
  /**
   * Whether the message was rewritten (should always be false after blocking)
   */
  wasRewritten: boolean;
}

/**
 * Generate step-by-step Socratic guidance message
 *
 * @param options - Step-by-step guidance generation options
 * @returns Generated guidance message that maintains Socratic principles
 */
export const generateStepByStepGuidance = async (
  options: StepByStepGuidanceOptions
): Promise<StepByStepGuidanceResult> => {
  const startTime = Date.now();
  const { problemText, problemType, conversationHistory = [] } = options;

  try {
    console.log('[Step-by-Step Guidance Service] Generating guidance', {
      problemType,
      problemLength: problemText.length,
    });

    // Create a student message that requests step-by-step guidance
    const simulatedStudentMessage =
      'I need help working through this step-by-step. Can you guide me?';

    // Generate Socratic dialogue with step-by-step guidance context
    // The system prompt in generateSocraticDialogue will handle Socratic principles
    // We'll add context by crafting the student message to request step-by-step guidance
    const dialogueResponse = await generateSocraticDialogue({
      problemText: problemText.trim(),
      problemType,
      studentMessage: simulatedStudentMessage,
      conversationHistory: conversationHistory,
      helpLevel: 'escalated', // Use escalated help level for more concrete guidance
    });

    let guidanceMessage = dialogueResponse.response;
    let wasRewritten = false;

    // Post-process the response to ensure it's step-by-step focused
    const lowerMessage = guidanceMessage.toLowerCase();

    // Ensure the message offers step-by-step guidance if not already doing so
    if (
      !lowerMessage.includes('step') &&
      !lowerMessage.includes('guide') &&
      !lowerMessage.includes('walk through') &&
      !lowerMessage.includes('together')
    ) {
      // Prepend step-by-step offer if not present
      guidanceMessage = `Let's work through this step-by-step together. ${guidanceMessage}`;
    }

    // Apply answer blocking and rewriting to ensure Socratic compliance
    const blockingResult = await blockAndRewriteAnswer(
      guidanceMessage,
      problemText.trim(),
      problemType,
      conversationHistory
    );

    if (blockingResult.blocked) {
      console.log(
        '[Step-by-Step Guidance Service] Guidance was blocked and rewritten',
        {
          detectionMethod: blockingResult.detectionMethod,
          confidence: blockingResult.confidence,
          originalLength: guidanceMessage.length,
          rewrittenLength: blockingResult.rewrittenResponse?.length || 0,
        }
      );
      guidanceMessage = blockingResult.rewrittenResponse || guidanceMessage;
      wasRewritten = true;
    }

    const generationTime = Date.now() - startTime;
    console.log('[Step-by-Step Guidance Service] Guidance generated', {
      generationTime: `${generationTime}ms`,
      messageLength: guidanceMessage.length,
      wasRewritten,
    });

    return {
      guidanceMessage,
      wasRewritten,
    };
  } catch (error) {
    const generationTime = Date.now() - startTime;
    console.error('[Step-by-Step Guidance Service] Error generating guidance', {
      generationTime: `${generationTime}ms`,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Fallback to generic step-by-step guidance message
    const fallbackMessage =
      "Let's work through this step-by-step together. What information do we have in the problem? What do you think we should figure out first?";

    console.log('[Step-by-Step Guidance Service] Using fallback message', {
      fallbackMessage,
    });

    return {
      guidanceMessage: fallbackMessage,
      wasRewritten: false,
    };
  }
};
