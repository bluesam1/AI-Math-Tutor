/**
 * Answer Detection Utility
 *
 * Detects when a student message contains a potential answer to the math problem.
 * Uses heuristic patterns first (fast, lightweight), then optionally LLM-based validation
 * for confidence scoring.
 *
 * This utility is used for passive answer detection - automatically detecting answers
 * without requiring explicit "Check Answer" button.
 */

/**
 * Answer detection result
 */
export interface AnswerDetectionResult {
  /**
   * Whether the message appears to be an answer
   */
  isAnswer: boolean;

  /**
   * Confidence score (0.0 to 1.0)
   */
  confidence: number;

  /**
   * Reasoning for the detection result
   */
  reasoning?: string;

  /**
   * Detected answer patterns (if any)
   */
  patterns?: string[];
}

/**
 * Heuristic patterns for answer detection
 * These patterns are fast and lightweight, used for initial detection
 */
const ANSWER_PATTERNS = {
  // Direct answer patterns
  directAnswer: [
    /^the answer is\s+(.+)$/i,
    /^answer:\s*(.+)$/i,
    /^it's\s+(.+)$/i,
    /^it is\s+(.+)$/i,
  ],

  // Numerical answer patterns (standalone numbers)
  numerical: [
    /^\d+(\.\d+)?$/, // "5", "42", "3.14"
    /^-\d+(\.\d+)?$/, // "-5", "-3.14"
    /^[+-]?\d+(\.\d+)?$/, // "+5", "-3.14"
  ],

  // Algebraic answer patterns
  algebraic: [
    /^[a-z]\s*=\s*-?\d+(\.\d+)?$/i, // "x = 5", "y = -3.14"
    /^[a-z]\s*=\s*\d+\/\d+$/i, // "x = 5/2"
    /^[a-z]\s*=\s*\d+\s*\+\s*\d+$/i, // "x = 2 + 3"
    /^[a-z]\s*=\s*\d+\s*-\s*\d+$/i, // "x = 5 - 2"
  ],

  // Expression-based answers
  expression: [
    /^\d+\s*\+\s*\d+$/, // "2 + 3"
    /^\d+\s*-\s*\d+$/, // "5 - 2"
    /^\d+\s*\*\s*\d+$/, // "2 * 3"
    /^\d+\s*\/\s*\d+$/, // "5 / 2"
    /^\d+\/\d+$/, // "5/2"
  ],

  // Text-based answers (numbers written as words)
  textBased: [
    /^(the answer is\s+)?(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)$/i,
  ],

  // Question-formatted answers (these contain an answer in question format)
  // Examples: "Is it 5?", "Is the answer 42?", "Is this 3.14?"
  questionFormattedAnswer: [
    /^is\s+(it|the answer|this)\s+(.+?)\s*$/i, // "Is it 5?", "Is the answer 42?"
  ],

  // Question patterns (these should NOT be treated as answers)
  // These are genuine questions without answers
  question: [
    /^what\s+is\s+/, // "What is the answer?"
    /^does\s+/, // "Does x = 5?" (when used as a question, not "Is it x = 5?")
    /^how\s+/, // "How do I solve this?"
    /^why\s+/, // "Why is this?"
    /^can\s+you\s+/, // "Can you help?"
    /^\?$/, // Just a question mark
  ],
};

/**
 * Extract answer from question-formatted messages
 * Examples: "Is it 5?" -> "5", "Is the answer 42?" -> "42"
 * Returns null if not a question-formatted answer
 */
function extractAnswerFromQuestion(message: string): string | null {
  const trimmed = message.trim();
  
  // Check for question-formatted answer patterns
  for (const pattern of ANSWER_PATTERNS.questionFormattedAnswer) {
    const match = trimmed.match(pattern);
    if (match && match[2]) {
      // Extract the answer part (group 2) and remove trailing question mark
      const answerPart = match[2].trim().replace(/\?$/, '').trim();
      // Only return if there's actual content (not just "Is it ?")
      if (answerPart.length > 0) {
        return answerPart;
      }
    }
  }
  
  return null;
}

/**
 * Check if message contains question patterns (but NOT question-formatted answers)
 * These patterns indicate the message is a genuine question, not an answer
 */
