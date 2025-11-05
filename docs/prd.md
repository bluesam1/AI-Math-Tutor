# AI Math Tutor Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Students successfully solve math problems independently through guided Socratic questioning without receiving direct answers
- System maintains 100% adherence to Socratic principles through enforced answer detection guardrails
- 6th grade students (ages 11-12) receive age-appropriate visual feedback and encouragement throughout their problem-solving journey
- System reliably parses math problems from both text input and image uploads (printed text) across 5 problem types: arithmetic, algebra, geometry, word problems, and multi-step problems
- Students experience adaptive scaffolding that adjusts to their understanding level through progressive help escalation
- System maintains coherent conversation context across multiple turns (10+ message exchanges)
- Students feel encouraged and supported, building confidence in their mathematical thinking skills
- System provides intuitive, responsive interface with side-by-side layout (problem left, chat right) optimized for 6th grade students
- Technical implementation demonstrates reliable problem parsing, context management, and pedagogical quality without direct answers

### Background Context

AI Math Tutor addresses a critical gap in math education resources. Students often struggle with math problems and need personalized guidance, but traditional resources like textbooks and videos either give away answers too quickly (reducing learning value) or lack the interactive, adaptive nature needed for effective learning. Existing AI chatbots frequently violate Socratic teaching principles by providing direct answers, while human tutors are expensive and not always available.

This application solves this problem by providing a patient, adaptive AI tutor that never gives direct answers but guides students through Socratic questioning to discover solutions themselves. The system uses Vision APIs to parse problems from images, employs an LLM-based dialogue system with enforced answer detection guardrails (combining keyword-based pattern matching and LLM-based validation), and provides prominent visual feedback appropriate for 6th grade students (ages 11-12). The solution adapts Khan Academy techniques in an automated way, breaking down problems through progressive disclosure and chain-of-thought strategies to help students discover solutions while maintaining visual engagement and clear progress indicators.

**Scope Focus: 6th Grade Math**
The system is specifically designed for 6th grade mathematics, focusing on core 6th grade math topics including: operations with fractions and decimals, ratios and proportions, integers and absolute value, introductory algebraic expressions, basic geometry (area, perimeter, volume), statistical thinking, and multi-step word problems. This focused scope allows for optimized pedagogical approaches and age-appropriate language and visual feedback for 11-12 year old students.

### Change Log

| Date       | Version | Description                                                                                         | Author |
| ---------- | ------- | --------------------------------------------------------------------------------------------------- | ------ |
| 2025-11-03 | 1.0     | Initial PRD created from Project Brief                                                              | PM     |
| 2025-01-XX | 1.1     | Scope refined to focus on 6th grade math specifically                                               | PM     |
| 2025-01-XX | 1.2     | Added requirements for streamlined testing workflows and developer testing interface                | PM     |
| 2025-11-04 | 1.3     | Migrated from AWS (Lambda, S3, CloudFront, ElastiCache) to Firebase (Functions, Hosting, Firestore) | PM     |

## Requirements

### Functional

FR1: The system must accept math problems via text input, allowing users to type or paste problem statements directly into the interface.

FR2: The system must accept math problems via image upload, allowing users to upload images containing printed math problems (handwritten text is out of scope for MVP).

FR3: The system must use Vision APIs (OpenAI Vision, Google Vision, or similar) to parse printed text from uploaded images and extract mathematical problem statements.

FR4: The system must validate that submitted input (text or parsed from image) is a valid math problem before proceeding with Socratic dialogue.

FR5: The system must identify the problem type from five supported categories: arithmetic, algebra, geometry, word problems, and multi-step problems.

FR6: The system must generate Socratic guiding questions using an LLM-based dialogue system that breaks down problems through progressive disclosure and chain-of-thought strategies, never providing direct answers.

FR7: The system must employ answer detection guardrails using a two-tier approach: (1) keyword-based pattern matching to detect common answer patterns (e.g., "the answer is", "equals", numeric results), and (2) LLM-based validation to analyze response context and detect implicit answers that keyword matching might miss.

FR8: The system must prevent any response containing direct answers from being displayed to the user, rewriting or blocking such responses before delivery.

FR9: The system must maintain conversation context by storing and referencing the last 10 messages (user inputs and system responses) within a single browser session.

FR10: The system must provide progressive help escalation, offering more concrete hints when students appear stuck (after 2+ turns without progress), while maintaining Socratic principles and never abandoning the student.

FR11: The system must validate student responses and provide positive redirection for incorrect answers, encouraging continued thinking without revealing the correct answer.

FR12: The system must automatically render mathematical equations and formulas using LaTeX/KaTeX rendering in both problem statements and dialogue responses.

FR13: The system must display the current problem on the left side of the interface and the chat conversation on the right side in a side-by-side layout.

FR14: The system must provide prominent, interactive visual feedback appropriate for 6th grade students (ages 11-12), including progress indicators, encouraging responses, and age-appropriate visual elements.

FR15: The system must handle arithmetic problems (addition, subtraction, multiplication, division, combinations) through Socratic questioning.

