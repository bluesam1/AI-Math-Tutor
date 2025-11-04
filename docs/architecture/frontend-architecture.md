# Frontend Architecture

### Component Architecture

#### Component Organization

```
apps/web/src/
├── components/
│   ├── ProblemInput/
│   │   ├── ProblemInput.tsx
│   │   ├── ImageUpload.tsx
│   │   └── index.ts
│   ├── ProblemDisplay/
│   │   ├── ProblemDisplay.tsx
│   │   ├── MathRenderer.tsx
│   │   └── index.ts
│   ├── ChatInterface/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── index.ts
│   ├── VisualFeedback/
│   │   ├── VisualFeedback.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── Encouragement.tsx
│   │   └── index.ts
│   ├── Layout/
│   │   ├── SideBySideLayout.tsx
│   │   └── index.ts
│   └── DeveloperTesting/
│       ├── DeveloperTestingInterface.tsx
│       ├── TestProblemLibrary.tsx
│       ├── ScenarioTestingPanel.tsx
│       ├── TestResultsDashboard.tsx
│       ├── EdgeCaseTesting.tsx
│       └── index.ts
├── hooks/
│   ├── useSession.ts
│   ├── useChat.ts
│   └── useProblem.ts
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   ├── problem.ts
│   │   ├── chat.ts
│   │   ├── session.ts
│   │   └── testing.ts
│   └── math/
│       └── renderer.ts
├── types/
│   ├── problem.ts
│   ├── message.ts
│   └── session.ts
├── utils/
│   ├── formatting.ts
│   └── validation.ts
└── styles/
    └── globals.css
```

#### Component Template

```typescript
import React from 'react';
import { Problem } from '@/types/problem';

interface ProblemInputProps {
  onProblemSubmit: (problem: Problem) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  onProblemSubmit,
  onImageUpload,
}) => {
  // Component implementation
  return (
    <div className="problem-input">
      {/* Component JSX */}
    </div>
  );
};
```

### State Management Architecture

#### State Structure

```typescript
// State management using React Context
interface AppState {
  session: Session | null;
  problem: Problem | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

interface AppContextValue {
  state: AppState;
  actions: {
    setProblem: (problem: Problem) => void;
    addMessage: (message: Message) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
}
```

#### State Management Patterns

- **React Context API:** Global state for session, problem, and messages
- **Local State (useState):** Component-specific state (input values, UI state)
- **Custom Hooks:** Encapsulated state logic (useSession, useChat, useProblem)
- **No External State Library:** Simple state needs don't require Redux/Zustand for MVP

### Routing Architecture

#### Route Organization

```
apps/web/src/
├── App.tsx                 # Root component with routing
├── pages/
│   ├── HomePage.tsx       # Main problem-solving interface
│   └── NotFoundPage.tsx    # 404 page
```

**Route Structure:**
- `/` - Main problem-solving interface (side-by-side layout)
- `/dev/testing` - Developer testing interface (development only, hidden in production)
- No additional routes needed for MVP (single-page application)

#### Protected Route Pattern

N/A - No authentication required per PRD (anonymous sessions only)

### Frontend Services Layer

#### API Client Setup

```typescript
// apps/web/src/services/api/client.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.aimathtutor.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for LLM responses
});

// Request interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    return Promise.reject(error);
  }
);
```

#### Service Example

```typescript
// apps/web/src/services/api/chat.ts
import { apiClient } from './client';
import { Message, ChatResponse } from '@/types/message';

export const chatService = {
  sendMessage: async (
    sessionId: string,
    message: string,
    problemId?: string
  ): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/api/chat/message', {
      sessionId,
      message,
      problemId,
    });
    return response.data;
  },
};
```

#### Developer Testing Service Example

```typescript
// apps/web/src/services/api/testing.ts
import { apiClient } from './client';
import { TestFixture, TestResult, BatchTestResult } from '@/types/testing';

export const testingService = {
  getTestFixtures: async (problemType?: string): Promise<TestFixture[]> => {
    const params = problemType ? { problemType } : {};
    const response = await apiClient.get<{ fixtures: TestFixture[] }>(
      '/api/dev/test-fixtures',
      { params }
    );
    return response.data.fixtures;
  },

  runScenario: async (scenario: string, problemType?: string): Promise<TestResult> => {
    const response = await apiClient.post<TestResult>('/api/dev/run-scenario', {
      scenario,
      problemType,
    });
    return response.data;
  },

  runBatch: async (scenarios: string[]): Promise<BatchTestResult> => {
    const response = await apiClient.post<BatchTestResult>('/api/dev/run-batch', {
      scenarios,
    });
    return response.data;
  },
};
```

**Note:** The testing service is only available in development environment. Production builds exclude this service and its endpoints return 403 Forbidden.
