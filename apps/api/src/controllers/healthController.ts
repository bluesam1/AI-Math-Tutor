import type { Request, Response } from 'express';
import type { HealthResponse } from '../types/api';
import { env } from '../config/env';

/**
 * Health check controller
 * Returns API status and basic information
 */
export const getHealth = (req: Request, res: Response): void => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  };

  res.status(200).json(response);
};

