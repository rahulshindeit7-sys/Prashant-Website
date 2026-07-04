const API_BASE = '/api';

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

// Sites API
async function getSites() {
  return request('GET', '/sites');
}

async function addSite(siteData) {
  return request('POST', '/sites', siteData);
}

async function removeSite(siteId) {
  return request('DELETE', `/sites/${encodeURIComponent(siteId)}`);
}

async function testConnection(siteId) {
  return request('POST', `/sites/${encodeURIComponent(siteId)}/test-connection`);
}

// Config API
async function getConfig(siteId) {
  return request('GET', `/sites/${encodeURIComponent(siteId)}/config`);
}

async function saveConfig(siteId, config) {
  return request('PUT', `/sites/${encodeURIComponent(siteId)}/config`, { config });
}

async function getDiff(siteId, proposedConfig) {
  return request('POST', `/sites/${encodeURIComponent(siteId)}/config/diff`, { proposed_config: proposedConfig });
}

// Health API
async function refreshSites(siteIds = null) {
  const body = siteIds ? { site_ids: siteIds } : {};
  return request('POST', '/sites/refresh', body);
}

async function getHealthDetails(siteId) {
  return request('GET', `/sites/${encodeURIComponent(siteId)}/health`);
}

// Logs API
async function getLogs(siteId = null, limit = 50) {
  let path = `/logs?limit=${limit}`;
  if (siteId) path += `&site_id=${encodeURIComponent(siteId)}`;
  return request('GET', path);
}

// Export API functions
window.API = {
  getSites,
  addSite,
  removeSite,
  testConnection,
  getConfig,
  saveConfig,
  getDiff,
  refreshSites,
  getHealthDetails,
  getLogs
};
