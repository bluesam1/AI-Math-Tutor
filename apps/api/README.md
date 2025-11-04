# AI Math Tutor API

Backend API for the AI Math Tutor application, built with Express.js and TypeScript.

## Development

### Local Development

Run the API server locally:

```bash
npm run dev
```

The server will start on `http://localhost:3001`.

### Serverless Offline (Local Lambda Testing)

Test the serverless deployment locally:

```bash
npm run build
npm run dev:offline
```

This starts the serverless-offline plugin, simulating AWS Lambda and API Gateway locally.

## Deployment

### Prerequisites

1. **Install AWS CLI**: See [docs/INSTALL_AWS_CLI.md](docs/INSTALL_AWS_CLI.md)
2. **Get AWS Credentials**: See [docs/GET_AWS_CREDENTIALS.md](docs/GET_AWS_CREDENTIALS.md)
3. **Configure AWS CLI**: See [docs/AWS_CLI_SETUP.md](docs/AWS_CLI_SETUP.md)

For detailed setup instructions, see:
- [docs/AWS_SETUP.md](docs/AWS_SETUP.md) - Complete AWS setup guide
- [docs/AWS_SETUP_CHECKLIST.md](docs/AWS_SETUP_CHECKLIST.md) - Setup checklist
- [docs/AWS_READY_TO_DEPLOY.md](docs/AWS_READY_TO_DEPLOY.md) - Pre-deployment guide

### Deploy to AWS

Build and deploy to development stage:
```bash
npm run deploy:dev
```

Build and deploy to production stage:
```bash
npm run deploy:prod
```

Deploy to a specific stage:
```bash
npm run build
serverless deploy --stage staging
```

### Remove Deployment

Remove the deployed stack:
```bash
npm run remove
```

For deployment troubleshooting, see [docs/DEPLOYMENT_FIX.md](docs/DEPLOYMENT_FIX.md).

## Environment Variables

Required environment variables (see `.env.example`):

- `NODE_ENV` - Environment (development, production)
- `FRONTEND_URL` - Frontend origin for CORS
- `OPENAI_API_KEY` - OpenAI API key (for future stories)
- `ANTHROPIC_API_KEY` - Anthropic Claude API key (alternative, for future stories)
- `AWS_REGION` - AWS region (automatically provided by Lambda, don't set manually)
- `REDIS_HOST` - ElastiCache Redis host (for future stories)
- `REDIS_PORT` - ElastiCache Redis port (for future stories)

## API Endpoints

### Health Check

```
GET /api/health
```

Returns API status and environment information.
```

## Project Structure

```
apps/api/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── functions/       # Lambda function handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── server.ts        # Express server entry point
├── serverless.yml       # Serverless Framework configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Architecture

- **Runtime**: Node.js 20.x on AWS Lambda
- **Framework**: Express.js with serverless-http wrapper
- **API Gateway**: AWS HTTP API
- **Deployment**: Serverless Framework
- **Region**: us-east-2 (configurable in serverless.yml)

## Documentation

Detailed documentation is available in the `docs/` folder:

- **[AWS Setup](docs/AWS_SETUP.md)** - Complete AWS setup guide
- **[AWS Setup Checklist](docs/AWS_SETUP_CHECKLIST.md)** - Setup verification checklist
- **[AWS CLI Setup](docs/AWS_CLI_SETUP.md)** - Installing and configuring AWS CLI
- **[Get AWS Credentials](docs/GET_AWS_CREDENTIALS.md)** - Step-by-step guide to get AWS credentials
- **[Install AWS CLI](docs/INSTALL_AWS_CLI.md)** - Multiple installation methods
- **[Ready to Deploy](docs/AWS_READY_TO_DEPLOY.md)** - Pre-deployment verification
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Detailed deployment instructions
- **[Deployment Fixes](docs/DEPLOYMENT_FIX.md)** - Common deployment issues and fixes
- **[Context7 Guidance](docs/CONTEXT7_GUIDANCE.md)** - Best practices from Context7 documentation

