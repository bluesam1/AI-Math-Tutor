# Backend Architecture

### Service Architecture

#### Serverless Architecture (Lambda Functions)

Since the architecture uses serverless AWS Lambda functions, the backend is organized as Lambda handlers:

##### Function Organization

```
apps/api/src/
├── functions/
│   ├── problemInput/
│   │   ├── handler.ts
│   │   ├── parseImage.ts
│   │   └── validateProblem.ts
│   ├── socraticDialogue/
│   │   ├── handler.ts
│   │   ├── generateDialogue.ts
│   │   └── manageContext.ts
│   ├── health/
│   │   └── handler.ts
│   └── testing/
│       ├── handler.ts
│       ├── getTestFixtures.ts
│       ├── runScenario.ts
│       └── runBatch.ts
├── services/
│   ├── vision/
│   │   └── visionApi.ts
│   ├── llm/
│   │   └── llmApi.ts
│   ├── answerDetection/
│   │   ├── keywordDetection.ts
│   │   └── llmValidation.ts
│   ├── context/
│   │   └── contextService.ts
│   └── testing/
│       ├── testFixtures.ts
│       ├── scenarioRunner.ts
│       └── testValidator.ts
├── middleware/
│   ├── errorHandler.ts
│   ├── cors.ts
│   └── validation.ts
├── types/
│   ├── problem.ts
│   ├── message.ts
│   └── session.ts
└── utils/
    ├── logger.ts
    └── config.ts
```

##### Function Template

```typescript
// apps/api/src/functions/socraticDialogue/handler.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { generateDialogue } from './generateDialogue';
import { errorHandler } from '../../middleware/errorHandler';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { sessionId, message, problemId } = JSON.parse(event.body || '{}');
    
    // Validate input
    if (!sessionId || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate Socratic dialogue
    const response = await generateDialogue(sessionId, message, problemId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    return errorHandler(error);
  }
};
```

### Database Architecture

#### Schema Design

N/A - No persistent database. Session storage uses Redis (ElastiCache) with hash structure as defined in Database Schema section.

#### Data Access Layer

```typescript
// apps/api/src/services/context/contextService.ts
import { Redis } from 'ioredis';
import { Session, Message, Problem } from '../../types';

export class ContextService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async getContext(sessionId: string): Promise<Session | null> {
    const data = await this.redis.hgetall(`session:${sessionId}`);
    if (!data || Object.keys(data).length === 0) {
      return null;
    }
    return {
      sessionId: data.sessionId,
      problem: data.problem ? JSON.parse(data.problem) : null,
      messages: data.messages ? JSON.parse(data.messages) : [],
      createdAt: new Date(data.createdAt),
      lastActivityAt: new Date(data.lastActivityAt),
    };
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const session = await this.getContext(sessionId) || {
      sessionId,
      problem: null,
      messages: [],
      createdAt: new Date(),
      lastActivityAt: new Date(),
    };

    // Keep only last 10 messages
    session.messages.push(message);
    if (session.messages.length > 10) {
      session.messages = session.messages.slice(-10);
    }

    session.lastActivityAt = new Date();

    await this.redis.hset(`session:${sessionId}`, {
      sessionId: session.sessionId,
      problem: session.problem ? JSON.stringify(session.problem) : '',
      messages: JSON.stringify(session.messages),
      createdAt: session.createdAt.toISOString(),
      lastActivityAt: session.lastActivityAt.toISOString(),
    });

    // Set TTL to 30 minutes
    await this.redis.expire(`session:${sessionId}`, 1800);
  }
}
```

### Authentication and Authorization

#### Auth Flow

N/A - No authentication required per PRD (anonymous sessions only). Session management uses session IDs generated on the frontend.

#### Developer Testing Interface Access Control

**Environment-Based Access Control:**
- **Development Environment:** Developer testing interface fully accessible via `/dev/testing` route
- **Production Environment:** Developer testing interface completely excluded from build
- **Access Check:** Frontend checks `NODE_ENV === 'development'` before rendering testing interface
- **Backend Protection:** All `/api/dev/*` endpoints check environment and return 403 Forbidden in production
- **Build-Time Exclusion:** Developer testing components and services excluded via conditional compilation or environment checks

**Implementation:**
```typescript
// apps/web/src/components/DeveloperTesting/DeveloperTestingInterface.tsx
if (import.meta.env.MODE !== 'development') {
  return null; // Component not rendered in production
}

// apps/api/src/functions/testing/handler.ts
if (process.env.NODE_ENV === 'production') {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: 'Testing endpoints not available in production' }),
  };
}
```
