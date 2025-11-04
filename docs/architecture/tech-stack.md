# Tech Stack

### Technology Stack Table

| Category             | Technology                         | Version       | Purpose                                     | Rationale                                                         |
| -------------------- | ---------------------------------- | ------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| Frontend Language    | TypeScript                         | Latest        | Type-safe frontend development              | PRD requirement - all code must be TypeScript for type safety     |
| Frontend Framework   | React                              | Latest stable | Component-based UI with side-by-side layout | PRD requirement - React with functional components and Hooks      |
| UI Component Library | None (custom)                      | -             | Built-in components                         | PRD doesn't specify a UI library, custom components with Tailwind |
| State Management     | React Hooks (useState, useContext) | Built-in      | Client-side state management                | Simple state needs for MVP, no complex state management required  |
| Backend Language     | TypeScript                         | Latest        | Type-safe backend development               | PRD requirement - all code must be TypeScript                     |
| Backend Framework    | Express.js                         | Latest        | REST API endpoints                          | PRD requirement - Node.js/Express for API endpoints               |
| API Style            | REST                               | -             | Frontend-backend communication              | PRD requirement - RESTful API design                              |
| Database             | N/A                                | -             | No persistent storage                       | PRD specifies session-only storage (no persistence)               |
| Cache                | AWS ElastiCache (Redis)            | Latest        | Session context storage                     | PRD requirement - in-memory session management (last 10 messages) |
| File Storage         | N/A                                | -             | No file persistence                         | Images processed then discarded, no storage needed                |
| Authentication       | None                               | -             | Anonymous sessions                          | PRD requirement - anonymous sessions only, no auth needed         |
| Frontend Testing     | Jest + React Testing Library       | Latest        | Component and unit testing                  | Standard React testing stack                                      |
| Backend Testing      | Jest + Supertest                   | Latest        | API endpoint testing                        | Standard Node.js testing stack                                    |
| E2E Testing          | Deferred                           | -             | Post-MVP                                    | PRD specifies Unit + Integration only for MVP                     |
| Build Tool           | Vite                               | Latest        | Frontend build tool                         | Fast, modern build tool for React                                 |
| Bundler              | Vite (Rollup)                      | Latest        | Code bundling                               | Included with Vite                                                |
| IaC Tool             | AWS CDK or SAM                     | Latest        | Infrastructure as Code                      | AWS-native IaC tools                                              |
| CI/CD                | GitHub Actions                     | -             | Automated testing and deployment            | Standard CI/CD for GitHub repositories                            |
| Monitoring           | CloudWatch                         | AWS native    | Application monitoring                      | AWS-native monitoring solution                                    |
| Logging              | CloudWatch Logs                    | AWS native    | Application logging                         | AWS-native logging solution                                       |
| CSS Framework        | Tailwind CSS                       | v4.1.16       | Utility-first styling                       | PRD requirement - Tailwind CSS v4.1.16 for responsive design      |

### Technical Dependency Matrix

This section documents all technical dependencies, their versions, compatibility requirements, and dependency relationships. This ensures consistent versions across the monorepo and prevents dependency conflicts.

#### Runtime Environment Requirements

| Requirement | Minimum Version | Recommended Version    | Purpose                       | Notes                                               |
| ----------- | --------------- | ---------------------- | ----------------------------- | --------------------------------------------------- |
| Node.js     | v18.0.0         | v18.x LTS or v20.x LTS | JavaScript runtime            | Required for both frontend and backend              |
| npm         | v9.0.0          | v10.x or latest        | Package manager               | Included with Node.js, used for monorepo workspaces |
| TypeScript  | v5.0.0          | v5.3.x or latest       | Type checking and compilation | Required for all code (PRD requirement)             |

**Node.js Version Compatibility:**

- **Supported:** Node.js 18.x LTS, 20.x LTS
- **Not Supported:** Node.js 16.x or earlier (TypeScript 5.x requires Node 18+)
- **Rationale:** TypeScript 5.x and modern tooling require Node 18+

#### Frontend Dependencies

