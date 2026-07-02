const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '..', 'data', 'dashboard-registry.json');

function loadRegistry() {
  const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
  return JSON.parse(data);
}

function saveRegistry(registry) {
  registry.updated_at = new Date().toISOString();
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
}

function getAllSites() {
  const registry = loadRegistry();
  return registry.sites;
}

function getSite(siteId) {
  const registry = loadRegistry();
  return registry.sites.find(s => s.site_id === siteId) || null;
}

function addSite(siteData) {
  const registry = loadRegistry();
  const existing = registry.sites.find(s => s.site_id === siteData.site_id);
  if (existing) {
    throw new Error(`Site with ID '${siteData.site_id}' already exists`);
  }
  siteData.added_at = new Date().toISOString();
  siteData.last_checked = new Date().toISOString();
  registry.sites.push(siteData);
  saveRegistry(registry);
  return siteData;
}

function removeSite(siteId) {
  const registry = loadRegistry();
  const index = registry.sites.findIndex(s => s.site_id === siteId);
  if (index === -1) {
    throw new Error(`Site '${siteId}' not found`);
  }
  const removed = registry.sites.splice(index, 1)[0];
  saveRegistry(registry);
  return removed;
}

function updateSiteStatus(siteId, status, additionalFields = {}) {
  const registry = loadRegistry();
  const site = registry.sites.find(s => s.site_id === siteId);
  if (!site) {
    throw new Error(`Site '${siteId}' not found`);
  }
  site.status = status;
  site.last_checked = new Date().toISOString();
  Object.assign(site, additionalFields);
  saveRegistry(registry);
  return site;
}

module.exports = {
  loadRegistry,
  saveRegistry,
  getAllSites,
  getSite,
  addSite,
  removeSite,
  updateSiteStatus
};
