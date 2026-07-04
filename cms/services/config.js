/**
 * Config File I/O Service
 * Handles reading/writing live config and draft staging for multiple doctors
 * 
 * MULTI-DOCTOR ISOLATION:
 * - Each doctor has their own config file: config/{doctorId}-profile.json
 * - Each doctor has their own draft staging: backups/{doctorId}/content.draft.json
 * - Session doctorId ensures isolation (cannot access other doctor's config)
 * 
 * ATOMIC WRITE SAFETY:
 * All writes use the temp-file-rename pattern:
 *   1. Write to a temp file (e.g., config.tmp)
 *   2. Atomic rename temp file to target
 * 
 * This prevents partial writes if the process crashes mid-write.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Get config file path for a specific doctor
 */
function getConfigPath(doctorId) {
  return path.join(__dirname, '..', '..', 'config', `${doctorId}-profile.json`);
}

/**
 * Get draft file path for a specific doctor
 */
function getDraftPath(doctorId) {
  return path.join(__dirname, '..', '..', 'backups', doctorId, 'content.draft.json');
}

/**
 * Read the live config file for a doctor (read-only, safe to call anytime)
 * 
 * @param {string} doctorId - Doctor identifier
 * @returns {Object} Parsed config object
 * @throws {Error} If file cannot be read or parsed
 */
export function readLiveConfig(doctorId) {
  try {
    const configPath = getConfigPath(doctorId);
    const content = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to read live config for ${doctorId}: ${err.message}`);
  }
}

/**
 * Read the draft staging file for a doctor (if it exists)
 * 
 * @param {string} doctorId - Doctor identifier
 * @returns {Object|null} Parsed draft object, or null if no draft exists
 */
export function readDraft(doctorId) {
  try {
    const draftPath = getDraftPath(doctorId);
    
    if (!fs.existsSync(draftPath)) {
      return null;
    }
    
    const content = fs.readFileSync(draftPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`Failed to read draft for ${doctorId}: ${err.message}`);
    return null;
  }
}

/**
 * Write draft config to staging file for a doctor (atomic write pattern)
 * 
 * @param {string} doctorId - Doctor identifier
 * @param {Object} config - Config object to write
 * @throws {Error} If write fails
 */
export function writeDraft(doctorId, config) {
  try {
    const draftPath = getDraftPath(doctorId);
    const draftDir = path.dirname(draftPath);
    
    // Ensure doctor's backup directory exists
    if (!fs.existsSync(draftDir)) {
      fs.mkdirSync(draftDir, { recursive: true });
    }
    
    const tmpPath = `${draftPath}.tmp`;
    const jsonContent = JSON.stringify(config, null, 2);
    
    // Write to temp file first (atomic write safety)
    fs.writeFileSync(tmpPath, jsonContent, 'utf8');
    
    // Rename temp file to actual draft path
    fs.renameSync(tmpPath, draftPath);
  } catch (err) {
    throw new Error(`Failed to write draft for ${doctorId}: ${err.message}`);
  }
}

/**
 * Write config to live location for a doctor (atomic write)
 * Used internally by publish operations
 * 
 * @param {string} doctorId - Doctor identifier
 * @param {Object} config - Config object to write
 * @throws {Error} If write fails
 */
export function writeLiveConfig(doctorId, config) {
  try {
    const configPath = getConfigPath(doctorId);
    const tmpPath = `${configPath}.tmp`;
    const jsonContent = JSON.stringify(config, null, 2);
    
    // Write to temp file first (atomic write safety)
    fs.writeFileSync(tmpPath, jsonContent, 'utf8');
    
    // Rename temp file to actual config path
    fs.renameSync(tmpPath, configPath);
  } catch (err) {
    throw new Error(`Failed to write live config for ${doctorId}: ${err.message}`);
  }
}

/**
 * Validate config object shape
 * @param {Object} config - Config to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateConfigShape(config) {
  const errors = [];
  
  if (!config) errors.push('Config object missing');
  if (!config.doctor) errors.push('doctor object missing');
  if (!config.doctor?.name) errors.push('doctor.name is required');
  if (!config.clinic) errors.push('clinic object missing');
  if (!Array.isArray(config.services)) errors.push('services must be an array');
  if (!Array.isArray(config.expertise_items)) errors.push('expertise_items must be an array');
  if (!Array.isArray(config.testimonials)) errors.push('testimonials must be an array');
  if (!Array.isArray(config.gallery)) errors.push('gallery must be an array');
  if (!config.seo) errors.push('seo object missing');
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default { 
  readLiveConfig, 
  readDraft, 
  writeDraft, 
  writeLiveConfig,
  validateConfigShape 
};
