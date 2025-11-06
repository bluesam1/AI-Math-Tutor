/**
 * Initial Greeting Service
 *
 * Generates initial greeting messages when a problem is set, with progressive
 * follow-up prompts if the student hasn't engaged.
 */

import {
  generateSocraticDialogue,
  type ProblemType,
  type ConversationMessage,
} from './llmService';
import { blockAndRewriteAnswer } from './answerBlockingService';

/**
 * Greeting prompt type
 */
export type GreetingPromptType = 'initial' | 'follow-up-1' | 'follow-up-2' | 'follow-up-3';

/**
 * Initial greeting generation options
 */
export interface InitialGreetingOptions {
  /**
   * Problem text
   */
  problemText: string;
  /**
   * Problem type
   */
  problemType: ProblemType;
  /**
   * Prompt type
   */
  promptType: GreetingPromptType;
  /**
   * Conversation history (optional)
   */
  conversationHistory?: ConversationMessage[];
}

/**
 * Greeting generation result
 */
export interface GreetingGenerationResult {
  /**
   * Generated greeting message
   */
  greetingMessage: string;
  /**
   * Whether the message was rewritten (should always be false after blocking)
   */
  wasRewritten: boolean;
}

/**
 * Generate initial greeting message based on prompt type
 *
 * @param options - Greeting generation options
 * @returns Generated greeting message that maintains Socratic principles
 */
export const generateInitialGreeting = async (
  options: InitialGreetingOptions
): Promise<GreetingGenerationResult> => {
  const startTime = Date.now();
  const { problemText, problemType, promptType, conversationHistory = [] } = options;

  try {
    console.log('[Initial Greeting Service] Generating greeting', {
      problemType,
      promptType,
      problemLength: problemText.length,
    });

    // Build context-aware student message based on prompt type
    let simulatedStudentMessage = '';
    switch (promptType) {
      case 'initial':
        // First greeting - open and welcoming
        simulatedStudentMessage = "I just set a problem. I'm ready to start working on it.";
        break;

      case 'follow-up-1':
        // First follow-up - gentle encouragement
        simulatedStudentMessage = "I'm still looking at the problem. I'm not sure where to start.";
        break;

      case 'follow-up-2':
        // Second follow-up - more specific guidance
        simulatedStudentMessage = "I'm still thinking about the problem. I could use some help getting started.";
        break;

      case 'follow-up-3':
        // Third follow-up - direct offer of help
        simulatedStudentMessage = "I'm stuck on this problem. Can you help me get started?";
        break;
    }

    // Generate Socratic dialogue with context-aware message
    const dialogueResponse = await generateSocraticDialogue({
      problemText: problemText.trim(),
      problemType,
      studentMessage: simulatedStudentMessage,
      conversationHistory: conversationHistory,
      helpLevel: promptType === 'follow-up-3' ? 'escalated' : 'normal',
    });

    let greetingMessage = dialogueResponse.response;
    let wasRewritten = false;

    // Post-process the response to ensure it's appropriate for the prompt type
    const lowerMessage = greetingMessage.toLowerCase();

    // For initial greeting, ensure it's welcoming and open
    if (promptType === 'initial') {
      // Ensure it's welcoming if not already
      if (
        !lowerMessage.includes('hi') &&
        !lowerMessage.includes('hello') &&
        !lowerMessage.includes('great') &&
        !lowerMessage.includes('ready')
      ) {
        // Prepend welcoming message if not present
        greetingMessage = `Hi! ${greetingMessage}`;
      }
    }

    // For follow-ups, ensure they're progressively more helpful
    if (promptType === 'follow-up-1') {
      const lowerGreeting = greetingMessage.toLowerCase();
      if (
        !lowerGreeting.includes('thinking') &&
        !lowerGreeting.includes('okay') &&
        !lowerGreeting.includes('time')
      ) {
        // Prepend gentle encouragement if not present
        greetingMessage = `Still thinking? That's okay! ${greetingMessage}`;
      }
    }

    if (promptType === 'follow-up-2') {
      const lowerGreeting = greetingMessage.toLowerCase();
      if (
        !lowerGreeting.includes('step') &&
        !lowerGreeting.includes('together') &&
        !lowerGreeting.includes('help')
      ) {
        // Prepend more specific guidance offer if not present
        greetingMessage = `Let's take it step by step! ${greetingMessage}`;
      }
    }

    if (promptType === 'follow-up-3') {
      const lowerGreeting = greetingMessage.toLowerCase();
      if (
        !lowerGreeting.includes('help') &&
        !lowerGreeting.includes('together') &&
        !lowerGreeting.includes('step')
      ) {
        // Prepend direct offer of help if not present
        greetingMessage = `I'm here to help! ${greetingMessage}`;
      }
    }

    // Apply answer blocking and rewriting to ensure Socratic compliance
    const blockingResult = await blockAndRewriteAnswer(
      greetingMessage,
      problemText.trim(),
      problemType,
      conversationHistory
    );

    if (blockingResult.blocked) {
      console.log(
        '[Initial Greeting Service] Greeting was blocked and rewritten',
        {
          detectionMethod: blockingResult.detectionMethod,
          confidence: blockingResult.confidence,
          originalLength: greetingMessage.length,
          rewrittenLength: blockingResult.rewrittenResponse?.length || 0,
        }
      );
      greetingMessage = blockingResult.rewrittenResponse || greetingMessage;
      wasRewritten = true;
    }

    const generationTime = Date.now() - startTime;
    console.log('[Initial Greeting Service] Greeting generated', {
      generationTime: `${generationTime}ms`,
      promptType,
      messageLength: greetingMessage.length,
      wasRewritten,
    });

    return {
      greetingMessage,
      wasRewritten,
    };
  } catch (error) {
    const generationTime = Date.now() - startTime;
    console.error('[Initial Greeting Service] Error generating greeting', {
      generationTime: `${generationTime}ms`,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Fallback to generic greeting message based on prompt type
    let fallbackMessage = '';
    switch (promptType) {
      case 'initial':
        fallbackMessage =
          "Hi! I'm here to help you work through this problem. What would you like to start with? 🎯";
        break;
      case 'follow-up-1':
        fallbackMessage =
          "Still thinking? That's okay! What part of the problem are you looking at first?";
        break;
      case 'follow-up-2':
        fallbackMessage =
          "Let's take it step by step! What do you notice about this problem?";
        break;
      case 'follow-up-3':
        fallbackMessage =
          "I'm here to help! Want to explore this problem together? What would you like to try first?";
        break;
    }

    console.log('[Initial Greeting Service] Using fallback message', {
      fallbackMessage,
    });

    return {
      greetingMessage: fallbackMessage,
      wasRewritten: false,
    };
  }
};