| Package              | Version | Purpose             | Dependencies          | Notes                               |
| -------------------- | ------- | ------------------- | --------------------- | ----------------------------------- |
| react                | ^18.2.0 | UI framework        | -                     | Latest stable React 18.x            |
| react-dom            | ^18.2.0 | React DOM bindings  | react                 | Must match React version            |
| typescript           | ^5.3.0  | Type checking       | -                     | Required for all .ts/.tsx files     |
| vite                 | ^5.0.0  | Build tool          | -                     | Fast build tool for React           |
| @vitejs/plugin-react | ^4.2.0  | Vite React plugin   | vite, react           | Required for React in Vite          |
| tailwindcss          | v4.1.16 | CSS framework       | -                     | PRD requirement - exact version     |
| katex                | ^0.16.0 | Math rendering      | -                     | LaTeX/KaTeX rendering for equations |
| react-katex          | ^3.0.0  | React KaTeX wrapper | react, katex          | React integration for KaTeX         |
| @types/react         | ^18.2.0 | TypeScript types    | react, typescript     | Must match React version            |
| @types/react-dom     | ^18.2.0 | TypeScript types    | react-dom, typescript | Must match React version            |
| @types/node          | ^20.0.0 | Node.js types       | typescript            | Node.js type definitions            |

**Frontend Dependency Compatibility Notes:**

- React 18.x is required for concurrent features and modern hooks
- TypeScript 5.x requires Node 18+ and provides better type inference
- Vite 5.x requires Node 18+ and provides fast HMR
- Tailwind CSS v4.1.16 is explicitly required by PRD (exact version)
- KaTeX 0.16.x is latest stable for math rendering
- All @types packages must match their corresponding package versions

#### Backend Dependencies

| Package                     | Version   | Purpose                | Dependencies        | Notes                                       |
| --------------------------- | --------- | ---------------------- | ------------------- | ------------------------------------------- |
| express                     | ^4.18.0   | Web framework          | -                   | Latest stable Express 4.x                   |
| typescript                  | ^5.3.0    | Type checking          | -                   | Shared with frontend                        |
| @types/express              | ^4.17.0   | TypeScript types       | express, typescript | Express type definitions                    |
| @types/node                 | ^20.0.0   | Node.js types          | typescript          | Node.js type definitions                    |
| aws-sdk                     | ^2.1500.0 | AWS SDK v2             | -                   | AWS service integration                     |
| @aws-sdk/client-s3          | ^3.0.0    | AWS S3 client          | -                   | Alternative: AWS SDK v3 (modular)           |
| @aws-sdk/client-lambda      | ^3.0.0    | AWS Lambda client      | -                   | Alternative: AWS SDK v3 (modular)           |
| @aws-sdk/client-elasticache | ^3.0.0    | AWS ElastiCache client | -                   | Alternative: AWS SDK v3 (modular)           |
| ioredis                     | ^5.3.0    | Redis client           | -                   | For ElastiCache (Redis) connection          |
| @types/ioredis              | ^5.0.0    | TypeScript types       | ioredis, typescript | Redis type definitions                      |
| openai                      | ^4.0.0    | OpenAI API client      | -                   | For Vision API and LLM API                  |
| @anthropic-ai/sdk           | ^0.9.0    | Anthropic Claude API   | -                   | Alternative LLM provider                    |
| cors                        | ^2.8.5    | CORS middleware        | express             | Required for frontend-backend communication |
| multer                      | ^1.4.5    | File upload middleware | express             | For image upload handling                   |
| @types/multer               | ^1.4.0    | TypeScript types       | multer, typescript  | Multer type definitions                     |
| @types/cors                 | ^2.8.0    | TypeScript types       | cors, typescript    | CORS type definitions                       |
| dotenv                      | ^16.3.0   | Environment variables  | -                   | For local development config                |

**Backend Dependency Compatibility Notes:**

- Express 4.x is stable and well-tested
- AWS SDK: Choose either v2 (aws-sdk) or v3 (modular @aws-sdk/client-\* packages)
  - **Recommendation:** Use AWS SDK v3 for better tree-shaking and smaller bundle size
- ioredis 5.x is latest stable for Redis connections
- OpenAI SDK 4.x is latest for GPT-4 and Vision API
- Anthropic SDK 0.9.x is latest for Claude API (alternative provider)

#### Testing Dependencies

