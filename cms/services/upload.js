/**
 * Upload Service
 * Handles file validation, sanitization, and storage for multiple doctors
 * 
 * MULTI-DOCTOR ISOLATION:
 * - Each doctor's uploads stored in: uploads/{doctorId}/{uuid}-{filename}
 * - Filenames are sanitized and UUID-prefixed for safety
 * - Doctor isolation enforced by calling code (req.session.doctorId)
 * 
 * SECURITY FEATURES:
 * - Extension whitelist: Only .jpg, .jpeg, .png, .webp allowed
 * - Size limit: 5MB max per file
 * - MIME type validation: Checked against file extension
 * - Filename sanitization: Removes special chars, spaces, path traversal attempts
 * - UUID prefix: Prevents filename collisions and path traversal attacks
 * - No executable uploads: .js, .html, .svg, .exe, etc. rejected
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_BASE = path.join(__dirname, '..', '..', 'uploads');

// Whitelist of safe image extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Get the upload directory for a specific doctor
 */
function getUploadDir(doctorId) {
  return path.join(UPLOADS_BASE, doctorId);
}

/**
 * Sanitize filename by removing dangerous characters
 */
export function sanitizeFilename(filename) {
  if (!filename) return 'file';
  
  // Get extension
  const ext = path.extname(filename).toLowerCase();
  
  // Get name without extension
  let name = path.basename(filename, ext);
  
  // Lowercase and replace spaces/special chars with hyphens
  name = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50);
  
  return name || 'file';
}

/**
 * Validate and store uploaded file for a doctor
 * Returns URL on success
 * 
 * @param {object} file - Multer file object
 * @param {Buffer} buffer - File buffer
 * @param {string} doctorId - Doctor identifier
 * @returns {string} URL path to uploaded file
 */
export function validateAndStore(file, buffer, doctorId) {
  try {
    if (!file || !buffer || !doctorId) {
      throw new Error('File, buffer, and doctorId required');
    }

    // Check extension (first layer of defense)
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(`File type not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
    }

    // Check MIME type (second layer - validates file content)
    // Map of valid MIME types for whitelisted extensions
    const validMimeTypes = {
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.png': ['image/png'],
      '.webp': ['image/webp']
    };
    
    const allowedMimes = validMimeTypes[ext] || [];
    if (allowedMimes.length > 0 && !allowedMimes.includes(file.mimetype)) {
      throw new Error(`MIME type mismatch: expected ${allowedMimes.join(' or ')}, got ${file.mimetype}`);
    }

    // Check file size
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error('File too large. Maximum 5MB allowed.');
    }

    // Get doctor's upload directory
    const uploadDir = getUploadDir(doctorId);
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename and add UUID prefix
    const sanitized = sanitizeFilename(file.originalname);
    const uuid = uuidv4();
    const finalFilename = `${uuid}-${sanitized}${ext}`;
    const filepath = path.join(uploadDir, finalFilename);

    // Write file
    fs.writeFileSync(filepath, buffer);

    // Return URL that Nginx will serve from /uploads/{doctorId}/filename
    const url = `/uploads/${doctorId}/${finalFilename}`;
    console.log(`File uploaded for ${doctorId}: ${url}`);
    return url;
  } catch (err) {
    throw new Error(`Upload failed: ${err.message}`);
  }
}

export default { sanitizeFilename, validateAndStore };
