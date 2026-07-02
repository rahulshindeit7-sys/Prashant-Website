# Feature Specification: Admin Dashboard (Multi-Site Manager)

**Feature Branch**: `002-admin-dashboard`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "As a developer, I want to make a SaaS kind of model, where on a single page I can monitor and edit multiple websites at once, so that I can manage all my websites from a single page. Also I want to add a feature where I can add new websites to monitor and edit from the same page."

## Clarifications

### Session 2026-07-01

- Q: How should the dashboard store SSH credentials for managed sites? -> A: AES-256 encrypted local JSON file unlocked with a master password at dashboard startup.
- Q: For editing a site's configuration in the dashboard, which UI should be the default for v1? -> A: Code editor only (JSON text editor with validation and diff).
- Q: How often should the dashboard run automatic background health checks for all registered sites? -> A: Every 5 minutes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Views All Managed Sites at a Glance (Priority: P1)

A developer (template owner) opens the admin dashboard and immediately sees a grid/list of all doctor websites they manage. Each site card shows the doctor name, domain, last-updated timestamp, and health status (online/offline). The developer can quickly assess which sites need attention.

**Why this priority**: The core value of the dashboard is visibility across all managed sites. Without this overview, the developer has no reason to use the dashboard instead of SSH-ing into each VPS individually.

**Independent Test**: Open the dashboard with 3+ sites registered, verify all sites appear with correct doctor names, domains, and live status indicators. Verify the dashboard fetches each site's `/config/doctor-profile.json` to display current data.

**Acceptance Scenarios**:

1. **Given** the developer has registered 5 doctor websites, **When** they open the admin dashboard, **Then** all 5 sites appear as cards/rows showing doctor name, clinic name, domain URL, and last-updated date.
2. **Given** a registered site is online, **When** the dashboard loads, **Then** that site's card shows a green "Online" indicator (based on successful HTTP fetch of its config).
3. **Given** a registered site is unreachable (server down or domain expired), **When** the dashboard loads, **Then** that site's card shows a red "Offline" indicator with the error reason.
4. **Given** the developer has no sites registered yet, **When** they open the dashboard, **Then** they see an empty state with a clear "Add Your First Site" call-to-action.

---

### User Story 2 - Developer Edits a Site's Configuration Remotely (Priority: P1)

A developer selects a site from the dashboard, views its current `doctor-profile.json` contents in an editor panel, makes changes (e.g., updates clinic phone number, adds a new service), and pushes the updated config back to the live site — all without leaving the dashboard.

**Why this priority**: Editing configs is the most frequent management action. Being able to do it from a central dashboard instead of SSH-ing into each VPS is the primary time-saver and the reason to build this tool.

**Independent Test**: Select a registered site, modify a value in its config (e.g., change doctor phone number), save, verify the change is pushed to the remote VPS and the live site reflects it on reload.

**Acceptance Scenarios**:

1. **Given** a developer clicks "Edit" on a site card, **When** the editor panel opens, **Then** it displays the full contents of that site's `doctor-profile.json` in a JSON code editor.
2. **Given** the developer modifies a config value and clicks "Save & Deploy", **When** the save action completes, **Then** the updated JSON is pushed to the remote VPS via SSH and the site card shows the new "last-updated" timestamp.
3. **Given** the developer enters invalid JSON (syntax error), **When** they attempt to save, **Then** the dashboard shows a clear validation error highlighting the issue and prevents deployment.
4. **Given** the SSH connection to the remote VPS fails, **When** the developer attempts to save, **Then** the dashboard shows an error message with the failure reason (connection refused, auth failed, timeout) and offers a retry option.
5. **Given** the developer wants to preview changes before deploying, **When** they click "Preview", **Then** the dashboard shows a diff view highlighting what changed compared to the live config.

---

### User Story 3 - Developer Adds a New Site to the Dashboard (Priority: P1)

A developer deploys a new doctor website using the template (via `deploy.sh`) and then registers it in the admin dashboard by providing the site's domain/URL and SSH credentials. The dashboard immediately begins monitoring it.

**Why this priority**: Adding new sites is how the SaaS scales. The onboarding flow must be quick and friction-free to encourage the developer to use the dashboard for every new client.

