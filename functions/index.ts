import { onRequest } from 'firebase-functions/v2/https';
import app from './src/server';

/**
 * Firebase Cloud Functions entry point
 * Exposes Express app as HTTP function
 */
export const api = onRequest(
  {
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 30,
  },
  app
);

