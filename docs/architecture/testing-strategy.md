# Testing Strategy

**⚠️ CRITICAL: Testing is KEY to Success**

Thorough testing and ease of testing different scenarios are **fundamental to the success of AI Math Tutor**. The system's core value proposition—100% Socratic compliance—requires extensive scenario-based testing across all 5 problem types, answer detection validation, and pedagogical quality assurance. This architecture prioritizes testability and provides comprehensive testing infrastructure to ensure the system maintains its pedagogical integrity.

### Testing Philosophy

1. **Scenario-Based Testing is Primary:** Test real-world problem-solving scenarios across all 5 problem types (arithmetic, algebra, geometry, word problems, multi-step)
2. **Answer Detection Validation is Critical:** Every LLM response must be validated through answer detection guardrails—this is non-negotiable
3. **Pedagogical Quality Testing:** Manual and automated testing of Socratic dialogue quality, progressive help escalation, and context management
4. **Easy Test Execution:** Developers should be able to easily run tests for specific problem types, scenarios, or components
5. **Comprehensive Coverage:** Critical paths (answer detection, context management, problem parsing) must have >90% test coverage

### Testing Pyramid

```
        Manual/E2E Tests (Pedagogical Quality)
       /        \
      Integration Tests (API + External Services)
     /            \
    Frontend Unit  Backend Unit
```

**Note:** While E2E tests are deferred post-MVP, manual testing of pedagogical quality is **mandatory** for MVP to ensure Socratic compliance.

### Test Organization

**Frontend Tests:**

```
apps/web/tests/
├── components/
│   ├── ProblemInput.test.tsx
│   ├── ProblemDisplay.test.tsx
│   ├── ChatInterface.test.tsx
│   └── VisualFeedback.test.tsx
├── hooks/
│   ├── useSession.test.ts
│   ├── useChat.test.ts
│   └── useProblem.test.ts
├── services/
│   └── api.test.ts
└── scenarios/
    ├── arithmetic.test.ts
    ├── algebra.test.ts
    ├── geometry.test.ts
    ├── wordProblems.test.ts
    └── multiStep.test.ts
```

**Backend Tests:**

```
apps/api/tests/
├── functions/
│   ├── problemInput.test.ts
│   └── socraticDialogue.test.ts
├── services/
│   ├── answerDetection.test.ts
│   │   ├── keywordDetection.test.ts
│   │   ├── llmValidation.test.ts
│   │   └── scenarios/
│   │       ├── directAnswer.test.ts
│   │       ├── implicitAnswer.test.ts
│   │       └── edgeCases.test.ts
│   ├── contextService.test.ts
│   └── llmApi.test.ts
├── integration/
│   ├── api.test.ts
│   ├── visionApi.test.ts
│   └── llmIntegration.test.ts
└── scenarios/
    ├── arithmetic/
    │   ├── basicOperations.test.ts
    │   ├── fractions.test.ts
    │   └── decimals.test.ts
    ├── algebra/
    │   ├── linearEquations.test.ts
    │   ├── variables.test.ts
    │   └── expressions.test.ts
    ├── geometry/
    │   ├── shapes.test.ts
    │   ├── areaPerimeter.test.ts
    │   └── angles.test.ts
    ├── wordProblems/
    │   ├── storyProblems.test.ts
    │   └── multiStepWordProblems.test.ts
    └── multiStep/
        └── complexProblems.test.ts
```

**Test Fixtures and Utilities:**

```
tests/
├── fixtures/
│   ├── problems/
│   │   ├── arithmetic.fixtures.ts
│   │   ├── algebra.fixtures.ts
│   │   ├── geometry.fixtures.ts
│   │   ├── wordProblems.fixtures.ts
│   │   └── multiStep.fixtures.ts
│   ├── responses/
│   │   ├── validSocraticResponses.fixtures.ts
│   │   ├── invalidDirectAnswers.fixtures.ts
│   │   └── edgeCases.fixtures.ts
│   └── sessions/
│       └── sessionFixtures.ts
├── utils/
│   ├── testHelpers.ts
│   ├── mockLLM.ts
│   ├── mockVisionAPI.ts
│   ├── mockRedis.ts
│   └── scenarioRunner.ts
└── e2e/
    ├── problem-submission.spec.ts
    ├── socratic-dialogue.spec.ts
    └── answer-detection.spec.ts
```

### Scenario-Based Testing Infrastructure

**Test Fixtures for Problem Types:**

