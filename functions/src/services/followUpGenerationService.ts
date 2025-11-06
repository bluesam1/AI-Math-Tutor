/**
 * Follow-Up Generation Service
 *
 * Generates contextual follow-up messages after answer validation.
 * Maintains Socratic principles and ensures all messages pass answer detection guardrails.
 */

import {
  generateSocraticDialogue,
  type ProblemType,
  type ConversationMessage,
} from './llmService';
import { blockAndRewriteAnswer } from './answerBlockingService';

/**
 * Answer validation context
 */
export interface AnswerValidationContext {
  /**
   * Validation result: 'correct' | 'incorrect' | 'partial'
   */
  result: 'correct' | 'incorrect' | 'partial';
  /**
   * Student's answer
   */
  studentAnswer: string;
}

/**
 * Follow-up generation options
 */
export interface FollowUpGenerationOptions {
  /**
   * Problem text
   */
  problemText: string;
  /**
   * Problem type
   */
  problemType: ProblemType;
  /**
   * Answer validation context
   */
  answerValidationContext: AnswerValidationContext;
  /**
   * Conversation history (optional)
   */
  conversationHistory?: ConversationMessage[];
}

/**
 * Follow-up generation result
 */
export interface FollowUpGenerationResult {
  /**
   * Generated follow-up message
   */
  followUpMessage: string;
  /**
   * Whether the message was rewritten (should always be false after blocking)
   */
  wasRewritten: boolean;
}

/**
 * Generate contextual follow-up message based on answer validation result
 *
 * @param options - Follow-up generation options
 * @returns Generated follow-up message that maintains Socratic principles
 */
