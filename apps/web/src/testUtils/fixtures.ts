/**
 * Test Fixtures
 *
 * Provides test fixtures and utilities for testing different scenarios.
 * Used by the developer testing interface and automated tests.
 */

import type { TestProblem } from '../testData/problemLibrary';

/**
 * Answer detection test patterns
 */
export interface AnswerDetectionPattern {
  id: string;
  name: string;
  description: string;
  pattern: string;
  example: string;
  category: 'direct' | 'implicit';
}

/**
 * Direct answer detection patterns
 */
export const directAnswerPatterns: AnswerDetectionPattern[] = [
  {
    id: 'direct-1',
    name: 'Direct Answer Statement',
    description: 'Phrases like "the answer is" or "equals"',
    pattern: 'the answer is|equals|is equal to',
    example: 'The answer is 5',
    category: 'direct',
  },
  {
    id: 'direct-2',
    name: 'Numeric Result',
    description: 'Direct numeric results without context',
    pattern: '^\\d+(\\.\\d+)?$',
    example: '5 or 12.5',
    category: 'direct',
  },
  {
    id: 'direct-3',
    name: 'Fraction Result',
    description: 'Direct fraction results',
    pattern: '^\\d+/\\d+$',
    example: '3/4 or 1/2',
    category: 'direct',
  },
];

/**
 * Implicit answer detection patterns
 */
export const implicitAnswerPatterns: AnswerDetectionPattern[] = [
  {
    id: 'implicit-1',
    name: 'Subtle Answer Phrasing',
    description: 'Subtle ways of giving answers',
    pattern: 'you get|you have|the result|the solution',
    example: 'You get 5',
    category: 'implicit',
  },
  {
    id: 'implicit-2',
    name: 'Equation Result',
    description: 'Equations showing the result',
    pattern: '=\\s*\\d+',
    example: 'x = 5',
    category: 'implicit',
  },
];

/**
 * Edge case test scenarios
 */
export interface EdgeCaseScenario {
  id: string;
  name: string;
  description: string;
  problem?: string;
  type:
    | 'empty-input'
    | 'invalid-problem'
    | 'api-failure'
    | 'rate-limit'
    | 'timeout';
  expectedBehavior: string;
}

/**
 * Edge case scenarios for testing
 */
export const edgeCaseScenarios: EdgeCaseScenario[] = [
  {
    id: 'edge-1',
    name: 'Empty Input',
    description: 'Test behavior with empty problem input',
    type: 'empty-input',
    expectedBehavior: 'Should show validation error',
  },
  {
    id: 'edge-2',
    name: 'Invalid Problem',
    description: 'Test behavior with non-math input',
    problem: 'What is the capital of France?',
    type: 'invalid-problem',
    expectedBehavior: 'Should show validation error',
  },
  {
    id: 'edge-3',
    name: 'Vision API Failure',
    description: 'Test handling of Vision API failures',
    type: 'api-failure',
    expectedBehavior: 'Should show error message and allow retry',
  },
  {
    id: 'edge-4',
    name: 'LLM API Failure',
    description: 'Test handling of LLM API failures',
    type: 'api-failure',
    expectedBehavior: 'Should show error message and allow retry',
  },
  {
    id: 'edge-5',
    name: 'Rate Limit',
    description: 'Test handling of API rate limits',
    type: 'rate-limit',
    expectedBehavior: 'Should show rate limit message and allow retry',
  },
  {
    id: 'edge-6',
    name: 'Timeout',
    description: 'Test handling of request timeouts',
    type: 'timeout',
    expectedBehavior: 'Should show timeout message and allow retry',
  },
];

/**
 * Context management test scenarios
 */
export interface ContextManagementScenario {
  id: string;
  name: string;
  description: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  expectedBehavior: string;
}

/**
 * Context management scenarios for testing
 */
export const contextManagementScenarios: ContextManagementScenario[] = [
  {
    id: 'context-1',
    name: 'Short Conversation',
    description: 'Test context with 3 messages',
    messages: [
      { role: 'user', content: 'What is 2 + 2?' },
      { role: 'assistant', content: 'What do you think 2 + 2 equals?' },
      { role: 'user', content: 'I think it is 4' },
    ],
    expectedBehavior: 'Should maintain context across messages',
  },
  {
    id: 'context-2',
    name: 'Long Conversation',
    description: 'Test context with 10+ messages',
    messages: [
      { role: 'user', content: 'Solve: 2x + 5 = 15' },
      { role: 'assistant', content: 'What do you think we should do first?' },
      { role: 'user', content: 'Subtract 5?' },
      { role: 'assistant', content: 'Good! What do you get?' },
      { role: 'user', content: '2x = 10' },
      { role: 'assistant', content: 'Perfect! What should we do next?' },
      { role: 'user', content: 'Divide by 2?' },
      { role: 'assistant', content: 'Exactly! What is the result?' },
      { role: 'user', content: 'x = 5' },
      { role: 'assistant', content: 'Great work! Let me verify that for you.' },
      { role: 'user', content: 'How do I check?' },
    ],
    expectedBehavior: 'Should maintain context across all messages',
  },
];

/**
 * Help escalation test scenarios
 */
export interface HelpEscalationScenario {
  id: string;
  name: string;
  description: string;
  stuckTurns: number;
  expectedBehavior: string;
}

/**
 * Help escalation scenarios for testing
 */
export const helpEscalationScenarios: HelpEscalationScenario[] = [
  {
    id: 'help-1',
    name: 'No Escalation',
    description: 'Test behavior when student is making progress',
    stuckTurns: 0,
    expectedBehavior: 'Should provide standard Socratic guidance',
  },
  {
    id: 'help-2',
    name: 'First Escalation',
    description: 'Test behavior after 2 stuck turns',
    stuckTurns: 2,
    expectedBehavior: 'Should provide more concrete hints',
  },
  {
    id: 'help-3',
    name: 'Further Escalation',
    description: 'Test behavior after 4+ stuck turns',
    stuckTurns: 4,
    expectedBehavior: 'Should provide even more concrete hints',
  },
];

/**
 * Test result structure
 */
export interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'pending' | 'running';
  duration?: number;
  error?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Batch test configuration
 */
export interface BatchTestConfig {
  testProblems: TestProblem[];
  scenarios?: string[];
  parallel?: boolean;
  timeout?: number;
}

/**
 * Create a test result
 */
export const createTestResult = (
  id: string,
  name: string,
  status: TestResult['status'],
  details?: Record<string, unknown>,
  error?: string,
  duration?: number
): TestResult => {
  return {
    id,
    name,
    status,
    duration,
    error,
    details,
    timestamp: new Date(),
  };
};

/**
 * Test fixture utilities
 */
export const testFixtures = {
  answerDetectionPatterns: {
    direct: directAnswerPatterns,
    implicit: implicitAnswerPatterns,
    all: [...directAnswerPatterns, ...implicitAnswerPatterns],
  },
  edgeCases: edgeCaseScenarios,
  contextManagement: contextManagementScenarios,
  helpEscalation: helpEscalationScenarios,
};

export default testFixtures;