```typescript
// tests/fixtures/problems/arithmetic.fixtures.ts
export const arithmeticProblems = {
  basicAddition: {
    text: 'What is 15 + 27?',
    type: 'arithmetic',
    expectedSteps: [
      'What operation are we performing?',
      'What is 15 + 20?',
      'What is 35 + 7?',
    ],
  },
  subtraction: {
    text: 'Solve 43 - 18',
    type: 'arithmetic',
    expectedSteps: [
      'What operation are we doing?',
      'Can you break down 18?',
      'What is 43 - 10?',
    ],
  },
  // ... more arithmetic problems
};

// tests/fixtures/problems/algebra.fixtures.ts
export const algebraProblems = {
  linearEquation: {
    text: 'Solve 2x + 5 = 13',
    type: 'algebra',
    expectedSteps: [
      'What are we trying to find?',
      'What operations do we need to undo?',
      'What should we do first?',
    ],
  },
  // ... more algebra problems
};
```

**Test Utilities for Easy Scenario Testing:**

```typescript
// tests/utils/scenarioRunner.ts
export class ScenarioRunner {
  async runProblemScenario(
    problem: Problem,
    expectedBehavior: ScenarioExpectations
  ) {
    // Run full problem-solving scenario
    // Validate Socratic responses
    // Check answer detection
    // Verify context management
  }

  async testAnswerDetection(response: string, shouldDetect: boolean) {
    // Test answer detection guardrails
    // Validate keyword detection
    // Validate LLM validation
  }

  async testProgressiveHelpEscalation(problem: Problem, stuckTurns: number) {
    // Test help escalation after stuck turns
    // Verify help becomes more concrete
    // Ensure no direct answers given
  }
}
```

**Test Commands for Easy Execution:**

```bash
# Run tests for specific problem type
npm test -- --grep "arithmetic"
npm test -- --grep "algebra"
npm test -- --grep "answer-detection"

# Run scenario tests
npm run test:scenarios

# Run answer detection tests
npm run test:answer-detection

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage

# Run manual testing helpers
npm run test:manual -- --problem-type arithmetic
npm run test:manual -- --scenario basic-addition
```

### Critical Test Coverage Requirements

**Mandatory Coverage Targets:**

- **Answer Detection Service:** 100% coverage (critical for Socratic compliance)
- **Context Management Service:** >95% coverage (critical for conversation coherence)
- **Problem Validation:** >90% coverage (critical for all problem types)
- **Socratic Dialogue Generation:** >85% coverage (critical for pedagogical quality)
- **Overall Backend Services:** >80% coverage
- **Overall Frontend Components:** >75% coverage

**Test Priority Matrix:**

1. **P0 - Critical:** Answer detection guardrails, context management, problem validation
2. **P1 - High:** Socratic dialogue generation, LLM integration, OpenAI Vision API integration
3. **P2 - Medium:** UI components, state management, error handling
4. **P3 - Low:** Utility functions, helpers, formatting

### Test Examples

**Frontend Component Test:**

```typescript
// apps/web/tests/components/ProblemInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemInput } from '@/components/ProblemInput';

describe('ProblemInput', () => {
  it('submits problem text when entered', () => {
    const onProblemSubmit = jest.fn();
    render(<ProblemInput onProblemSubmit={onProblemSubmit} />);

    const input = screen.getByPlaceholderText('Enter math problem');
    fireEvent.change(input, { target: { value: 'Solve 2x + 5 = 13' } });
    fireEvent.click(screen.getByText('Submit'));

    expect(onProblemSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Solve 2x + 5 = 13' })
    );
  });
});
```

**Backend Answer Detection Test (CRITICAL):**

```typescript
// apps/api/tests/services/answerDetection/scenarios/directAnswer.test.ts
import { detectAnswer } from '../../../../src/services/answerDetection';
import { directAnswerFixtures } from '../../../../../fixtures/responses/invalidDirectAnswers.fixtures';

describe('Answer Detection - Direct Answers', () => {
  it('detects explicit direct answers', async () => {
    const responses = [
      'The answer is 42',
      'So the solution equals 15',
      'Therefore the answer would be x = 5',
      'The result is 100',
    ];

    for (const response of responses) {
      const result = await detectAnswer(response);
      expect(result.detected).toBe(true);
      expect(result.method).toContain('keyword');
    }
  });

  it('detects implicit direct answers through LLM validation', async () => {
    const responses = [
      'After solving this, you would find that x equals 4',
      'By following these steps, the final answer emerges as 25',
      'The mathematical process leads to the solution of 10',
    ];

    for (const response of responses) {
      const result = await detectAnswer(response);
      expect(result.detected).toBe(true);
      expect(result.method).toContain('llm');
    }
  });

  it('allows valid Socratic questions', async () => {
    const responses = [
      'What operation are we performing?',
      'Can you think about what information we have?',
      'What would be a good first step?',
      'How might we approach this problem?',
    ];

    for (const response of responses) {
      const result = await detectAnswer(response);
      expect(result.detected).toBe(false);
    }
  });
});
```

