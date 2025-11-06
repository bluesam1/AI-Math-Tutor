/**
 * Answer Controller
 *
 * Handles answer checking API endpoints
 */

import type { Request, Response } from 'express';
import { checkAnswer } from '../services/answerCheckingService';
import type { ProblemType } from '../services/llmService';

/**
 * Answer check request body
 */
export interface AnswerCheckRequest {
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
 * Answer validation context for follow-up generation
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
 * Answer check response
 */
export interface AnswerCheckResponse {
  success: true;
  isCorrect: boolean;
  isPartial?: boolean;
  confidence: number;
  feedback?: string;
  reasoning?: string;
  /**
   * Whether a follow-up message should be generated
   */
  shouldGenerateFollowUp?: boolean;
  /**
   * Answer validation context for follow-up generation
   */
  answerValidationContext?: AnswerValidationContext;
}

/**
 * Answer check error response
 */
export interface AnswerCheckErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

/**
 * Answer check endpoint handler
 *
 * POST /api/answer/check
 * Validates student answers against math problems
 */
export const checkAnswerEndpoint = async (
  req: Request<unknown, AnswerCheckResponse | AnswerCheckErrorResponse, AnswerCheckRequest>,
  res: Response<AnswerCheckResponse | AnswerCheckErrorResponse>
): Promise<void> => {
  console.log('[Answer Controller] *** CHECK ANSWER ENDPOINT CALLED ***');
  console.log('[Answer Controller] Request method:', req.method);
  console.log('[Answer Controller] Request path:', req.path);
  console.log('[Answer Controller] Request URL:', req.url);
  console.log('[Answer Controller] Request body:', req.body);
  console.log('[Answer Controller] Request headers:', req.headers);

  try {
    const { studentAnswer, problemText, problemType } = req.body;
    console.log('[Answer Controller] Extracted from body:', {
      studentAnswer,
      problemText,
      problemType,
      hasStudentAnswer: !!studentAnswer,
      hasProblemText: !!problemText,
      hasProblemType: !!problemType,
    });

    // Validate required fields
    if (
      !studentAnswer ||
      typeof studentAnswer !== 'string' ||
      studentAnswer.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        error: 'Invalid answer',
        message: 'Please provide a valid student answer',
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

    console.log('[Answer Controller] Checking answer', {
      problemType,
      problemText,
      studentAnswer,
      studentAnswerLength: studentAnswer.length,
      problemLength: problemText.length,
    });

    // Check answer using service
    const validationResult = await checkAnswer({
      studentAnswer: studentAnswer.trim(),
      problemText: problemText.trim(),
      problemType: problemType as ProblemType,
    });

    // Determine validation result type
    let validationResultType: 'correct' | 'incorrect' | 'partial';
    if (validationResult.isCorrect) {
      validationResultType = 'correct';
    } else if (validationResult.isPartial) {
      validationResultType = 'partial';
    } else {
      validationResultType = 'incorrect';
    }

    console.log('[Answer Controller] Answer check complete', {
      problemText,
      studentAnswer,
      isCorrect: validationResult.isCorrect,
      isPartial: validationResult.isPartial || false,
      confidence: validationResult.confidence,
      feedback: validationResult.feedback,
      reasoning: validationResult.reasoning,
      validationResultType,
    });

    // Return success response
    const response: AnswerCheckResponse = {
      success: true,
      isCorrect: validationResult.isCorrect,
      confidence: validationResult.confidence,
      shouldGenerateFollowUp: true, // Always generate follow-up after validation
      answerValidationContext: {
        result: validationResultType,
        studentAnswer: studentAnswer.trim(),
      },
    };

    // Include optional fields if present
    if (validationResult.isPartial !== undefined) {
      response.isPartial = validationResult.isPartial;
    }
    if (validationResult.feedback) {
      response.feedback = validationResult.feedback;
    }
    if (validationResult.reasoning) {
      response.reasoning = validationResult.reasoning;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('[Answer Controller] Error checking answer', {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Return error response
    const errorResponse: AnswerCheckErrorResponse = {
      success: false,
      error: 'Internal server error',
      message:
        error instanceof Error
          ? error.message
          : 'Failed to check answer. Please try again.',
    };

    // Include error code if available
    if (error instanceof Error && error.name) {
      errorResponse.code = error.name;
    }

    res.status(500).json(errorResponse);
  }
};

