# Admin Dashboard API Fix Summary

**Date:** 2026-07-04  
**Issue:** Admin dashboard stuck on "Initializing..." due to incorrect API endpoint paths  
**Root Cause:** Missing `/doctor-cms/` path prefix in API calls (broken by Nginx reverse proxy path rewriting)

## Files Modified

### 1. `/cms/public/js/api.js` (MAIN FIX)
**Status:** ✅ Fixed

**Changes:**
- ✅ Added `API_BASE = '/doctor-cms'` constant (line 6)
- ✅ Added `buildApiUrl()` function (lines 13-29) that intelligently handles path prefixing:
  - External URLs (http/https) → kept as-is
  - Already prefixed paths (/doctor-cms/) → kept as-is
  - API endpoints (/api/*) → prefixed with /doctor-cms
  - Other paths → treated as API endpoints
- ✅ Updated 401 redirect to `/doctor-cms/admin/login.html` (line 56)
- ✅ Added Content-Type validation (lines 64-78):
  - Detects when server returns HTML instead of JSON
  - Logs response preview (first 200 chars) for debugging
  - Throws clear error: "API returned [content-type] instead of JSON"
- ✅ Added API call logging (line 39): `console.log('[API] GET /doctor-cms/api/...')`
- ✅ Improved error handling with detailed error messages

**Before:**
```javascript
const url = endpoint.startsWith('http') ? endpoint : endpoint; // BROKEN: no prefix added
```

**After:**
```javascript
const API_BASE = '/doctor-cms';
const url = buildApiUrl(endpoint);
// Correctly generates: /doctor-cms/api/content, /doctor-cms/api/publish, etc.
```

---

### 2. `/cms/public/js/dashboard.js` (SECONDARY FIXES)
**Status:** ✅ Fixed

#### A. Initialization Handler (Lines 13-77)
**Changes:**
- ✅ Enhanced initialization logging with `[Dashboard]` prefix
- ✅ Added explicit response.config validation (lines 27-30):
  - Checks if response exists and has .config property
  - Throws descriptive error if missing
- ✅ Added URL hash support (lines 44-52):
  - If URL is `/doctor-cms/admin/#tab-about`, automatically activates About tab
  - Falls back to #tab-home if hash not found
- ✅ Added visual error display in UI (lines 63-78):
  - Shows error box with error message
  - Provides "Retry Loading" button
  - Prompts user to check browser console
- ✅ Changed status messages:
  - "Initializing..." → "Loaded" (success)
  - "Initializing..." → "Load failed" (error)
- ✅ Added comprehensive error logging with stack trace

#### B. Tab Switching (Lines 115-133)
**Changes:**
- ✅ Added console logging for tab switches
- ✅ Added null check for missing tab panels
- ✅ Updated URL hash when switching tabs

#### C. Logout Function (Lines 176-186)
**Changes:**
- ✅ Updated redirect URL: `/admin/login` → `/doctor-cms/admin/login.html`

#### D. Preview Function (Lines 138-150)
**Changes:**
- ✅ Updated preview to be doctor-aware (reads from currentConfig.doctor.id)
- ✅ Added TODO comment for configurable preview URL
- ✅ Added console logging for debugging

#### E. Save Draft Function (Lines 155-175)
**Changes:**
- ✅ Added console logging for save operations
- ✅ Improved response validation (checks for `response.ok !== false`)
- ✅ Added detailed error logging

#### F. Publish Function (Lines 191-213)
**Changes:**
- ✅ Added console logging for publish operations
- ✅ Improved response validation
- ✅ Added detailed error logging

#### G. Backups Loading (Lines 283-323)
**Changes:**
- ✅ Added console logging
- ✅ Added null check for response.backups
- ✅ Added fallback for missing doctorName field
- ✅ Improved error handling

#### H. Rollback Function (Lines 336-368)
**Changes:**
- ✅ Added console logging
- ✅ Improved response validation
- ✅ Reloads both backup list AND config after rollback
- ✅ Added detailed error logging

---

## Files Backed Up

Created timestamped backups before modifications:
- ✅ `cms/public/js/api.js.backup.20260704`
- ✅ `cms/public/js/dashboard.js.backup.20260704`
- ✅ `cms/public/js/editor.js.backup.20260704`

---

## How The Fix Works

### Request Flow (AFTER FIX)

1. **Browser** calls JavaScript function:
   ```javascript
   await get('/api/content')  // Called from dashboard.js
   ```

2. **api.js** (new buildApiUrl):
   ```javascript
   buildApiUrl('/api/content')
   // Returns: '/doctor-cms/api/content'
   ```

3. **Browser** makes HTTP request:
   ```
   GET /doctor-cms/api/content
   (with session cookie, credentials: 'include')
   ```

4. **Nginx reverse proxy** (already configured):
   ```
   Matches: location /doctor-cms/
   Strips prefix, sends to CMS:
   GET /api/content
   ```

5. **CMS Express server** handles:
   ```javascript
   GET /api/content  (from routes/content.js)
   Returns: { ok: true, config: {...} }  // JSON response
   ```

6. **api.js** validates response:
   ```javascript
   contentType = 'application/json'  // ✅ Correct!
   Calls response.json()
   Returns parsed data to dashboard.js
   ```

7. **dashboard.js** processes response:
   ```javascript
   currentConfig = response.config  // ✅ Works!
   buildAllTabs(currentConfig)       // ✅ Tab panels render!
   updateLastSaved('Loaded')         // ✅ Status updates!
   ```

---

## Testing Checklist

### ✅ Network Tab Verification
- [ ] Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- [ ] Open DevTools: `F12`
- [ ] Go to Network tab
- [ ] Reload page
- [ ] Look for request: `GET /doctor-cms/api/content`
  - **Should show:** Status 200, Content-Type: application/json
  - **Should NOT show:** HTML response or Vite app

### ✅ Console Verification
- [ ] Open DevTools: `F12`
- [ ] Go to Console tab
- [ ] Should see logs like:
  ```
  [API] GET /doctor-cms/api/content
  [Dashboard] Initializing...
  [Dashboard] Fetching config from /api/content
  [Dashboard] Config loaded successfully: {...}
  [Dashboard] Building tab forms...
  [Dashboard] Initialization complete
  ```
- [ ] Should NOT see any red errors

### ✅ UI Verification
- [ ] Admin dashboard loads without "Initializing..." stuck
- [ ] All 9 tab panels render with editable form fields
- [ ] Status shows "Loaded" (not "Initializing...")
- [ ] Sidebar is fully visible and clickable
- [ ] Tab navigation works (clicking tabs switches content)

### ✅ Hash Routing Test
- [ ] Navigate to: `/doctor-cms/admin/#tab-about`
- [ ] Page should load and automatically activate About tab
- [ ] Should see log: `[Dashboard] Navigating to hash: #tab-about`

### ✅ Button Functionality Tests
- **Save Draft:**
  - [ ] Modify a form field
  - [ ] Click "Save Draft" button
  - [ ] Network tab shows: `PUT /doctor-cms/api/content` with status 200
  - [ ] Toast shows: "Draft saved successfully"
  - [ ] Status updates: "Draft saved"

- **Publish:**
  - [ ] Click "Publish" button
  - [ ] Confirmation dialog appears
  - [ ] Network tab shows: `POST /doctor-cms/api/publish` with status 200
  - [ ] Toast shows: "Published successfully!"
  - [ ] Status updates: "Published"

- **Logout:**
  - [ ] Click logout button
  - [ ] Confirmation dialog appears
  - [ ] Should redirect to: `/doctor-cms/admin/login.html` (not `/admin/login`)
  - [ ] Network tab shows: `POST /doctor-cms/api/logout` with status 200

- **Preview:**
  - [ ] Click "Preview" button
  - [ ] Confirmation dialog appears
  - [ ] Clicking confirm should open preview in new tab
  - [ ] Console should log doctor ID

### ✅ Error Handling Test
- [ ] Stop the CMS server: `pm2 stop doctor-cms`
- [ ] Reload dashboard
- [ ] Should show error box: "Dashboard Load Failed"
- [ ] Should show detailed error message
- [ ] Should have "Retry Loading" button
- [ ] Console should show error with details
- [ ] Restart CMS: `pm2 start doctor-cms`
- [ ] Retry button should successfully reload

### ✅ Session Expiration Test
- [ ] Delete session file: `rm cms/sessions/<sessionid>.json`
- [ ] Try to save draft
- [ ] Should redirect to: `/doctor-cms/admin/login.html`
- [ ] Should NOT redirect to: `/admin/login`

---

## Deployment Instructions

### Local Testing
```bash
# Navigate to CMS directory
cd /var/www/smzentrix.info/cms

# Verify changes are in place
cat public/js/api.js | grep "API_BASE"
cat public/js/dashboard.js | grep "\[Dashboard\]" | head -5

# Restart CMS (if using PM2)
pm2 restart doctor-cms

# Check logs
pm2 logs doctor-cms
```

### Production Deployment
```bash
# On VPS, copy the fixed files
# (or re-deploy from Git if you've committed these changes)

# Verify Nginx config
sudo nginx -t

# Reload Nginx (if needed)
sudo systemctl reload nginx

# Restart CMS
pm2 restart doctor-cms

# Verify startup
pm2 logs doctor-cms --lines 20

# Test in browser
# Open: https://smzentrix.info/doctor-cms/admin/
# Hard refresh: Ctrl+Shift+R
# Check Network tab for /doctor-cms/api/content
# Check Console for [API] and [Dashboard] logs
```

---

## Key Improvements

### 1. **Intelligent Path Prefixing**
- The `buildApiUrl()` function handles all cases automatically
- No need to manually prefix paths in 100+ API calls throughout the app
- Future API calls will automatically get the correct path

### 2. **Better Error Messages**
- Instead of silent failures with HTML responses, users see:
  > "API returned text/html instead of JSON. Check Network tab. Got status 200. URL: /doctor-cms/api/content"
- Makes debugging much easier

### 3. **Comprehensive Logging**
- All API calls, dashboard initialization, and errors logged with `[API]` and `[Dashboard]` prefixes
- Console logs show exact URLs being called
- Easy to verify correct paths in Network tab

### 4. **Improved Error Display**
- No longer just a toast notification
- Full error box shows in the dashboard main content area
- "Retry Loading" button allows user to try again
- Status message changes to "Load failed"

### 5. **URL Hash Support**
- Dashboard now supports `/admin/#tab-about` style navigation
- Automatically activates correct tab on page load
- Useful for bookmarks and direct linking

### 6. **Better Session Expiration Handling**
- Correctly redirects to `/doctor-cms/admin/login.html`
- Works properly with Nginx reverse proxy path stripping

---

## Rollback Instructions (If Needed)

If issues arise, quickly revert to backups:

```bash
cd /var/www/smzentrix.info/cms/public/js

# Restore from backup
cp api.js.backup.20260704 api.js
cp dashboard.js.backup.20260704 dashboard.js

# Restart CMS
pm2 restart doctor-cms

# Clear browser cache
# Hard refresh: Ctrl+Shift+R
```

---

## Technical Details

### API_BASE Configuration
The `/doctor-cms` prefix is configured as a constant in `api.js`:
```javascript
const API_BASE = '/doctor-cms';
```

This matches the Nginx reverse proxy location:
```nginx
location /doctor-cms/ {
    proxy_pass http://127.0.0.1:5050/;
    # Nginx strips /doctor-cms/ before passing to CMS
    # So /doctor-cms/api/content becomes /api/content at the CMS
}
```

### Content-Type Validation
The API wrapper now validates that responses are JSON:
```javascript
const contentType = response.headers.get('content-type');
if (!contentType || !contentType.includes('application/json')) {
  throw new Error('API returned ' + contentType + ' instead of JSON');
}
```

This prevents silent failures when:
- Nginx returns 404 HTML page
- Vite dev server returns app HTML
- Server returns text instead of JSON
- Network errors occur

### Error Handling Strategy
**Three levels of error handling:**
1. **API Level** (api.js): Content-Type check, HTTP status check, response validation
2. **Dashboard Level** (dashboard.js): Config structure validation, UI error display
3. **User Level**: Error box in UI, console logs, toast notifications

---

## Monitoring

After deployment, monitor:
1. **Browser Console** for any red errors
2. **Network Tab** for correct API URLs and response content-types
3. **PM2 logs**: `pm2 logs doctor-cms`
4. **Nginx logs**: `/var/log/nginx/error.log` and `/var/log/nginx/access.log`

Expected successful request:
```
[API] GET /doctor-cms/api/content
[Dashboard] Config loaded successfully: {...}
[Dashboard] Building tab forms...
[Dashboard] Initialization complete
```

---

## References
- Nginx reverse proxy config: `/etc/nginx/sites-available/smzentrix.info`
- CMS server code: `/var/www/smzentrix.info/cms/server.js`
- API routes: `/var/www/smzentrix.info/cms/routes/content.js`
- Dashboard: `/var/www/smzentrix.info/cms/public/dashboard.html`
