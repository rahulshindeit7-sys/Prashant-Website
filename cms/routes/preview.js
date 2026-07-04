/**
 * Preview Routes
 * Handles authenticated preview of draft content
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { readDraft, readLiveConfig } from '../services/config.js';

const router = express.Router();

/**
 * GET /api/preview/config
 * Return the draft config for preview mode
 * Requires authentication
 */
router.get('/preview/config', requireAuth, (req, res) => {
  try {
    const draft = readDraft();

    if (!draft) {
      // No draft exists, return live config as fallback
      const live = readLiveConfig();
      return res.json({
        ok: true,
        config: live,
        isDraft: false,
        message: 'No draft available — showing live content'
      });
    }

    res.json({
      ok: true,
      config: draft,
      isDraft: true,
      message: 'Preview mode — draft content'
    });
  } catch (err) {
    console.error(`Error reading draft for preview: ${err.message}`);
    res.status(500).json({
      ok: false,
      message: 'Failed to load preview'
    });
  }
});

export default router;