export const generateFollowUp = async (
  options: FollowUpGenerationOptions
): Promise<FollowUpGenerationResult> => {
  const startTime = Date.now();
  const {
    problemText,
    problemType,
    answerValidationContext,
    conversationHistory = [],
  } = options;

  try {
    console.log('[Follow-Up Generation Service] Generating follow-up', {
      validationResult: answerValidationContext.result,
      problemType,
      studentAnswerLength: answerValidationContext.studentAnswer.length,
    });

    // Build context-aware student message based on validation result
    // For incorrect answers, make the student's answer more prominent so the tutor can reference it
    let simulatedStudentMessage = '';
    switch (answerValidationContext.result) {
      case 'correct':
        // Be very explicit that this is a CORRECT answer - the tutor should celebrate
        simulatedStudentMessage = `I just submitted my answer: ${answerValidationContext.studentAnswer}, and I'm confident it's correct! Can you confirm it's right?`;
        break;

      case 'incorrect':
        simulatedStudentMessage = `I tried to solve this problem and got the answer: ${answerValidationContext.studentAnswer}. But I'm not sure if it's right. Can you help me understand what I might have done wrong?`;
        break;

      case 'partial':
        simulatedStudentMessage = `I just submitted my answer: ${answerValidationContext.studentAnswer}. I think I'm on the right track but not finished.`;
        break;
    }

    // For correct answers, add a system message to conversation history to make it very clear
    // This helps prevent confusion from previous messages in the conversation
    let enhancedHistory = conversationHistory;
    if (answerValidationContext.result === 'correct') {
      // Add a system-like context message at the start to make it explicit
      enhancedHistory = [
        {
          role: 'assistant' as const,
          content: `IMPORTANT: The student just submitted the answer "${answerValidationContext.studentAnswer}" which is CORRECT. You should celebrate this success and ask them to explain their process. Do NOT suggest the answer is wrong or needs more work.`,
        },
        ...conversationHistory,
      ];
    }

    // Generate Socratic dialogue with context-aware message
    // For correct answers, we need to override the system prompt to prevent step-by-step instructions
    // The system prompt in generateSocraticDialogue will handle Socratic principles
    // For incorrect answers, use escalated help level to get more specific guidance
    const dialogueResponse = await generateSocraticDialogue({
      problemText: problemText.trim(),
      problemType,
      studentMessage: simulatedStudentMessage,
      conversationHistory: enhancedHistory,
      helpLevel: answerValidationContext.result === 'incorrect' ? 'escalated' : 'normal',
      // For correct answers, add a special system message to prevent step-by-step instructions
      systemOverride: answerValidationContext.result === 'correct' 
        ? 'IMPORTANT: The student just submitted a CORRECT answer. You should celebrate their success enthusiastically and ask them to explain how they got the answer. Do NOT break down the problem into steps. Do NOT provide step-by-step instructions. Do NOT act like they got it wrong. Simply celebrate and ask them to explain their process.'
        : undefined,
    });

    // Post-process the response to ensure it's contextual based on validation result
    let followUpMessage = dialogueResponse.response;
    
    // For correct answers, ensure the message celebrates and asks for explanation
    if (answerValidationContext.result === 'correct') {
      const lowerMessage = followUpMessage.toLowerCase();
      
      // Check if message suggests the answer is wrong OR contains step-by-step instructions
      // (which shouldn't happen for correct answers - they should celebrate instead)
      const suggestsIncorrect = 
        lowerMessage.includes('try') && lowerMessage.includes('again') ||
        lowerMessage.includes('not quite') ||
        lowerMessage.includes('not correct') ||
        lowerMessage.includes('incorrect') ||
        lowerMessage.includes('that\'s not right') ||
        lowerMessage.includes('not right') ||
        (lowerMessage.includes('good try') && !lowerMessage.includes('correct')) ||
        (lowerMessage.includes('break it down') && !lowerMessage.includes('correct'));
      
      // Check if message contains step-by-step instructions (numbered lists, "steps", etc.)
      // These should not appear for correct answers - only celebrations
      // Be more aggressive in detecting instructional content
      const containsStepByStepInstructions =
        /^\s*\d+\.\s/.test(followUpMessage) || // Starts with numbered list
        /\n\s*\d+\.\s/.test(followUpMessage) || // Contains numbered list anywhere
        /^\s*\d+\.\s/.test(followUpMessage.split('\n')[0]) || // First line is numbered
        lowerMessage.match(/\d+\.\s/) !== null || // Any numbered list pattern
        lowerMessage.includes('step 1') ||
        lowerMessage.includes('step 2') ||
        lowerMessage.includes('step 3') ||
        lowerMessage.includes('step 4') ||
        lowerMessage.includes('step 5') ||
        lowerMessage.includes('starting point') ||
        lowerMessage.includes('adding more') ||
        lowerMessage.includes('count together') ||
        lowerMessage.includes('reflect on') ||
        // For correct answers, ANY "break it down" language should be replaced
        // Don't check for "correct" - if it's a correct answer and contains these phrases, replace it
        lowerMessage.includes('break it down') ||
        lowerMessage.includes('break down') ||
        lowerMessage.includes('break it') ||
        lowerMessage.includes('smaller steps') ||
        lowerMessage.includes('let\'s break') ||
        lowerMessage.includes('break it down even more') ||
        (lowerMessage.includes('more clearly') && lowerMessage.includes('break')) ||
        lowerMessage.includes('imagine you have') ||
        lowerMessage.includes('visualize') ||
        (lowerMessage.includes('think about') && lowerMessage.includes('step')) ||
        lowerMessage.includes('starting point') ||
        lowerMessage.includes('first step') ||
        lowerMessage.includes('next step');
      
      // If the message suggests incorrectness OR contains step-by-step instructions, replace with celebration
      if (suggestsIncorrect || containsStepByStepInstructions) {
        followUpMessage = `That's correct! 🎉 Great job getting ${answerValidationContext.studentAnswer}! Can you walk me through how you got that answer?`;
      } else {
        // Check if message already celebrates (contains positive confirmation words)
        if (
          !lowerMessage.includes('correct') &&
          !lowerMessage.includes('right') && 
          !lowerMessage.includes('great job') &&
          !lowerMessage.includes('excellent') &&
          !lowerMessage.includes('well done') &&
          !lowerMessage.includes('perfect') &&
          !lowerMessage.includes('that\'s correct')
        ) {
          // Prepend celebration if not present
          followUpMessage = `That's correct! 🎉 ${followUpMessage}`;
        }
        
        // Ensure it asks for explanation if not already doing so
        if (!lowerMessage.includes('how') && !lowerMessage.includes('explain') && !lowerMessage.includes('walk me through')) {
          followUpMessage = `${followUpMessage} Can you walk me through how you got that answer?`;
        }
      }
    }
    
    // For incorrect answers, ensure the message is supportive and references the student's answer
    if (answerValidationContext.result === 'incorrect') {
      const lowerMessage = followUpMessage.toLowerCase();
      const studentAnswerLower = answerValidationContext.studentAnswer.toLowerCase();
      
      // Check if the response mentions the student's answer
      if (!lowerMessage.includes(studentAnswerLower) && !lowerMessage.includes('your answer')) {
        // If the tutor didn't reference the answer, add a gentle mention
        // But only if the response doesn't already have a supportive opening
        if (
          !lowerMessage.includes('together') &&
          !lowerMessage.includes('let\'s') &&
          !lowerMessage.includes('work through')
        ) {
          // Prepend supportive message that references their attempt
          followUpMessage = `I see you tried ${answerValidationContext.studentAnswer}. Let's work through this together. ${followUpMessage}`;
        } else {
          // Just add a reference to their answer if not present
          followUpMessage = `I see you got ${answerValidationContext.studentAnswer}. ${followUpMessage}`;
        }
      }
    }
    
    // For partial answers, ensure the message acknowledges progress
    if (answerValidationContext.result === 'partial') {
      const lowerMessage = followUpMessage.toLowerCase();
      if (
        !lowerMessage.includes('right track') &&
        !lowerMessage.includes('good thinking') &&
        !lowerMessage.includes('nice start')
      ) {
        // Prepend acknowledgment if not present
        followUpMessage = `You're on the right track! ${followUpMessage}`;
      }
    }

    let wasRewritten = false;

    // Apply answer blocking and rewriting to ensure Socratic compliance
    const blockingResult = await blockAndRewriteAnswer(
      followUpMessage,
      problemText.trim(),
      problemType,
      conversationHistory
    );

    if (blockingResult.blocked) {
      console.log(
        '[Follow-Up Generation Service] Follow-up was blocked and rewritten',
        {
          detectionMethod: blockingResult.detectionMethod,
          confidence: blockingResult.confidence,
          originalLength: followUpMessage.length,
          rewrittenLength: blockingResult.rewrittenResponse?.length || 0,
        }
      );
      followUpMessage = blockingResult.rewrittenResponse || followUpMessage;
      wasRewritten = true;
    }

    const generationTime = Date.now() - startTime;
    console.log('[Follow-Up Generation Service] Follow-up generated', {
      generationTime: `${generationTime}ms`,
      validationResult: answerValidationContext.result,
      messageLength: followUpMessage.length,
      wasRewritten,
    });

    return {
      followUpMessage,
      wasRewritten,
    };
  } catch (error) {
    const generationTime = Date.now() - startTime;
    console.error('[Follow-Up Generation Service] Error generating follow-up', {
      generationTime: `${generationTime}ms`,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Fallback to generic follow-up message based on validation result
    let fallbackMessage = '';
    switch (answerValidationContext.result) {
      case 'correct':
        fallbackMessage =
          "That's correct! 🎉 Can you walk me through how you got that answer?";
        break;
      case 'incorrect':
        fallbackMessage =
          "Thanks for trying! Let's work through this together. What information do we have?";
        break;
      case 'partial':
        fallbackMessage =
          "You're on the right track! What's the next step?";
        break;
    }

    console.log('[Follow-Up Generation Service] Using fallback message', {
      fallbackMessage,
    });

    return {
      followUpMessage: fallbackMessage,
      wasRewritten: false,
    };
  }
};

