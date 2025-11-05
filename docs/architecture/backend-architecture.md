# Backend Architecture

### Service Architecture

#### Serverless Architecture (Firebase Cloud Functions)

Since the architecture uses serverless Firebase Cloud Functions, the backend is organized as Express app routes integrated with Cloud Functions:

##### Function Organization

```
functions/
├── index.ts              # Firebase Functions entry point
├── src/
│   ├── server.ts         # Express app
│   ├── routes/
│   │   ├── health.ts
│   │   ├── problem.ts
│   │   └── chat.ts
│   ├── controllers/
│   │   ├── healthController.ts
│   │   ├── problemController.ts
│   │   └── chatController.ts
│   ├── services/
│   │   ├── vision/
│   │   │   └── visionApi.ts
│   │   ├── llm/
│   │   │   └── llmApi.ts
│   │   ├── answerDetection/
│   │   │   ├── keywordDetection.ts
│   │   │   └── llmValidation.ts
│   │   ├── context/
│   │   │   └── contextService.ts
│   │   └── testing/
│   │       ├── testFixtures.ts
│   │       ├── scenarioRunner.ts
│   │       └── testValidator.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── cors.ts
│   │   └── validation.ts
│   ├── types/
│   │   ├── problem.ts
│   │   ├── message.ts
│   │   └── session.ts
│   └── utils/
│       ├── logger.ts
│       └── config.ts
└── lib/                   # Compiled JavaScript
```

##### Firebase Functions Integration

```typescript
// functions/index.ts
import { onRequest } from 'firebase-functions/v2/https';
import app from './src/server';

// Export Express app as Firebase Function
export const api = onRequest(
  {
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 30,
  },
  app
);

// Express app handles all routes
// functions/src/server.ts
import express from 'express';
import healthRoutes from './routes/health';
import problemRoutes from './routes/problem';
import chatRoutes from './routes/chat';

const app = express();
app.use('/api', healthRoutes);
app.use('/api/problem', problemRoutes);
app.use('/api/chat', chatRoutes);
export default app;
```

### Database Architecture

#### Schema Design

N/A - No persistent database. Session storage uses Firestore with TTL policies for automatic cleanup. Schema structure:

```
sessions/
  {sessionId}/
    createdAt: timestamp
    lastActivity: timestamp
    expiresAt: timestamp  // For TTL-based cleanup
    messages: [
      { messageId, role, content, timestamp }
    ]
    problem: { problemType, problemText, ... }
```

#### Data Access Layer

```typescript
// functions/src/services/context/contextService.ts
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { Session, Message, Problem } from '../../types';

export class ContextService {
  private db = getFirestore();

  async getContext(sessionId: string): Promise<Session | null> {
    const doc = await this.db.collection('sessions').doc(sessionId).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    return {
      sessionId: data!.sessionId,
      problem: data!.problem || null,
      messages: data!.messages || [],
      createdAt: data!.createdAt.toDate(),
      lastActivityAt: data!.lastActivityAt.toDate(),
    };
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const session = (await this.getContext(sessionId)) || {
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

    await this.db
      .collection('sessions')
      .doc(sessionId)
      .set(
        {
          sessionId: session.sessionId,
          problem: session.problem,
          messages: session.messages,
          createdAt: Timestamp.fromDate(session.createdAt),
          lastActivityAt: Timestamp.fromDate(session.lastActivityAt),
          expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 60 * 1000)), // 30 minutes TTL
        },
        { merge: true }
      );

    // TTL policy configured in Firestore for automatic cleanup
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

// functions/src/routes/testing.ts
import { Router } from 'express';
const router = Router();

// Testing endpoints only available in development
if (process.env.NODE_ENV === 'production') {
  router.use((req, res) => {
    res.status(403).json({
      error: 'Testing endpoints not available in production',
    });
  });
}

// ... testing routes ...
export default router;
```
