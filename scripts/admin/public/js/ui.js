// UI Helper functions
window.UI = {
  renderSiteCard(site) {
    const card = document.createElement('div');
    card.className = 'site-card';
    card.dataset.siteId = site.site_id;

    const statusClass = `status-badge--${site.status}`;
    const statusLabel = site.status.replace('_', ' ');
    const lastChecked = site.last_checked ? new Date(site.last_checked).toLocaleString() : 'Never';

    card.innerHTML = `
      <div class="site-card__header">
        <div>
          <div class="site-card__name">${this.escapeHtml(site.doctor_name)}</div>
          <div class="site-card__clinic">${this.escapeHtml(site.clinic_name)}</div>
        </div>
        <span class="status-badge ${statusClass}">
          <span class="status-badge__dot"></span>
          ${statusLabel}
        </span>
      </div>
      <a class="site-card__domain" href="${this.escapeHtml(site.domain_url)}" target="_blank" rel="noopener">${this.escapeHtml(site.domain_url)}</a>
      ${this.renderWarningBadges(site)}
      <div class="site-card__footer">
        <span class="site-card__time">Checked: ${lastChecked}</span>
        <div class="site-card__actions">
          <button class="btn btn--secondary btn--sm" data-action="edit" data-site-id="${site.site_id}" title="Edit Config">✎</button>
          <button class="btn btn--secondary btn--sm" data-action="health" data-site-id="${site.site_id}" title="Health Details">♥</button>
          <button class="btn btn--danger btn--sm" data-action="remove" data-site-id="${site.site_id}" title="Remove">✕</button>
        </div>
      </div>
    `;
    return card;
  },

  renderWarningBadges(site) {
    const badges = [];
    if (site.status === 'ssl_expiring') {
      badges.push('<span class="warning-badge warning-badge--ssl">SSL Expiring</span>');
    }
    if (site.status === 'stale') {
      badges.push('<span class="warning-badge warning-badge--stale">Stale Config</span>');
    }
    if (badges.length === 0) return '';
    return `<div class="warning-badges">${badges.join('')}</div>`;
  },

  renderSummaryBar(summary) {
    document.getElementById('total-count').textContent = summary.total;
    document.getElementById('online-count').textContent = summary.online;
    document.getElementById('offline-count').textContent = summary.offline;
    document.getElementById('warning-count').textContent = summary.warnings;
  },

  renderEmptyState(show) {
    document.getElementById('empty-state').style.display = show ? 'block' : 'none';
    document.getElementById('site-grid').style.display = show ? 'none' : 'grid';
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
  },

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  },

  renderLogEntries(logs) {
    const container = document.getElementById('log-entries');
    if (!logs || logs.length === 0) {
      container.innerHTML = '<p style="color: var(--color-text-muted); font-size: 0.85rem;">No deployment actions recorded yet.</p>';
      return;
    }
    container.innerHTML = logs.map(log => `
      <div class="log-entry">
        <span class="log-entry__time">${new Date(log.timestamp).toLocaleString()}</span>
        <span class="log-entry__action">${this.escapeHtml(log.action)}</span>
        <span>${this.escapeHtml(log.site_id)}</span>
        <span class="log-entry__result--${log.result}">${log.result}</span>
        ${log.changes_summary ? `<span>${this.escapeHtml(log.changes_summary)}</span>` : ''}
      </div>
    `).join('');
  },

  renderHealthDetails(health) {
    const container = document.getElementById('health-details');
    const sslClass = health.ssl_days_remaining !== null && health.ssl_days_remaining < 30 ? 'warn' : 'ok';
    const httpClass = health.http_reachable ? 'ok' : 'error';

    container.innerHTML = `
      <div class="health-details__row">
        <span class="health-details__label">HTTP Reachable</span>
        <span class="health-details__value--${httpClass}">${health.http_reachable ? 'Yes' : 'No'}</span>
      </div>
      <div class="health-details__row">
        <span class="health-details__label">HTTP Status</span>
        <span>${health.http_status_code || 'N/A'}</span>
      </div>
      <div class="health-details__row">
        <span class="health-details__label">Config Valid</span>
        <span class="health-details__value--${health.config_valid ? 'ok' : 'error'}">${health.config_valid ? 'Yes' : 'No'}</span>
      </div>
      <div class="health-details__row">
        <span class="health-details__label">SSL Days Remaining</span>
        <span class="health-details__value--${sslClass}">${health.ssl_days_remaining !== null ? health.ssl_days_remaining + ' days' : 'N/A'}</span>
      </div>
      <div class="health-details__row">
        <span class="health-details__label">SSL Expiry</span>
        <span>${health.ssl_expiry_date ? new Date(health.ssl_expiry_date).toLocaleDateString() : 'N/A'}</span>
      </div>
      <div class="health-details__row">
        <span class="health-details__label">Days Since Last Update</span>
        <span class="health-details__value--${health.last_update_days > 90 ? 'warn' : 'ok'}">${health.last_update_days !== null ? health.last_update_days + ' days' : 'Never updated'}</span>
      </div>
      <div class="health-details__row">
        <span class="health-details__label">Checked At</span>
        <span>${new Date(health.checked_at).toLocaleString()}</span>
      </div>
    `;
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
