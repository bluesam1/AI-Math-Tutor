# Active Context: AI Math Tutor

**Last Updated:** 2025-01-XX  
**Version:** 1.0

## Current Work Focus

### Recent Changes

**Epic 1: Foundation & Problem Input System** - In Progress

- ✅ **Story 1.1:** Foundation & Project Setup - Complete
  - Monorepo structure established with npm workspaces
  - TypeScript configuration across all workspaces
  - Git repository initialized
  - Basic CI/CD pipeline configured

- ✅ **Story 1.2:** React Frontend Shell - Complete
  - React application initialized with TypeScript
  - Tailwind CSS v4.1.16 installed and configured
  - Side-by-side layout implemented (problem left, chat right)
  - Sample data displayed in Layout component

- ✅ **Story 1.3:** Node.js/Express Backend API Structure - Complete
  - Express backend initialized with TypeScript
  - CORS middleware configured
  - Error handling middleware implemented
  - Health check endpoint created (`GET /api/health`)
  - Route structure established (`/api/problem`, `/api/chat`)

- ⏳ **Story 1.4:** Text Input for Math Problems - Pending
- ⏳ **Story 1.5:** Image Upload UI Component - Pending
- ⏳ **Story 1.6:** Vision API Integration Backend Endpoint - Pending
- ⏳ **Story 1.7:** Problem Validation & Type Identification - Pending
- ⏳ **Story 1.8:** Problem Display Component - Pending
- ⏳ **Story 1.9:** Developer Testing Interface - Pending

### Current Status

**Infrastructure:** ✅ Foundation complete

- Monorepo structure with npm workspaces
- TypeScript configuration across frontend and backend
- Express backend with basic routes and middleware
- React frontend with side-by-side layout

**Core Functionality:** ⏳ In Progress

- Problem input (text and image) - Not yet implemented
- Vision API integration - Not yet implemented
- Problem validation - Not yet implemented
- Socratic dialogue system - Not yet implemented
- Answer detection guardrails - Not yet implemented

## Next Steps

### Immediate Priorities

1. **Complete Epic 1: Foundation & Problem Input System**
   - Implement text input component (Story 1.4)
   - Implement image upload UI (Story 1.5)
   - Integrate Vision API for image parsing (Story 1.6)
   - Implement problem validation (Story 1.7)
   - Enhance problem display component (Story 1.8)
   - Build developer testing interface (Story 1.9)

2. **Begin Epic 2: Socratic Dialogue System & Answer Detection**
   - Set up LLM integration service (Story 2.1)
   - Implement dialogue generation endpoint (Story 2.2)
   - Build answer detection guardrails (Stories 2.3, 2.4, 2.5)
   - Implement context management (Story 2.6)
   - Build chat UI component (Story 2.7)
   - Add progressive help escalation (Story 2.8)

3. **Complete Epic 3: Visual Feedback & Math Rendering**
   - Integrate LaTeX/KaTeX rendering (Story 3.1)
   - Build visual feedback components (Story 3.2)
   - Implement responsive design (Story 3.3)
   - Apply age-appropriate styling (Story 3.4)
   - Comprehensive testing (Story 3.5)
   - Final UI polish (Story 3.6)

### Active Decisions

1. **LLM Provider Selection:** Need to decide between OpenAI GPT-4 or Claude for Socratic dialogue generation
2. **Vision API Provider:** Need to decide between OpenAI Vision API or Google Vision API
3. **Session Storage:** Need to configure ElastiCache Redis or DynamoDB for session management
4. **Deployment Strategy:** Finalize AWS deployment configuration (S3 + CloudFront vs Amplify)

### Active Considerations

1. **Answer Detection Strategy:** Need to refine keyword-based and LLM-based detection patterns
2. **Progressive Help Escalation:** Need to determine optimal thresholds for help escalation
3. **Visual Feedback Design:** Need to finalize visual feedback elements for 6th grade students
4. **Testing Workflows:** Need to design comprehensive test suites for all 5 problem types

## Blockers & Risks

### Current Blockers

- None identified at this time

### Known Risks

1. **LLM Answer Detection Failure:** Guardrails may fail to detect direct answers in some edge cases
   - **Mitigation:** Multiple detection strategies (keyword-based, LLM-based validation), extensive testing

2. **Vision API Accuracy:** Vision API may misparse math problems, especially with complex notation
   - **Mitigation:** Image preprocessing, clear error handling, fallback to manual text entry

3. **Generic System Limitations:** Generic Socratic system may not provide optimal guidance for all 5+ problem types
   - **Mitigation:** Design flexible system that can be enhanced with problem-type-specific logic later

4. **API Rate Limits/Costs:** LLM and Vision API costs may exceed budget or hit rate limits
   - **Mitigation:** Monitor API usage, implement caching where possible, use cost-effective API tiers

## Recent Learnings

1. **Monorepo Structure:** npm workspaces provide simple setup without additional tooling complexity
2. **TypeScript Configuration:** Project references enable cross-workspace type checking
3. **Express Middleware:** Modular middleware structure supports clean error handling and CORS configuration
4. **React Layout:** Side-by-side layout works well for problem-solving interface

## Questions & Open Items

1. **LLM Provider:** Which LLM provider (OpenAI GPT-4 or Claude) provides better Socratic dialogue generation?
2. **Answer Detection Patterns:** What additional keyword patterns should be included in answer detection?
3. **Visual Feedback:** What specific visual feedback elements are most effective for 6th grade students?
4. **Session Expiration:** Should sessions expire after inactivity, or persist for full browser session?

## Notes

- All code must be written in TypeScript (no raw JavaScript)
- ESLint with TypeScript support is required for all code
- All code must pass linting checks before merging
- Focus on 6th grade mathematics (ages 11-12) for age-appropriate design