| Package                     | Version | Purpose                     | Scope              | Notes                        |
| --------------------------- | ------- | --------------------------- | ------------------ | ---------------------------- |
| jest                        | ^29.7.0 | Testing framework           | Frontend + Backend | Latest Jest with ESM support |
| @testing-library/react      | ^14.1.0 | React testing utilities     | Frontend           | React component testing      |
| @testing-library/jest-dom   | ^6.1.0  | Jest DOM matchers           | Frontend           | Additional DOM matchers      |
| @testing-library/user-event | ^14.5.0 | User interaction testing    | Frontend           | User event simulation        |
| supertest                   | ^6.3.0  | HTTP assertion library      | Backend            | API endpoint testing         |
| @types/jest                 | ^29.5.0 | TypeScript types            | Frontend + Backend | Jest type definitions        |
| @types/supertest            | ^6.0.0  | TypeScript types            | Backend            | Supertest type definitions   |
| ts-jest                     | ^29.1.0 | TypeScript Jest transformer | Frontend + Backend | TypeScript support in Jest   |

**Testing Dependency Compatibility Notes:**

- Jest 29.x requires Node 18+ and supports ESM modules
- Testing Library 14.x is latest with React 18 support
- ts-jest 29.x must match Jest version for compatibility

#### Development Dependencies

| Package                          | Version | Purpose                  | Scope              | Notes                              |
| -------------------------------- | ------- | ------------------------ | ------------------ | ---------------------------------- |
| eslint                           | ^8.55.0 | Linter                   | Frontend + Backend | Code quality enforcement           |
| @typescript-eslint/parser        | ^6.15.0 | TypeScript ESLint parser | Frontend + Backend | TypeScript linting                 |
| @typescript-eslint/eslint-plugin | ^6.15.0 | TypeScript ESLint rules  | Frontend + Backend | TypeScript-specific rules          |
| eslint-plugin-react              | ^7.33.0 | React ESLint rules       | Frontend           | React-specific linting             |
| eslint-plugin-react-hooks        | ^4.6.0  | React Hooks linting      | Frontend           | React Hooks rules                  |
| prettier                         | ^3.1.0  | Code formatter           | Frontend + Backend | Code formatting                    |
| eslint-config-prettier           | ^9.1.0  | Prettier ESLint config   | Frontend + Backend | Prevents ESLint/Prettier conflicts |
| @types/node                      | ^20.0.0 | Node.js types            | Frontend + Backend | Shared Node.js types               |

**Development Dependency Compatibility Notes:**

- ESLint 8.x is stable and supports TypeScript 5.x
- TypeScript ESLint 6.x supports TypeScript 5.x
- Prettier 3.x is latest with improved formatting
- All ESLint plugins must be compatible with ESLint 8.x

#### Infrastructure Dependencies

| Service                 | Version/Region | Purpose              | Dependencies     | Notes                      |
| ----------------------- | -------------- | -------------------- | ---------------- | -------------------------- |
| AWS S3                  | Latest         | Static asset hosting | -                | Frontend deployment        |
| AWS CloudFront          | Latest         | CDN distribution     | AWS S3           | Global content delivery    |
| AWS Lambda              | Latest         | Serverless functions | AWS API Gateway  | Backend API endpoints      |
| AWS API Gateway         | Latest         | API routing          | AWS Lambda       | API request routing        |
| AWS ElastiCache (Redis) | Latest         | Session storage      | -                | In-memory session context  |
| AWS IAM                 | Latest         | Access control       | All AWS services | Security and permissions   |
| OpenAI API              | Latest         | Vision + LLM APIs    | -                | Image parsing and dialogue |
| Anthropic Claude API    | Latest         | Alternative LLM      | -                | Alternative LLM provider   |

**Infrastructure Dependency Compatibility Notes:**

- All AWS services use latest versions (managed services)
- AWS SDK must be compatible with service APIs
- OpenAI and Anthropic APIs are versioned independently
- Region: us-east-1 (primary) for cost-effectiveness

#### Shared Dependencies (Monorepo Root)

