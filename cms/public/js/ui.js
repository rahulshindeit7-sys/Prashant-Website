/**
 * UI Utilities
 * Toast notifications, confirm dialogs, timestamps
 */

/**
 * Show toast notification
 */
export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/**
 * Show confirm dialog
 */
export function showConfirmDialog(message, onConfirm) {
  const dialog = document.getElementById('confirmDialog');
  const messageEl = document.getElementById('confirmMessage');
  const yesBtn = document.getElementById('confirmYes');
  const noBtn = document.getElementById('confirmNo');

  messageEl.textContent = message;
  dialog.style.display = 'flex';

  const handleYes = () => {
    onConfirm();
    cleanup();
  };

  const handleNo = () => {
    cleanup();
  };

  const cleanup = () => {
    dialog.style.display = 'none';
    yesBtn.removeEventListener('click', handleYes);
    noBtn.removeEventListener('click', handleNo);
  };

  yesBtn.addEventListener('click', handleYes);
  noBtn.addEventListener('click', handleNo);
}

/**
 * Update last saved timestamp
 */
export function updateLastSaved(text) {
  const el = document.getElementById('lastSaved');
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  el.textContent = `${text} at ${time}`;
}

export default { showToast, showConfirmDialog, updateLastSaved };
