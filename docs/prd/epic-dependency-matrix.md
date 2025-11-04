# Epic Dependency Matrix

### Cross-Epic Dependencies

**Epic 1 → Epic 2 Dependencies:**
- All Epic 2 stories require Epic 1 infrastructure (monorepo, React app, backend API structure)
- Epic 2 Story 2.1 (LLM Integration) requires Epic 1 Story 1.3 (Backend API Structure) for API endpoints
- Epic 2 Story 2.2 (Dialogue Generation) requires Epic 1 Story 1.7 (Problem Validation) for problem type identification
- Epic 2 Story 2.6 (Context Management) requires Epic 1 Story 1.3 (Backend API Structure) for session storage setup
- Epic 2 Story 2.7 (Chat UI Component) requires Epic 1 Story 1.2 (React Frontend Shell) for layout structure

**Epic 1 → Epic 3 Dependencies:**
- All Epic 3 stories require Epic 1 infrastructure (React app, Tailwind CSS, component structure)
- Epic 3 Story 3.1 (Math Rendering) requires Epic 1 Story 1.8 (Problem Display Component) for problem rendering
- Epic 3 Story 3.2 (Visual Feedback Components) requires Epic 1 Story 1.2 (React Frontend Shell) for layout
- Epic 3 Story 3.3 (Responsive Design) requires Epic 1 Story 1.2 (React Frontend Shell) for base layout

**Epic 2 → Epic 3 Dependencies:**
- Epic 3 Story 3.1 (Math Rendering) requires Epic 2 Story 2.7 (Chat UI Component) for message rendering
- Epic 3 Story 3.2 (Visual Feedback Components) requires Epic 2 Story 2.7 (Chat UI Component) for integration
- Epic 3 Story 3.5 (Comprehensive Testing) requires all Epic 2 stories for full system testing

### Epic-Level Dependency Diagram

```
Epic 1 (Foundation)
    ↓
    ├─→ Epic 2 (Socratic Dialogue)
    │       ↓
    │       └─→ Epic 3 (Visual Feedback & Polish)
    │
    └─→ Epic 3 (Visual Feedback & Polish)
```

### Story-Level Dependencies Within Epic 1

**Story 1.1 (Foundation & Project Setup)** → **All other Epic 1 stories**
- Foundation for all subsequent work
- Provides: monorepo structure, Git, CI/CD, deployment infrastructure

**Story 1.2 (React Frontend Shell)** → **Stories 1.4, 1.5, 1.8**
- Provides: Side-by-side layout required for problem input and display components

**Story 1.3 (Backend API Structure)** → **Stories 1.6, 1.7**
- Provides: Express API structure required for Vision API and validation endpoints

**Story 1.4 (Text Input)** → **Story 1.7 (Problem Validation)**
- Text input requires validation before problem display

**Story 1.5 (Image Upload UI)** → **Story 1.6 (Vision API Integration)**
- Image upload UI requires Vision API backend endpoint

**Story 1.6 (Vision API Integration)** → **Story 1.7 (Problem Validation)**
- Parsed image text requires validation before problem display

**Story 1.7 (Problem Validation)** → **Story 1.8 (Problem Display)**
- Validated problem required before display

**Story 1.9 (Developer Testing Interface)** → **All Epic 1 stories**
- Testing interface depends on all input, validation, and display functionality

### Story-Level Dependencies Within Epic 2

**Story 2.1 (LLM Integration Service)** → **Stories 2.2, 2.4, 2.5**
- LLM service required for dialogue generation, validation, and rewriting

**Story 2.2 (Dialogue Generation Endpoint)** → **Stories 2.3, 2.4, 2.5, 2.6, 2.7**
- Dialogue generation requires answer detection, blocking, context management, and chat UI

**Story 2.3 (Keyword-Based Detection)** → **Story 2.5 (Answer Blocking)**
- Keyword detection feeds into answer blocking logic