FR16: The system must handle algebra problems (solving equations, working with variables, algebraic expressions) through Socratic questioning.

FR17: The system must handle geometry problems (shapes, area, perimeter, angles, geometric relationships) through Socratic questioning.

FR18: The system must handle word problems (story problems requiring mathematical reasoning) through Socratic questioning.

FR19: The system must handle multi-step problems (problems requiring multiple sequential operations) through Socratic questioning.

FR20: The system must gracefully handle errors when Vision API fails to parse an image, providing clear error messages and fallback to text input.

FR21: The system must handle cases where the LLM returns inappropriate responses, implementing error handling and response validation.

FR22: The system must provide streamlined testing workflows that enable rapid testing of different problem types (arithmetic, algebra, geometry, word problems, multi-step) through automated test suites and test fixtures.

FR23: The system must provide a developer testing interface (development environment only) that allows developers to easily test different scenarios, problem types, and edge cases without requiring manual problem input.

FR24: The developer testing interface must include quick access to test problem fixtures for all 5 problem types, allowing developers to load pre-configured test problems with one click.

FR25: The developer testing interface must support testing edge cases including: direct answer detection scenarios, implicit answer detection, progressive help escalation, context management across multiple turns, and error handling scenarios.

FR26: The developer testing interface must provide visual indicators showing test results, answer detection status, Socratic compliance validation, and context management status in real-time during testing.

FR27: The system must provide test utilities and fixtures that make it easy to test different problem types, answer detection scenarios, and edge cases programmatically.

### Non Functional

NFR1: The system must respond to user inputs within 3 seconds for LLM-generated responses to maintain engaging conversation flow.

NFR2: The system must provide smooth, responsive visual feedback interactions without noticeable lag or delays.

NFR3: The system must efficiently process image uploads through Vision API integration, handling image preprocessing and parsing within acceptable time limits.

NFR4: The system must maintain 100% adherence to Socratic principles, never providing direct answers as verified through testing across all 5 problem types.

NFR5: The system must maintain conversation context coherence for at least 10 message exchanges, ensuring dialogue remains contextually relevant.

NFR6: The system must support modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript enabled, ensuring cross-browser compatibility.

NFR7: The system must implement responsive design that works effectively on desktop, tablet, and mobile browsers.

NFR8: The system must handle API rate limits gracefully, implementing appropriate error handling and user feedback when rate limits are reached.

NFR9: The system must implement input sanitization for all text inputs to prevent security vulnerabilities.

NFR10: The system must manage API keys securely without exposing them in client-side code or public repositories.

NFR11: The system must maintain session data only within the browser session (no persistence to external storage), ensuring privacy for anonymous users.

NFR12: The system must be designed to minimize API costs where possible, implementing caching strategies when appropriate without compromising functionality.

NFR13: The system must provide clear, age-appropriate error messages for 6th grade students when technical errors occur.

NFR14: The system must ensure visual feedback elements are accessible and engaging for 6th grade students (ages 11-12).

NFR15: The system must maintain system reliability and uptime appropriate for an MVP deployment, handling API failures gracefully with user-friendly error messages.

NFR16: All source code must be written in TypeScript (no raw JavaScript). All files must use `.ts` or `.tsx` extensions. ESLint with TypeScript support must be configured, and all code must pass linting checks before deployment.

NFR17: The system must support streamlined testing workflows that enable developers to run comprehensive test suites for all problem types in under 5 minutes, including automated answer detection validation.

NFR18: The developer testing interface must be accessible only in development environment (disabled in production), ensuring no testing tools are exposed to end users.

NFR19: The system must provide test fixtures for at least 10 different problem scenarios per problem type (50+ total scenarios), covering common cases and edge cases for comprehensive testing.

NFR20: The developer testing interface must allow developers to test answer detection guardrails with various response patterns (explicit answers, implicit answers, edge cases) with immediate visual feedback.

## User Interface Design Goals

### Overall UX Vision

The AI Math Tutor interface should feel like working with a patient, encouraging human tutor who never gives away answers but guides students through discovery. The experience should be visually engaging for 6th grade students (ages 11-12), with prominent progress indicators, encouraging feedback, and a clean, distraction-free layout that keeps the problem visible while facilitating dialogue. The side-by-side layout (problem left, chat right) creates a natural learning environment where students can reference the problem while engaging in Socratic dialogue. Visual feedback should be immediate, positive, and age-appropriate for 11-12 year olds, using colors, icons, and simple animations to celebrate progress and encourage continued thinking.

### Key Interaction Paradigms

**Side-by-Side Learning Layout:** The problem remains permanently visible on the left side, while the chat conversation unfolds on the right, allowing students to reference the problem context throughout their problem-solving journey.

**Progressive Disclosure:** The interface supports the Socratic method by revealing information progressively—students see guiding questions first, with hints becoming more concrete only after multiple attempts, visually represented through progressive help indicators.

**Visual Feedback System:** Prominent, immediate visual feedback accompanies every interaction—encouraging messages, progress indicators, and age-appropriate visual elements (emojis, colors, simple animations) that celebrate small wins and maintain engagement.

