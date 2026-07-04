/**
 * API Fetch Wrapper
 * Handles all API calls with authentication and error handling
 */

// API base path for CMS endpoints (with /doctor-cms prefix for path-based routing)
const API_BASE = '/doctor-cms';

/**
 * Build correct API URL based on endpoint
 * - If endpoint starts with 'http', keep as-is (for external APIs)
 * - If endpoint starts with '/doctor-cms/', keep as-is (already prefixed)
 * - If endpoint starts with '/api/', prefix with /doctor-cms
 * - Otherwise, prefix with /doctor-cms/api
 * @param {string} endpoint - API endpoint
 * @returns {string} Full API URL
 */
function buildApiUrl(endpoint) {
  if (endpoint.startsWith('http')) {
    return endpoint; // External URL, use as-is
  }
  if (endpoint.startsWith('/doctor-cms/')) {
    return endpoint; // Already prefixed with /doctor-cms
  }
  if (endpoint.startsWith('/api/')) {
    return `${API_BASE}${endpoint}`; // Prefix /api/ with /doctor-cms
  }
  // Default: treat as API endpoint and add full prefix
  return `${API_BASE}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
}

/**
 * Make an authenticated API call
 * @param {string} endpoint - API endpoint (e.g., '/api/content')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object>} Response JSON
 * @throws {Error} On network error or 401 (redirects to login)
 */
export async function apiCall(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  console.log(`[API] ${options.method || 'GET'} ${url}`);

  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Include session cookie
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, mergedOptions);

    // Handle 401 Unauthorized (session expired)
    if (response.status === 401) {
      console.warn(`[API] 401 Unauthorized. Redirecting to login.`);
      window.location.href = '/doctor-cms/admin/login.html';
      return;
    }

    // Check if response is JSON (not HTML or other content)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Response is not JSON - likely an error (HTML error page or Vite app)
      let responseBody = await response.text();
      // Log first 200 chars of non-JSON response for debugging
      const preview = responseBody.substring(0, 200);
      console.error(`[API] Non-JSON response from ${url}:`);
      console.error(`[API] Content-Type: ${contentType}`);
      console.error(`[API] Status: ${response.status}`);
      console.error(`[API] Response preview: ${preview}`);
      throw new Error(
        `API returned ${contentType || 'unknown'} instead of JSON. ` +
        `Check Network tab. Got status ${response.status}. ` +
        `URL: ${url}`
      );
    }

    // Handle other HTTP errors (not 200-299 range)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[API] HTTP ${response.status} error:`, errorData);
      throw new Error(errorData.message || `API error ${response.status}`);
    }

    // Successfully got JSON response
    const data = await response.json();
    console.log(`[API] Response OK:`, data);
    return data;
  } catch (err) {
    console.error(`[API] Call failed to ${url}:`, err.message);
    throw err;
  }
}

/**
 * POST request shorthand
 */
export async function post(endpoint, data) {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PUT request shorthand
 */
export async function put(endpoint, data) {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * GET request shorthand
 */
export async function get(endpoint) {
  return apiCall(endpoint, {
    method: 'GET'
  });
}

export default { apiCall, post, put, get };
