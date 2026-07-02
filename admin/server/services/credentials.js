const SERVICE_NAME = 'doctor-dashboard';

let keytar;
try {
  keytar = require('keytar');
} catch (e) {
  // Fallback for environments without keytar (e.g., CI)
  console.warn('keytar not available — credential storage disabled');
  keytar = null;
}

async function storePassword(siteId, password) {
  if (!keytar) {
    throw new Error('Credential storage not available (keytar not installed)');
  }
  await keytar.setPassword(SERVICE_NAME, siteId, password);
}

async function getPassword(siteId) {
  if (!keytar) {
    return null;
  }
  return await keytar.getPassword(SERVICE_NAME, siteId);
}

async function deletePassword(siteId) {
  if (!keytar) {
    return false;
  }
  return await keytar.deletePassword(SERVICE_NAME, siteId);
}

module.exports = {
  storePassword,
  getPassword,
  deletePassword
};
