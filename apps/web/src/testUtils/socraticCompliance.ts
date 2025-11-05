/**
 * Socratic Compliance Test Utilities
 *
 * Utilities for testing Socratic compliance (ensuring no direct answers).
 * Used by the developer testing interface to validate Socratic dialogue.
 */

import { answerDetectionUtils } from './answerDetection';
import type { AnswerDetectionPattern } from './fixtures';

/**
 * Socratic compliance test result
 */
export interface SocraticComplianceTestResult {
  compliant: boolean;
  score: number; // 0-1, where 1 is fully compliant
  violations: Array<{
    pattern: AnswerDetectionPattern;
    location: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  details: {
    containsDirectAnswer: boolean;
    containsImplicitAnswer: boolean;
    isQuestion: boolean;
    isGuidance: boolean;
  };
}

/**
 * Test Socratic compliance of a response
 */
export const testSocraticCompliance = (
  response: string,
  patterns: AnswerDetectionPattern[]
): SocraticComplianceTestResult => {
  // Check for direct answers
  const containsDirect = answerDetectionUtils.containsDirect(response);

  // Check for implicit answers
  const containsImplicit = answerDetectionUtils.containsImplicit(response);

  // Check if it's a question (good sign)
  const isQuestion = /[?]/.test(response);

  // Check if it provides guidance (good sign)
  const isGuidance = /(think|consider|what|how|why|try|step)/i.test(response);

  // Test against all patterns
  const testResults = answerDetectionUtils.testMultiple(patterns, response);
  const violations: Array<{
    pattern: AnswerDetectionPattern;
    location: string;
    severity: 'high' | 'medium' | 'low';
  }> = testResults
    .filter(result => result.detected)
    .map(result => ({
      pattern: result.pattern,
      location: result.matchDetails?.match || 'unknown',
      severity: (result.pattern.category === 'direct' ? 'high' : 'medium') as
        | 'high'
        | 'medium',
    }));

  // Calculate compliance score
  let score = 1.0;
  if (containsDirect) score -= 0.5;
  if (containsImplicit) score -= 0.3;
  if (isQuestion) score += 0.1;
  if (isGuidance) score += 0.1;
  score = Math.max(0, Math.min(1, score));

  const compliant =
    !containsDirect && !containsImplicit && violations.length === 0;

  return {
    compliant,
    score,
    violations,
    details: {
      containsDirectAnswer: containsDirect,
      containsImplicitAnswer: containsImplicit,
      isQuestion,
      isGuidance,
    },
  };
};

/**
 * Validate Socratic compliance (pass/fail)
 */
export const validateSocraticCompliance = (
  response: string,
  patterns: AnswerDetectionPattern[]
): boolean => {
  const result = testSocraticCompliance(response, patterns);
  return result.compliant;
};

/**
 * Socratic compliance utilities
 */
export const socraticComplianceUtils = {
  test: testSocraticCompliance,
  validate: validateSocraticCompliance,
};

export default socraticComplianceUtils;
