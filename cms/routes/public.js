/**
 * Public API Routes
 * Unauthenticated endpoints for public websites to fetch config
 * 
 * No authentication required — these endpoints serve public content
 * to patient-facing websites
 */

import express from 'express';
import { readLiveConfig } from '../services/config.js';

const router = express.Router();

/**
 * GET /api/public/config/:doctorId
 * Fetch doctor's live config (public, no auth required)
 * 
 * Used by patient-facing websites to load doctor content
 * Example: GET /api/public/config/deepali
 * 
 * Response 200:
 * {
 *   "ok": true,
 *   "config": { ...full config object... }
 * }
 * 
 * Response 404:
 * {
 *   "ok": false,
 *   "message": "Doctor not found"
 * }
 */
router.get('/public/config/:doctorId', (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({
        ok: false,
        message: 'doctorId required'
      });
    }

    const config = readLiveConfig(doctorId);

    // Add cache headers (10-second cache for faster loads)
    res.set('Cache-Control', 'public, max-age=10');

    res.json({
      ok: true,
      config
    });
  } catch (err) {
    console.error(`Error fetching public config for ${req.params.doctorId}:`, err.message);
    res.status(404).json({
      ok: false,
      message: `Doctor not found: ${req.params.doctorId}`
    });
  }
});

export default router;
