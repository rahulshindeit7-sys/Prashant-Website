const express = require('express');
const router = express.Router();
const registry = require('../services/registry');
const sshService = require('../services/ssh');
const healthService = require('../services/health');
const logger = require('../services/logger');

// GET /api/sites/:siteId/config - Fetch remote config via HTTP
router.get('/:siteId/config', async (req, res) => {
  try {
    const { siteId } = req.params;
    const site = registry.getSite(siteId);
    if (!site) {
      return res.status(404).json({ error: `Site '${siteId}' not found` });
    }

    const { URL } = require('url');
    const url = new URL(site.domain_url);
    const configUrl = `${url.origin}/config/doctor-profile.json`;
    const fetchModule = url.protocol === 'https:' ? require('https') : require('http');

    const config = await new Promise((resolve, reject) => {
      fetchModule.get(configUrl, { timeout: 10000 }, (resp) => {
        if (resp.statusCode !== 200) {
          reject(new Error(`HTTP ${resp.statusCode} from remote`));
          return;
        }
        let body = '';
        resp.on('data', chunk => { body += chunk; });
        resp.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch (e) { reject(new Error('Invalid JSON in remote config')); }
        });
      }).on('error', (err) => reject(new Error(`Failed to fetch config: ${err.message}`)));
    });

    res.json({
      config,
      fetched_at: new Date().toISOString(),
      source: 'http'
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// PUT /api/sites/:siteId/config - Push config via SSH
router.put('/:siteId/config', async (req, res) => {
  try {
    const { siteId } = req.params;
    const { config } = req.body;

    if (!config || typeof config !== 'object') {
      return res.status(400).json({ error: 'Invalid config: must be a JSON object' });
    }

    const site = registry.getSite(siteId);
    if (!site) {
      return res.status(404).json({ error: `Site '${siteId}' not found` });
    }

    // Basic validation: check for required fields
    if (!config.doctor && !config.site_id) {
      return res.status(400).json({ error: "Invalid config: missing required field 'doctor' or 'site_id'" });
    }

    const configContent = JSON.stringify(config, null, 2);
    const result = await sshService.pushFile(site, configContent, site.remote_config_path);

    const deployedAt = new Date().toISOString();
    registry.updateSiteStatus(siteId, 'online', { last_updated: deployedAt });

    logger.logAction({
      site_id: siteId,
      action: 'config_push',
      result: 'success',
      changes_summary: 'Config deployed via SSH'
    });

    res.json({
      message: 'Config deployed successfully',
      deployed_at: deployedAt,
      site_id: siteId
    });
  } catch (err) {
    const { siteId } = req.params;
    logger.logAction({
      site_id: siteId,
      action: 'config_push',
      result: 'failure',
      error_message: err.message
    });

    if (err.message.includes('SSH') || err.message.includes('authentication')) {
      return res.status(502).json({ error: `Failed to push config: ${err.message}` });
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sites/:siteId/config/diff - Compare proposed vs live config
router.post('/:siteId/config/diff', async (req, res) => {
  try {
    const { siteId } = req.params;
    const { proposed_config } = req.body;

    if (!proposed_config || typeof proposed_config !== 'object') {
      return res.status(400).json({ error: 'proposed_config must be a JSON object' });
    }

    const site = registry.getSite(siteId);
    if (!site) {
      return res.status(404).json({ error: `Site '${siteId}' not found` });
    }

    // Fetch current live config
    const { URL } = require('url');
    const url = new URL(site.domain_url);
    const configUrl = `${url.origin}/config/doctor-profile.json`;
    const fetchModule = url.protocol === 'https:' ? require('https') : require('http');

    const liveConfig = await new Promise((resolve, reject) => {
      fetchModule.get(configUrl, { timeout: 10000 }, (resp) => {
        let body = '';
        resp.on('data', chunk => { body += chunk; });
        resp.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch (e) { reject(new Error('Failed to parse live config')); }
        });
      }).on('error', reject);
    });

    // Compute line-by-line diff
    const liveLines = JSON.stringify(liveConfig, null, 2).split('\n');
    const proposedLines = JSON.stringify(proposed_config, null, 2).split('\n');

    const diff = [];
    const maxLen = Math.max(liveLines.length, proposedLines.length);

    for (let i = 0; i < maxLen; i++) {
      const liveLine = liveLines[i] || '';
      const proposedLine = proposedLines[i] || '';
      if (liveLine !== proposedLine) {
        if (liveLine) diff.push({ line: i + 1, type: 'removed', content: liveLine });
        if (proposedLine) diff.push({ line: i + 1, type: 'added', content: proposedLine });
      }
    }

    const changedFields = diff.filter(d => d.type === 'added').length;
    res.json({
      has_changes: diff.length > 0,
      diff,
      summary: diff.length > 0 ? `${changedFields} line(s) changed` : 'No changes'
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
