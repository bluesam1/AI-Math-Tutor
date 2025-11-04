# Data Models

### Session

**Purpose:** Represents a browser session with conversation context and current problem state.

**Key Attributes:**

- `sessionId`: string - Unique session identifier
- `problem`: Problem | null - Current problem being solved
- `messages`: Message[] - Last 10 messages (user inputs and system responses)
- `createdAt`: Date - Session creation timestamp
- `lastActivityAt`: Date - Last activity timestamp for expiration

**TypeScript Interface:**

```typescript
interface Session {
  sessionId: string;
  problem: Problem | null;
  messages: Message[];
  createdAt: Date;
  lastActivityAt: Date;
}
```

**Relationships:**

- Contains one optional Problem
- Contains multiple Messages (max 10)

### Problem

**Purpose:** Represents a math problem submitted by the student.

**Key Attributes:**

- `id`: string - Unique problem identifier
- `text`: string - Problem statement text
- `type`: ProblemType - Problem category (arithmetic, algebra, geometry, word, multi-step)
- `source`: ProblemSource - Input method (text or image)
- `imageUrl?`: string - Optional image URL if uploaded (temporary)
- `createdAt`: Date - Problem submission timestamp

**TypeScript Interface:**

```typescript
enum ProblemType {
  ARITHMETIC = 'arithmetic',
  ALGEBRA = 'algebra',
  GEOMETRY = 'geometry',
  WORD = 'word',
  MULTI_STEP = 'multi-step',
}

enum ProblemSource {
  TEXT = 'text',
  IMAGE = 'image',
}

interface Problem {
  id: string;
  text: string;
  type: ProblemType;
  source: ProblemSource;
  imageUrl?: string;
  createdAt: Date;
}
```

**Relationships:**

- Belongs to one Session
- Has multiple Messages in conversation

### Message

**Purpose:** Represents a single message in the conversation (user input or system response).

**Key Attributes:**

- `id`: string - Unique message identifier
- `role`: MessageRole - Message sender (user or system)
- `content`: string - Message text content
- `timestamp`: Date - Message timestamp
- `metadata?`: MessageMetadata - Optional metadata (e.g., help level, validation result)

**TypeScript Interface:**

```typescript
enum MessageRole {
  USER = 'user',
  SYSTEM = 'system',
}

interface MessageMetadata {
  helpLevel?: number; // Progressive help escalation level
  answerDetected?: boolean; // Whether answer detection guardrail triggered
  validationResult?: string; // Student response validation result
}

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}
```

**Relationships:**

- Belongs to one Session
- References one Problem