**Responsive Input Methods:** Students can input problems via text (typing or pasting) or image upload (drag-and-drop or file selection), with clear visual feedback during image processing.

**Contextual Math Rendering:** Mathematical equations and formulas render automatically using LaTeX/KaTeX, ensuring proper mathematical notation appears in both problem statements and dialogue responses.

**Error Recovery:** Clear, age-appropriate error messages guide students when technical issues occur (e.g., image parsing failure, API errors), with fallback options (e.g., text input when image fails) always available.

### Core Screens and Views

**Main Problem-Solving Interface:** The primary screen displaying the side-by-side layout with the problem on the left and chat conversation on the right. This view supports both problem input (text field and image upload button) and ongoing dialogue, with visual feedback elements (progress indicators, encouraging messages) prominently displayed.

**Problem Input View:** The interface state when a student first arrives or wants to start a new problem, featuring a text input field and an image upload button/drop zone, with clear instructions on how to input problems.

**Chat Conversation View:** The right-side panel displaying the Socratic dialogue, with message bubbles showing student inputs and system responses, math rendering for equations, and visual feedback indicators (encouragement, progress, hints).

**Visual Feedback Elements:** Throughout the interface, prominent visual indicators show progress, encouragement, and helpful hints, designed to be age-appropriate for 6th grade students (colors, simple icons, brief animations).

**Developer Testing Interface (Development Environment Only):** A specialized testing interface accessible only in development environment that enables developers to efficiently test different problem types, scenarios, and edge cases. The interface includes:

- **Test Problem Library:** Quick access to pre-configured test problems organized by problem type (arithmetic, algebra, geometry, word problems, multi-step), with one-click loading of test fixtures
- **Scenario Testing Panel:** Interface for testing specific scenarios including: answer detection validation, progressive help escalation, context management across multiple turns, and error handling
- **Real-Time Testing Indicators:** Visual indicators showing test results, answer detection status (keyword detection, LLM validation), Socratic compliance validation, context management status, and help escalation level
- **Edge Case Testing:** Quick access to edge case scenarios including direct answer detection, implicit answer detection, boundary conditions, and error scenarios
- **Test Results Dashboard:** Visual summary of test results showing pass/fail status, Socratic compliance percentage, answer detection accuracy, and context management validation
- **Batch Testing:** Ability to run multiple test scenarios in sequence or parallel, with automated test execution and results reporting

The developer testing interface is hidden in production builds and only accessible when `NODE_ENV=development` or via a special development mode flag. The interface is designed to be intuitive and efficient, allowing developers to quickly test different problem types and scenarios without manual setup.

### Accessibility: WCAG AA

The system must meet WCAG AA standards for accessibility, ensuring:

- Color contrast ratios meet WCAG AA requirements (4.5:1 for normal text, 3:1 for large text)
- Keyboard navigation support for all interactive elements
- Screen reader compatibility for problem statements and dialogue responses
- Alternative text for images and visual elements where appropriate
- Focus indicators for keyboard navigation
- Age-appropriate accessibility features that support students with different learning needs

### Branding

The interface should maintain a clean, educational aesthetic appropriate for 6th grade students. Visual elements should be:

- **Colorful but not overwhelming:** Use a primary color palette that is engaging but not distracting, with clear visual hierarchy
- **Friendly and encouraging:** Visual feedback should feel warm and supportive, using age-appropriate icons, emojis, and simple animations
- **Mathematically focused:** The design should emphasize mathematical content (equations, formulas) with proper rendering and clear typography
- **Minimalist core:** Clean layout with plenty of white space, keeping the focus on the problem and dialogue without unnecessary visual clutter

No specific brand guidelines or style guides are provided; the design should prioritize clarity, engagement, and educational effectiveness for the target age group.

### Target Device and Platforms: Web Responsive

The system must work effectively across:

- **Desktop browsers:** Full side-by-side layout with optimal screen real estate
- **Tablet browsers:** Responsive layout that adapts to tablet screens while maintaining usability
- **Mobile browsers:** Mobile-optimized layout that may stack vertically or adjust the side-by-side layout for smaller screens while maintaining core functionality

The responsive design should ensure that all core features (text input, image upload, chat dialogue, math rendering, visual feedback) work seamlessly across all device types, with touch-friendly interactions for mobile and tablet devices.

## Technical Assumptions

### Repository Structure: Monorepo

The project will use a monorepo structure combining frontend and backend code in a single repository. This approach:

- Simplifies development workflow with shared code and dependencies
- Enables easier context management across frontend and backend
- Supports streamlined deployment and testing processes
- Allows for shared TypeScript types and utilities between frontend and backend
- Enforces TypeScript-only development (no raw JavaScript) with proper type safety across the entire codebase

**Rationale:** For an MVP with tight integration between frontend and backend, a monorepo provides better developer experience and easier maintenance than separate repositories. TypeScript-only development ensures type safety, reduces errors, and improves code maintainability across the entire project.

### Service Architecture

The system will use a **serverless architecture** with Firebase Cloud Functions for backend API endpoints, paired with a React frontend deployed as static assets. This architecture:

