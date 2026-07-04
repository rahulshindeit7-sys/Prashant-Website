/**
 * Dashboard Script
 * Handles tab routing, config loading, session management
 */

import { apiCall, get, post, put } from './api.js';
import { buildAllTabs } from './editor.js';
import { showToast, showConfirmDialog, updateLastSaved } from './ui.js';

let currentConfig = null;

/**
 * Initialize dashboard on load
 */
window.addEventListener('load', async () => {
  console.log('[Dashboard] Initializing...');
  
  // Update UI to show loading state
  updateLastSaved('Initializing...');

  try {
    // Check session and load config
    console.log('[Dashboard] Fetching config from /api/content');
    const response = await get('/api/content');
    
    // Check if response has expected structure
    if (!response || !response.config) {
      console.error('[Dashboard] Response missing config field:', response);
      throw new Error('Server returned invalid response structure. Expected { ok: true, config: {...} }');
    }

    currentConfig = response.config;
    console.log('[Dashboard] Config loaded successfully:', currentConfig);

    // Build all tab forms
    console.log('[Dashboard] Building tab forms...');
    buildAllTabs(currentConfig);

    // Setup event listeners
    setupEventListeners();

    // Handle URL hash for tab navigation
    if (window.location.hash) {
      const hashTab = window.location.hash;
      console.log('[Dashboard] Navigating to hash:', hashTab);
      const link = document.querySelector(`a[href="${hashTab}"]`);
      if (link) {
        switchTab(link);
      } else {
        console.warn('[Dashboard] Hash tab not found, defaulting to #tab-home');
        switchTab(document.querySelector('a[href="#tab-home"]'));
      }
    } else {
      // Default to home tab
      switchTab(document.querySelector('a[href="#tab-home"]'));
    }

    updateLastSaved('Loaded');
    console.log('[Dashboard] Initialization complete');
  } catch (err) {
    console.error('[Dashboard] Initialization failed:', err);
    console.error('[Dashboard] Error message:', err.message);
    console.error('[Dashboard] Stack:', err.stack);
    
    // Show error in UI
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div style="padding: 20px; background: #fee; border: 1px solid #c00; border-radius: 4px;">
          <h2 style="color: #c00; margin-top: 0;">⚠️ Dashboard Load Failed</h2>
          <p><strong>Error:</strong> ${err.message}</p>
          <p style="font-size: 0.9em; color: #666;">
            Check the browser console (F12) for detailed error information.<br>
            Ensure you're logged in and the API endpoint is reachable.
          </p>
          <button onclick="location.reload()" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Retry Loading
          </button>
        </div>
      `;
    }
    
    updateLastSaved('Load failed');
    showToast(`Error loading dashboard: ${err.message}`, 'error');
  }
});

/**
 * Setup event listeners for buttons
 */
function setupEventListeners() {
  document.getElementById('saveDraftBtn').addEventListener('click', saveDraft);
  document.getElementById('previewBtn').addEventListener('click', openPreview);
  document.getElementById('publishBtn').addEventListener('click', confirmPublish);
  document.getElementById('logoutBtn').addEventListener('click', confirmLogout);

  // Tab navigation
  document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link);
      // Load backups when preview tab is clicked
      if (link.getAttribute('href') === '#tab-preview') {
        setTimeout(() => loadAndDisplayBackups(), 100);
      }
    });
  });
}

/**
 * Switch active tab
 */
function switchTab(link) {
  const tabId = link.getAttribute('href');
  console.log('[Dashboard] Switching to tab:', tabId);
  
  // Remove active class from all links
  document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
  // Add active class to clicked link
  link.classList.add('active');

  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.style.display = 'none';
  });
  // Show selected panel
  const panel = document.querySelector(tabId);
  if (panel) {
    panel.style.display = 'block';
    // Update URL hash
    window.location.hash = tabId;
  } else {
    console.warn('[Dashboard] Tab panel not found:', tabId);
  }
}

/**
 * Collect all form data from the current tab
 */
function collectFormData() {
  const formElements = document.querySelectorAll('[data-field]');
  const config = JSON.parse(JSON.stringify(currentConfig)); // Deep copy

  formElements.forEach(el => {
    const field = el.getAttribute('data-field');
    const value = el.type === 'checkbox' ? el.checked : el.value;

    // Navigate nested paths like "doctor.name"
    const parts = field.split('.');
    let obj = config;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
  });

  return config;
}

/**
 * Save draft
 */
async function saveDraft() {
  try {
    const config = collectFormData();
    const btn = document.getElementById('saveDraftBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Saving...';

    console.log('[Dashboard] Saving draft...');
    const response = await put('/api/content', { config });

    if (response && response.ok !== false) {
      currentConfig = config;
      updateLastSaved('Draft saved');
      showToast('Draft saved successfully', 'success');
      console.log('[Dashboard] Draft saved');
    } else {
      const errorMsg = response?.message || 'Unknown error';
      console.error('[Dashboard] Save error:', errorMsg);
      showToast(`Error: ${errorMsg}`, 'error');
    }
  } catch (err) {
    console.error('[Dashboard] Save failed:', err);
    showToast(`Save failed: ${err.message}`, 'error');
  } finally {
    document.getElementById('saveDraftBtn').disabled = false;
    document.getElementById('saveDraftBtn').textContent = '💾 Save Draft';
  }
}

/**
 * Open preview in new tab
 * Note: Preview URL should be configured based on the doctor's website domain
 */
function openPreview() {
  showConfirmDialog(
    'Open preview of changes?\n\n(Opening doctor website - live config will be shown)',
    () => {
      // TODO: Configure preview URL based on doctor subdomain
      // For now, show a placeholder message
      const doctorId = currentConfig?.doctor?.id || 'doctor';
      console.log('[Dashboard] Preview for doctor:', doctorId);
      
      // Open the main doctor website (you may need to update this URL)
      // Example: window.open(`https://${doctorId}.smzentrix.info`, '_blank');
      window.open('/?preview=1', '_blank');
    }
  );
}

