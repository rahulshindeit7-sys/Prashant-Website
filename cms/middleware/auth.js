/**
 * Authentication Middleware
 * Validates session and enforces authentication on protected routes
 */

export function requireAuth(req, res, next) {
  if (!req.session || !req.session.authenticated) {
    return res.status(401).json({
      ok: false,
      message: 'Unauthorized — please log in'
    });
  }
  next();
}

export default { requireAuth };
