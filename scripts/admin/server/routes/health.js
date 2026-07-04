const express = require('express');
const router = express.Router();
const registry = require('../services/registry');
const healthService = require('../services/health');
const sshService = require('../services/ssh');

// POST /api/sites/refresh - Refresh status of all or specified sites
router.post('/refresh', async (req, res) => {
  try {
    const { site_ids } = req.body || {};
    let sites = registry.getAllSites();

    if (site_ids && Array.isArray(site_ids) && site_ids.length > 0) {
      sites = sites.filter(s => site_ids.includes(s.site_id));
    }

    const results = await Promise.all(sites.map(async (site) => {
      const [httpResult, sslResult] = await Promise.all([
        healthService.checkHttpStatus(site.domain_url),
        healthService.checkSSLExpiry(site.domain_url)
      ]);

      const status = healthService.determineSiteStatus(httpResult, sslResult, site.last_updated);
      registry.updateSiteStatus(site.site_id, status);

      return { site_id: site.site_id, status };
    }));

    res.json({ checked: results.length, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sites/:siteId/health - Get detailed health info
router.get('/:siteId/health', async (req, res) => {
  try {
    const { siteId } = req.params;
    const site = registry.getSite(siteId);
    if (!site) {
      return res.status(404).json({ error: `Site '${siteId}' not found` });
    }

    const [httpResult, sslResult] = await Promise.all([
      healthService.checkHttpStatus(site.domain_url),
      healthService.checkSSLExpiry(site.domain_url)
    ]);

    const lastUpdated = site.last_updated ? new Date(site.last_updated) : null;
    const lastUpdateDays = lastUpdated ? Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)) : null;

    res.json({
      site_id: siteId,
      http_reachable: httpResult.reachable,
      http_status_code: httpResult.status_code,
      config_valid: httpResult.config_valid,
      ssl_days_remaining: sslResult.days_remaining,
      ssl_expiry_date: sslResult.expiry_date,
      last_update_days: lastUpdateDays,
      checked_at: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
