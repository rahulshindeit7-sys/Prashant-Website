/**
 * Login Page Script
 * Handles login form submission and error display
 */

import { post } from './api.js';

const loginForm = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

/**
 * Handle login form submission
 */
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showError('Please enter both username and password');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';
  errorMessage.style.display = 'none';

  try {
    const response = await post('/api/login', { username, password });

    if (response.ok) {
      // Redirect to admin dashboard
      window.location.href = '/admin/dashboard.html';
    } else {
      showError(response.message || 'Login failed');
      passwordInput.value = '';
      passwordInput.focus();
    }
  } catch (err) {
    showError(err.message || 'Network error — please try again');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log In';
  }
});

/**
 * Display error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

// Focus username field on load
window.addEventListener('load', () => {
  usernameInput.focus();
});
