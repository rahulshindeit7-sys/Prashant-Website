/**
 * Content Management Routes
 * Handles read/write of config and draft content
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  readLiveConfig,
  readDraft,
  writeDraft,
  validateConfigShape
} from '../services/config.js';

const router = express.Router();

/**
 * GET /api/content
 * Return the current live config for the authenticated doctor
 * Requires authentication
 */
router.get('/content', requireAuth, (req, res) => {
  try {
    const doctorId = req.session.doctorId;
    const config = readLiveConfig(doctorId);
    res.json({
      ok: true,
      config
    });
  } catch (err) {
    console.error(`Error reading config: ${err.message}`);
    res.status(500).json({
      ok: false,
      message: 'Failed to read config'
    });
  }
});

/**
 * PUT /api/content
 * Save draft changes for the authenticated doctor
 * Merges submitted config over live config and writes to draft file
 * Does NOT modify the live config
 * Requires authentication
 */
router.put('/content', requireAuth, (req, res) => {
  try {
    const { config } = req.body;
    const doctorId = req.session.doctorId;

    if (!config) {
      return res.status(400).json({
        ok: false,
        message: 'Config object required in request body'
      });
    }

    // Validate config shape
    const validation = validateConfigShape(config);
    if (!validation.valid) {
      return res.status(400).json({
        ok: false,
        message: 'Config validation failed',
        errors: validation.errors
      });
    }

    // Write draft for the specific doctor
    writeDraft(doctorId, config);

    res.json({
      ok: true,
      message: 'Draft saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Error saving draft: ${err.message}`);
    res.status(500).json({
      ok: false,
      message: err.message || 'Failed to save draft'
    });
  }
});

export default router;
