/**
 * Backup Service
 * Handles backup creation, listing, and restoration for multiple doctors
 * 
 * MULTI-DOCTOR ISOLATION:
 * - Each doctor has their own backup directory: backups/{doctorId}/
 * - Each backup is timestamped: config.2026-07-03T14-30-00.json
 * - Doctor can only access their own backups (enforced by calling code)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readLiveConfig } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUPS_BASE = path.join(__dirname, '..', '..', 'backups');

/**
 * Get the backup directory for a specific doctor
 */
function getBackupDir(doctorId) {
  return path.join(BACKUPS_BASE, doctorId);
}

/**
 * Get the live config path for a doctor
 */
function getConfigPath(doctorId) {
  return path.join(__dirname, '..', '..', 'config', `${doctorId}-profile.json`);
}

/**
 * Create a timestamped backup of the current live config for a doctor
 * Naming: config.2026-07-03T14-30-00.json (colons replaced with hyphens)
 * 
 * @param {string} doctorId - Doctor identifier
 * @returns {string} Path to created backup file
 */
export function createBackup(doctorId) {
  try {
    const backupDir = getBackupDir(doctorId);
    
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, '-').split('.')[0];
    const backupPath = path.join(backupDir, `config.${timestamp}.json`);

    // Read current live config
    const liveConfig = readLiveConfig(doctorId);
    const configContent = JSON.stringify(liveConfig, null, 2);

    // Write backup
    fs.writeFileSync(backupPath, configContent, 'utf8');

    console.log(`Backup created for ${doctorId}: ${backupPath}`);
    return backupPath;
  } catch (err) {
    throw new Error(`Failed to create backup for ${doctorId}: ${err.message}`);
  }
}

/**
 * List the last 5 backups for a doctor with metadata
 * 
 * @param {string} doctorId - Doctor identifier
 * @returns {Array} Array of backup objects with filename, timestamp, created, doctorName
 */
export function listBackups(doctorId) {
  try {
    const backupDir = getBackupDir(doctorId);
    
    if (!fs.existsSync(backupDir)) {
      return [];
    }

    const files = fs.readdirSync(backupDir);

    // Filter config.*.json files and sort by date (newest first)
    const backups = files
      .filter(file => file.match(/^config\.\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/))
      .sort()
      .reverse()
      .slice(0, 5)
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stat = fs.statSync(filePath);

        // Extract doctor name from backup for preview
        let doctorName = 'Unknown';
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const config = JSON.parse(content);
          doctorName = config.doctor?.name || 'Unknown';
        } catch (e) {
          // Ignore parse errors
        }

        return {
          filename: file,
          timestamp: file.replace('config.', '').replace('.json', ''),
          created: stat.mtime,
          doctorName
        };
      });

    return backups;
  } catch (err) {
    console.warn(`Failed to list backups for ${doctorId}: ${err.message}`);
    return [];
  }
}

/**
 * Restore a backup to become the live config for a doctor
 * 
 * @param {string} doctorId - Doctor identifier
 * @param {string} filename - Backup filename to restore
 * @returns {boolean} True if successful
 */
export function restoreBackup(doctorId, filename) {
  try {
    const backupDir = getBackupDir(doctorId);
    const backupPath = path.join(backupDir, filename);
    const configPath = getConfigPath(doctorId);

    // Security: ensure filename is safe (no path traversal)
    if (!filename.match(/^config\.\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/)) {
      throw new Error('Invalid backup filename');
    }

    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup not found');
    }

    // Read backup content
    const backupContent = fs.readFileSync(backupPath, 'utf8');

    // Write to live config (atomic write)
    const tmpPath = `${configPath}.tmp`;
    fs.writeFileSync(tmpPath, backupContent, 'utf8');
    fs.renameSync(tmpPath, configPath);

    console.log(`Restored backup for ${doctorId}: ${filename}`);
    return true;
  } catch (err) {
    throw new Error(`Failed to restore backup for ${doctorId}: ${err.message}`);
  }
}

export default { createBackup, listBackups, restoreBackup };
