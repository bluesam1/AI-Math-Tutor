# Firebase Cloud Functions

This directory contains the Firebase Cloud Functions for the AI Math Tutor API.

## Structure

```
functions/
├── index.ts              # Firebase Functions entry point
├── src/                  # Source code
│   ├── server.ts         # Express app
│   ├── config/           # Configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Utilities
├── lib/                 # Compiled JavaScript (generated)
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── .env                 # Environment variables (local only)
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 3. Build

```bash
npm run build
```

## Development

### Local Development with Emulators

```bash
# Start Firebase emulators
npm run serve

# Or from project root
npm run dev:emulators
```

The functions emulator will be available at:
- Functions: `http://localhost:5001`
- Emulator UI: `http://localhost:4000`

### Standalone Development (for testing Express app directly)

If you want to run the Express app standalone (not in Firebase Functions):

```bash
# Set NODE_ENV to development (not production)
# The server will start automatically on port 3001
npm run build
node lib/src/server.js
```

## Deployment

### Deploy Functions

```bash
# Deploy to default project
npm run deploy

# Deploy to specific project
npm run deploy:prod
```

### View Logs

```bash
# View all function logs
npm run logs

# View specific function logs
npm run logs:api
```

## Environment Variables

### Local Development

Environment variables are loaded from `.env` file using `dotenv`.

### Production (Firebase Functions)

Set environment variables via Firebase CLI:

```bash
# Set environment variable
firebase functions:config:set env.node_env="production"
firebase functions:config:set env.frontend_url="https://your-domain.web.app"

# Or use Secret Manager for sensitive data
firebase functions:secrets:set OPENAI_API_KEY
```

In Firebase Functions v2, environment variables are accessed via `process.env` directly.

## API Routes

- `GET /` - Health check (returns API info)
- `GET /api/health` - Health check endpoint
- `/api/problem/*` - Problem-related endpoints
- `/api/chat/*` - Chat-related endpoints

## Firebase Functions Configuration

Functions are configured in `firebase.json`:

```json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "runtime": "nodejs20",
      "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"]
    }
  ]
}
```

The function is exported as `api` in `index.ts` and is accessible at:
- Emulator: `http://localhost:5001/{project-id}/us-central1/api/...`
- Production: `https://us-central1-{project-id}.cloudfunctions.net/api/...`
- Via Hosting Rewrite: `https://your-domain.web.app/api/...`

## TypeScript

The project uses TypeScript with standard Firebase Functions configuration:
- **Module System**: CommonJS (Firebase standard)
- **Target**: ES2017
- **Output**: `lib/` directory
- **Source Maps**: Enabled

## Notes

- All code is written in TypeScript
- The Express app is exported as a Firebase Function
- Firebase Functions v2 handles the server lifecycle automatically
- CORS is configured to allow requests from Firebase Hosting and local development
- Error handling logs errors to Firebase Functions logs automatically

