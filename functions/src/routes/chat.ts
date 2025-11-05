import { Router } from 'express';
import { sendMessage } from '../controllers/chatController';

const router = Router();

/**
 * Chat-related routes
 * POST /api/chat/message - Send chat message and receive Socratic dialogue response
 */

router.post('/message', sendMessage);

export default router;
