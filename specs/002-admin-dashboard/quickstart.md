# Quickstart: Admin Dashboard Validation Guide

**Feature**: 002-admin-dashboard
**Date**: 2026-06-29

## Prerequisites

- Node.js 20 LTS installed
- SSH key configured for at least one deployed doctor-website-template VPS
- At least one doctor website deployed (via spec 001's `deploy.sh`) with `site_id` in its `doctor-profile.json`
- Internet access (to fetch remote configs and check SSL)

## Setup

```bash
cd admin
npm install
npm start
# Dashboard available at http://localhost:3500
```

---

## Validation Scenario 1: Empty Dashboard (First Run)

**Proves**: US1 acceptance scenario 4 (empty state)

**Steps**:
1. Start dashboard with no `dashboard-registry.json` (or empty sites array)
2. Open `http://localhost:3500` in browser

**Expected**:
- Dashboard shows "No sites registered" empty state
- "Add Your First Site" CTA button is prominently displayed
- Summary bar shows: Total: 0, Online: 0, Offline: 0, Warnings: 0

---

## Validation Scenario 2: Register a Site

**Proves**: US3 (add site), FR-003, FR-004, FR-013

**Steps**:
1. Click "Add Site" button
2. Fill in form:
   - Domain: `https://your-deployed-site.com`
   - SSH Host: `<VPS IP>`
   - SSH Port: `22`
   - SSH User: `deploy`
   - Auth Method: Key
   - Key Path: `~/.ssh/id_rsa`
   - Remote Config Path: `/var/www/site/config/doctor-profile.json`
3. Click "Test Connection"
4. Observe connection test result
5. Click "Add Site"

**Expected**:
- Connection test shows green checkmarks for SSH ✓ and HTTP ✓
- Site appears in dashboard grid with doctor name and clinic name pulled from config
- Status shows "Online" (green indicator)
- Summary bar updates to Total: 1, Online: 1

---

## Validation Scenario 3: View All Sites

**Proves**: US1 (overview), FR-001, FR-002, SC-001

**Steps**:
1. Register 3+ sites (repeat Scenario 2)
2. Refresh the dashboard page

**Expected**:
- All registered sites visible as cards
- Each card shows: doctor name, clinic name, domain, status, last-checked time
- Page loads within 5 seconds (SC-001)
- Summary bar shows correct counts

---

## Validation Scenario 4: Edit & Deploy Config

**Proves**: US2 (edit config), FR-006, FR-007, FR-008, FR-009, SC-003, SC-005

**Steps**:
1. Click "Edit" on any online site card
2. Observe the config editor opens with the site's current `doctor-profile.json`
3. Change a value (e.g., update `clinic.phone`)
4. Click "Preview" — observe diff view
5. Click "Save & Deploy"
6. Open the site's live URL in another tab, verify the change is reflected

**Expected**:
- Editor shows full JSON with syntax highlighting
- Diff view highlights the changed line (red for old, green for new)
- Deployment succeeds with confirmation message
- Live site reflects the change on reload
- Deployment log entry created (visible in audit log)
- Total time from opening editor to live update: < 3 minutes (SC-003)

---

## Validation Scenario 5: JSON Validation Prevents Bad Deploy

**Proves**: FR-007, SC-005

**Steps**:
1. Open editor for any site
2. Introduce a JSON syntax error (e.g., remove a closing brace)
3. Click "Save & Deploy"

**Expected**:
- Dashboard shows validation error: "Invalid JSON: Unexpected end of input at line X"
- Deploy button is disabled / deploy is blocked
- No changes pushed to the remote site
- Config on VPS remains unchanged

---

## Validation Scenario 6: Offline Site Detection

**Proves**: US1 scenario 3, FR-010, FR-012, SC-004

**Steps**:
1. Register a site with an unreachable SSH host (e.g., `999.999.999.999`) or shut down a VPS
2. Click "Refresh All" or reload dashboard

**Expected**:
- Site card shows red "Offline" status indicator
- Error reason displayed (e.g., "Connection timed out")
- Other sites still show correct status (not affected)
- Status check completes within 30 seconds (SC-004)

---

## Validation Scenario 7: Remove a Site

**Proves**: US4, FR-011

**Steps**:
1. Click "Remove" on a site card
2. Confirm in the confirmation dialog

**Expected**:
- Site disappears from dashboard
- Actual deployed website is NOT affected (verify by visiting the URL)
- Registry JSON file no longer contains the site
- Audit log records the removal
