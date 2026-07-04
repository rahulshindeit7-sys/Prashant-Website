/**
 * Publish Routes
 * Handles publishing, backup listing, and rollback
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { readDraft, writeLiveConfig } from '../services/config.js';
import { createBackup, listBackups, restoreBackup } from '../services/backup.js';

const router = express.Router();

/**
 * POST /api/publish
 * Publish draft to live config for the authenticated doctor
 * Creates backup of current live config first
 * Requires authentication
 */
router.post('/publish', requireAuth, (req, res) => {
  try {
    const doctorId = req.session.doctorId;
    
    // Read draft for this doctor
    const draft = readDraft(doctorId);
    if (!draft) {
      return res.status(400).json({
        ok: false,
        message: 'No draft to publish'
      });
    }

    // Create backup of current live config before publishing
    createBackup(doctorId);

    // Write draft to live config
    writeLiveConfig(doctorId, draft);

    res.json({
      ok: true,
      message: 'Published successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Publish error: ${err.message}`);
    res.status(500).json({
      ok: false,
      message: err.message || 'Publish failed'
    });
  }
});

/**
 * GET /api/backups
 * List last 5 backups for the authenticated doctor
 * Requires authentication
 */
router.get('/backups', requireAuth, (req, res) => {
  try {
    const doctorId = req.session.doctorId;
    const backups = listBackups(doctorId);
    res.json({
      ok: true,
      backups
    });
  } catch (err) {
    console.error(`Backups list error: ${err.message}`);
    res.status(500).json({
      ok: false,
      message: 'Failed to list backups'
    });
  }
});

/**
 * POST /api/rollback
 * Restore a previous backup to live config for the authenticated doctor
 * Requires authentication and filename in request body
 */
router.post('/rollback', requireAuth, (req, res) => {
  try {
    const { filename } = req.body;
    const doctorId = req.session.doctorId;

    if (!filename) {
      return res.status(400).json({
        ok: false,
        message: 'Backup filename required'
      });
    }

    // Create backup of current live before rolling back
    createBackup(doctorId);

    // Restore the requested backup for this doctor
    restoreBackup(doctorId, filename);

    res.json({
      ok: true,
      message: 'Rolled back successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Rollback error: ${err.message}`);
    res.status(500).json({
      ok: false,
      message: err.message || 'Rollback failed'
    });
  }
});

export default router;
