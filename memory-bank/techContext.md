# Technical Context: AI Math Tutor

**Last Updated:** 2025-01-XX  
**Version:** 1.0

## Technologies Used

### Frontend Stack

- **React 18.2.0:** Component-based UI framework
- **TypeScript 5.3.0+:** Type-safe development (required - no raw JavaScript)
- **Vite 5.0.0:** Build tool and development server
- **Tailwind CSS v4.1.16:** Utility-first CSS framework
- **LaTeX/KaTeX:** Mathematical equation rendering

### Backend Stack

- **Node.js 18.x LTS or 20.x LTS:** Runtime environment
- **Express 4.18.0:** Web framework for API endpoints
- **TypeScript 5.3.0+:** Type-safe development (required - no raw JavaScript)
- **Firebase Functions:** Firebase Cloud Functions deployment with Express app integration

### Infrastructure & Deployment

- **Firebase Hosting:** Frontend static asset hosting with global CDN
- **Firebase Cloud Functions:** Serverless backend API endpoints (us-central1)
- **Firebase Hosting Rewrites:** API routing, connecting frontend to Cloud Functions
- **Firestore:** Session storage (last 10 messages) with TTL policies
- **Firebase CLI:** Unified deployment tool for functions, hosting, and database

### External Services

- **OpenAI Vision API:** Image parsing for printed text extraction
- **LLM API:** OpenAI GPT-4 or Claude for Socratic dialogue generation and validation

### Development Tools

- **npm 9.0.0+:** Package manager and workspace management
- **ESLint 8.55.0:** Code linting with TypeScript support
- **Prettier 3.1.0:** Code formatting
- **Git:** Version control
- **TypeScript:** Type checking and compilation

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git for version control

### Installation Steps

1. **Clone repository:**

   ```bash
   git clone <repository-url>
   cd AI-Math-Tutor
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `functions/.env.example` to `functions/.env`
   - Configure required environment variables:
     - `NODE_ENV` - Environment (development, production)
     - `FRONTEND_URL` - Frontend origin for CORS (default: http://localhost:3000)
     - `OPENAI_API_KEY` - OpenAI API key (for Vision API and LLM)
     - `ANTHROPIC_API_KEY` - Anthropic API key (alternative LLM)

4. **Verify setup:**
   ```bash
   npm run lint      # Check code quality
   npm run build     # Build all workspaces
   ```

### Development Workflow

#### Frontend Development

```bash
# Start development server
npm run dev:web

# Frontend available at http://localhost:3000
```

#### Backend Development

```bash
# Start Firebase emulators (functions + hosting)
npm run dev:emulators

# Or start backend development server (standalone)
npm run dev:api

# Backend API available at http://localhost:5000/api (emulator) or http://localhost:3001 (standalone)
```

#### Running All Workspaces

```bash
# Build all workspaces
npm run build

# Lint all code
npm run lint

# Format code
npm run format
```

## Technical Constraints

### TypeScript Requirement

- **All code must be written in TypeScript** (no raw JavaScript)
- All source files must use `.ts` or `.tsx` extensions
- ESLint with TypeScript support is required
- All code must pass linting checks before deployment

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript runtime required (React and application functionality)
- Responsive design for desktop, tablet, and mobile browsers

### Performance Requirements

- **LLM Response Time:** < 3 seconds for LLM-generated responses
- **Visual Feedback:** Smooth interactions without noticeable lag
- **Image Processing:** Efficient Vision API integration with timeout handling

### API Rate Limits

- Graceful handling of API rate limits (Vision API, LLM API)
- Appropriate error messages when rate limits are reached
- Retry logic or queuing when rate limits are encountered

## Dependencies

### Root Level Dependencies

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.57.1",
    "eslint-config-prettier": "^9.1.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^4.6.2",
    "prettier": "^3.6.2",
    "typescript": "^5.9.3"
  }
}
```

### Frontend Dependencies (apps/web/)

- React 18.2.0
- TypeScript 5.3.0+
- Vite 5.0.0
- Tailwind CSS v4.1.16
- LaTeX/KaTeX (for math rendering)

### Backend Dependencies (functions/)

- Express 4.18.0
- TypeScript 5.3.0+
- @types/express, @types/node
- firebase-admin (for server-side Firebase operations)
- firebase-functions (for Cloud Functions integration)
- dotenv (for environment variable management in local development)

## Build Configuration

### TypeScript Configuration

- **Root `tsconfig.json`:** Base configuration and project references
- **`apps/web/tsconfig.json`:** React frontend configuration
- **`apps/api/tsconfig.json`:** Node.js backend configuration
- **`packages/shared/tsconfig.json`:** Shared package configuration

### Build Commands

- **Frontend:** `npm run build:web` → `apps/web/dist/`
- **Backend:** `npm run build:api` → `apps/api/dist/`
- **All Workspaces:** `npm run build` → builds all workspaces

## Deployment Configuration

### Frontend Deployment (AWS Amplify)

- **Build Command:** `npm run build:web`
- **Output Directory:** `apps/web/dist`
- **Configuration:** `amplify.yml` (build settings for monorepo)

### Backend Deployment (Firebase Cloud Functions)

- **Firebase Functions:** `functions/index.ts` exports Express app as Cloud Function
- **Firebase Configuration:** `firebase.json` defines functions and hosting
- **Deployment:** Firebase CLI (`firebase deploy --only functions`)

### Environment Variables

- **Development:** `.env` files in `functions/` directory (never committed)
- **Production:** Firebase Functions Config or Secret Manager
- **Required Variables:**
  - API keys (OpenAI, Anthropic)
  - Frontend URL for CORS configuration

## Code Quality Standards

### Linting

- **ESLint:** Configured for TypeScript and React
- **Prettier:** Code formatting with consistent style
- **TypeScript:** Strict type checking enabled
- **Pre-commit:** All code must pass linting checks before merging

### Code Organization

- **Monorepo Structure:** Clear separation of frontend, backend, and shared code
- **TypeScript Project References:** Cross-workspace type checking
- **Modular Architecture:** Routes, controllers, services, middleware separation

## Testing Strategy

### Current Status

- Testing infrastructure planned for future stories
- CI/CD pipeline verifies builds complete successfully
- Manual testing for pedagogical quality and user experience

### Planned Testing

- **Unit Tests:** Component-level testing for React components, function-level testing for backend logic
- **Integration Tests:** API endpoint testing, Vision API integration, LLM integration with guardrail validation
- **Manual Testing:** Socratic dialogue quality, visual feedback effectiveness, cross-browser compatibility

## Security Considerations

### API Key Management

- **Storage:** Environment variables (never committed to repository)
- **Access:** Backend-only access (never exposed in client-side code)
- **Configuration:** `.env.example` template for required variables

### Input Sanitization

- **Text Input:** Sanitization for all text inputs to prevent security vulnerabilities
- **Image Upload:** Validation for file format, size limits (max 10MB)
- **Error Messages:** Age-appropriate error messages (no technical details exposed)

### Session Management

- **Storage:** Session storage (Firestore with TTL policies)
- **Expiration:** Sessions expire after 30 minutes of inactivity via Firestore TTL
- **Privacy:** No sensitive user data collection (anonymous sessions only)
