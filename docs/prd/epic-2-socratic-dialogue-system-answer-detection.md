# Epic 2: Socratic Dialogue System & Answer Detection

This epic implements the core pedagogical functionality that enables students to engage in guided problem-solving through Socratic questioning. The system uses an LLM-based dialogue system to generate guiding questions that break down problems through progressive disclosure and chain-of-thought strategies, with enforced answer detection guardrails ensuring no direct answers are provided. A two-tier guardrail system combines keyword-based pattern matching to detect common answer patterns (e.g., "the answer is", "equals", numeric results) and LLM-based validation to analyze response context and detect implicit answers that keyword matching might miss. The system maintains conversation context by storing and referencing the last 10 messages within a single browser session, enabling coherent dialogue across multiple turns. Progressive help escalation provides more concrete hints when students appear stuck (after 2+ turns without progress), while maintaining Socratic principles and never abandoning the student. The chat interface is fully functional, displaying student inputs and system responses with proper message formatting, maintaining conversation context and adapting to student responses throughout the problem-solving journey.

### Story 2.1: LLM Integration Backend Service

As a developer,
I want to integrate an LLM API (OpenAI GPT-4, Claude, or similar) for generating Socratic dialogue,
so that the system can generate guiding questions that help students discover solutions.

#### Acceptance Criteria

1: A backend service module is created for LLM API integration (e.g., `llmService.ts`) in TypeScript that handles API calls to the LLM service (OpenAI GPT-4, Claude, or similar).

2: The LLM service is configured with appropriate API keys stored securely in environment variables, never exposed in client-side code.

3: The service includes a function for generating Socratic dialogue responses with appropriate prompts that instruct the LLM to:

- Generate guiding questions, not direct answers
- Use progressive disclosure and chain-of-thought strategies
- Break down problems appropriately
- Adapt to student understanding level

4: The service handles API rate limits gracefully, implementing retry logic or queuing when rate limits are reached.

5: Error handling is implemented for LLM API failures (network errors, API errors, timeouts) with appropriate error messages.

6: The service includes response time monitoring to ensure responses are generated within 3 seconds when possible.

7: The service is structured to support different LLM providers (OpenAI, Claude, etc.) with provider-specific configuration.

8: API requests include appropriate parameters (temperature, max tokens, etc.) optimized for Socratic dialogue generation.

### Story 2.2: Socratic Dialogue Generation Endpoint

As a student,
I want to receive Socratic guiding questions when I submit my problem,
so that I can start working through the solution with guided questions.

#### Acceptance Criteria

1: A backend API endpoint (e.g., POST /api/chat/message) accepts student messages and generates Socratic dialogue responses using the LLM service.

2: The endpoint accepts the current problem statement and student message as input, along with conversation context (last 10 messages if available).

3: The LLM prompt includes:

- The current problem statement
- The problem type (arithmetic, algebra, geometry, word problems, multi-step)
- Conversation history (last 10 messages)
- Instructions to generate Socratic guiding questions, never direct answers
- Instructions to use progressive disclosure and chain-of-thought strategies

4: The endpoint returns the generated Socratic dialogue response to the frontend.

5: Error handling is implemented for LLM API failures, returning appropriate error messages to the frontend.

6: The endpoint handles empty or invalid student messages gracefully, prompting for clarification.

7: The response includes metadata indicating whether the response is a question, hint, or encouragement (for visual feedback purposes).

8: The endpoint validates that the problem statement exists before generating dialogue (returns error if no problem is set).

### Story 2.3: Keyword-Based Answer Detection Guardrail

As a student,
I want the system to never give me direct answers,
so that I can learn through guided discovery rather than answer-getting.

#### Acceptance Criteria

1: A backend service module is created for keyword-based answer detection (e.g., `answerDetectionService.ts`) in TypeScript that scans LLM responses for common answer patterns.

2: The keyword-based detection identifies patterns such as:

- "the answer is", "the solution is", "equals", "is equal to"
- Numeric results at the end of responses (e.g., "42", "x = 5")
- Direct answer phrases (e.g., "so the answer would be", "therefore the answer is")

3: The detection logic uses regex or pattern matching to identify these patterns in LLM responses.

4: When a direct answer pattern is detected, the service flags the response for blocking or rewriting.

5: The service returns a detection result indicating whether the response contains direct answers, along with the detected patterns.

6: The detection is applied to all LLM-generated responses before they are returned to the frontend.

7: The service includes unit tests validating detection of common answer patterns across different problem types.

8: The detection logic is configurable, allowing for easy addition of new patterns as edge cases are discovered.

### Story 2.4: LLM-Based Answer Detection Guardrail

As a student,
I want the system to detect implicit answers that keyword matching might miss,
so that the Socratic principles are maintained even when answers are phrased subtly.

#### Acceptance Criteria

1: A backend service module is created for LLM-based answer validation (e.g., `answerValidationService.ts`) in TypeScript that uses a secondary LLM call to analyze response context.

2: The validation service sends the LLM-generated response to a secondary LLM call with a prompt asking:

- "Does this response contain a direct answer to the math problem?"
- "Would this response give away the solution without requiring student thinking?"

3: The secondary LLM call analyzes the response context and returns a validation result (contains answer / does not contain answer).

