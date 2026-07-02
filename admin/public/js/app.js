// Main Dashboard Application
(function() {
  'use strict';

  let allSites = [];
  let cachedSites = null;
  let currentEditSiteId = null;

  // === Initialization ===
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    bindEvents();
    await loadSites();
  }

  // === Data Loading ===
  async function loadSites() {
    try {
      const data = await API.getSites();
      allSites = data.sites;
      cachedSites = data.sites;
      UI.renderSummaryBar(data.summary);
      renderSiteGrid(allSites);
      hideOfflineBanner();
    } catch (err) {
      showOfflineBanner();
      if (cachedSites) {
        renderSiteGrid(cachedSites);
      }
    }
  }

  function renderSiteGrid(sites) {
    const grid = document.getElementById('site-grid');
    grid.innerHTML = '';

    if (sites.length === 0) {
      UI.renderEmptyState(true);
      return;
    }

    UI.renderEmptyState(false);
    sites.forEach(site => {
      grid.appendChild(UI.renderSiteCard(site));
    });
  }

  // === Event Binding ===
  function bindEvents() {
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', handleRefresh);

    // Add site button
    document.getElementById('add-site-btn').addEventListener('click', () => UI.showModal('add-site-modal'));

    // Search input
    document.getElementById('search-input').addEventListener('input', handleSearch);

    // Site grid actions (event delegation)
    document.getElementById('site-grid').addEventListener('click', handleCardAction);

    // Add site form
    document.getElementById('add-site-form').addEventListener('submit', handleAddSite);

    // Test connection button
    document.getElementById('test-connection-btn').addEventListener('click', handleTestConnection);

    // Auth method toggle
    document.getElementById('site-auth-method').addEventListener('change', (e) => {
      document.getElementById('key-path-group').style.display = e.target.value === 'key' ? 'block' : 'none';
    });

    // Modal close buttons
    document.querySelectorAll('.modal__close, .modal__overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) modal.style.display = 'none';
      });
    });

    // Confirm modal buttons
    document.getElementById('confirm-cancel-btn').addEventListener('click', () => UI.hideModal('confirm-modal'));

    // Editor panel
    document.getElementById('editor-close-btn').addEventListener('click', closeEditor);
    document.getElementById('preview-diff-btn').addEventListener('click', handlePreviewDiff);
    document.getElementById('save-deploy-btn').addEventListener('click', handleSaveDeploy);

    // Log panel toggle
    document.getElementById('toggle-log-btn').addEventListener('click', handleToggleLog);
  }

  // === Refresh ===
  async function handleRefresh() {
    const btn = document.getElementById('refresh-btn');
    btn.disabled = true;
    btn.textContent = 'Refreshing...';
    try {
      await API.refreshSites();
      await loadSites();
      UI.showToast('All sites refreshed', 'success');
    } catch (err) {
      UI.showToast('Refresh failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Refresh All';
    }
  }

  // === Search/Filter ===
  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderSiteGrid(allSites);
      return;
    }
    const filtered = allSites.filter(site =>
      site.doctor_name.toLowerCase().includes(query) ||
      site.clinic_name.toLowerCase().includes(query) ||
      site.domain_url.toLowerCase().includes(query) ||
      site.site_id.toLowerCase().includes(query)
    );
    renderSiteGrid(filtered);
  }

  // === Card Actions ===
  function handleCardAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const siteId = btn.dataset.siteId;

    switch (action) {
      case 'edit': openEditor(siteId); break;
      case 'health': showHealthDetails(siteId); break;
      case 'remove': confirmRemoveSite(siteId); break;
    }
  }

  // === Add Site ===
  async function handleAddSite(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const siteData = Object.fromEntries(formData.entries());

    try {
      const result = await API.addSite(siteData);
      UI.showToast(`Site "${result.doctor_name}" added successfully`, 'success');
      UI.hideModal('add-site-modal');
      form.reset();
      await loadSites();
    } catch (err) {
      UI.showToast('Add failed: ' + err.message, 'error');
    }
  }

  // === Test Connection ===
  async function handleTestConnection() {
    const form = document.getElementById('add-site-form');
    const formData = new FormData(form);
    const siteData = Object.fromEntries(formData.entries());

    const resultDiv = document.getElementById('connection-test-result');
    resultDiv.style.display = 'block';
    resultDiv.className = 'connection-result';
    resultDiv.textContent = 'Testing connection...';

    try {
      // For test-connection before adding, we need to temporarily add and test
      // Instead, just test HTTP reachability as a pre-check
      const response = await fetch(`${siteData.domain_url}/config/doctor-profile.json`, { mode: 'no-cors' });
      resultDiv.className = 'connection-result connection-result--success';
      resultDiv.textContent = '✓ Domain is reachable. Add the site to test full SSH connectivity.';
    } catch (err) {
      resultDiv.className = 'connection-result connection-result--error';
      resultDiv.textContent = '✗ Could not reach domain. Check the URL and try again.';
    }
  }

  // === Remove Site ===
  function confirmRemoveSite(siteId) {
    const site = allSites.find(s => s.site_id === siteId);
    if (!site) return;

    document.getElementById('confirm-site-name').textContent = `${site.doctor_name} (${site.domain_url})`;
    UI.showModal('confirm-modal');

    const confirmBtn = document.getElementById('confirm-ok-btn');
    // Remove old listeners by cloning
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.addEventListener('click', async () => {
      try {
        await API.removeSite(siteId);
        UI.showToast(`Site "${site.doctor_name}" removed`, 'success');
        UI.hideModal('confirm-modal');
        await loadSites();
      } catch (err) {
        UI.showToast('Remove failed: ' + err.message, 'error');
      }
    });
  }

  // === Editor ===
  async function openEditor(siteId) {
    currentEditSiteId = siteId;
    const site = allSites.find(s => s.site_id === siteId);
    document.getElementById('editor-site-name').textContent = `Edit: ${site ? site.doctor_name : siteId}`;
    document.getElementById('editor-panel').style.display = 'block';
    document.getElementById('diff-view').style.display = 'none';

    try {
      const data = await API.getConfig(siteId);
      window.Editor.loadConfig(data.config);
    } catch (err) {
      UI.showToast('Failed to load config: ' + err.message, 'error');
    }
  }

  function closeEditor() {
    document.getElementById('editor-panel').style.display = 'none';
    currentEditSiteId = null;
  }

  async function handlePreviewDiff() {
    if (!currentEditSiteId) return;
    try {
      const content = window.Editor.getEditorContent();
      const proposedConfig = JSON.parse(content);
      const diffData = await API.getDiff(currentEditSiteId, proposedConfig);
      const diffView = document.getElementById('diff-view');
      diffView.style.display = 'block';

      if (!diffData.has_changes) {
        diffView.innerHTML = '<p>No changes detected.</p>';
        return;
      }

      diffView.innerHTML = diffData.diff.map(d => {
        const cls = d.type === 'added' ? 'diff-line--added' : 'diff-line--removed';
        const prefix = d.type === 'added' ? '+' : '-';
        return `<div class="${cls}">${prefix} ${UI.escapeHtml(d.content)}</div>`;
      }).join('');
    } catch (err) {
      UI.showToast('Diff failed: ' + err.message, 'error');
    }
  }

  async function handleSaveDeploy() {
    if (!currentEditSiteId) return;
    const btn = document.getElementById('save-deploy-btn');
    btn.disabled = true;
    btn.textContent = 'Deploying...';
    try {
      const content = window.Editor.getEditorContent();
      const config = JSON.parse(content);
      await API.saveConfig(currentEditSiteId, config);
      UI.showToast('Config deployed successfully!', 'success');
      closeEditor();
      await loadSites();
    } catch (err) {
      UI.showToast('Deploy failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Save & Deploy';
    }
  }

  // === Health Details ===
  async function showHealthDetails(siteId) {
    try {
      const health = await API.getHealthDetails(siteId);
      UI.renderHealthDetails(health);
      UI.showModal('health-panel');
    } catch (err) {
      UI.showToast('Health check failed: ' + err.message, 'error');
    }
  }

  // === Logs ===
  async function handleToggleLog() {
    const entries = document.getElementById('log-entries');
    const btn = document.getElementById('toggle-log-btn');
    if (entries.style.display === 'none') {
      entries.style.display = 'block';
      btn.textContent = '▲';
      try {
        const data = await API.getLogs();
        UI.renderLogEntries(data.logs);
      } catch (err) {
        UI.showToast('Failed to load logs', 'error');
      }
    } else {
      entries.style.display = 'none';
      btn.textContent = '▼';
    }
  }

  // === Offline Handling ===
  function showOfflineBanner() {
    document.getElementById('offline-banner').style.display = 'block';
  }

  function hideOfflineBanner() {
    document.getElementById('offline-banner').style.display = 'none';
  }

})();
