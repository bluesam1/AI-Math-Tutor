# Coding Standards

### Critical Fullstack Rules

- **Testing First:** All critical functionality (answer detection, context management, problem validation) must have tests written before implementation
- **Test Coverage:** Answer detection service requires 100% test coverage before deployment
- **Scenario Testing:** New problem types or features must include scenario-based tests
- **Type Sharing:** Always define types in `packages/shared/src/types` and import from there
- **API Calls:** Never make direct HTTP calls - use the service layer (`apps/web/src/services/api`)
- **Environment Variables:** Access only through config objects, never `process.env` directly in code
- **Error Handling:** All API routes must use the standard error handler middleware
- **State Updates:** Never mutate state directly - use proper state management patterns (React Context or useState)
- **TypeScript Only:** All code must be TypeScript (no raw JavaScript) - `.ts` for utilities, `.tsx` for React components
- **ESLint Compliance:** All code must pass ESLint checks before commit
- **Answer Detection:** All LLM responses must pass through two-tier answer detection guardrails before delivery
- **Test-Driven Development:** Critical paths (answer detection, Socratic dialogue) should follow TDD principles

### Naming Conventions

| Element          | Frontend             | Backend          | Example                    |
| ---------------- | -------------------- | ---------------- | -------------------------- |
| Components       | PascalCase           | -                | `ProblemInput.tsx`         |
| Hooks            | camelCase with 'use' | -                | `useSession.ts`            |
| API Routes       | -                    | kebab-case       | `/api/problem/parse-image` |
| Functions        | camelCase            | camelCase        | `generateDialogue`         |
| Types/Interfaces | PascalCase           | PascalCase       | `Problem`, `Session`       |
| Constants        | UPPER_SNAKE_CASE     | UPPER_SNAKE_CASE | `MAX_MESSAGES = 10`        |
