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
