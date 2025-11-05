import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import app from './src/server';

/**
 * Define secrets
 */
const openaiApiKey = defineSecret('OPENAI_API_KEY');

/**
 * Firebase Cloud Functions entry point
 * Exposes Express app as HTTP function
 */
export const api = onRequest(
  {
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 30,
    secrets: [openaiApiKey],
    // Note: Using express-multipart-file-parser middleware for file uploads
  },
  app
);

