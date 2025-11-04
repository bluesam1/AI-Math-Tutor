# High Level Architecture

### Technical Summary

AI Math Tutor uses a serverless fullstack architecture with AWS Lambda functions for backend API endpoints, paired with a React frontend deployed as static assets. The system follows a monorepo structure combining frontend and backend TypeScript code in a single repository, enabling shared types and utilities across the stack. The architecture leverages AWS services (S3, CloudFront, API Gateway, ElastiCache/DynamoDB) for scalable, cost-effective deployment while maintaining clean separation between frontend UI, backend API services, and session management. The system integrates with OpenAI Vision API for image parsing and LLM APIs (OpenAI GPT-4 or Claude) for Socratic dialogue generation, with enforced answer detection guardrails ensuring pedagogical quality. The system is specifically designed for 6th grade mathematics (ages 11-12), focusing on core 6th grade math topics including operations with fractions and decimals, ratios and proportions, integers, introductory algebra, basic geometry, and multi-step word problems. A developer testing interface (development-only) enables streamlined testing workflows for rapid validation across all problem types and edge cases. This serverless approach provides the scalability and cost-effectiveness needed for an MVP while supporting the requirement for sub-3-second LLM response times and maintaining conversation context across 10+ message exchanges.

### Platform and Infrastructure Choice

**Platform:** AWS Full Stack

**Key Services:**

- **Frontend:** AWS S3 + CloudFront (or AWS Amplify for full-stack deployment)
- **Backend:** AWS Lambda (serverless) for API endpoints
- **Session Storage:** AWS ElastiCache (Redis) for in-memory session management (last 10 messages)
- **API Gateway:** AWS API Gateway for API routing, rate limiting, and request management
- **CDN:** CloudFront for static asset delivery and edge caching

**Deployment Host and Regions:**

- Primary: US East (N. Virginia) us-east-1
- CDN: CloudFront global distribution

**Rationale:**
The PRD explicitly specifies AWS infrastructure with serverless architecture. AWS provides:

- **Cost-effectiveness for MVP:** Pay-per-use model ideal for initial deployment
- **Scalability:** Auto-scaling Lambda functions handle variable load
- **Integration:** Seamless integration between S3, CloudFront, API Gateway, and Lambda
- **Session Management:** ElastiCache (Redis) provides fast in-memory storage for session context (last 10 messages)
- **Alternative Considered:** Vercel + Supabase was considered but PRD constraints specify AWS

### Repository Structure

**Structure:** Monorepo

**Monorepo Tool:** npm workspaces (lightweight, no additional tooling required)

**Package Organization:**

- Root package.json manages workspace dependencies
- `apps/web/` - React frontend application
- `apps/api/` - Node.js/Express backend API
- `packages/shared/` - Shared TypeScript types and utilities
- `packages/config/` - Shared ESLint, TypeScript, Jest configurations

**Rationale:**
The PRD explicitly requires a monorepo structure. npm workspaces provides:

- Simple setup without additional tooling complexity
- Shared TypeScript types between frontend and backend
- Unified dependency management
- Easier context management across the stack
- Aligns with 3-day MVP timeline (minimal tooling overhead)

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser<br/>React App]
    end

    subgraph "AWS Infrastructure"
        subgraph "Frontend"
            S3[S3 Bucket<br/>Static Assets]
            CF[CloudFront<br/>CDN]
        end

        subgraph "API Layer"
            APIGW[API Gateway<br/>Routing & Rate Limiting]
        end

        subgraph "Backend Services"
            Lambda1[Lambda: Problem Input<br/>Image Parsing]
            Lambda2[Lambda: Socratic Dialogue<br/>LLM Integration]
            Lambda3[Lambda: Answer Detection<br/>Guardrails]
        end

        subgraph "Session Storage"
            Redis[ElastiCache Redis<br/>Session Context]
        end
    end

    subgraph "External Services"
        VisionAPI[OpenAI Vision API]
        LLMAPI[LLM API<br/>OpenAI GPT-4/Claude]
    end

    Browser -->|HTTPS| CF
    CF -->|Static Assets| S3
    Browser -->|API Requests| APIGW
    APIGW -->|Route| Lambda1
    APIGW -->|Route| Lambda2
    APIGW -->|Route| Lambda3
    Lambda1 -->|Parse Image| VisionAPI
    Lambda2 -->|Generate Dialogue| LLMAPI
    Lambda3 -->|Validate Response| LLMAPI
    Lambda2 -->|Store Context| Redis
    Lambda2 -->|Retrieve Context| Redis
```

### Architectural Patterns

- **Serverless Architecture:** Backend deployed as AWS Lambda functions - _Rationale:_ Cost-effective for MVP, auto-scaling, pay-per-use model, eliminates server management overhead

- **Jamstack Architecture:** Static frontend with serverless APIs - _Rationale:_ Optimal performance through static asset delivery via CloudFront, reduced backend load, improved security

- **Component-Based UI:** React functional components with TypeScript - _Rationale:_ Maintainability, reusability, type safety across UI components, aligns with modern React best practices

- **Repository Pattern:** Abstract data access for session management - _Rationale:_ Enables testing with mock implementations, future flexibility for storage backend changes

- **API Gateway Pattern:** Single entry point via AWS API Gateway - _Rationale:_ Centralized authentication, rate limiting, request routing, monitoring, and CORS handling

- **Two-Tier Guardrail Pattern:** Keyword-based + LLM-based answer detection - _Rationale:_ Defense in depth approach ensures 100% Socratic compliance, catches both explicit and implicit answers

- **Progressive Help Escalation:** Context-aware hint generation - _Rationale:_ Maintains pedagogical quality while adapting to student needs, prevents student abandonment

- **Session-Based Context Management:** In-memory storage of last 10 messages - _Rationale:_ Fast access, no persistence requirements per PRD, cost-effective for anonymous sessions