**Scenario-Based Test for Problem Type:**

```typescript
// apps/api/tests/scenarios/algebra/linearEquations.test.ts
import { ScenarioRunner } from '../../../../utils/scenarioRunner';
import { algebraProblems } from '../../../../fixtures/problems/algebra.fixtures';

describe('Algebra - Linear Equations', () => {
  const runner = new ScenarioRunner();

  it('guides through solving 2x + 5 = 13', async () => {
    const problem = algebraProblems.linearEquation;
    const result = await runner.runProblemScenario(problem, {
      expectedSocraticSteps: [
        'What are we trying to find?',
        'What operations do we need to undo?',
        'What should we do first?',
      ],
      mustNotContain: ['x = 4', 'the answer is', 'equals 4'],
      maxTurns: 10,
    });

    expect(result.success).toBe(true);
    expect(result.socraticCompliance).toBe(100);
    expect(result.answerDetected).toBe(false);
  });

  it('escalates help after 2 stuck turns', async () => {
    const problem = algebraProblems.linearEquation;
    const result = await runner.testProgressiveHelpEscalation(problem, 3);

    expect(result.helpLevel).toBeGreaterThan(1);
    expect(result.answerDetected).toBe(false);
    expect(result.response.includes('direct answer')).toBe(false);
  });
});
```

**Integration Test for Full Socratic Dialogue:**

```typescript
// apps/api/tests/integration/socraticDialogue.test.ts
import { handler } from '../../src/functions/socraticDialogue/handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { arithmeticProblems } from '../../../fixtures/problems/arithmetic.fixtures';

describe('Socratic Dialogue Integration', () => {
  it('maintains Socratic compliance across 10+ message exchanges', async () => {
    const problem = arithmeticProblems.basicAddition;
    let sessionId = 'test-session-' + Date.now();
    let messages: string[] = [];

    // Simulate 10 message exchanges
    for (let i = 0; i < 10; i++) {
      const event: APIGatewayProxyEvent = {
        body: JSON.stringify({
          sessionId,
          message: messages[i] || 'What should I do?',
          problemId: 'test-problem',
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);
      expect(result.statusCode).toBe(200);

      const body = JSON.parse(result.body);

      // CRITICAL: Verify no direct answers
      expect(body.message).not.toContain('the answer is');
      expect(body.message).not.toContain('equals');
      expect(body.message).not.toMatch(/\d+$/); // No numeric answers at end

      // Verify Socratic question format
      expect(body.message).toMatch(/[?]/); // Contains question mark

      messages.push(body.message);
    }
  });
});
```

**Test for All 5 Problem Types:**

```typescript
// apps/api/tests/scenarios/allProblemTypes.test.ts
import { ScenarioRunner } from '../../../../utils/scenarioRunner';
import {
  arithmeticProblems,
  algebraProblems,
  geometryProblems,
  wordProblems,
  multiStepProblems,
} from '../../../../fixtures/problems';

describe('All Problem Types - Socratic Compliance', () => {
  const runner = new ScenarioRunner();

  const problemTypes = [
    { name: 'arithmetic', problems: arithmeticProblems },
    { name: 'algebra', problems: algebraProblems },
    { name: 'geometry', problems: geometryProblems },
    { name: 'word problems', problems: wordProblems },
    { name: 'multi-step', problems: multiStepProblems },
  ];

  problemTypes.forEach(({ name, problems }) => {
    describe(`${name} problems`, () => {
      Object.entries(problems).forEach(([problemName, problem]) => {
        it(`maintains Socratic compliance for ${problemName}`, async () => {
          const result = await runner.runProblemScenario(problem, {
            mustNotContain: ['the answer is', 'equals', 'the solution is'],
            validateAnswerDetection: true,
          });

          expect(result.success).toBe(true);
          expect(result.socraticCompliance).toBe(100);
          expect(result.answerDetected).toBe(false);
        });
      });
    });
  });
});
```