- **Frontend:** React application built with component-based UI architecture, deployed as static assets to Firebase Hosting with global CDN distribution
- **Backend:** Node.js/Express-based API endpoints deployed as Firebase Cloud Functions (serverless) with Express app integration
- **Session Storage:** Firestore for session management (last 10 messages) with TTL policies for automatic cleanup
- **API Routing:** Firebase Hosting rewrites for API routing, connecting frontend requests to Cloud Functions
- **Image Processing:** Vision API calls (OpenAI Vision, Google Vision, or similar) handled through backend Cloud Functions
- **LLM Integration:** LLM API calls (OpenAI GPT-4, Claude, or similar) handled through backend Cloud Functions with answer detection guardrails

**Rationale:** Serverless architecture provides scalability, cost-effectiveness for MVP, and simplified deployment. Firebase provides integrated hosting, functions, and database services with a unified deployment workflow. The separation of frontend (static) and backend (API) allows for independent scaling and deployment.

### Testing Requirements: Unit + Integration

The system will implement:

- **Unit Tests:** Component-level testing for React components, function-level testing for backend logic (answer detection guardrails, context management, problem parsing)
- **Integration Tests:** API endpoint testing (end-to-end API calls), Vision API integration testing, LLM integration testing with guardrail validation
- **Manual Testing:** Convenience methods for manual testing of Socratic dialogue quality, visual feedback effectiveness, and cross-browser compatibility

**Rationale:** Unit + Integration testing ensures core functionality works correctly while allowing for manual testing of pedagogical quality and user experience. Full E2E testing is deferred to post-MVP to focus on core functionality.

### Additional Technical Assumptions and Requests

**Frontend Framework:** React with TypeScript (latest stable version) for component-based UI with side-by-side layout, using functional components and React Hooks for state management. All frontend code must be written in TypeScript (`.tsx` for React components, `.ts` for utilities).

**Styling:** Tailwind CSS v4.1.16 (latest version as of October 2025) for utility-first styling, ensuring modern, responsive design with consistent design tokens.

**Backend Framework:** Node.js with Express and TypeScript for API endpoints handling LLM integration, Vision API calls, and answer detection guardrails. All backend code must be written in TypeScript (`.ts` extensions).

**Math Rendering:** LaTeX/KaTeX library integration for automatic rendering of mathematical equations and formulas in both problem statements and dialogue responses.

**Vision API:** OpenAI Vision API, Google Vision API, or similar service for parsing printed text from uploaded images (handwritten text deferred to post-MVP).

**LLM API:** OpenAI GPT-4, Claude, or similar LLM service for problem understanding and Socratic dialogue generation, with chain-of-thought and progressive disclosure strategies.

**Answer Detection Guardrails:** Two-tier approach:

1. **Keyword-based pattern matching:** Detects common answer patterns (e.g., "the answer is", "equals", numeric results at end of responses)
2. **LLM-based validation:** Uses a secondary LLM call to analyze response context and detect implicit answers that keyword matching might miss

**Context Management:** Session storage (last 10 messages + problem understanding) using Firestore with TTL policies for automatic cleanup, with no persistence beyond browser session.

**API Integration:** RESTful API design for frontend-backend communication, with clear error handling and response formatting.

**Deployment Targets:**

- **Frontend:** Firebase Hosting for static hosting with global CDN distribution
- **Backend:** Firebase Cloud Functions (serverless) for API endpoints with Express app integration
- **Session Storage:** Firestore for session management with TTL policies
- **API Routing:** Firebase Hosting rewrites for API routing, connecting frontend to Cloud Functions

**Deployment Tools:**

- **Firebase CLI:** Unified deployment tool for functions, hosting, and database
- **Firebase Emulators:** Local development environment for testing before deployment

**Security:**

- API keys stored securely in environment variables, never exposed in client-side code
- Input sanitization for all text inputs to prevent security vulnerabilities
- No sensitive user data collection (anonymous sessions only)

**Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript runtime enabled (required for React and application functionality). Note: All source code must be written in TypeScript and compiled to JavaScript for browser execution.

**Performance Requirements:**

- LLM response times: < 3 seconds
- Smooth visual feedback interactions without noticeable lag
- Efficient image processing through Vision API integration

**Development Tools:**

- **TypeScript (Required):** All code must be written in TypeScript (no raw JavaScript). TypeScript provides type safety across frontend and backend, ensuring code quality and reducing errors. All source files must use `.ts` or `.tsx` extensions.
- **Code Linting:** ESLint with TypeScript support is required for code quality and consistency. All TypeScript code must pass linting checks before deployment.
- Git for version control
- Prettier for code formatting (integrated with ESLint)

## Epic List

Epic 1: Foundation & Problem Input System

Epic 2: Socratic Dialogue System & Answer Detection

Epic 3: Visual Feedback & Math Rendering

---

**Epic 1: Foundation & Problem Input System**

