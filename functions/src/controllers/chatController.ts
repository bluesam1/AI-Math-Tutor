/**
 * Chat Controller
 *
 * Handles chat-related API endpoints for Socratic dialogue generation
 */

import type { Request, Response } from 'express';
import { generateSocraticDialogue } from '../services/llmService';
import { blockAndRewriteAnswer } from '../services/answerBlockingService';
import {
  getConversationHistory,
  addMessage,
  setProblem,
} from '../services/contextService';
import { trackProgress } from '../services/helpEscalationService';
import type { ProblemType } from '../services/llmService';
import type {
  ChatMessageRequest,
  ChatMessageResponse,
  ChatMessageErrorResponse,
} from '../types/api';
import {
  generateFollowUp,
  type AnswerValidationContext,
} from '../services/followUpGenerationService';
import { generateStepByStepGuidance } from '../services/stepByStepGuidanceService';
import {
  generateInitialGreeting,
  type GreetingPromptType,
} from '../services/initialGreetingService';

/**
 * Chat message endpoint handler
 *
 * POST /api/chat/message
 * Accepts student messages and generates Socratic dialogue responses
 */
export const sendMessage = async (
  req: Request<
    unknown,
    ChatMessageResponse | ChatMessageErrorResponse,
    ChatMessageRequest
  >,
  res: Response<ChatMessageResponse | ChatMessageErrorResponse>
): Promise<void> => {
  try {
    const {
      message,
      problemText,
      problemType,
      conversationHistory,
      sessionId,
    } = req.body;

    // Validate required fields
    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        error: 'Invalid message',
        message: 'Please provide a valid message',
      });
      return;
    }

    if (
      !problemText ||
      typeof problemText !== 'string' ||
      problemText.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        error: 'No problem set',
        message: 'Please set a problem before sending messages',
      });
      return;
    }

    if (!problemType) {
      res.status(400).json({
        success: false,
        error: 'Invalid problem type',
        message: 'Please provide a valid problem type',
      });
      return;
    }

    // Validate problem type
    const validProblemTypes: ProblemType[] = [
      'arithmetic',
      'algebra',
      'geometry',
      'word',
      'multi-step',
    ];
    if (!validProblemTypes.includes(problemType as ProblemType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid problem type',
        message: `Problem type must be one of: ${validProblemTypes.join(', ')}`,
      });
      return;
    }

    // Get or create session ID
    const currentSessionId =
      sessionId ||
      `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Set problem for session if not already set
    await setProblem(currentSessionId, problemText.trim(), problemType);

    // Get conversation history from context service
    const historyFromContext = await getConversationHistory(currentSessionId);
    const effectiveHistory = conversationHistory || historyFromContext;

    // Add user message to context
    await addMessage(currentSessionId, {
      role: 'user',
      content: message.trim(),
    });

    // Track progress and determine help level
    const progressResult = await trackProgress(currentSessionId);
    const helpLevel = progressResult.helpLevel;

    // Generate Socratic dialogue response
    const dialogueResponse = await generateSocraticDialogue({
      problemText: problemText.trim(),
      problemType: problemType as ProblemType,
      studentMessage: message.trim(),
      conversationHistory: effectiveHistory,
      helpLevel, // Use help level from progress tracking
    });

    // Apply answer blocking and rewriting
    const blockingResult = await blockAndRewriteAnswer(
      dialogueResponse.response,
      problemText.trim(),
      problemType as ProblemType,
      conversationHistory || []
    );

    // Log blocking if it occurred
    if (blockingResult.blocked) {
      console.log('[Chat Controller] Response was blocked and rewritten', {
        detectionMethod: blockingResult.detectionMethod,
        confidence: blockingResult.confidence,
        originalLength: blockingResult.originalResponse.length,
        rewrittenLength: blockingResult.rewrittenResponse?.length || 0,
      });
    }

    // Use rewritten response if blocked, otherwise use original
    const finalResponse = blockingResult.blocked
      ? blockingResult.rewrittenResponse || dialogueResponse.response
      : dialogueResponse.response;

    console.log('[Chat Controller] *** RETURNING RESPONSE TO FRONTEND ***');
    console.log(
      '[Chat Controller] Final response:',
      JSON.stringify(finalResponse)
    );
    console.log(
      '[Chat Controller] Final response length:',
      finalResponse.length
    );
    console.log(
      '[Chat Controller] First 150 chars:',
      finalResponse.substring(0, 150)
    );
    console.log('[Chat Controller] Contains $:', finalResponse.includes('$'));
    console.log(
      '[Chat Controller] Contains \\(:',
      finalResponse.includes('\\(')
    );
    console.log(
      '[Chat Controller] Contains \\):',
      finalResponse.includes('\\)')
    );

    // Add assistant response to context
    await addMessage(currentSessionId, {
      role: 'assistant',
      content: finalResponse,
    });

    // Return response
    res.status(200).json({
      success: true,
      response: finalResponse,
      metadata: dialogueResponse.metadata,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error('[Chat Controller] Error generating dialogue', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    // Handle specific error types
    if (error instanceof Error) {
      // Rate limit errors
      if (error.message.includes('Rate limit')) {
        res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: 'Please try again in a moment',
        });
        return;
      }

      // API key errors
      if (
        error.message.includes('API key') ||
        error.message.includes('Invalid API key')
      ) {
        res.status(500).json({
          success: false,
          error: 'Configuration error',
          message: 'Please check your API configuration',
        });
        return;
      }

      // Generic LLM errors
      if (
        error.message.includes('LLM API') ||
        error.message.includes('Failed to generate')
      ) {
        res.status(500).json({
          success: false,
          error: 'Service error',
          message: 'Failed to generate response. Please try again.',
        });
        return;
      }
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again.',
    });
  }
};

/**
 * Follow-up request body
 */
export interface FollowUpRequest {
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
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

/**
 * Follow-up response
 */
export interface FollowUpResponse {
  success: true;
  followUpMessage: string;
}

/**
 * Follow-up error response
 */
export interface FollowUpErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

/**
 * Follow-up endpoint handler
 *
 * POST /api/chat/follow-up
 * Generates contextual follow-up message after answer validation
 */
export const generateFollowUpMessage = async (
  req: Request<
    unknown,
    FollowUpResponse | FollowUpErrorResponse,
    FollowUpRequest
  >,
  res: Response<FollowUpResponse | FollowUpErrorResponse>
): Promise<void> => {
  try {
    const {
      problemText,
      problemType,
      answerValidationContext,
      conversationHistory = [],
    } = req.body;

    // Validate required fields
    if (
      !problemText ||
      typeof problemText !== 'string' ||
      problemText.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        error: 'No problem set',
        message: 'Please provide a valid problem text',
      });
      return;
    }

    if (!problemType) {
      res.status(400).json({
        success: false,
        error: 'Invalid problem type',
        message: 'Please provide a valid problem type',
      });
      return;
    }

    if (!answerValidationContext || !answerValidationContext.result) {
      res.status(400).json({
        success: false,
        error: 'Invalid validation context',
        message: 'Please provide a valid answer validation context',
      });
      return;
    }

    // Validate problem type
    const validProblemTypes: ProblemType[] = [
      'arithmetic',
      'algebra',
      'geometry',
      'word',
      'multi-step',
    ];
    if (!validProblemTypes.includes(problemType as ProblemType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid problem type',
        message: `Problem type must be one of: ${validProblemTypes.join(', ')}`,
      });
      return;
    }

    // Validate validation result
    const validResults: Array<'correct' | 'incorrect' | 'partial'> = [
      'correct',
      'incorrect',
      'partial',
    ];
    if (!validResults.includes(answerValidationContext.result)) {
      res.status(400).json({
        success: false,
        error: 'Invalid validation result',
        message: `Validation result must be one of: ${validResults.join(', ')}`,
      });
      return;
    }

    console.log('[Chat Controller] Generating follow-up', {
      problemType,
      validationResult: answerValidationContext.result,
      studentAnswerLength: answerValidationContext.studentAnswer.length,
    });

    // Generate follow-up message
    const followUpResult = await generateFollowUp({
      problemText: problemText.trim(),
      problemType: problemType as ProblemType,
      answerValidationContext,
      conversationHistory: conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    console.log('[Chat Controller] Follow-up generated', {
      messageLength: followUpResult.followUpMessage.length,
      wasRewritten: followUpResult.wasRewritten,
    });

    // Return success response
    const response: FollowUpResponse = {
      success: true,
      followUpMessage: followUpResult.followUpMessage,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[Chat Controller] Error generating follow-up', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Return error response
    const errorResponse: FollowUpErrorResponse = {
      success: false,
      error: 'Internal server error',
      message:
        error instanceof Error
          ? error.message
          : 'Failed to generate follow-up. Please try again.',
    };

    // Include error code if available
    if (error instanceof Error && error.name) {
      errorResponse.code = error.name;
    }

    res.status(500).json(errorResponse);
  }
};

/**
 * Step-by-step guidance request body
 */
export interface StepByStepGuidanceRequest {
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
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

/**
 * Step-by-step guidance response
 */
export interface StepByStepGuidanceResponse {
  success: true;
  guidanceMessage: string;
}

/**
 * Step-by-step guidance error response
 */
export interface StepByStepGuidanceErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

/**
 * Step-by-step guidance endpoint handler
 *
 * POST /api/chat/step-by-step-guidance
 * Generates step-by-step Socratic guidance message
 */
export const generateStepByStepGuidanceMessage = async (
  req: Request<
    unknown,
    StepByStepGuidanceResponse | StepByStepGuidanceErrorResponse,
    StepByStepGuidanceRequest
  >,
  res: Response<StepByStepGuidanceResponse | StepByStepGuidanceErrorResponse>
): Promise<void> => {
  try {
    const { problemText, problemType, conversationHistory = [] } = req.body;

    // Validate required fields
    if (
      !problemText ||
      typeof problemText !== 'string' ||
      problemText.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        error: 'No problem set',
        message: 'Please provide a valid problem text',
      });
      return;
    }

    if (!problemType) {
      res.status(400).json({
        success: false,
        error: 'Invalid problem type',
        message: 'Please provide a valid problem type',
      });
      return;
    }

    // Validate problem type
    const validProblemTypes: ProblemType[] = [
      'arithmetic',
      'algebra',
      'geometry',
      'word',
      'multi-step',
    ];
    if (!validProblemTypes.includes(problemType as ProblemType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid problem type',
        message: `Problem type must be one of: ${validProblemTypes.join(', ')}`,
      });
      return;
    }

    console.log('[Chat Controller] Generating step-by-step guidance', {
      problemType,
      problemLength: problemText.length,
    });

    // Generate step-by-step guidance message
    const guidanceResult = await generateStepByStepGuidance({
      problemText: problemText.trim(),
      problemType: problemType as ProblemType,
      conversationHistory: conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    console.log('[Chat Controller] Step-by-step guidance generated', {
      messageLength: guidanceResult.guidanceMessage.length,
      wasRewritten: guidanceResult.wasRewritten,
    });

    // Return success response
    const response: StepByStepGuidanceResponse = {
      success: true,
      guidanceMessage: guidanceResult.guidanceMessage,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[Chat Controller] Error generating step-by-step guidance', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Return error response
    const errorResponse: StepByStepGuidanceErrorResponse = {
      success: false,
      error: 'Internal server error',
      message:
        error instanceof Error
          ? error.message
          : 'Failed to generate step-by-step guidance. Please try again.',
    };

    // Include error code if available
    if (error instanceof Error && error.name) {
      errorResponse.code = error.name;
    }

    res.status(500).json(errorResponse);
  }
};

/**
 * Initial greeting request body
 */
export interface InitialGreetingRequest {
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
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

/**
 * Initial greeting response
 */
export interface InitialGreetingResponse {
  success: true;
  greetingMessage: string;
}

/**
 * Initial greeting error response
 */
export interface InitialGreetingErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

/**
 * Initial greeting endpoint handler
 *
 * POST /api/chat/initial-greeting
 * Generates initial greeting message when problem is set
 */
export const generateInitialGreetingMessage = async (
  req: Request<
    unknown,
    InitialGreetingResponse | InitialGreetingErrorResponse,
    InitialGreetingRequest
  >,
  res: Response<InitialGreetingResponse | InitialGreetingErrorResponse>
): Promise<void> => {
  try {
    const {
      problemText,
      problemType,
      promptType,
      conversationHistory = [],
    } = req.body;

    // Validate required fields
    if (
      !problemText ||
      typeof problemText !== 'string' ||
      problemText.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        error: 'No problem set',
        message: 'Please provide a valid problem text',
      });
      return;
    }

    if (!problemType) {
      res.status(400).json({
        success: false,
        error: 'Invalid problem type',
        message: 'Please provide a valid problem type',
      });
      return;
    }

    if (!promptType) {
      res.status(400).json({
        success: false,
        error: 'Invalid prompt type',
        message: 'Please provide a valid prompt type',
      });
      return;
    }

    // Validate problem type
    const validProblemTypes: ProblemType[] = [
      'arithmetic',
      'algebra',
      'geometry',
      'word',
      'multi-step',
    ];
    if (!validProblemTypes.includes(problemType as ProblemType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid problem type',
        message: `Problem type must be one of: ${validProblemTypes.join(', ')}`,
      });
      return;
    }

    // Validate prompt type
    const validPromptTypes: GreetingPromptType[] = [
      'initial',
      'follow-up-1',
      'follow-up-2',
      'follow-up-3',
    ];
    if (!validPromptTypes.includes(promptType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid prompt type',
        message: `Prompt type must be one of: ${validPromptTypes.join(', ')}`,
      });
      return;
    }

    console.log('[Chat Controller] Generating initial greeting', {
      problemType,
      promptType,
      problemLength: problemText.length,
    });

    // Generate initial greeting message
    const greetingResult = await generateInitialGreeting({
      problemText: problemText.trim(),
      problemType: problemType as ProblemType,
      promptType,
      conversationHistory: conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    console.log('[Chat Controller] Initial greeting generated', {
      messageLength: greetingResult.greetingMessage.length,
      wasRewritten: greetingResult.wasRewritten,
    });

    // Return success response
    const response: InitialGreetingResponse = {
      success: true,
      greetingMessage: greetingResult.greetingMessage,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[Chat Controller] Error generating initial greeting', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Return error response
    const errorResponse: InitialGreetingErrorResponse = {
      success: false,
      error: 'Internal server error',
      message:
        error instanceof Error
          ? error.message
          : 'Failed to generate initial greeting. Please try again.',
    };

    // Include error code if available
    if (error instanceof Error && error.name) {
      errorResponse.code = error.name;
    }

    res.status(500).json(errorResponse);
  }
};
