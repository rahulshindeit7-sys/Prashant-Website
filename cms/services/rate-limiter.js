/**
 * Rate Limiter Middleware
 * Implements IP-based rate limiting for login attempts
 */

import rateLimit from 'express-rate-limit';

/**
 * Login rate limiter: 5 attempts per 15 minutes per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for successful logins (don't increment counter)
    return req.session && req.session.authenticated;
  },
  handler: (req, res) => {
    res.status(429).json({
      ok: false,
      message: 'Too many login attempts. Try again in 15 minutes.'
    });
  }
});

export default { loginLimiter };