function isQuestion(message: string): boolean {
  const trimmed = message.trim();
  
  // First check if it's a question-formatted answer (these should be treated as answers)
  if (extractAnswerFromQuestion(trimmed) !== null) {
    return false; // It's a question-formatted answer, not a genuine question
  }
  
  // Check if message ends with question mark (but not if it's a question-formatted answer)
  if (trimmed.endsWith('?') && extractAnswerFromQuestion(trimmed) === null) {
    // Check if it's one of the genuine question patterns
    if (ANSWER_PATTERNS.question.some(pattern => pattern.test(trimmed))) {
      return true;
    }
    // If it ends with ? but doesn't match question-formatted answer patterns,
    // it might still be a genuine question, so we check if it has an answer pattern
    // If it has an answer pattern, treat it as an answer, not a question
    const hasAnswerPattern = ANSWER_PATTERNS.directAnswer.some(p => p.test(trimmed)) ||
                            ANSWER_PATTERNS.numerical.some(p => p.test(trimmed)) ||
                            ANSWER_PATTERNS.algebraic.some(p => p.test(trimmed));
    // If it has an answer pattern, it's not a genuine question
    return !hasAnswerPattern;
  }

  // Check for question patterns (genuine questions)
  return ANSWER_PATTERNS.question.some(pattern => pattern.test(trimmed));
}

/**
 * Detect answer patterns using heuristics
 * Returns array of detected pattern types
 */
function detectPatterns(message: string): string[] {
  const trimmed = message.trim();
  const detectedPatterns: string[] = [];

  // First, check if it's a question-formatted answer (e.g., "Is it 5?")
  const extractedAnswer = extractAnswerFromQuestion(trimmed);
  if (extractedAnswer !== null) {
    // Check if the extracted answer part looks like an answer
    const hasAnswerPattern = 
      ANSWER_PATTERNS.numerical.some(p => p.test(extractedAnswer)) ||
      ANSWER_PATTERNS.algebraic.some(p => p.test(extractedAnswer)) ||
      ANSWER_PATTERNS.expression.some(p => p.test(extractedAnswer)) ||
      ANSWER_PATTERNS.textBased.some(p => p.test(extractedAnswer));
    
    if (hasAnswerPattern) {
      detectedPatterns.push('questionFormattedAnswer');
      // Also add the specific pattern type detected in the extracted answer
      if (ANSWER_PATTERNS.numerical.some(p => p.test(extractedAnswer))) {
        detectedPatterns.push('numerical');
      }
      if (ANSWER_PATTERNS.algebraic.some(p => p.test(extractedAnswer))) {
        detectedPatterns.push('algebraic');
      }
      if (ANSWER_PATTERNS.expression.some(p => p.test(extractedAnswer))) {
        detectedPatterns.push('expression');
      }
      if (ANSWER_PATTERNS.textBased.some(p => p.test(extractedAnswer))) {
        detectedPatterns.push('textBased');
      }
    }
  }

  // Check direct answer patterns
  if (ANSWER_PATTERNS.directAnswer.some(p => p.test(trimmed))) {
    detectedPatterns.push('directAnswer');
  }

  // Check numerical patterns
  if (ANSWER_PATTERNS.numerical.some(p => p.test(trimmed))) {
    detectedPatterns.push('numerical');
  }

  // Check algebraic patterns
  if (ANSWER_PATTERNS.algebraic.some(p => p.test(trimmed))) {
    detectedPatterns.push('algebraic');
  }

  // Check expression patterns
  if (ANSWER_PATTERNS.expression.some(p => p.test(trimmed))) {
    detectedPatterns.push('expression');
  }

  // Check text-based patterns
  if (ANSWER_PATTERNS.textBased.some(p => p.test(trimmed))) {
    detectedPatterns.push('textBased');
  }

  return detectedPatterns;
}

/**
 * Calculate confidence score based on detected patterns
 */