Establishes project infrastructure (monorepo setup, Git, basic CI/CD, React app, Node.js/Express backend, AWS infrastructure configuration) while delivering core problem input functionality. This epic enables students to input math problems via text or image upload, with Vision API integration for parsing printed text, problem validation, and basic problem display. Students can start interacting with the system by submitting problems, even before Socratic dialogue is implemented.

**Epic 2: Socratic Dialogue System & Answer Detection**

Implements the core pedagogical functionality: LLM-based Socratic dialogue generation, two-tier answer detection guardrails (keyword-based pattern matching + LLM-based validation), context management (last 10 messages), and progressive help escalation. This epic enables students to engage in guided problem-solving through Socratic questioning, with enforced guardrails ensuring no direct answers are provided. The chat interface is fully functional, maintaining conversation context and adapting to student responses.

**Epic 3: Visual Feedback & Math Rendering**

Delivers the visual and mathematical rendering capabilities: LaTeX/KaTeX rendering for equations and formulas, prominent visual feedback elements appropriate for 6th grade students (progress indicators, encouraging messages, age-appropriate visual elements), responsive design for desktop/tablet/mobile, and final UI polish. This epic also includes comprehensive testing across all 5 problem types (arithmetic, algebra, geometry, word problems, multi-step) to validate the complete system. The system is fully functional and ready for deployment.

**Epic Sequencing Rationale:**

Epic 1 establishes the foundation and delivers immediate value (problem input and parsing), allowing early testing of core input functionality. Epic 2 builds upon Epic 1 by adding the pedagogical core (Socratic dialogue and guardrails), enabling end-to-end problem-solving workflows. Epic 3 completes the system with visual polish and mathematical rendering, ensuring the product is fully functional and ready for deployment. This sequential approach ensures each epic builds upon previous work while delivering tangible value, allowing for iterative testing and refinement.

## Epic Dependency Matrix

### Cross-Epic Dependencies

**Epic 1 → Epic 2 Dependencies:**

- All Epic 2 stories require Epic 1 infrastructure (monorepo, React app, backend API structure)
- Epic 2 Story 2.1 (LLM Integration) requires Epic 1 Story 1.3 (Backend API Structure) for API endpoints
- Epic 2 Story 2.2 (Dialogue Generation) requires Epic 1 Story 1.7 (Problem Validation) for problem type identification
- Epic 2 Story 2.6 (Context Management) requires Epic 1 Story 1.3 (Backend API Structure) for session storage setup
- Epic 2 Story 2.7 (Chat UI Component) requires Epic 1 Story 1.2 (React Frontend Shell) for layout structure

**Epic 1 → Epic 3 Dependencies:**

- All Epic 3 stories require Epic 1 infrastructure (React app, Tailwind CSS, component structure)
- Epic 3 Story 3.1 (Math Rendering) requires Epic 1 Story 1.8 (Problem Display Component) for problem rendering
- Epic 3 Story 3.2 (Visual Feedback Components) requires Epic 1 Story 1.2 (React Frontend Shell) for layout
- Epic 3 Story 3.3 (Responsive Design) requires Epic 1 Story 1.2 (React Frontend Shell) for base layout

**Epic 2 → Epic 3 Dependencies:**

- Epic 3 Story 3.1 (Math Rendering) requires Epic 2 Story 2.7 (Chat UI Component) for message rendering
- Epic 3 Story 3.2 (Visual Feedback Components) requires Epic 2 Story 2.7 (Chat UI Component) for integration
- Epic 3 Story 3.5 (Comprehensive Testing) requires all Epic 2 stories for full system testing

### Epic-Level Dependency Diagram

```
Epic 1 (Foundation)
    ↓
    ├─→ Epic 2 (Socratic Dialogue)
    │       ↓
    │       └─→ Epic 3 (Visual Feedback & Polish)
    │
    └─→ Epic 3 (Visual Feedback & Polish)
```

### Story-Level Dependencies Within Epic 1

**Story 1.1 (Foundation & Project Setup)** → **All other Epic 1 stories**

- Foundation for all subsequent work
- Provides: monorepo structure, Git, CI/CD, deployment infrastructure

**Story 1.2 (React Frontend Shell)** → **Stories 1.4, 1.5, 1.8**

- Provides: Side-by-side layout required for problem input and display components

**Story 1.3 (Backend API Structure)** → **Stories 1.6, 1.7**

- Provides: Express API structure required for Vision API and validation endpoints

**Story 1.4 (Text Input)** → **Story 1.7 (Problem Validation)**

- Text input requires validation before problem display

**Story 1.5 (Image Upload UI)** → **Story 1.6 (Vision API Integration)**

- Image upload UI requires Vision API backend endpoint

**Story 1.6 (Vision API Integration)** → **Story 1.7 (Problem Validation)**

- Parsed image text requires validation before problem display

**Story 1.7 (Problem Validation)** → **Story 1.8 (Problem Display)**

- Validated problem required before display

**Story 1.9 (Developer Testing Interface)** → **All Epic 1 stories**

- Testing interface depends on all input, validation, and display functionality

### Story-Level Dependencies Within Epic 2

**Story 2.1 (LLM Integration Service)** → **Stories 2.2, 2.4, 2.5**

