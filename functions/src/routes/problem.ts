import { Router } from 'express';
import multer from 'multer';
import { parseImage } from '../controllers/problemController';
import { validateUploadedFile, handleMulterError } from '../middleware/fileValidation';

const router = Router();

/**
 * Problem-related routes
 * 
 * POST /api/problem/parse-image - Image parsing (Story 1.6)
 * POST /api/problem/validate - Problem validation (Story 1.7)
 */

// Configure multer for file uploads
// Store files in memory (buffer) for API processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only allow one file
  },
  fileFilter: (req, file, cb) => {
    // Additional format check (multer level)
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPG, PNG, and GIF are allowed.'));
    }
  },
});

/**
 * POST /api/problem/parse-image
 * 
 * Accepts multipart/form-data with image file
 * Field name: "image"
 * 
 * Returns:
 * - Success: { success: true, problemText: string }
 * - Error: { success: false, error: string, message: string, code?: string }
 */
router.post(
  '/parse-image',
  upload.single('image'), // Handle single file upload with field name "image"
  handleMulterError, // Handle multer-specific errors
  validateUploadedFile, // Validate file format, size, and signature
  parseImage // Process image and extract text
);

// Placeholder route for future story
router.post('/validate', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

export default router;
