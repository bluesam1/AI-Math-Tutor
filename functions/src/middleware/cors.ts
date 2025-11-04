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
  ];

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Allow requests from allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In production, if origin is from Firebase Hosting, allow it
      if (process.env.NODE_ENV === 'production' && (origin.includes('web.app') || origin.includes('firebaseapp.com'))) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
};
