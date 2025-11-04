# Technical Assumptions

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