| Package    | Version | Purpose       | Scope  | Notes                  |
| ---------- | ------- | ------------- | ------ | ---------------------- |
| typescript | ^5.3.0  | Type checking | Shared | Root TypeScript config |
| eslint     | ^8.55.0 | Linter        | Shared | Root ESLint config     |
| prettier   | ^3.1.0  | Formatter     | Shared | Root Prettier config   |
| jest       | ^29.7.0 | Testing       | Shared | Root Jest config       |

**Shared Dependency Rationale:**

- TypeScript, ESLint, Prettier, and Jest are shared across frontend and backend
- Root-level configuration ensures consistency
- Package versions must match across all workspaces

#### Dependency Conflict Resolution

**Known Conflicts and Resolutions:**

1. **AWS SDK v2 vs v3:**
   - **Conflict:** Can't use both aws-sdk (v2) and @aws-sdk/client-\* (v3) simultaneously
   - **Resolution:** Choose one approach:
     - **Option A:** Use AWS SDK v2 (`aws-sdk`) - simpler, larger bundle
     - **Option B:** Use AWS SDK v3 (`@aws-sdk/client-*`) - modular, smaller bundle
   - **Recommendation:** Use AWS SDK v3 for better tree-shaking

2. **TypeScript Version Consistency:**
   - **Conflict:** Different TypeScript versions across workspaces
   - **Resolution:** Use exact same TypeScript version (^5.3.0) in root and all workspaces
   - **Enforcement:** Root package.json locks TypeScript version

3. **React Type Definitions:**
   - **Conflict:** @types/react version mismatch with react version
   - **Resolution:** @types/react version must match react version (both ^18.2.0)
   - **Enforcement:** Use peer dependency checks

4. **Node.js Version:**
   - **Conflict:** TypeScript 5.x requires Node 18+, but older Node versions might be used
   - **Resolution:** Enforce Node 18+ in .nvmrc and package.json engines field
   - **Enforcement:** CI/CD checks Node version

#### Version Pinning Strategy

**Pinned Versions (Exact):**

- `tailwindcss: v4.1.16` - PRD requirement, exact version
- `typescript: ^5.3.0` - Shared dependency, consistent version
- `react: ^18.2.0` - Core framework, stable version
- `node: ^18.0.0` - Runtime requirement, minimum version

**Version Ranges (Caret):**

- Most other packages use `^` (caret) for patch and minor updates
- Allows security patches and bug fixes
- Prevents breaking major version changes

**Lock File Strategy:**

- Use `package-lock.json` (npm) for deterministic installs
- Commit lock file to repository
- CI/CD uses `npm ci` for reproducible builds

#### Dependency Update Policy

**Monthly Updates:**

- Security patches: Immediate
- Bug fixes: Within 1 week
- Minor updates: Within 1 month
- Major updates: Require architecture review

**Update Process:**

1. Check for security vulnerabilities: `npm audit`
2. Review changelog for breaking changes
3. Test in development environment
4. Update lock file and commit
5. Verify CI/CD passes

#### Dependency Installation Order

**Root Dependencies (First):**

```bash
npm install  # Install root dependencies and create workspaces
```

**Workspace Dependencies (Second):**

```bash
npm install --workspace=apps/web  # Frontend dependencies
npm install --workspace=apps/api  # Backend dependencies
npm install --workspace=packages/shared  # Shared dependencies
```

**Or Install All:**

```bash
npm install  # Installs all workspace dependencies automatically
```

#### Compatibility Matrix

| Node.js | TypeScript | React  | Express | Jest   | Status                                              |
| ------- | ---------- | ------ | ------- | ------ | --------------------------------------------------- |
| 18.x    | 5.3.x      | 18.2.x | 4.18.x  | 29.7.x | ✅ Supported                                        |
| 20.x    | 5.3.x      | 18.2.x | 4.18.x  | 29.7.x | ✅ Supported                                        |
| 16.x    | 5.3.x      | 18.2.x | 4.18.x  | 29.7.x | ❌ Not Supported (TypeScript 5.x requires Node 18+) |
| 18.x    | 4.9.x      | 18.2.x | 4.18.x  | 29.7.x | ⚠️ Not Recommended (TypeScript 4.x is outdated)     |

**Recommended Configuration:**

- Node.js: 18.x LTS or 20.x LTS
- TypeScript: 5.3.x
- React: 18.2.x
- Express: 4.18.x
- Jest: 29.7.x
