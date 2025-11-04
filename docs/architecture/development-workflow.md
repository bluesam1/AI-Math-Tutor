# Development Workflow

### Local Development Setup

#### Prerequisites

```bash
# Required software
- Node.js (v18 or later)
- npm (v9 or later)
- AWS CLI (for deployment)
- Git

# Optional (for local Redis testing)
- Docker (for local Redis instance)
```

#### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd ai-math-tutor

# Install dependencies
npm install

# Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Set up environment variables
# Edit .env files with API keys and configuration
```

#### Development Commands

```bash
# Start all services
npm run dev

# Start frontend only
npm run dev:web

# Start backend only
npm run dev:api

# Run tests
npm test

# Run tests for specific problem type
npm test -- --grep "arithmetic"
npm test -- --grep "algebra"
npm test -- --grep "answer-detection"

# Run scenario tests
npm run test:scenarios

# Run answer detection tests
npm run test:answer-detection

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage

# Run manual testing helpers
npm run test:manual -- --problem-type arithmetic
npm run test:manual -- --scenario basic-addition

# Run linting
npm run lint

# Build for production
npm run build
```

### Environment Configuration

#### Required Environment Variables

```bash
# Frontend (.env.local)
VITE_API_BASE_URL=https://api.aimathtutor.com

# Backend (.env)
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Redis Configuration
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# External API Keys
OPENAI_API_KEY=your-openai-key
# OR (for LLM)
CLAUDE_API_KEY=your-claude-key

# Serverless Configuration
STAGE=dev
REGION=us-east-1
```