**Independent Test**: Click "Add Site", fill in domain and SSH credentials, verify the dashboard successfully connects, fetches the config, and adds the site to the overview grid.

**Acceptance Scenarios**:

1. **Given** a developer clicks "Add Site", **When** the registration form appears, **Then** it asks for: site URL/domain, SSH host, SSH port, SSH username, SSH key path (or password), and remote config path (with default `/var/www/site/config/doctor-profile.json`).
2. **Given** the developer fills in valid connection details, **When** they click "Test Connection", **Then** the dashboard attempts an SSH connection AND fetches the config URL, reporting success or failure for each.
3. **Given** the connection test passes, **When** the developer clicks "Add Site", **Then** the site appears in the dashboard grid with its doctor name and domain pulled from the fetched config.
4. **Given** a developer tries to add a site with a `site_id` that already exists in the registry, **When** they submit, **Then** the dashboard shows a duplicate error and suggests editing the existing entry instead.
5. **Given** the developer adds a site with an invalid domain or unreachable SSH host, **When** they submit, **Then** the dashboard registers it but marks it as "Offline" with a warning icon.

---

### User Story 4 - Developer Removes a Site from the Dashboard (Priority: P2)

A developer no longer manages a doctor's website and wants to remove it from the dashboard monitoring. They remove the site from the registry (dashboard-only action — does NOT delete the actual deployed site).

**Why this priority**: Clean management requires ability to unregister sites. Lower priority because it's infrequent compared to viewing and editing.

**Independent Test**: Remove a registered site, verify it disappears from the dashboard and no further monitoring/fetch attempts are made for it.

**Acceptance Scenarios**:

1. **Given** a developer clicks "Remove" on a site card, **When** a confirmation dialog appears and they confirm, **Then** the site is removed from the dashboard registry.
2. **Given** a site is removed from the dashboard, **When** the dashboard refreshes, **Then** the site no longer appears AND the actual deployed website remains untouched on the VPS.
3. **Given** the developer accidentally removes a site, **When** they want to re-add it, **Then** they can use "Add Site" again with the same credentials and it re-appears.

---

### User Story 5 - Developer Monitors Site Health Over Time (Priority: P3)

A developer checks the dashboard periodically and sees which sites have uptime issues, SSL certificate expiry warnings, or stale configs (not updated in X days). The dashboard provides at-a-glance health signals.

**Why this priority**: Proactive monitoring prevents client complaints. Lower priority because basic online/offline from US1 covers the immediate need; richer health signals are a nice-to-have.

**Independent Test**: Register a site with an expiring SSL cert or one that's been offline for >24h, verify the dashboard surfaces a warning badge on that site's card.

**Acceptance Scenarios**:

1. **Given** a site's SSL certificate expires within 30 days, **When** the dashboard loads, **Then** the site card shows a yellow "SSL Expiring" warning badge.
2. **Given** a site has not had its config updated in over 90 days, **When** the dashboard loads, **Then** the site card shows a blue "Stale Config" indicator.
3. **Given** the developer clicks on a health warning, **When** the detail panel opens, **Then** it shows specific details (cert expiry date, days since last update, last error log).

---

### Edge Cases

