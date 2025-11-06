import cors from 'cors';
import type { Express } from 'express';
import { env } from '../config/env';

/**
 * Configure CORS middleware for Express app
 *
 * In Firebase Functions, we need to allow:
 * - Local development: FRONTEND_URL from .env
 * - Production: Firebase Hosting domain (same origin, handled by Firebase Hosting rewrites)
 * - Emulator: Local development URL
 */
export const configureCors = (app: Express): void => {
  // In production, Firebase Hosting serves both frontend and API from same domain
  // So CORS is only needed for local development
  const allowedOrigins = [
    env.frontendUrl,
    'http://localhost:3000',
    'http://localhost:5000', // Firebase Hosting emulator
    'http://127.0.0.1:3000', // Alternative localhost
    'http://127.0.0.1:5000', // Alternative localhost
    'https://learnmath.app', // Production domain
    'http://learnmath.app', // Production domain (HTTP fallback)
  ];

  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // In development/emulator, be more permissive
      const isDevelopment =
        process.env.NODE_ENV !== 'production' || process.env.FUNCTIONS_EMULATOR;

      // Allow requests with no origin (like mobile apps, curl requests, or same-origin requests)
      if (!origin) {
        if (isDevelopment) {
          console.log(
            '[CORS] Allowing request with no origin (development mode)'
          );
        }
        return callback(null, true);
      }

      // Log origin for debugging
      if (isDevelopment) {
        console.log('[CORS] Request origin:', origin);
      }

      // Allow requests from allowed origins
      if (allowedOrigins.includes(origin)) {
        if (isDevelopment) {
          console.log('[CORS] Origin allowed:', origin);
        }
        return callback(null, true);
      }

      // In development, allow localhost on any port for easier debugging
      if (
        isDevelopment &&
        (origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:'))
      ) {
        console.log(
          '[CORS] Allowing localhost origin (development mode):',
          origin
        );
        return callback(null, true);
      }

      // In production, if origin is from Firebase Hosting, allow it
      if (
        process.env.NODE_ENV === 'production' &&
        (origin.includes('web.app') || origin.includes('firebaseapp.com'))
      ) {
        return callback(null, true);
      }

      // Allow learnmath.app domain (production)
      if (origin.includes('learnmath.app')) {
        if (isDevelopment) {
          console.log('[CORS] Allowing learnmath.app origin:', origin);
        }
        return callback(null, true);
      }

      // Log rejected origin
      console.warn(
        '[CORS] Origin rejected:',
        origin,
        'Allowed origins:',
        allowedOrigins
      );
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type'],
  };

  // Apply CORS middleware
  app.use(cors(corsOptions));

  // Explicitly handle OPTIONS requests for preflight (in case CORS middleware doesn't catch it)
  app.options('*', cors(corsOptions));
};
