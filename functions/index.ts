import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import app from './src/server';

/**
 * Define secrets (only used in production)
 * In emulator, use environment variables from .env file instead
 * 
 * Note: We only define the secret if NOT in the emulator to avoid
 * trying to access Secret Manager when running locally
 */
const isEmulator = !!process.env.FUNCTIONS_EMULATOR;
const openaiApiKey = isEmulator ? undefined : defineSecret('OPENAI_API_KEY');

/**
 * Firebase Cloud Functions entry point
 * Exposes Express app as HTTP function
 * 
 * For emulator: Uses environment variables from .env file (loaded in server.ts)
 * For production: Uses secrets from Firebase Secret Manager
 */
export const api = onRequest(
  {
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 30,
    // Only use secrets in production (not in emulator)
    // In emulator, environment variables are loaded from .env file in server.ts
    // Conditionally include secrets only if not in emulator and secret is defined
    secrets: isEmulator || !openaiApiKey ? [] : [openaiApiKey],
    // Note: Using express-multipart-file-parser middleware for file uploads
  },
  app
);
