/**
 * Upload Routes
 * Handles image file uploads with validation
 */

import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { validateAndStore } from '../services/upload.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/upload
 * Upload an image file for the authenticated doctor
 * Accepts: jpg, jpeg, png, webp (max 5MB)
 * Requires authentication
 */
router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    const doctorId = req.session.doctorId;
    
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: 'No file uploaded'
      });
    }

    const url = validateAndStore(req.file, req.file.buffer, doctorId);

    res.json({
      ok: true,
      message: 'File uploaded successfully',
      url
    });
  } catch (err) {
    console.error(`Upload error: ${err.message}`);
    res.status(400).json({
      ok: false,
      message: err.message || 'Upload failed'
    });
  }
});

export default router;
