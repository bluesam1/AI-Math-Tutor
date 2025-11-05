/**
 * Answer Detection Test Utilities
 * 
 * Utilities for testing answer detection functionality.
 * Used by the developer testing interface to validate answer detection patterns.
 */

import type { AnswerDetectionPattern } from './fixtures';

/**
 * Answer detection test result
 */
export interface AnswerDetectionTestResult {
  pattern: AnswerDetectionPattern;
  testText: string;
  detected: boolean;
  confidence: number;
  matchDetails?: {
    match: string;
    position: number;
  };
}

/**
 * Test answer detection against a pattern
 */
export const testAnswerDetection = (
  pattern: AnswerDetectionPattern,
  text: string
): AnswerDetectionTestResult => {
  const regex = new RegExp(pattern.pattern, 'i');
  const match = text.match(regex);

  return {
    pattern,
    testText: text,
    detected: match !== null,
    confidence: match ? 1.0 : 0.0,
    matchDetails: match
      ? {
          match: match[0],
          position: match.index ?? 0,
        }
      : undefined,
  };
};

/**
 * Test answer detection against multiple patterns
 */
export const testAnswerDetectionMultiple = (
  patterns: AnswerDetectionPattern[],
  text: string
): AnswerDetectionTestResult[] => {
  return patterns.map((pattern) => testAnswerDetection(pattern, text));
};

/**
 * Check if text contains direct answer
 */
export const containsDirectAnswer = (text: string): boolean => {
  const directPatterns = [
    /the answer is/i,
    /equals/i,
    /is equal to/i,
    /^\d+(\.\d+)?$/,
    /^\d+\/\d+$/,
  ];

  return directPatterns.some((pattern) => pattern.test(text));
};

/**
 * Check if text contains implicit answer
 */
export const containsImplicitAnswer = (text: string): boolean => {
  const implicitPatterns = [
    /you get/i,
    /you have/i,
    /the result/i,
    /the solution/i,
    /=\s*\d+/,
  ];

  return implicitPatterns.some((pattern) => pattern.test(text));
};

/**
 * Answer detection utilities
 */
export const answerDetectionUtils = {
  testSingle: testAnswerDetection,
  testMultiple: testAnswerDetectionMultiple,
  containsDirect: containsDirectAnswer,
  containsImplicit: containsImplicitAnswer,
};

export default answerDetectionUtils;

