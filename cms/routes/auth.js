/**
 * Authentication Routes
 * Handles login and logout endpoints with security measures
 * 
 * SECURITY FEATURES:
 * - Rate limiting: 5 failed attempts per 15 minutes (returns 429)
 * - Password hashing: bcryptjs with 10 salt rounds (takes ~100ms per attempt)
 * - Session management: HTTP-only cookie, secure flag (HTTPS only), sameSite: strict
 * - No plaintext passwords in logs or responses
 * - Timing-safe comparison via bcryptjs.compare()
 */

import express from 'express';
import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginLimiter } from '../services/rate-limiter.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCTORS_FILE = path.join(__dirname, '..', '..', 'config', 'doctors-list.json');

/**
 * POST /api/login
 * Authenticate any doctor with username and password from doctors-list.json
 * 
 * Rate limited to 5 attempts per 15 minutes (per IP address)
 * Returns 429 Too Many Requests if rate limit exceeded
 * 
 * Request body:
 *   { "username": "deepali", "password": "secret" }
 * 
 * Success (200):
 *   { "ok": true, "message": "Logged in successfully", "doctor": {...} }
 *   + Sets HTTP-only session cookie with doctorId
 * 
 * Failure (401):
 *   { "ok": false, "message": "Invalid username or password" }
 * 
 * Rate Limited (429):
 *   { "ok": false, "message": "Too many login attempts..." }
 */
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Username and password required'
    });
  }

  try {
    // Load doctors list
    const doctorsData = JSON.parse(fs.readFileSync(DOCTORS_FILE, 'utf8'));
    
    // Find doctor by username
    const doctor = doctorsData.doctors.find(d => d.username === username);

    if (!doctor) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid username or password'
      });
    }

    // Verify password using stored hash
    const passwordMatch = await bcryptjs.compare(password, doctor.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid username or password'
      });
    }

    // Create session with doctor info
    req.session.authenticated = true;
    req.session.doctorId = doctor.id;
    req.session.doctorName = doctor.name;
    req.session.loginTime = new Date();

    res.json({
      ok: true,
      message: 'Logged in successfully',
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty
      }
    });
  } catch (err) {
    console.error(`Login error: ${err.message}`);
    res.status(500).json({
      ok: false,
      message: 'Login failed'
    });
  }
});

/**
 * POST /api/logout
 * Destroy session and clear session cookie
 */
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Logout failed'
      });
    }
    res.json({
      ok: true,
      message: 'Logged out successfully'
    });
  });
});

export default router;
