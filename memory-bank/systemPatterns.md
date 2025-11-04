# System Patterns: AI Math Tutor

**Last Updated:** 2025-01-XX  
**Version:** 1.0

## System Architecture

### High-Level Architecture

AI Math Tutor uses a **serverless fullstack architecture** with Firebase Cloud Functions for backend API endpoints, paired with a React frontend deployed as static assets. The system follows a monorepo structure combining frontend and backend TypeScript code in a single repository.

### Architecture Components

```
Client Layer (Browser)
    ↓
Firebase Infrastructure:
    - Frontend: Firebase Hosting (static assets + CDN)
    - API Routing: Firebase Hosting rewrites
    - Backend: Cloud Functions (Express API endpoints)
    - Session Storage: Firestore (session context with TTL)
    ↓
External Services:
    - OpenAI Vision API (image parsing)
    - LLM API (OpenAI GPT-4 or Claude)
```

### Key Technical Decisions

1. **Monorepo Structure:** npm workspaces for unified dependency management and shared TypeScript types
2. **Serverless Architecture:** Firebase Cloud Functions for cost-effective, scalable backend
3. **TypeScript Only:** All code must be written in TypeScript (no raw JavaScript)
4. **Two-Tier Answer Detection:** Keyword-based pattern matching + LLM-based validation
5. **Session Management:** Session storage (last 10 messages) using Firestore with TTL policies
6. **Progressive Help Escalation:** Escalates help after 2+ turns without progress
7. **Firebase Deployment:** Unified deployment via Firebase CLI (functions, hosting, database)

## Component Structure

### Frontend (apps/web/)

```
apps/web/src/
├── App.tsx              # Main application component
├── main.tsx             # Entry point
├── components/          # React components
│   ├── Layout.tsx       # Side-by-side layout
│   ├── ProblemDisplay.tsx
│   ├── ChatInterface.tsx
│   └── ...
├── types/               # TypeScript types
├── styles/              # CSS/Tailwind styles
└── ...
```

### Backend (functions/)

```
functions/
├── index.ts              # Firebase Functions entry point
├── src/
│   ├── server.ts         # Express app
│   ├── routes/           # API route definitions
│   │   ├── health.ts
│   │   ├── problem.ts
│   │   └── chat.ts
│   ├── controllers/       # Route controllers
│   ├── services/          # Business logic
│   │   ├── llmService.ts
│   │   ├── answerDetectionService.ts
│   │   ├── answerValidationService.ts
│   │   ├── contextService.ts
│   │   └── helpEscalationService.ts
│   ├── middleware/        # Express middleware
│   │   ├── cors.ts
│   │   └── errorHandler.ts
│   ├── config/            # Configuration
│   │   └── env.ts
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── lib/                   # Compiled JavaScript
```

### Shared (packages/shared/)

```
packages/shared/src/
├── types/               # Shared TypeScript types
├── constants/          # Shared constants
└── utils/               # Shared utility functions
```

## Design Patterns

### 1. Socratic Dialogue Pattern

**Pattern:** LLM generates guiding questions with enforced guardrails

- **Input:** Problem statement, problem type, conversation context (last 10 messages)
- **Processing:** LLM generates Socratic dialogue with answer detection guardrails
- **Output:** Guiding question (never direct answer)

**Implementation:**

- `llmService.ts` - LLM API integration
- `answerDetectionService.ts` - Keyword-based detection
- `answerValidationService.ts` - LLM-based validation
- Answer blocking and rewriting before response delivery

### 2. Two-Tier Answer Detection Pattern

**Pattern:** Multi-layer guardrail system to prevent direct answers

- **Layer 1:** Keyword-based pattern matching (e.g., "the answer is", "equals", numeric results)
- **Layer 2:** LLM-based validation analyzing response context
- **Action:** Block or rewrite responses containing direct answers

**Implementation:**

- Keyword detection: regex/pattern matching
- LLM validation: secondary LLM call analyzing response context
- Blocking: replace with Socratic question or generic guiding question

