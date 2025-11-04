# Epic 1: Foundation & Problem Input System

This epic establishes the foundational project infrastructure—monorepo structure, Git repository, basic CI/CD pipeline, React frontend application, Node.js/Express backend API, and AWS infrastructure configuration—while delivering core problem input functionality. Students can input math problems via text entry or image upload, with Vision API integration parsing printed text from images, problem validation ensuring submitted content is a valid math problem, and basic problem display showing the current problem on the left side of the interface. This epic enables students to start interacting with the system by submitting problems, even before Socratic dialogue is implemented, providing immediate value while establishing the technical foundation for subsequent epics.

### Story 1.1: Foundation & Project Setup

As a developer,
I want to establish the foundational project structure with monorepo setup, Git repository, basic CI/CD configuration, and a working "canary" page,
so that the project has a solid foundation with version control, automated workflows, and a deployable initial page that validates the infrastructure is working.

#### Acceptance Criteria

1: The project uses a monorepo structure with separate directories for frontend and backend code, with shared configuration files (package.json, tsconfig.json, etc.) at the root level. All code must be written in TypeScript (no raw JavaScript), with TypeScript configuration files (tsconfig.json) properly configured for both frontend and backend.

2: The Git repository is initialized with appropriate .gitignore files (excluding node_modules, build artifacts, API keys, environment variables, compiled JavaScript files). TypeScript source files (`.ts`, `.tsx`) are tracked, but compiled JavaScript output is excluded.

3: A basic CI/CD pipeline is configured (GitHub Actions, GitLab CI, or similar) that runs TypeScript linting (ESLint with TypeScript support) and builds on pull requests, with deployment configured for main branch. All TypeScript code must pass linting checks before merging.

4: A working "canary" page is deployed and accessible, displaying a simple message confirming the application is running (e.g., "AI Math Tutor - Application is Live").

5: The canary page demonstrates successful deployment of frontend static assets (S3 + CloudFront, or AWS Amplify, or alternative hosting).

6: Environment variable management is configured for API keys and configuration (never committed to repository).

### Story 1.2: React Frontend Shell with Side-by-Side Layout

As a student,
I want to see a clean interface with a side-by-side layout (problem on left, chat on right),
so that I can reference the problem while engaging in dialogue.

#### Acceptance Criteria

1: A React application is initialized with TypeScript (using `.tsx` extensions for React components), functional components and React Hooks for state management, using the latest stable React version. All code must be written in TypeScript (no raw JavaScript).

2: Tailwind CSS v4.1.16 is installed and configured with appropriate Tailwind configuration for the project.

3: The main interface displays a side-by-side layout with two primary panels: left panel for problem display, right panel for chat conversation (currently empty).

4: The layout is responsive and works on desktop, tablet, and mobile browsers (responsive breakpoints implemented with Tailwind CSS).

5: The interface uses age-appropriate styling appropriate for 6th grade students (clean, colorful but not overwhelming, friendly visual elements).

6: The left panel has a header or title area indicating "Problem" or similar, with space for displaying the problem statement.

7: The right panel has a header or title area indicating "Chat" or similar, with space for displaying conversation messages.

8: The layout maintains proper spacing and visual hierarchy using Tailwind CSS utility classes.

### Story 1.3: Node.js/Express Backend API Structure

As a developer,
I want to establish a Node.js/Express backend API structure with basic endpoints and middleware,
so that the backend can handle API requests from the frontend and integrate with external services.

#### Acceptance Criteria

1: A Node.js/Express backend application is initialized with TypeScript, using appropriate project structure (routes, controllers, services, middleware). All code must be written in TypeScript (no raw JavaScript).

2: Express middleware is configured for CORS (allowing frontend requests), JSON body parsing, and error handling.

3: A health check endpoint (e.g., GET /api/health) returns a success response confirming the API is running.

4: Environment variable management is configured for API keys (Vision API, LLM API) and configuration.

5: The backend is structured to support serverless deployment (AWS Lambda) or containerized deployment (ECS/Fargate), with appropriate configuration files.

6: Basic error handling middleware is implemented to catch and format errors appropriately.

7: API routes are organized in a modular structure (e.g., /api/problem, /api/chat, etc.) ready for implementation in subsequent stories.

### Story 1.4: Text Input for Math Problems

As a student,
I want to input math problems by typing or pasting text into the interface,
so that I can submit problems for the tutor to help me solve.

#### Acceptance Criteria

1: A text input field is displayed in the left panel (or above the side-by-side layout) with a clear label indicating "Enter Math Problem" or similar.

2: Students can type or paste problem statements into the text input field.

3: A "Submit" or "Start" button is available next to the input field to submit the problem.

4: When a problem is submitted, the text input is validated to ensure it contains text (not empty).

5: The submitted problem is displayed in the left panel (problem display area) after submission.

6: The text input field is cleared after successful submission, ready for a new problem (if needed).

7: Error handling is implemented for invalid input (empty input shows appropriate error message).

8: The input field is accessible via keyboard navigation and supports standard input behaviors (select, copy, paste).

### Story 1.5: Image Upload UI Component

As a student,
I want to upload images containing printed math problems,
so that I can submit problems without typing them manually.

#### Acceptance Criteria

1: An image upload button or drag-and-drop zone is displayed in the interface (near the text input field or in the left panel).

2: Students can click the upload button to select an image file from their device, or drag-and-drop an image file onto the upload zone.

3: Supported image formats are clearly indicated (e.g., "JPG, PNG, GIF" or similar) with appropriate validation.

4: When an image is selected, visual feedback is provided (e.g., image preview, loading indicator, file name display).

5: The image file is validated for size limits (e.g., max 10MB) and format (JPG, PNG, GIF) before upload.

