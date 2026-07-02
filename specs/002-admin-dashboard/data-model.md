# Data Model: Admin Dashboard (Multi-Site Manager)

**Feature**: 002-admin-dashboard
**Date**: 2026-06-29

## Entities

### Site

The primary entity representing a managed doctor website instance.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| site_id | string (UUID/slug) | Yes | Unique identifier, pulled from the site's `doctor-profile.json` |
| doctor_name | string | Yes | Doctor's name (from fetched config) |
| clinic_name | string | Yes | Clinic name (from fetched config) |
| domain_url | string (URL) | Yes | Public URL of the deployed site |
| ssh_host | string | Yes | SSH hostname or IP for the VPS |
| ssh_port | number | Yes | SSH port (default: 22) |
| ssh_user | string | Yes | SSH username |
| auth_method | enum: "key" \| "password" | Yes | Authentication method |
| ssh_key_path | string | Conditional | Path to SSH private key (required if auth_method = "key") |
| remote_config_path | string | Yes | Absolute path to `doctor-profile.json` on the remote VPS (default: `/var/www/site/config/doctor-profile.json`) |
| status | enum: "online" \| "offline" \| "auth_failed" \| "config_error" \| "ssl_expiring" \| "stale" | Yes | Current health status |
| last_checked | ISO 8601 datetime | Yes | Last time status was checked |
| last_updated | ISO 8601 datetime | No | Last time config was pushed from dashboard |
| added_at | ISO 8601 datetime | Yes | When the site was registered |

**Validation Rules**:
- `domain_url` must be a valid URL (https:// preferred)
- `ssh_port` must be 1–65535
- `ssh_host` must not be empty
- `ssh_user` must not be empty
- `site_id` must be unique across all registered sites
- `ssh_key_path` must exist on local filesystem (when auth_method = "key")

**Relationships**:
- One Site → Many DeploymentLog entries
- Site.site_id → matches `site_id` in the remote site's `doctor-profile.json`

---

### Site Registry

The collection of all managed sites stored as a JSON file.

| Field | Type | Description |
|-------|------|-------------|
| version | string | Schema version (e.g., "1.0.0") |
| sites | Site[] | Array of Site entities |
| updated_at | ISO 8601 datetime | Last modification timestamp |

**Storage**: `admin/server/data/dashboard-registry.json`

**Validation Rules**:
- File must be valid JSON
- No duplicate `site_id` values in `sites` array
- `version` must follow semver format

---

### Deployment Log Entry

An immutable record of a deployment action performed via the dashboard.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique log entry ID |
| timestamp | ISO 8601 datetime | Yes | When the action occurred |
| site_id | string | Yes | Which site was affected |
| action | enum: "config_push" \| "status_check" \| "site_added" \| "site_removed" | Yes | Type of action |
| result | enum: "success" \| "failure" | Yes | Outcome |
| changes_summary | string | No | Human-readable description of what changed |
| error_message | string | No | Error details (when result = "failure") |

**Storage**: `admin/server/data/deployment-log.json` (append-only array)

**Validation Rules**:
- `site_id` should reference an existing or previously-existing site
- `timestamp` must be valid ISO 8601
- `changes_summary` max 500 characters

---

### Health Check Result

Transient data structure representing the result of checking a site's health.

| Field | Type | Description |
|-------|------|-------------|
| site_id | string | Site being checked |
| http_reachable | boolean | Whether `/config/doctor-profile.json` is fetchable |
| http_status_code | number | HTTP response code |
| ssh_reachable | boolean | Whether SSH connection succeeds |
| ssl_days_remaining | number \| null | Days until SSL cert expires (null if check failed) |
| config_valid | boolean | Whether fetched JSON is valid |
| config_last_modified | ISO 8601 datetime \| null | Last-Modified header from config fetch |
| checked_at | ISO 8601 datetime | When check was performed |

**Note**: This is not persisted directly — it's computed on each health check and used to update the Site's `status` and `last_checked` fields.

---

### Credential (Stored in OS Keychain)

SSH passwords stored securely via `keytar` — NOT in the JSON registry.

| Field | Type | Description |
|-------|------|-------------|
| service | string (constant) | `"doctor-dashboard"` |
| account | string | `site_id` of the site |
| password | string | SSH password for the site |

**Validation Rules**:
- Only created when `auth_method = "password"` for a site
- Deleted when site is removed from registry

---

## State Transitions

### Site Status

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    ▼                                         │
  [Added] ──► online ◄──► offline                            │
                │  ▲          │                               │
                │  │          │                               │
                │  └──────────┘ (retry succeeds)              │
                │                                             │
                ├──► auth_failed (SSH creds invalid)          │
                │         │                                   │
                │         └── (creds updated) ────────────────┘
                │
                ├──► config_error (JSON malformed/missing)
                │         │
                │         └── (config fixed) ──► online
                │
                ├──► ssl_expiring (cert < 30 days)
                │         │
                │         └── (cert renewed) ──► online
                │
                └──► stale (config unchanged > 90 days)
                          │
                          └── (config updated) ──► online
```

**Priority**: When multiple conditions apply, display the most severe:
1. offline (highest — can't reach at all)
2. auth_failed
3. config_error
4. ssl_expiring
5. stale (lowest)
