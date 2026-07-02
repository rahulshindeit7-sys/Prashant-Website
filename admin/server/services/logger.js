const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LOG_PATH = path.join(__dirname, '..', 'data', 'deployment-log.json');

function loadLog() {
  const data = fs.readFileSync(LOG_PATH, 'utf-8');
  return JSON.parse(data);
}

function saveLog(entries) {
  fs.writeFileSync(LOG_PATH, JSON.stringify(entries, null, 2), 'utf-8');
}

function logAction({ site_id, action, result, changes_summary, error_message }) {
  const entries = loadLog();
  const entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    site_id,
    action,
    result,
    changes_summary: changes_summary || null,
    error_message: error_message || null
  };
  entries.unshift(entry); // newest first
  saveLog(entries);
  return entry;
}

function getLogEntries(limit = 50) {
  const entries = loadLog();
  return entries.slice(0, limit);
}

function filterBySite(siteId, limit = 50) {
  const entries = loadLog();
  return entries.filter(e => e.site_id === siteId).slice(0, limit);
}

module.exports = {
  logAction,
  getLogEntries,
  filterBySite
};