6: Error handling is implemented for invalid files (wrong format, too large, etc.) with clear, age-appropriate error messages.

7: The upload button/zone is accessible via keyboard navigation and supports standard file input behaviors.

8: After successful image selection, the image is ready for processing (displayed in preview or queued for Vision API parsing).

### Story 1.6: Vision API Integration Backend Endpoint

As a student,
I want my uploaded images to be parsed to extract the math problem text,
so that the system can understand the problem from the image.

#### Acceptance Criteria

1: A backend API endpoint (e.g., POST /api/problem/parse-image) accepts image file uploads and processes them using Vision API (OpenAI Vision, Google Vision, or similar).

2: The endpoint validates the uploaded image file (format, size) before sending to Vision API.

3: The Vision API integration extracts printed text from the uploaded image, returning the problem statement as text.

4: The extracted problem text is returned to the frontend in the API response.

5: Error handling is implemented for Vision API failures (network errors, API errors, parsing failures) with clear error messages returned to the frontend.

6: The endpoint handles API rate limits gracefully, returning appropriate error messages when rate limits are reached.

7: API keys for Vision API are stored securely in environment variables and never exposed in client-side code.

8: The extracted problem text is validated to ensure it contains mathematical content (not empty, contains math-related keywords or notation).

### Story 1.7: Problem Validation & Type Identification

As a student,
I want the system to validate that my input is a valid math problem and identify its type,
so that the tutor can guide me appropriately.

#### Acceptance Criteria

1: A backend API endpoint (e.g., POST /api/problem/validate) accepts problem text (from text input or Vision API parsing) and validates it is a valid math problem.

2: The validation logic uses LLM API (OpenAI GPT-4, Claude, or similar) to analyze the problem text and confirm it is a mathematical problem (not unrelated text).

3: The system identifies the problem type from five supported categories: arithmetic, algebra, geometry, word problems, or multi-step problems.

4: The validation response includes: (1) validation status (valid/invalid), (2) problem type (if valid), (3) cleaned problem statement (if needed).

5: Error handling is implemented for invalid problems (non-math content, unclear problems) with clear, age-appropriate error messages returned to the frontend.

6: The LLM API integration is configured with appropriate prompts for problem validation and type identification.

7: API keys for LLM API are stored securely in environment variables and never exposed in client-side code.

8: The validation endpoint handles API rate limits gracefully, returning appropriate error messages when rate limits are reached.

### Story 1.8: Problem Display Component

As a student,
I want to see my submitted problem displayed clearly on the left side of the interface,
so that I can reference it while working through the solution.

#### Acceptance Criteria

1: The problem display component shows the submitted problem statement in the left panel of the side-by-side layout.

2: The problem text is displayed with clear typography and appropriate spacing, readable for 6th grade students.

3: The problem type is displayed (e.g., "Arithmetic" or "Algebra") as a label or badge near the problem statement.

4: The problem display persists throughout the session until a new problem is submitted (or session is reset).

5: The problem display area is visually distinct from the chat area, maintaining clear visual hierarchy.

6: The component handles long problem statements appropriately (wrapping text, scrolling if needed, maintaining readability).

7: The problem display is accessible via keyboard navigation and screen readers (appropriate ARIA labels).

8: The component is responsive and works effectively on desktop, tablet, and mobile browsers.

### Story 1.9: Developer Testing Interface

As a developer,
I want a streamlined testing interface that allows me to easily test different problem types, scenarios, and edge cases,
so that I can efficiently validate system behavior and ensure Socratic compliance across all problem types.

#### Acceptance Criteria

1: A developer testing interface is accessible only in development environment (hidden in production builds), accessible via `NODE_ENV=development` or a development mode flag.

2: The testing interface provides a test problem library with pre-configured test problems organized by problem type (arithmetic, algebra, geometry, word problems, multi-step), with at least 10 test problems per problem type (50+ total scenarios).

3: Developers can load test problems with one click from the test problem library, automatically populating the problem input and starting a test session.

4: The testing interface includes a scenario testing panel that allows developers to test specific scenarios including:

- Answer detection validation (direct answers, implicit answers)
- Progressive help escalation (testing help escalation after stuck turns)
- Context management (testing conversation coherence across 10+ messages)
- Error handling scenarios (Vision API failures, LLM API failures, rate limits)

5: Real-time testing indicators display during testing, showing:

- Answer detection status (keyword detection, LLM validation results)
- Socratic compliance validation (pass/fail status)
- Context management status (session state, message history)
- Help escalation level (current help level, escalation triggers)

6: The testing interface provides quick access to edge case scenarios including:

- Direct answer detection patterns ("the answer is", "equals", numeric results)
- Implicit answer detection patterns (subtle answer phrasings)
- Boundary conditions (empty inputs, invalid problems, session expiration)
- Error scenarios (API failures, network errors, timeout errors)

7: A test results dashboard displays visual summary of test results including:

- Pass/fail status for each test scenario
- Socratic compliance percentage (100% required)
- Answer detection accuracy (keyword detection rate, LLM validation rate)
- Context management validation (message retention, session state)

8: The testing interface supports batch testing, allowing developers to run multiple test scenarios in sequence or parallel, with automated test execution and results reporting.

9: Test utilities and fixtures are provided programmatically, enabling developers to write automated tests for different problem types, answer detection scenarios, and edge cases.

10: The testing interface is designed for efficiency, allowing developers to run comprehensive test suites for all problem types in under 5 minutes.

11: The testing interface is hidden in production builds and cannot be accessed by end users, ensuring security and privacy.

12: The testing interface integrates with the existing test suite, allowing developers to run both manual and automated tests from the same interface.