- LLM service required for dialogue generation, validation, and rewriting

**Story 2.2 (Dialogue Generation Endpoint)** → **Stories 2.3, 2.4, 2.5, 2.6, 2.7**

- Dialogue generation requires answer detection, blocking, context management, and chat UI

**Story 2.3 (Keyword-Based Detection)** → **Story 2.5 (Answer Blocking)**

- Keyword detection feeds into answer blocking logic

**Story 2.4 (LLM-Based Validation)** → **Story 2.5 (Answer Blocking)**

- LLM validation feeds into answer blocking logic

**Story 2.5 (Answer Blocking)** → **Story 2.2 (Dialogue Generation)**

- Answer blocking must be applied before sending responses from dialogue generation

**Story 2.6 (Context Management)** → **Story 2.2 (Dialogue Generation)**

- Context management provides conversation history for dialogue generation

**Story 2.8 (Progressive Help Escalation)** → **Story 2.2 (Dialogue Generation)**

- Help escalation modifies prompts for dialogue generation

**Story 2.7 (Chat UI Component)** → **Story 2.2 (Dialogue Generation)**

- Chat UI displays responses from dialogue generation endpoint

### Story-Level Dependencies Within Epic 3

**Story 3.1 (Math Rendering)** → **Stories 1.8 (Problem Display), 2.7 (Chat UI)**

- Math rendering required for both problem display and chat messages

**Story 3.2 (Visual Feedback Components)** → **Story 2.7 (Chat UI Component)**

- Visual feedback integrates with chat interface

**Story 3.3 (Responsive Design)** → **Stories 1.2 (Frontend Shell), 2.7 (Chat UI)**

- Responsive design applies to all layout components

**Story 3.4 (Age-Appropriate Styling)** → **All Epic 3 stories**

- Styling applies across all visual components

**Story 3.5 (Comprehensive Testing)** → **All Epic 1, 2, and 3 stories**

- Comprehensive testing validates entire system

**Story 3.6 (Final UI Polish)** → **All Epic 3 stories**

- Final polish applies to all visual components

### Critical Path Dependencies

**Critical Path 1: Problem Input → Validation → Display**

```
1.1 (Foundation) → 1.2 (Frontend Shell) → 1.3 (Backend API)
    → 1.4 (Text Input) OR 1.5 (Image Upload) → 1.6 (Vision API) [if image]
    → 1.7 (Validation) → 1.8 (Problem Display)
```

**Critical Path 2: Dialogue System → Answer Detection → Chat UI**

```
2.1 (LLM Integration) → 2.2 (Dialogue Generation)
    → 2.3 (Keyword Detection) + 2.4 (LLM Validation) → 2.5 (Answer Blocking)
    → 2.6 (Context Management) [parallel with 2.2]
    → 2.7 (Chat UI) → 2.8 (Help Escalation) [enhances 2.2]
```

**Critical Path 3: Visual Polish → Math Rendering → Final Testing**

```
3.1 (Math Rendering) → 3.2 (Visual Feedback) → 3.3 (Responsive Design)
    → 3.4 (Styling) → 3.5 (Testing) → 3.6 (Final Polish)
```

### Dependency Notes

**Parallel Development Opportunities:**

- Stories 1.4 (Text Input) and 1.5 (Image Upload) can be developed in parallel
- Stories 2.3 (Keyword Detection) and 2.4 (LLM Validation) can be developed in parallel
- Stories 3.1 (Math Rendering), 3.2 (Visual Feedback), and 3.3 (Responsive Design) can be developed in parallel

**Blocking Dependencies:**

- Story 1.1 (Foundation) blocks all other stories
- Story 1.2 (Frontend Shell) blocks frontend components (1.4, 1.5, 1.8)
- Story 1.3 (Backend API) blocks backend endpoints (1.6, 1.7)
- Story 2.1 (LLM Integration) blocks dialogue generation (2.2)
- Story 2.2 (Dialogue Generation) blocks chat UI (2.7)

**Technical Dependencies:**

- All stories require TypeScript and ESLint configuration (from 1.1)
- All frontend stories require Tailwind CSS setup (from 1.2)
- All backend stories require Express API structure (from 1.3)
- All Epic 2 stories require Epic 1 infrastructure
- All Epic 3 stories require Epic 1 and Epic 2 infrastructure

## Epic 1: Foundation & Problem Input System

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

## Epic 2: Socratic Dialogue System & Answer Detection

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

## Epic 3: Visual Feedback & Math Rendering

This epic delivers the visual and mathematical rendering capabilities that complete the system, ensuring the product is fully functional and ready for deployment. LaTeX/KaTeX rendering automatically displays mathematical equations and formulas in both problem statements and dialogue responses, ensuring proper mathematical notation throughout the interface. Prominent visual feedback elements appropriate for 6th grade students (ages 11-12) include progress indicators showing student advancement, encouraging messages celebrating small wins, and age-appropriate visual elements (emojis, colors, simple animations) that maintain engagement. Responsive design ensures the interface works effectively on desktop, tablet, and mobile browsers, with touch-friendly interactions for mobile and tablet devices. Final UI polish refines the interface with age-appropriate styling using Tailwind CSS v4.1.16, ensuring the product feels polished and professional while maintaining educational effectiveness. Comprehensive testing across all 5 problem types (arithmetic, algebra, geometry, word problems, multi-step) validates the complete system, ensuring Socratic dialogue quality, answer detection guardrail effectiveness, and visual feedback appropriateness for 6th grade students. The system is fully functional and ready for deployment after this epic.

