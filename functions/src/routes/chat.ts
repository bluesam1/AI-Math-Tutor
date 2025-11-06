import { Router } from 'express';
import {
  sendMessage,
  generateFollowUpMessage,
  generateStepByStepGuidanceMessage,
  generateInitialGreetingMessage,
} from '../controllers/chatController';

const router = Router();

/**
 * Chat-related routes
 * POST /api/chat/message - Send chat message and receive Socratic dialogue response
 * POST /api/chat/follow-up - Generate contextual follow-up message after answer validation
 * POST /api/chat/step-by-step-guidance - Generate step-by-step Socratic guidance message
 * POST /api/chat/initial-greeting - Generate initial greeting message when problem is set
 */

router.post('/message', sendMessage);
router.post('/follow-up', generateFollowUpMessage);
router.post('/step-by-step-guidance', generateStepByStepGuidanceMessage);
router.post('/initial-greeting', generateInitialGreetingMessage);

export default router;