**Story 2.4 (LLM-Based Validation)** → **Story 2.5 (Answer Blocking)**
- LLM validation feeds into answer blocking logic

**Story 2.5 (Answer Blocking)** → **Story 2.2 (Dialogue Generation)**
- Answer blocking must be applied before sending responses from dialogue generation

**Story 2.6 (Context Management)** → **Story 2.2 (Dialogue Generation)**
- Context management provides conversation history for dialogue generation

**Story 2.8 (Progressive Help Escalation)** → **Story 2.2 (Dialogue Generation)**
- Help escalation modifies prompts for dialogue generation

**Story 2.7 (Chat UI Component)** → **Story 2.2 (Dialogue Generation)**
- Chat UI displays responses from dialogue generation endpoint

### Story-Level Dependencies Within Epic 3

**Story 3.1 (Math Rendering)** → **Stories 1.8 (Problem Display), 2.7 (Chat UI)**
- Math rendering required for both problem display and chat messages

**Story 3.2 (Visual Feedback Components)** → **Story 2.7 (Chat UI Component)**
- Visual feedback integrates with chat interface

**Story 3.3 (Responsive Design)** → **Stories 1.2 (Frontend Shell), 2.7 (Chat UI)**
- Responsive design applies to all layout components

**Story 3.4 (Age-Appropriate Styling)** → **All Epic 3 stories**
- Styling applies across all visual components

**Story 3.5 (Comprehensive Testing)** → **All Epic 1, 2, and 3 stories**
- Comprehensive testing validates entire system

**Story 3.6 (Final UI Polish)** → **All Epic 3 stories**
- Final polish applies to all visual components

### Critical Path Dependencies

**Critical Path 1: Problem Input → Validation → Display**
```
1.1 (Foundation) → 1.2 (Frontend Shell) → 1.3 (Backend API)
    → 1.4 (Text Input) OR 1.5 (Image Upload) → 1.6 (Vision API) [if image]
    → 1.7 (Validation) → 1.8 (Problem Display)
```

**Critical Path 2: Dialogue System → Answer Detection → Chat UI**
```
2.1 (LLM Integration) → 2.2 (Dialogue Generation)
    → 2.3 (Keyword Detection) + 2.4 (LLM Validation) → 2.5 (Answer Blocking)
    → 2.6 (Context Management) [parallel with 2.2]
    → 2.7 (Chat UI) → 2.8 (Help Escalation) [enhances 2.2]
```

**Critical Path 3: Visual Polish → Math Rendering → Final Testing**
```
3.1 (Math Rendering) → 3.2 (Visual Feedback) → 3.3 (Responsive Design)
    → 3.4 (Styling) → 3.5 (Testing) → 3.6 (Final Polish)
```

### Dependency Notes

**Parallel Development Opportunities:**
- Stories 1.4 (Text Input) and 1.5 (Image Upload) can be developed in parallel
- Stories 2.3 (Keyword Detection) and 2.4 (LLM Validation) can be developed in parallel
- Stories 3.1 (Math Rendering), 3.2 (Visual Feedback), and 3.3 (Responsive Design) can be developed in parallel

**Blocking Dependencies:**
- Story 1.1 (Foundation) blocks all other stories
- Story 1.2 (Frontend Shell) blocks frontend components (1.4, 1.5, 1.8)
- Story 1.3 (Backend API) blocks backend endpoints (1.6, 1.7)
- Story 2.1 (LLM Integration) blocks dialogue generation (2.2)
- Story 2.2 (Dialogue Generation) blocks chat UI (2.7)

**Technical Dependencies:**
- All stories require TypeScript and ESLint configuration (from 1.1)
- All frontend stories require Tailwind CSS setup (from 1.2)
- All backend stories require Express API structure (from 1.3)
- All Epic 2 stories require Epic 1 infrastructure
- All Epic 3 stories require Epic 1 and Epic 2 infrastructure