### Story 3.1: LaTeX/KaTeX Math Rendering Integration

As a student,
I want to see mathematical equations and formulas rendered properly in problems and responses,
so that I can read and understand mathematical notation clearly.

#### Acceptance Criteria

1: LaTeX/KaTeX library is installed and configured in the React frontend application.

2: The math rendering library automatically detects LaTeX/KaTeX syntax in problem statements and dialogue responses.

3: Mathematical equations and formulas are rendered with proper formatting, including:

- Fractions, exponents, square roots
- Variables, constants, operators
- Algebraic expressions, equations
- Geometric notation (angles, shapes, measurements)

4: The math rendering works in both the problem display component (left panel) and chat conversation component (right panel).

5: The rendering is responsive and works effectively on desktop, tablet, and mobile browsers.

6: The rendering handles inline math expressions (e.g., `$x + 5 = 10$`) and block math expressions (e.g., `$$\frac{a}{b} = c$$`).

7: The rendering is accessible via keyboard navigation and screen readers (appropriate ARIA labels for mathematical content).

8: The math rendering library is optimized for performance, ensuring smooth rendering without noticeable delays.

### Story 3.2: Visual Feedback Components (Progress Indicators, Encouragement)

As a student,
I want to see visual feedback that encourages me and shows my progress,
so that I feel supported and motivated to continue working through problems.

#### Acceptance Criteria

1: Visual feedback components are created for progress indicators, showing student advancement through the problem-solving process.

2: Visual feedback components are created for encouraging messages, displaying positive reinforcement when students make progress or show effort.

3: Visual feedback elements are age-appropriate for 6th grade students (ages 11-12), using:

- Friendly colors that are engaging but not overwhelming
- Simple icons or emojis that celebrate progress
- Brief animations (subtle, not distracting) for encouragement

4: Progress indicators are displayed prominently in the interface, showing:

- Current step in the problem-solving process
- Number of attempts or progress milestones
- Visual representation of advancement (e.g., progress bar, step indicators)

5: Encouraging messages are displayed at appropriate moments:

- When students make progress (correct responses, clearer thinking)
- When students show effort (attempting problems, asking questions)
- When students complete steps or reach milestones

6: Visual feedback elements are integrated with the chat conversation component, appearing alongside system responses.

7: Visual feedback elements are responsive and work effectively on desktop, tablet, and mobile browsers.

8: Visual feedback elements are accessible via keyboard navigation and screen readers (appropriate ARIA labels).

### Story 3.3: Responsive Design & Mobile Optimization

As a student,
I want to use the tutor on desktop, tablet, and mobile devices,
so that I can access help from any device I have available.

#### Acceptance Criteria

1: The interface is fully responsive, adapting to different screen sizes (desktop, tablet, mobile) using Tailwind CSS responsive breakpoints.

2: The side-by-side layout adapts appropriately for smaller screens:

- Desktop: Full side-by-side layout (problem left, chat right)
- Tablet: Side-by-side layout with adjusted sizing, or stacked layout if needed
- Mobile: Stacked layout (problem above, chat below) or collapsible panels

3: All interactive elements are touch-friendly on mobile and tablet devices:

- Buttons are appropriately sized for touch
- Input fields are easily accessible
- Drag-and-drop works on touch devices

4: The responsive design maintains usability across all device types:

- Text is readable without zooming
- Interactive elements are easily accessible
- Visual hierarchy is maintained

