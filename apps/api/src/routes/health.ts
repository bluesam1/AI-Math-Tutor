import { Router } from 'express';
import { getHealth } from '../controllers/healthController';

const router = Router();

/**
 * Health check route
 * GET /api/health
 */
router.get('/health', getHealth);

export default router;