- What happens when the dashboard itself has no internet connection? → Graceful error message; show cached last-known state of sites if available.
- What happens when SSH credentials are invalid or key is revoked? → Mark site as "Auth Failed" with specific error; don't delete it from registry.
- What happens when a site's `doctor-profile.json` is missing or malformed? → Show "Config Error" status on card with details of what's wrong.
- What happens when two developers access the same dashboard simultaneously? → Dashboard is single-user (developer's local/personal tool); no multi-user conflict handling needed for v1.
- What happens when the developer registers a site that doesn't use this template? → Config fetch will fail or return unexpected format; mark as "Incompatible" with explanation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Dashboard MUST display all registered sites in a grid/list view with doctor name, clinic name, domain URL, status indicator, and last-updated timestamp.
- **FR-002**: Dashboard MUST fetch each registered site's `/config/doctor-profile.json` via HTTP to display current site data and verify online status.
- **FR-003**: Dashboard MUST provide a "Add Site" form to register new sites with fields: site URL, SSH host, SSH port, SSH username, authentication method (key or password), and remote config path.
- **FR-004**: Dashboard MUST validate SSH connectivity via a "Test Connection" action before adding a site to the registry.
- **FR-005**: Dashboard MUST store the site registry (list of sites + connection details) in a local JSON file (`dashboard-registry.json`).
- **FR-006**: Dashboard MUST provide an inline JSON code editor to view and modify a site's `doctor-profile.json`.
- **FR-007**: Dashboard MUST validate JSON syntax before allowing deployment of config changes.
- **FR-008**: Dashboard MUST push config changes to the remote VPS via SSH (SCP/rsync) when the developer clicks "Save & Deploy".
- **FR-009**: Dashboard MUST show a diff/preview of changes before deploying to the remote site.
- **FR-010**: Dashboard MUST display site health status: Online (green), Offline (red), Auth Failed (orange), Config Error (yellow).
- **FR-011**: Dashboard MUST allow removal of sites from the registry without affecting the actual deployed site.
- **FR-012**: Dashboard MUST handle connection failures gracefully with clear error messages and retry options.
- **FR-013**: Dashboard MUST identify sites by `site_id` from their `doctor-profile.json` and reject duplicate registrations.
- **FR-014**: Dashboard MUST support searching/filtering the site list by doctor name, clinic name, or domain.
- **FR-015**: Dashboard MUST store SSH credentials in an AES-256 encrypted local credentials file (separate from the registry file), unlocked with a master password at dashboard startup; plaintext credential storage is prohibited.
- **FR-016**: Dashboard MUST display a summary bar showing total sites, online count, offline count, and sites with warnings.
- **FR-017**: Dashboard MUST refresh site statuses on page load, run automatic background health checks for all registered sites every 5 minutes, and provide a manual "Refresh All" button.
- **FR-018**: Dashboard MUST log all deployment actions (who, when, what changed) in a local audit log for accountability.

### Key Entities

- **Site**: site_id, doctor_name, clinic_name, domain_url, ssh_host, ssh_port, ssh_user, auth_method, remote_config_path, status, last_checked, last_updated
- **Site Registry**: Collection of all managed sites, stored locally
- **Deployment Log**: Timestamp, site_id, action (config_push, status_check), result (success/failure), changes_summary
- **Health Status**: Online, Offline, Auth Failed, Config Error, SSL Expiring, Stale Config

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developer can view status of all managed sites within 5 seconds of opening the dashboard.
- **SC-002**: Developer can add a new site to the dashboard in under 2 minutes (including connection test).
- **SC-003**: Developer can edit and deploy a config change to a remote site in under 3 minutes (from opening editor to live update).
- **SC-004**: Dashboard correctly identifies offline sites within 30 seconds of page load.
- **SC-005**: 100% of config edits are validated for JSON syntax before deployment (zero malformed configs pushed to production).
- **SC-006**: Dashboard supports managing 50+ sites without performance degradation (page load < 3 seconds).
- **SC-007**: All deployment actions are logged with timestamp, site identifier, and change summary.
- **SC-008**: Developer can find any site by name or domain in under 5 seconds using search/filter.

## Assumptions

- The dashboard is a developer-facing tool (single user) — no multi-tenant authentication or user management needed for v1.
- All managed sites use the doctor-website-template and have `doctor-profile.json` at the predictable `/config/doctor-profile.json` URL path (as defined in FR-028 of spec 001).
- SSH key-based authentication is the primary method; password auth is supported as fallback.
- The developer runs the dashboard locally or on a personal machine — not a publicly hosted SaaS (v1 is a local tool).
- Sites are deployed on Hostinger VPS (or any Linux VPS with SSH access and Nginx).
- The dashboard does NOT deploy the template itself — it only manages configs of already-deployed sites. Initial deployment still uses `deploy.sh`.
- CORS headers on each deployed site allow the dashboard domain to read `/config/doctor-profile.json` (as established in spec 001, FR-028).
- The developer has SSH keys set up for all managed VPS instances.
- Constitution Principle III (Zero-Framework Simplicity) applies to the doctor template sites. The admin dashboard is a separate developer tool and MAY use appropriate tooling if needed, though simplicity is still preferred.
