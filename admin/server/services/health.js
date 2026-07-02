const https = require('https');
const http = require('http');
const tls = require('tls');
const { URL } = require('url');

async function checkHttpStatus(domainUrl) {
  return new Promise((resolve) => {
    const url = new URL(domainUrl);
    const configUrl = `${url.origin}/config/doctor-profile.json`;
    const client = url.protocol === 'https:' ? https : http;

    const req = client.get(configUrl, { timeout: 10000 }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        let configValid = false;
        try {
          JSON.parse(body);
          configValid = true;
        } catch (e) {
          // invalid JSON
        }
        resolve({
          reachable: true,
          status_code: res.statusCode,
          config_valid: configValid,
          config_last_modified: res.headers['last-modified'] || null
        });
      });
    });

    req.on('error', (err) => {
      resolve({ reachable: false, status_code: null, config_valid: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ reachable: false, status_code: null, config_valid: false, error: 'Timeout' });
    });
  });
}

async function checkSSLExpiry(domainUrl) {
  return new Promise((resolve) => {
    const url = new URL(domainUrl);
    if (url.protocol !== 'https:') {
      resolve({ days_remaining: null, expiry_date: null });
      return;
    }

    const socket = tls.connect({
      host: url.hostname,
      port: 443,
      servername: url.hostname,
      timeout: 10000
    }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (cert && cert.valid_to) {
        const expiry = new Date(cert.valid_to);
        const now = new Date();
        const daysRemaining = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
        resolve({ days_remaining: daysRemaining, expiry_date: expiry.toISOString() });
      } else {
        resolve({ days_remaining: null, expiry_date: null });
      }
    });

    socket.on('error', () => {
      resolve({ days_remaining: null, expiry_date: null });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ days_remaining: null, expiry_date: null });
    });
  });
}

function determineSiteStatus(httpResult, sslResult, lastUpdated) {
  // Priority: offline > auth_failed > config_error > ssl_expiring > stale > online
  if (!httpResult.reachable) {
    return 'offline';
  }
  if (httpResult.status_code === 403 || httpResult.status_code === 401) {
    return 'auth_failed';
  }
  if (!httpResult.config_valid) {
    return 'config_error';
  }
  if (sslResult.days_remaining !== null && sslResult.days_remaining < 30) {
    return 'ssl_expiring';
  }
  if (lastUpdated) {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate > 90) {
      return 'stale';
    }
  }
  return 'online';
}

module.exports = {
  checkHttpStatus,
  checkSSLExpiry,
  determineSiteStatus
};
