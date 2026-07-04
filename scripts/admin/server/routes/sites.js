const express = require('express');
const router = express.Router();
const registry = require('../services/registry');
const sshService = require('../services/ssh');
const healthService = require('../services/health');
const credentialService = require('../services/credentials');
const logger = require('../services/logger');

// Input sanitization helpers
function isValidUrl(str) {
  try {
    const url = new URL(str);
    return ['http:', 'https:'].includes(url.protocol);
  } catch { return false; }
}

function isValidRemotePath(p) {
  // Prevent path traversal
  if (!p || typeof p !== 'string') return false;
  if (p.includes('..') || p.includes('\0')) return false;
  if (!p.startsWith('/')) return false;
  return true;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x1f]/g, '').trim();
}

// GET /api/sites - List all sites with summary
router.get('/', (req, res) => {
  try {
    const sites = registry.getAllSites();
    const summary = {
      total: sites.length,
      online: sites.filter(s => s.status === 'online').length,
      offline: sites.filter(s => s.status === 'offline' || s.status === 'auth_failed').length,
      warnings: sites.filter(s => ['config_error', 'ssl_expiring', 'stale'].includes(s.status)).length
    };
    res.json({ sites, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sites - Register a new site
router.post('/', async (req, res) => {
  try {
    const { domain_url, ssh_host, ssh_port, ssh_user, auth_method, ssh_key_path, remote_config_path, password } = req.body;

    // Validation
    if (!domain_url || !isValidUrl(domain_url)) {
      return res.status(400).json({ error: 'Invalid domain_url: must be a valid http/https URL' });
    }
    if (!ssh_host || typeof ssh_host !== 'string' || sanitizeString(ssh_host).length === 0) {
      return res.status(400).json({ error: 'Invalid SSH host: cannot be empty' });
    }
    if (!ssh_user || typeof ssh_user !== 'string' || sanitizeString(ssh_user).length === 0) {
      return res.status(400).json({ error: 'Invalid SSH user: cannot be empty' });
    }
    if (!auth_method || !['key', 'password'].includes(auth_method)) {
      return res.status(400).json({ error: 'Invalid auth_method: must be "key" or "password"' });
    }
    if (auth_method === 'key' && !ssh_key_path) {
      return res.status(400).json({ error: 'ssh_key_path required when auth_method is "key"' });
    }
    const port = parseInt(ssh_port) || 22;
    if (port < 1 || port > 65535) {
      return res.status(400).json({ error: 'Invalid SSH port: must be 1-65535' });
    }
    if (!isValidRemotePath(remote_config_path)) {
      return res.status(400).json({ error: 'Invalid remote_config_path: must be an absolute path without traversal' });
    }

    // Fetch remote config to extract site_id, doctor_name, clinic_name
    const httpResult = await healthService.checkHttpStatus(domain_url);
    let site_id, doctor_name, clinic_name;

    if (httpResult.reachable && httpResult.config_valid) {
      // Fetch the config
      const { URL } = require('url');
      const url = new URL(domain_url);
      const configUrl = `${url.origin}/config/doctor-profile.json`;
      const fetchModule = url.protocol === 'https:' ? require('https') : require('http');

      const configData = await new Promise((resolve, reject) => {
        fetchModule.get(configUrl, { timeout: 10000 }, (resp) => {
          let body = '';
          resp.on('data', chunk => { body += chunk; });
          resp.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch (e) { reject(new Error('Invalid JSON in remote config')); }
          });
        }).on('error', reject);
      });

      site_id = configData.site_id || domain_url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
      doctor_name = configData.doctor?.name || configData.doctor_name || 'Unknown';
      clinic_name = configData.clinic?.name || configData.clinic_name || 'Unknown';
    } else {
      // Can't fetch config — generate site_id from domain
      site_id = domain_url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
      doctor_name = 'Unknown';
      clinic_name = 'Unknown';
    }

    // Store password if auth_method is password
    if (auth_method === 'password' && password) {
      await credentialService.storePassword(site_id, password);
    }

    const siteData = {
      site_id,
      doctor_name,
      clinic_name,
      domain_url,
      ssh_host,
      ssh_port: port,
      ssh_user,
      auth_method,
      ssh_key_path: auth_method === 'key' ? ssh_key_path : undefined,
      remote_config_path,
      status: httpResult.reachable ? 'online' : 'offline',
      last_checked: new Date().toISOString(),
      last_updated: null
    };

    const added = registry.addSite(siteData);

    logger.logAction({
      site_id,
      action: 'site_added',
      result: 'success',
      changes_summary: `Registered site: ${doctor_name} (${domain_url})`
    });

    res.status(201).json({
      site_id: added.site_id,
      doctor_name: added.doctor_name,
      clinic_name: added.clinic_name,
      domain_url: added.domain_url,
      status: added.status,
      message: 'Site registered successfully'
    });
  } catch (err) {
    if (err.message.includes('already exists')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sites/:siteId - Remove a site
router.delete('/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    const removed = registry.removeSite(siteId);

    // Cleanup credentials
    await credentialService.deletePassword(siteId);

    logger.logAction({
      site_id: siteId,
      action: 'site_removed',
      result: 'success',
      changes_summary: `Removed site: ${removed.doctor_name} (${removed.domain_url})`
    });

    res.json({ message: `Site '${siteId}' removed from dashboard` });
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sites/:siteId/test-connection - Test connectivity
router.post('/:siteId/test-connection', async (req, res) => {
  try {
    const { siteId } = req.params;
    const site = registry.getSite(siteId);
    if (!site) {
      return res.status(404).json({ error: `Site '${siteId}' not found` });
    }

    const [sshResult, httpResult, sslResult] = await Promise.all([
      sshService.testConnection(site),
      healthService.checkHttpStatus(site.domain_url),
      healthService.checkSSLExpiry(site.domain_url)
    ]);

    res.json({
      ssh: { reachable: sshResult.reachable, message: sshResult.message },
      http: { reachable: httpResult.reachable, status_code: httpResult.status_code, message: httpResult.reachable ? 'Config fetched' : httpResult.error },
      ssl: { days_remaining: sslResult.days_remaining, expiry_date: sslResult.expiry_date }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