5: The responsive design is tested across modern browsers (Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile devices.

6: The responsive design handles orientation changes (portrait/landscape) appropriately on mobile and tablet devices.

7: The responsive design ensures all core features (text input, image upload, chat dialogue, math rendering, visual feedback) work seamlessly across all device types.

8: The responsive design uses Tailwind CSS utility classes effectively, maintaining consistency across breakpoints.

### Story 3.4: Age-Appropriate Styling with Tailwind CSS

As a student,
I want the interface to look friendly and engaging for my age group,
so that I feel comfortable using the tutor.

#### Acceptance Criteria

1: The interface uses Tailwind CSS v4.1.16 for styling, with appropriate Tailwind configuration and design tokens.

2: The styling is age-appropriate for 6th grade students (ages 11-12), using:

- Colorful but not overwhelming color palette
- Friendly visual elements (emojis, icons, simple animations)
- Clear typography that is readable for the age group
- Appropriate spacing and visual hierarchy

3: The styling maintains a clean, educational aesthetic:

- Minimalist core with plenty of white space
- Focus on mathematical content (equations, formulas)
- Clear visual hierarchy emphasizing problem and dialogue

4: The styling is consistent throughout the interface:

- Consistent color scheme across components
- Consistent typography and spacing
- Consistent interactive element styling (buttons, inputs, etc.)

5: The styling uses Tailwind CSS utility classes effectively, maintaining design consistency and avoiding custom CSS where possible.

6: The styling is responsive and works effectively across all device types (desktop, tablet, mobile).

7: The styling is accessible, meeting WCAG AA standards for color contrast and accessibility.

8: The styling is optimized for performance, ensuring fast loading and smooth interactions.

### Story 3.5: Comprehensive Testing Across All 5 Problem Types

As a student,
I want the tutor to work effectively for all types of math problems I encounter,
so that I can get help with arithmetic, algebra, geometry, word problems, and multi-step problems.

#### Acceptance Criteria

1: The system is tested with arithmetic problems (addition, subtraction, multiplication, division, combinations), validating:

- Problem parsing (text input and image upload)
- Problem validation and type identification
- Socratic dialogue quality
- Answer detection guardrail effectiveness
- Visual feedback appropriateness

2: The system is tested with algebra problems (solving equations, working with variables, algebraic expressions), validating:

- Problem parsing (text input and image upload)
- Problem validation and type identification
- Socratic dialogue quality
- Answer detection guardrail effectiveness
- Math rendering for algebraic notation
- Visual feedback appropriateness

3: The system is tested with geometry problems (shapes, area, perimeter, angles, geometric relationships), validating:

- Problem parsing (text input and image upload)
- Problem validation and type identification
- Socratic dialogue quality
- Answer detection guardrail effectiveness
- Math rendering for geometric notation
- Visual feedback appropriateness

4: The system is tested with word problems (story problems requiring mathematical reasoning), validating:

- Problem parsing (text input and image upload)
- Problem validation and type identification
- Socratic dialogue quality
- Answer detection guardrail effectiveness
- Context management across multiple turns
- Visual feedback appropriateness

5: The system is tested with multi-step problems (problems requiring multiple sequential operations), validating:

- Problem parsing (text input and image upload)
- Problem validation and type identification
- Socratic dialogue quality
- Answer detection guardrail effectiveness
- Context management across extended conversations (10+ messages)
- Progressive help escalation
- Visual feedback appropriateness

6: Testing results are documented, including:

- Test cases for each problem type
- Socratic dialogue quality assessment
- Answer detection guardrail validation (100% adherence verified)
- Visual feedback appropriateness assessment
- Known issues or areas for improvement

7: The system demonstrates 100% adherence to Socratic principles across all 5 problem types, verified through testing.

8: The system is ready for deployment after comprehensive testing, with all core functionality validated and working correctly.

### Story 3.6: Final UI Polish & Error Handling

As a student,
I want the interface to be polished and handle errors gracefully,
so that I have a smooth, professional experience when using the tutor.

#### Acceptance Criteria

1: Final UI polish is applied to the interface, ensuring:

- Consistent styling throughout
- Smooth transitions and interactions
- Professional appearance appropriate for the target age group
- Clear visual hierarchy and spacing

2: Error handling is implemented throughout the interface, providing clear, age-appropriate error messages for:

- API failures (Vision API, LLM API)
- Network errors
- Invalid input (empty problems, invalid images)
- Session expiration
- Rate limit errors

3: Error messages are displayed prominently in the interface, with:

- Clear, age-appropriate language (no technical jargon)
- Actionable guidance (e.g., "Try again" or "Check your internet connection")
- Visual feedback (error icons, colors) appropriate for the age group

4: Loading states are implemented throughout the interface, showing:

- Loading indicators during API calls (Vision API, LLM API)
- Progress indicators during image processing
- Smooth transitions between states

5: The interface handles edge cases gracefully:

- Empty or invalid problem submissions
- Image parsing failures
- LLM response failures
- Session expiration
- Network disconnections

6: The interface is tested across modern browsers (Chrome, Firefox, Safari, Edge) to ensure compatibility and polish.

7: The interface is tested on different device types (desktop, tablet, mobile) to ensure responsive design and polish.

8: The interface is ready for deployment, with all error handling, loading states, and UI polish completed.

## Checklist Results Report

_This section will be populated after running the PM checklist to validate the PRD completeness and quality._

## Next Steps

### UX Expert Prompt

Create a UX design system and detailed UI specifications for the AI Math Tutor application based on this PRD. Focus on the target age group (6th grade students, ages 11-12), ensuring the interface is age-appropriate, engaging, and maintains educational effectiveness. Design the side-by-side layout (problem left, chat right), visual feedback elements, and responsive design for desktop/tablet/mobile devices. Use Tailwind CSS v4.1.16 for styling, ensuring WCAG AA accessibility compliance.

### Architect Prompt

Design the system architecture for the AI Math Tutor application based on this PRD. Create detailed architecture diagrams, component specifications, API contracts, and database schemas (if needed). Focus on the serverless architecture with Firebase Cloud Functions, React frontend, session management with Firestore, Vision API integration, LLM integration with answer detection guardrails, and context management. Ensure the architecture supports all functional and non-functional requirements, including scalability, security, and performance requirements.