4: When the validation detects an implicit answer, the service flags the response for blocking or rewriting.

5: The validation is applied to all LLM-generated responses after keyword-based detection, providing a second layer of protection.

6: The validation service includes error handling for secondary LLM API failures, defaulting to blocking uncertain responses when validation cannot be performed.

7: The service returns a validation result indicating whether the response contains implicit answers, along with confidence level if available.

8: The validation is optimized for response time, using efficient prompts and parameters to minimize additional latency.

### Story 2.5: Answer Blocking & Response Rewriting

As a student,
I want the system to rewrite or block responses that contain direct answers,
so that I never receive direct answers even if the guardrails detect them.

#### Acceptance Criteria

1: A backend service module combines keyword-based detection and LLM-based validation to determine if a response contains direct answers.

2: When a response is flagged for containing direct answers (by either detection method), the system:

- Blocks the response from being sent to the frontend
- Generates a replacement response that maintains Socratic principles (asks a guiding question instead)
- Logs the blocked response for monitoring and improvement

3: The replacement response is generated using the LLM service with a prompt instructing it to:

- Rewrite the response as a guiding question
- Maintain the same pedagogical intent without giving away the answer
- Use Socratic questioning techniques

4: The system handles cases where rewriting fails (e.g., LLM API error) by returning a generic Socratic question (e.g., "Let's think about this step by step. What do you think we should consider first?").

5: The blocking and rewriting logic is applied to all LLM-generated responses before they are returned to the frontend.

6: The system maintains 100% adherence to Socratic principles, never sending direct answers to the frontend.

7: The blocking and rewriting process is logged for monitoring and improvement, tracking detection rates and rewriting quality.

8: The system handles edge cases gracefully (e.g., responses that are borderline, ambiguous responses) by defaulting to blocking when uncertain.

### Story 2.6: Context Management Service

As a student,
I want the system to remember our conversation history,
so that the tutor can provide coherent, contextually relevant guidance.

#### Acceptance Criteria

1: A backend service module is created for context management (e.g., `contextService.ts`) in TypeScript that stores and retrieves conversation context.

2: The context management service stores the last 10 messages (user inputs and system responses) for each session, using session identifiers.

3: The service uses AWS ElastiCache (Redis) or DynamoDB for session storage, with session data persisting only within the browser session (no persistence beyond session).

4: The service includes functions to:

- Add a new message to the context (user input or system response)
- Retrieve the last 10 messages for a session
- Clear context when a new problem is started

5: The context is retrieved and included in LLM prompts for dialogue generation, ensuring coherent conversation flow.

6: The service handles session expiration gracefully (e.g., after 30 minutes of inactivity), clearing context when sessions expire.

7: The context management is integrated with the dialogue generation endpoint, automatically including conversation history in LLM prompts.

8: The service includes error handling for storage failures, defaulting to empty context when storage is unavailable (with graceful degradation).

### Story 2.7: Chat UI Component

As a student,
I want to see my conversation with the tutor in a chat interface,
so that I can follow our dialogue and see my progress.

#### Acceptance Criteria

1: A chat UI component is created in the React frontend that displays the conversation in the right panel of the side-by-side layout.

2: The chat component displays messages in a conversation format, with user messages and system responses clearly distinguished (different styling, alignment, or icons).

3: The chat component includes:

- A message list displaying all messages in chronological order
- A message input field at the bottom for students to type responses
- A send button to submit messages

4: The chat component handles message submission, sending student messages to the backend API endpoint (POST /api/chat/message).

5: The chat component displays system responses as they are received, with loading indicators while waiting for LLM responses.

6: The chat component automatically scrolls to show the latest messages when new messages are added.

7: The chat component handles long messages appropriately (wrapping text, maintaining readability, scrolling if needed).

8: The chat component is accessible via keyboard navigation and supports standard input behaviors (select, copy, paste).

9: The chat component is responsive and works effectively on desktop, tablet, and mobile browsers.

10: The chat component displays error messages appropriately when API calls fail, with clear, age-appropriate error messages.

### Story 2.8: Progressive Help Escalation Logic

As a student,
I want the system to provide more concrete hints when I'm stuck,
so that I can make progress without receiving direct answers.

#### Acceptance Criteria

1: A backend service module is created for progressive help escalation (e.g., `helpEscalationService.ts`) in TypeScript that tracks student progress and escalates help when needed.

2: The escalation service tracks the number of turns without progress for each problem (e.g., consecutive incorrect or unclear responses).

3: When a student has been stuck for 2+ turns without progress, the system escalates help by:

- Providing more concrete hints in the LLM prompt
- Instructing the LLM to offer more specific guidance
- Maintaining Socratic principles (still asking questions, not giving direct answers)

4: The escalation logic is integrated with the dialogue generation endpoint, automatically adjusting LLM prompts based on student progress.

5: The escalation service resets progress tracking when a student makes progress (e.g., correct response, clearer understanding).

6: The escalation service maintains a history of help levels for each problem, ensuring help escalates appropriately without repeating the same hints.

7: The escalation logic is configurable, allowing for adjustment of thresholds (e.g., 2 turns, 3 turns) based on testing and feedback.

8: The escalation service includes logging for monitoring and improvement, tracking escalation rates and student progress patterns.