### 3. Progressive Help Escalation Pattern

**Pattern:** Escalates help when students are stuck while maintaining Socratic principles

- **Trigger:** 2+ turns without progress
- **Escalation:** More concrete hints in LLM prompt (still questions, not answers)
- **Reset:** Progress tracking resets when student makes progress

**Implementation:**

- `helpEscalationService.ts` - Tracks progress and escalates help
- Integrated with dialogue generation endpoint
- Adjusts LLM prompts based on student progress

### 4. Context Management Pattern

**Pattern:** Maintains conversation context for coherent dialogue

- **Storage:** Last 10 messages (user inputs + system responses)
- **Session:** Storage using Firestore with TTL policies
- **Retrieval:** Included in LLM prompts for dialogue generation

**Implementation:**

- `contextService.ts` - Stores and retrieves conversation context using Firestore
- Session identifiers for multi-user support
- Context expiration after 30 minutes of inactivity via Firestore TTL policies

### 5. Problem Validation Pattern

**Pattern:** Validates input is a valid math problem and identifies type

- **Input:** Problem text (from text input or Vision API parsing)
- **Processing:** LLM analyzes problem text to confirm it's mathematical
- **Output:** Validation status, problem type (arithmetic, algebra, geometry, word problems, multi-step)

**Implementation:**

- `/api/problem/validate` endpoint
- LLM API integration for validation and type identification
- Returns cleaned problem statement and problem type

## API Patterns

### RESTful API Design

**Base Path:** `/api`

**Endpoints:**

- `GET /api/health` - Health check
- `POST /api/problem/parse-image` - Parse image with Vision API
- `POST /api/problem/validate` - Validate problem and identify type
- `POST /api/chat/message` - Generate Socratic dialogue response

**Request/Response Format:**

- JSON request bodies
- JSON response bodies
- Standard HTTP status codes
- Error responses with clear messages

### Error Handling Pattern

**Pattern:** Consistent error handling across all API endpoints

- **Middleware:** `errorHandler.ts` catches and formats errors
- **Error Types:** Validation errors, API errors, network errors
- **Response Format:** `{ error: { message: string, code?: string } }`

## Component Relationships

### Frontend Component Flow

```
App
  └── Layout
      ├── ProblemDisplay (left panel)
      └── ChatInterface (right panel)
          ├── MessageList
          └── MessageInput
```

### Backend Service Flow

```
API Request
  └── Route Handler
      └── Controller
          └── Service Layer
              ├── LLM Service
              ├── Answer Detection Service
              ├── Context Service
              └── Help Escalation Service
```

## Integration Points

### External API Integration

1. **Vision API (OpenAI Vision):** Image parsing for problem extraction
2. **LLM API (OpenAI GPT-4 or Claude):** Problem validation, dialogue generation, answer validation
3. **Firestore:** Session storage for conversation context with TTL policies

### Internal Integration

1. **Frontend ↔ Backend:** RESTful API calls (`/api/*` endpoints)
2. **Routes ↔ Controllers ↔ Services:** Modular service layer architecture
3. **Shared Types:** TypeScript types shared between frontend and backend

## Security Patterns

### API Key Management

- **Storage:** Environment variables (never committed to repository)
- **Access:** Backend-only access (never exposed in client-side code)
- **Configuration:** `.env.example` template for required variables

### Input Sanitization

- **Text Input:** Sanitization for all text inputs to prevent security vulnerabilities
- **Image Upload:** Validation for file format, size limits
- **Error Messages:** Age-appropriate error messages (no technical details exposed)

## Performance Patterns

### Response Time Optimization

- **LLM Response Time:** Target < 3 seconds for LLM-generated responses
- **Caching:** Session context cached in Redis for fast retrieval
- **Image Processing:** Efficient Vision API integration with timeout handling

### Scalability Patterns

- **Serverless Architecture:** Auto-scaling Cloud Functions
- **CDN:** Firebase Hosting global CDN for static asset delivery
- **Session Storage:** Firestore for fast session storage with TTL policies
