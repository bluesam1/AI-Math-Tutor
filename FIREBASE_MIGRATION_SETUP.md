# Firebase Migration Setup Guide

**Last Updated:** 2025-11-04  
**Status:** ✅ Quick Migration - Full Cutover Complete  
**Region:** us-central1  
**Plan:** Firebase Blaze (Pay-as-you-go)

## Migration Complete ✅

All source code has been migrated from `apps/api/src/` to `functions/src/` following standard Firebase Functions structure.

### Quick Start

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Set Firebase Project (if not already done)

```bash
firebase use --add
# Select your existing Firebase project
```

Or create `.firebaserc` manually:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 4. Set Up Environment Variables

Copy the example environment file:

```bash
cp functions/.env.example functions/.env
```

Edit `functions/.env` and add your values:

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 5. Test Locally with Emulators

```bash
# From project root
npm run dev:emulators
```

This will start:
- Functions emulator on port 5001
- Hosting emulator on port 5000
- Firebase UI on port 4000

Visit http://localhost:4000 to see the emulator UI.

Test the API:
```bash
curl http://localhost:5001/your-project-id/us-central1/api/api/health
```

### 6. Build and Deploy

```bash
# Build everything
npm run build

# Deploy functions
npm run deploy:functions

# Deploy hosting
npm run deploy:hosting

# Or deploy everything
npm run deploy
```

## Project Structure

```
AI-Math-Tutor/
├── functions/              # Firebase Cloud Functions
│   ├── index.ts           # Function entry point (exports Express app)
│   ├── src/               # All API source code (migrated from apps/api/src/)
│   │   ├── server.ts      # Express app
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript types
│   ├── lib/               # Compiled JavaScript (TypeScript output)
│   ├── package.json      # Functions dependencies
│   ├── tsconfig.json      # TypeScript config (standard Firebase)
│   └── .env               # Environment variables (not committed)
├── apps/
│   ├── api/               # Original API (can be removed after migration)
│   └── web/               # React frontend
├── firebase.json          # Firebase configuration
└── .firebaserc            # Firebase project selection
```

## Environment Variables

Firebase Functions v2 uses `process.env` directly (same as Lambda), so no code changes needed!

Environment variables are loaded from:
1. `functions/.env` file (local development)
2. Firebase Functions Config (deployed)
3. Firebase Secret Manager (for sensitive data - optional)

To set environment variables for deployed functions:

```bash
firebase functions:config:set env.frontend_url="https://your-domain.com"
firebase functions:config:set env.node_env="production"
```

## Testing

### Local Development

```bash
# Start emulators
npm run dev:emulators

# Test API endpoint
curl http://localhost:5001/your-project-id/us-central1/api/api/health
```

### Deployed Functions

```bash
# View logs
firebase functions:log

# View specific function logs
firebase functions:log --only api
```

## Deployment

### Functions Only

```bash
npm run deploy:functions
```

### Hosting Only

```bash
npm run deploy:hosting
```

### Everything

```bash
npm run deploy
```

## Troubleshooting

### Build Errors

If you get TypeScript errors about imports:

1. Make sure `functions/tsconfig.json` includes the API source files
2. Check that `baseUrl` is set to `".."` (parent directory)
3. Verify path mappings are correct

### Emulator Issues

If emulators don't start:

1. Check that Firebase CLI is installed: `firebase --version`
2. Verify you're logged in: `firebase login`
3. Check `.firebaserc` has the correct project ID
4. Ensure `firebase.json` is valid JSON

### Function Not Found

If deployed function returns 404:

1. Check function name in `firebase.json` matches export name
2. Verify function is deployed: `firebase functions:list`
3. Check function logs: `firebase functions:log --only api`

## Next Steps

1. ✅ Functions structure created
2. ✅ Firebase configuration set up
3. ✅ Emulators configured
4. ⏳ Deploy functions to Firebase
5. ⏳ Deploy hosting to Firebase
6. ⏳ Update frontend API base URL
7. ⏳ Remove AWS/Serverless dependencies

## Migration Summary

### ✅ Completed

1. **Functions Structure**: Standard Firebase setup with `functions/` directory
2. **Source Code Migration**: All API code moved from `apps/api/src/` to `functions/src/`
3. **TypeScript Configuration**: Standard Firebase Functions TypeScript config (CommonJS)
4. **Build System**: TypeScript compiles to `lib/` directory
5. **Firebase Configuration**: `firebase.json` configured for functions and hosting
6. **Emulators**: Configured for local testing
7. **Environment Variables**: `.env` file setup for local development

### 📋 Next Steps

1. **Set Firebase Project**: Create `.firebaserc` with your Firebase project ID
2. **Configure Environment**: Copy `functions/.env.example` to `functions/.env` and add API keys
3. **Test Locally**: Run `npm run dev:emulators` to test functions locally
4. **Deploy Functions**: Run `npm run deploy:functions` to deploy to Firebase
5. **Deploy Hosting**: Run `npm run deploy:hosting` to deploy frontend
6. **Update Frontend**: Update frontend API base URL to Firebase Hosting domain

## Notes

- ✅ Standard Firebase Functions structure (TypeScript → CommonJS)
- ✅ All source code in `functions/src/` directory
- ✅ Environment variables use `.env` file (not Secret Manager)
- ✅ Region: us-central1
- ✅ Firebase Blaze plan required
- ✅ TypeScript compiles automatically via `predeploy` hook in `firebase.json`