function calculateConfidence(patterns: string[]): number {
  if (patterns.length === 0) {
    return 0.0;
  }

  // Higher confidence for more explicit patterns
  const patternWeights: Record<string, number> = {
    directAnswer: 0.9, // "the answer is 5" - very explicit
    questionFormattedAnswer: 0.85, // "Is it 5?" - question format but contains answer
    algebraic: 0.8, // "x = 5" - clear algebraic answer
    numerical: 0.7, // "5" - likely an answer
    expression: 0.6, // "2 + 3" - could be answer or intermediate step
    textBased: 0.5, // "five" - less clear
  };

  // Use the highest weight among detected patterns
  const maxWeight = Math.max(
    ...patterns.map(p => patternWeights[p] || 0.5)
  );

  // Multiple patterns increase confidence slightly
  const patternBonus = patterns.length > 1 ? 0.1 : 0.0;

  return Math.min(1.0, maxWeight + patternBonus);
}

/**
 * Determine if a message looks like an answer using heuristic patterns
 *
 * @param message - Student message to check
 * @returns Answer detection result with confidence score
 */
export function detectAnswer(message: string): AnswerDetectionResult {
  const trimmed = message.trim();

  console.log('[Answer Detection] Starting detection', {
    message,
    trimmed,
    length: trimmed.length,
  });

  // Empty messages are not answers
  if (trimmed.length === 0) {
    console.log('[Answer Detection] Empty message detected');
    return {
      isAnswer: false,
      confidence: 0.0,
      reasoning: 'Empty message',
    };
  }

  // Check if message is a question (not an answer)
  const isQuestionResult = isQuestion(trimmed);
  console.log('[Answer Detection] Question check result', {
    isQuestion: isQuestionResult,
    message: trimmed,
  });

  if (isQuestionResult) {
    console.log('[Answer Detection] Message is a question, not an answer');
    return {
      isAnswer: false,
      confidence: 0.0,
      reasoning: 'Message appears to be a question',
      patterns: ['question'],
    };
  }

  // Detect answer patterns
  const patterns = detectPatterns(trimmed);
  console.log('[Answer Detection] Pattern detection result', {
    patterns,
    patternCount: patterns.length,
    message: trimmed,
  });

  // If no patterns detected, likely not an answer
  if (patterns.length === 0) {
    console.log('[Answer Detection] No answer patterns detected');
    return {
      isAnswer: false,
      confidence: 0.0,
      reasoning: 'No answer patterns detected',
    };
  }

  // Calculate confidence
  const confidence = calculateConfidence(patterns);
  console.log('[Answer Detection] Confidence calculation', {
    patterns,
    confidence,
    threshold: 0.5,
    meetsThreshold: confidence >= 0.5,
  });

  // Consider it an answer if confidence is above threshold
  const isAnswer = confidence >= 0.5;

  const result = {
    isAnswer,
    confidence,
    reasoning: isAnswer
      ? `Detected answer patterns: ${patterns.join(', ')}`
      : `Low confidence (${(confidence * 100).toFixed(0)}%) for patterns: ${patterns.join(', ')}`,
    patterns,
  };

  console.log('[Answer Detection] Final result', {
    isAnswer: result.isAnswer,
    confidence: result.confidence,
    reasoning: result.reasoning,
    patterns: result.patterns,
  });

  return result;
}

/**
 * Validate answer detection using lightweight LLM-based validation
 * This is optional and can be used to increase confidence for edge cases
 *
 * Note: This is a placeholder for future LLM-based validation.
 * For now, we use heuristics only for performance.
 *
 * @param message - Student message to validate
 * @param problemText - Problem text for context
 * @param problemType - Problem type for context
 * @returns Promise with enhanced detection result
 */
export async function validateAnswerDetection(
  message: string,
  problemText: string,
  problemType: string
): Promise<AnswerDetectionResult> {
  // First, use heuristic detection
  const heuristicResult = detectAnswer(message);

  // If heuristic confidence is very high or very low, return early
  if (heuristicResult.confidence >= 0.9 || heuristicResult.confidence <= 0.3) {
    return heuristicResult;
  }

  // For medium confidence cases, we could enhance with LLM validation
  // For now, return heuristic result as LLM validation would require API call
  // and is not needed for initial implementation (can be added later if needed)

  return {
    ...heuristicResult,
    reasoning: `${heuristicResult.reasoning} (heuristic-only, LLM validation not implemented)`,
  };
}

/**
 * Answer detection utilities
 */
export const answerDetectionUtils = {
  detect: detectAnswer,
  validate: validateAnswerDetection,
};

export default answerDetectionUtils;

