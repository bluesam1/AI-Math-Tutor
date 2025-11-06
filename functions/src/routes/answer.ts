import { Router } from 'express';
import { checkAnswerEndpoint } from '../controllers/answerController';

const router = Router();

/**
 * Answer checking routes
 * POST /api/answer/check - Check if student answer is correct
 */

console.log('[Answer Routes] Registering answer routes');
console.log('[Answer Routes] checkAnswerEndpoint:', typeof checkAnswerEndpoint);

// Debug middleware to log all requests to answer router
router.use((req, res, next) => {
  console.log('[Answer Routes] *** REQUEST RECEIVED IN ANSWER ROUTER ***', {
    method: req.method,
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
  });
  next();
});

router.post('/check', checkAnswerEndpoint);

console.log('[Answer Routes] Route /check registered');

export default router;

