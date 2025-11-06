/**
 * Answer Detection Service
 *
 * Keyword-based answer detection guardrail for detecting direct answers in LLM responses.
 * Scans responses for common answer patterns using regex and pattern matching.
 */

/**
 * Answer pattern definition
 */
export interface AnswerPattern {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  category: 'direct' | 'implicit';
}

/**
 * Detection result
 */
export interface DetectionResult {
  detected: boolean;
  patterns: Array<{
    pattern: AnswerPattern;
    match: string;
    position: number;
  }>;
  confidence: number;
}

/**
 * Answer detection patterns library
 * Configurable patterns for detecting direct and implicit answers
 */
const answerPatterns: AnswerPattern[] = [
  // Direct answer patterns
  {
    id: 'direct-1',
    name: 'Direct Answer Statement',
    description: 'Phrases like "the answer is" or "equals"',
    pattern: /\b(the answer is|the solution is|equals|is equal to)\b/i,
    category: 'direct',
  },
  {
    id: 'direct-2',
    name: 'Numeric Result at End',
    description: 'Direct numeric results at the end of response',
    pattern: /(?:^|\s)(\d+(\.\d+)?)\s*$/,
    category: 'direct',
  },
  {
    id: 'direct-3',
    name: 'Fraction Result',
    description: 'Direct fraction results',
    pattern: /\b\d+\/\d+\b/,
    category: 'direct',
  },
  {
    id: 'direct-4',
    name: 'Variable Equals Value',
    description: 'Variable assignment patterns like "x = 5"',
    pattern: /\b[a-zA-Z]\s*=\s*\d+(\.\d+)?\b/,
    category: 'direct',
  },
  {
    id: 'direct-5',
    name: 'Answer Phrase',
    description:
      'Phrases like "so the answer would be" or "therefore the answer is"',
    pattern:
      /\b(so the answer would be|therefore the answer is|thus the answer is|the answer would be)\b/i,
    category: 'direct',
  },
  // Implicit answer patterns
  {
    id: 'implicit-1',
    name: 'Implicit Result',
    description: 'Phrases like "you get" or "you have" followed by numbers',
    pattern:
      /\b(you get|you have|the result is|the solution is)\s+(?:[a-zA-Z]\s*=\s*)?\d+(\.\d+)?\b/i,
    category: 'implicit',
  },
  {
    id: 'implicit-2',
    name: 'Calculation Result',
    description: 'Standalone calculation results',
    pattern: /=\s*\d+(\.\d+)?/,
    category: 'implicit',
  },
];

/**
 * Detect direct answers in text using keyword-based patterns
 *
 * @param text - Text to analyze for direct answers
 * @returns Detection result with detected patterns and confidence
 */
export const detectDirectAnswers = (text: string): DetectionResult => {
  const detectedPatterns: Array<{
    pattern: AnswerPattern;
    match: string;
    position: number;
  }> = [];

  // Check each pattern
  for (const pattern of answerPatterns) {
    const match = text.match(pattern.pattern);
    if (match) {
      detectedPatterns.push({
        pattern,
        match: match[0],
        position: match.index ?? 0,
      });
    }
  }

  // Calculate confidence based on number and type of patterns detected
  let confidence = 0;
  if (detectedPatterns.length > 0) {
    // Direct patterns have higher confidence
    const directCount = detectedPatterns.filter(
      p => p.pattern.category === 'direct'
    ).length;
    const implicitCount = detectedPatterns.filter(
      p => p.pattern.category === 'implicit'
    ).length;

    // Base confidence on pattern type and count
    confidence = Math.min(1.0, 0.7 + directCount * 0.2 + implicitCount * 0.1);
  }

  return {
    detected: detectedPatterns.length > 0,
    patterns: detectedPatterns,
    confidence,
  };
};

/**
 * Add a new answer pattern to the detection library
 *
 * @param pattern - New pattern to add
 */
export const addAnswerPattern = (
  pattern: Omit<AnswerPattern, 'pattern'> & { pattern: string | RegExp }
): void => {
  const regexPattern =
    typeof pattern.pattern === 'string'
      ? new RegExp(pattern.pattern, 'i')
      : pattern.pattern;

  answerPatterns.push({
    ...pattern,
    pattern: regexPattern,
  });
};

/**
 * Get all answer patterns
 *
 * @returns Array of all answer patterns
 */
export const getAnswerPatterns = (): AnswerPattern[] => {
  return [...answerPatterns];
};

/**
 * Clear all answer patterns (for testing)
 */
export const clearAnswerPatterns = (): void => {
  answerPatterns.length = 0;
};

/**
 * Reset answer patterns to default (for testing)
 */
export const resetAnswerPatterns = (): void => {
  clearAnswerPatterns();
  // Re-add default patterns
  answerPatterns.push(
    {
      id: 'direct-1',
      name: 'Direct Answer Statement',
      description: 'Phrases like "the answer is" or "equals"',
      pattern: /\b(the answer is|the solution is|equals|is equal to)\b/i,
      category: 'direct',
    },
    {
      id: 'direct-2',
      name: 'Numeric Result at End',
      description: 'Direct numeric results at the end of response',
      pattern: /(?:^|\s)(\d+(\.\d+)?)\s*$/,
      category: 'direct',
    },
    {
      id: 'direct-3',
      name: 'Fraction Result',
      description: 'Direct fraction results',
      pattern: /\b\d+\/\d+\b/,
      category: 'direct',
    },
    {
      id: 'direct-4',
      name: 'Variable Equals Value',
      description: 'Variable assignment patterns like "x = 5"',
      pattern: /\b[a-zA-Z]\s*=\s*\d+(\.\d+)?\b/,
      category: 'direct',
    },
    {
      id: 'direct-5',
      name: 'Answer Phrase',
      description:
        'Phrases like "so the answer would be" or "therefore the answer is"',
      pattern:
        /\b(so the answer would be|therefore the answer is|thus the answer is|the answer would be)\b/i,
      category: 'direct',
    },
    {
      id: 'implicit-1',
      name: 'Implicit Result',
      description: 'Phrases like "you get" or "you have" followed by numbers',
      pattern:
        /\b(you get|you have|the result is|the solution is)\s+(?:[a-zA-Z]\s*=\s*)?\d+(\.\d+)?\b/i,
      category: 'implicit',
    },
    {
      id: 'implicit-2',
      name: 'Calculation Result',
      description: 'Standalone calculation results',
      pattern: /=\s*\d+(\.\d+)?/,
      category: 'implicit',
    }
  );
};
