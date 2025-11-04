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
│   └── api/          # Express backend API
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
# Start the backend development server
npm run dev:api

# Build the backend
npm run build:api
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

### Backend (apps/api)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run production build

## Environment Variables

Required environment variables are documented in `.env.example`. Create a `.env` file in the root directory with your configuration:

- `AWS_REGION` - AWS region for deployment (default: us-east-1)
- `AMPLIFY_APP_ID` - AWS Amplify App ID (for manual deployment)
- `OPENAI_API_KEY` - OpenAI API key (for future stories)
- `ANTHROPIC_API_KEY` - Anthropic API key (for future stories)
- `REDIS_HOST` - ElastiCache Redis host (for future stories)
- `REDIS_PORT` - Redis port (default: 6379)

**Important**: Never commit `.env` files to the repository.

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD:

- **CI Workflow** (`.github/workflows/ci.yaml`): Runs on push and pull requests
  - Lints code with ESLint
  - Checks formatting with Prettier
  - Builds all workspaces
  - Runs tests

- **Deploy Workflow** (`.github/workflows/deploy.yaml`): Runs on push to main branch
  - Builds frontend
  - Deploys to AWS Amplify (configured for auto-deployment via Amplify Console)

## Deployment

### Frontend Deployment (AWS Amplify)

The frontend is deployed to AWS Amplify:

- **Build Command**: `npm run build:web`
- **Output Directory**: `apps/web/dist`
- **Configuration**: `amplify.yml` (build settings for monorepo)

**Setup Instructions:**

1. **Connect GitHub Repository to AWS Amplify:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Select "GitHub" as the source
   - Authorize and select this repository
   - Select the `main` branch
   - Amplify will automatically detect `amplify.yml` and configure the build

2. **Manual Deployment (Optional):**

   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify publish
   ```

3. **Auto-Deployment:**
   - Once connected, Amplify will automatically deploy on every push to `main`
   - Build status and URL will be available in the Amplify Console

## TypeScript Configuration

The project uses TypeScript project references for cross-workspace type checking:

- Root `tsconfig.json` - Base configuration and project references
- `apps/web/tsconfig.json` - React frontend configuration
- `apps/api/tsconfig.json` - Node.js backend configuration
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
