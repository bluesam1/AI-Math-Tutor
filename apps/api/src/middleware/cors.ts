import cors from 'cors';
import type { Express } from 'express';
import { env } from '../config/env';

/**
 * Configure CORS middleware for Express app
 */
export const configureCors = (app: Express): void => {
  const corsOptions = {
    origin: env.frontendUrl,
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
};
