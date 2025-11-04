# AI Math Tutor

AI Math Tutor is a Socratic dialogue system for math problem solving, designed to help students learn through guided questioning rather than direct answers.

## Project Overview

This project uses a monorepo structure with npm workspaces to manage both frontend and backend applications, along with shared packages.

## Technology Stack

- **Runtime**: Node.js 18.x LTS or 20.x LTS
- **Package Manager**: npm 9.0.0+
- **Frontend**: React 18.2.0 + Vite 5.0.0 + TypeScript 5.3.0+
- **Backend**: Express 4.18.0 + TypeScript 5.3.0+
- **Linting**: ESLint 8.55.0 + Prettier 3.1.0
- **Build Tool**: Vite for frontend

## Monorepo Structure

```
ai-math-tutor/
├── apps/
│   ├── web/          # React frontend application
│   └── api/          # Express backend API (legacy, migrated to functions/)
├── functions/         # Firebase Cloud Functions (Express API)
├── packages/
│   └── shared/       # Shared types and utilities
├── .github/
│   └── workflows/    # CI/CD workflows
└── docs/             # Project documentation
```

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   # Copy the example file (create .env.example if needed)
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Verify the setup:**
   ```bash
   npm run lint      # Check code quality
   npm run build     # Build all workspaces
   ```

## Development Workflow

### Frontend Development

```bash
# Start the development server
npm run dev:web

# Build the frontend
npm run build:web
```

The frontend will be available at `http://localhost:3000`

### Backend Development

```bash
# Start Firebase emulators (functions + hosting)
npm run dev:emulators

# Or start backend development server (standalone)
npm run dev:api

# Build the backend
npm run build:functions
```

### Running All Workspaces

```bash
# Build all workspaces
npm run build

# Run tests across all workspaces
npm test

# Lint all code
npm run lint
```

## Workspace Scripts

### Root Level

- `npm run lint` - Lint all TypeScript files
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check code formatting
- `npm run build` - Build all workspaces
- `npm test` - Run tests in all workspaces

### Frontend (apps/web)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (functions/)

- `npm run build` - Compile TypeScript to JavaScript
- `npm run serve` - Start Firebase emulators (functions only)
- `npm run deploy` - Deploy functions to Firebase
- `npm run logs` - View function logs

## Environment Variables

Required environment variables are documented in `.env.example` files. Create `.env` files in the appropriate directories:

### Functions (functions/.env)

- `NODE_ENV` - Environment (development, production)
- `FRONTEND_URL` - Frontend origin for CORS (default: http://localhost:3000)
- `OPENAI_API_KEY` - OpenAI API key (for future stories)

**Important**: Never commit `.env` files to the repository.

### Production Environment Variables

Set environment variables for deployed Firebase Functions via Firebase CLI:

```bash
firebase functions:config:set env.node_env="production"
firebase functions:config:set env.frontend_url="https://your-domain.web.app"
```

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD:

- **CI Workflow** (`.github/workflows/ci.yaml`): Runs on push and pull requests
  - Lints code with ESLint
  - Checks formatting with Prettier
  - Builds all workspaces
  - Runs tests

- **Deploy Workflow** (`.github/workflows/deploy.yaml`): Runs on push to main branch
  - Builds frontend and functions
  - Deploys to Firebase (hosting + functions)

## Deployment

### Firebase Deployment

The application is deployed to Firebase (Hosting + Cloud Functions):

- **Frontend**: Firebase Hosting with global CDN
- **Backend**: Firebase Cloud Functions (us-central1)
- **Session Storage**: Firestore with TTL policies

**Setup Instructions:**

1. **Install Firebase CLI:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**

   ```bash
   firebase login
   ```

3. **Set Firebase Project:**

   ```bash
   firebase use --add
   # Select your Firebase project
   ```

4. **Deploy Everything:**

   ```bash
   # Build and deploy functions
   npm run deploy:functions

   # Build and deploy hosting
   npm run deploy:hosting

   # Or deploy everything
   npm run deploy
   ```

5. **View Deployment:**

   - Functions: `https://us-central1-{project-id}.cloudfunctions.net/api`
   - Hosting: `https://{project-id}.web.app` or `https://{project-id}.firebaseapp.com`

### Local Development with Emulators

```bash
# Start Firebase emulators (functions + hosting)
npm run dev:emulators

# Emulator UI: http://localhost:4000
# Functions: http://localhost:5001
# Hosting: http://localhost:5000
```

## TypeScript Configuration

The project uses TypeScript project references for cross-workspace type checking:

- Root `tsconfig.json` - Base configuration and project references
- `apps/web/tsconfig.json` - React frontend configuration
- `functions/tsconfig.json` - Firebase Functions configuration (CommonJS)
- `packages/shared/tsconfig.json` - Shared package configuration

## Code Quality

- **ESLint**: Configured for TypeScript and React
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Strict type checking enabled

All code must pass linting checks before merging.

## Testing

Testing infrastructure will be set up in later stories. For now, the CI/CD pipeline will verify that builds complete successfully.

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all linting and tests pass
4. Submit a pull request

## License

MIT
