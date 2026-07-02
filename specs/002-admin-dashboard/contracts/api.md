# API Contract: Admin Dashboard Backend

**Base URL**: `http://localhost:3500/api`

All endpoints return JSON. Errors use standard HTTP status codes with body: `{ "error": "<message>" }`.

---

## Sites

### GET /api/sites

List all registered sites with current status.

**Response 200**:
```json
{
  "sites": [
    {
      "site_id": "dr-sharma-pune",
      "doctor_name": "Dr. Rahul Sharma",
      "clinic_name": "Sharma Dental Clinic",
      "domain_url": "https://drsharma.example.com",
      "ssh_host": "192.168.1.100",
      "ssh_port": 22,
      "ssh_user": "deploy",
      "auth_method": "key",
      "ssh_key_path": "/home/dev/.ssh/id_rsa",
      "remote_config_path": "/var/www/site/config/doctor-profile.json",
      "status": "online",
      "last_checked": "2026-06-29T10:00:00Z",
      "last_updated": "2026-06-28T15:30:00Z",
      "added_at": "2026-06-01T09:00:00Z"
    }
  ],
  "summary": {
    "total": 5,
    "online": 3,
    "offline": 1,
    "warnings": 1
  }
}
```

---

### POST /api/sites

Register a new site.

**Request Body**:
```json
{
  "domain_url": "https://newdoctor.example.com",
  "ssh_host": "192.168.1.101",
  "ssh_port": 22,
  "ssh_user": "deploy",
  "auth_method": "key",
  "ssh_key_path": "/home/dev/.ssh/id_rsa",
  "remote_config_path": "/var/www/site/config/doctor-profile.json"
}
```

**Response 201**:
```json
{
  "site_id": "dr-patel-mumbai",
  "doctor_name": "Dr. Anita Patel",
  "clinic_name": "Patel Heart Care",
  "domain_url": "https://newdoctor.example.com",
  "status": "online",
  "message": "Site registered successfully"
}
```

**Response 409** (duplicate site_id):
```json
{
  "error": "Site with ID 'dr-patel-mumbai' already exists"
}
```

**Response 400** (validation error):
```json
{
  "error": "Invalid SSH host: cannot be empty"
}
```

---

### DELETE /api/sites/:siteId

Remove a site from the registry (does NOT affect the deployed site).

**Response 200**:
```json
{
  "message": "Site 'dr-sharma-pune' removed from dashboard"
}
```

**Response 404**:
```json
{
  "error": "Site 'unknown-id' not found"
}
```

---

### POST /api/sites/:siteId/test-connection

Test SSH and HTTP connectivity to a site.

**Response 200**:
```json
{
  "ssh": { "reachable": true, "message": "Connected successfully" },
  "http": { "reachable": true, "status_code": 200, "message": "Config fetched" },
  "ssl": { "days_remaining": 45, "expiry_date": "2026-08-13T00:00:00Z" }
}
```

**Response 200** (partial failure):
```json
{
  "ssh": { "reachable": false, "message": "Connection refused" },
  "http": { "reachable": true, "status_code": 200, "message": "Config fetched" },
  "ssl": { "days_remaining": 45, "expiry_date": "2026-08-13T00:00:00Z" }
}
```

---

## Config Management

### GET /api/sites/:siteId/config

Fetch the current `doctor-profile.json` from the remote site.

**Response 200**:
```json
{
  "config": { /* full doctor-profile.json contents */ },
  "fetched_at": "2026-06-29T10:05:00Z",
  "source": "http"
}
```

**Response 502** (site unreachable):
```json
{
  "error": "Failed to fetch config: ECONNREFUSED"
}
```

---

### PUT /api/sites/:siteId/config

Push updated config to the remote site via SSH.

**Request Body**:
```json
{
  "config": { /* updated doctor-profile.json contents */ }
}
```

**Response 200**:
```json
{
  "message": "Config deployed successfully",
  "deployed_at": "2026-06-29T10:10:00Z",
  "site_id": "dr-sharma-pune"
}
```

**Response 400** (invalid JSON structure):
```json
{
  "error": "Invalid config: missing required field 'doctor.name'"
}
```

**Response 502** (SSH push failed):
```json
{
  "error": "Failed to push config: SSH authentication failed"
}
```

---

### POST /api/sites/:siteId/config/diff

Compare local changes against the live config.

**Request Body**:
```json
{
  "proposed_config": { /* modified config */ }
}
```

**Response 200**:
```json
{
  "has_changes": true,
  "diff": [
    { "line": 15, "type": "removed", "content": "  \"phone\": \"+91-9876543210\"" },
    { "line": 15, "type": "added", "content": "  \"phone\": \"+91-9876543211\"" }
  ],
  "summary": "1 field changed: clinic.phone"
}
```

---

## Health & Monitoring

### POST /api/sites/refresh

Refresh status of all sites (or specific sites).

**Request Body** (optional — omit for all):
```json
{
  "site_ids": ["dr-sharma-pune", "dr-patel-mumbai"]
}
```

**Response 200**:
```json
{
  "checked": 5,
  "results": [
    { "site_id": "dr-sharma-pune", "status": "online" },
    { "site_id": "dr-patel-mumbai", "status": "ssl_expiring" }
  ]
}
```

---

## Deployment Log

### GET /api/logs

Get deployment audit log (most recent first).

**Query Parameters**:
- `site_id` (optional): Filter by site
- `limit` (optional, default: 50): Max entries to return

**Response 200**:
```json
{
  "logs": [
    {
      "id": "abc123",
      "timestamp": "2026-06-29T10:10:00Z",
      "site_id": "dr-sharma-pune",
      "action": "config_push",
      "result": "success",
      "changes_summary": "Updated clinic.phone"
    }
  ],
  "total": 42
}
```
