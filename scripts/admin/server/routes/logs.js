const express = require('express');
const router = express.Router();
const logger = require('../services/logger');

// GET /api/logs - Get deployment audit log
router.get('/', (req, res) => {
  try {
    const { site_id, limit } = req.query;
    const maxEntries = parseInt(limit) || 50;

    let logs;
    if (site_id) {
      logs = logger.filterBySite(site_id, maxEntries);
    } else {
      logs = logger.getLogEntries(maxEntries);
    }

    res.json({ logs, total: logs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