/**
 * Confirm and publish
 */
function confirmPublish() {
  showConfirmDialog(
    '⚠️ Publish to live?\n\nThis will make all draft changes immediately visible on the public website. A backup will be created automatically.',
    async () => {
      await publish();
    }
  );
}

/**
 * Publish changes
 */
async function publish() {
  try {
    const btn = document.getElementById('publishBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Publishing...';

    console.log('[Dashboard] Publishing...');
    const response = await post('/api/publish', {});

    if (response && response.ok !== false) {
      updateLastSaved('Published');
      showToast('✅ Published successfully! Changes are now live.', 'success');
      console.log('[Dashboard] Publish complete');
    } else {
      const errorMsg = response?.message || 'Unknown error';
      console.error('[Dashboard] Publish error:', errorMsg);
      showToast(`Publish failed: ${errorMsg}`, 'error');
    }
  } catch (err) {
    console.error('[Dashboard] Publish error:', err);
    showToast(`Publish error: ${err.message}`, 'error');
  } finally {
    document.getElementById('publishBtn').disabled = false;
    document.getElementById('publishBtn').textContent = '📤 Publish';
  }
}

/**
 * Confirm and logout
 */
function confirmLogout() {
  showConfirmDialog(
    'Log out from Doctor CMS?',
    async () => {
      try {
        await post('/api/logout', {});
        window.location.href = '/doctor-cms/admin/login.html';
      } catch (err) {
        console.error('[Dashboard] Logout error:', err);
        showToast('Logout failed', 'error');
      }
    }
  );
}

/**
 * Load and display backup list
 */
async function loadAndDisplayBackups() {
  try {
    console.log('[Dashboard] Loading backups...');
    const response = await get('/api/backups');
    
    if (!response || !response.backups) {
      console.warn('[Dashboard] No backups in response:', response);
      document.getElementById('backupsList').innerHTML = '<p>No backups available</p>';
      return;
    }

    const backups = response.backups || [];
    if (backups.length === 0) {
      document.getElementById('backupsList').innerHTML = '<p>No backups available</p>';
      return;
    }

    console.log('[Dashboard] Found', backups.length, 'backups');

    let html = '<table class="backups-table"><thead><tr><th>Created</th><th>Doctor Name</th><th>Action</th></tr></thead><tbody>';
    
    backups.forEach(backup => {
      const date = new Date(backup.created).toLocaleString();
      html += `
        <tr>
          <td>${date}</td>
          <td>${backup.doctorName || 'Unknown'}</td>
          <td><button class="btn-rollback" data-filename="${backup.filename}">Restore</button></td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    document.getElementById('backupsList').innerHTML = html;

    // Add rollback event listeners
    document.querySelectorAll('.btn-rollback').forEach(btn => {
      btn.addEventListener('click', () => confirmRollback(btn.getAttribute('data-filename')));
    });
  } catch (err) {
    console.error('[Dashboard] Failed to load backups:', err);
    const el = document.getElementById('backupsList');
    if (el) el.innerHTML = `<p style="color: red;">Error loading backups: ${err.message}</p>`;
  }
}

/**
 * Confirm and rollback
 */
function confirmRollback(filename) {
  showConfirmDialog(
    `⚠️ Restore this version?\n\nThis will replace the live config with this backup. A backup of the current version will be created first.`,
    async () => {
      await rollback(filename);
    }
  );
}

/**
 * Perform rollback
 */
async function rollback(filename) {
  try {
    const btn = document.querySelector(`[data-filename="${filename}"]`);
    if (btn) btn.disabled = true;

    console.log('[Dashboard] Rolling back to:', filename);
    const response = await post('/api/rollback', { filename });

    if (response && response.ok !== false) {
      updateLastSaved('Rolled back');
      showToast('✅ Restored successfully! Changes are now live.', 'success');
      console.log('[Dashboard] Rollback complete');
      // Reload backup list and config
      loadAndDisplayBackups();
      // Reload config
      const configResponse = await get('/api/content');
      if (configResponse && configResponse.config) {
        currentConfig = configResponse.config;
        buildAllTabs(currentConfig);
      }
    } else {
      const errorMsg = response?.message || 'Unknown error';
      console.error('[Dashboard] Rollback error:', errorMsg);
      showToast(`Rollback failed: ${errorMsg}`, 'error');
    }
  } catch (err) {
    console.error('[Dashboard] Rollback error:', err);
    showToast(`Rollback error: ${err.message}`, 'error');
  } finally {
    const btn = document.querySelector(`[data-filename="${filename}"]`);
    if (btn) btn.disabled = false;
  }
}

export { currentConfig, collectFormData };
