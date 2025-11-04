import { Router } from 'express';

const router = Router();

/**
 * Problem-related routes
 * Placeholder for future implementation
 * POST /api/problem/parse-image - Image parsing (Story 1.6)
 * POST /api/problem/validate - Problem validation (Story 1.7)
 */

// Placeholder routes to be implemented in future stories
router.post('/parse-image', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.post('/validate', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

export default router;
