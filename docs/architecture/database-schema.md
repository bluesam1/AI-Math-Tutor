# Database Schema

Since the system uses in-memory session storage (Redis) with no persistent database, the schema is defined as Redis data structures:

### Redis Schema

**Session Storage (Hash):**
- Key: `session:{sessionId}`
- Fields:
  - `sessionId`: string
  - `problem`: JSON string (Problem object)
  - `messages`: JSON array (Message[] array, max 10 items)
  - `createdAt`: ISO timestamp string
  - `lastActivityAt`: ISO timestamp string

**Session Expiration:**
- TTL: 30 minutes of inactivity (configurable)
- Automatic cleanup via Redis TTL

**Example Redis Structure:**
```
session:abc123
  sessionId: "abc123"
  problem: '{"id":"prob1","text":"Solve 2x + 5 = 13","type":"algebra",...}'
  messages: '[{"id":"msg1","role":"user","content":"What is x?",...},...]'
  createdAt: "2025-01-XXT10:00:00Z"
  lastActivityAt: "2025-01-XXT10:15:00Z"
```

**Rationale:**
- No persistent storage required per PRD
- Fast in-memory access for session context
- Automatic expiration prevents data accumulation
- Cost-effective for anonymous sessions
