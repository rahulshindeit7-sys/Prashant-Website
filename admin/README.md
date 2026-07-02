# Admin Dashboard — Doctor Site Manager

A local developer tool for managing multiple deployed doctor-website-template instances from a single dashboard.

## Prerequisites

- **Node.js 20 LTS** or higher
- SSH key access configured for target VPS servers
- Doctor websites deployed using the doctor-website-template (spec 001)

## Setup

```bash
cd admin
npm install
```

## Usage

### Start the Dashboard

```bash
npm start
```

The dashboard will be available at **http://localhost:3500**

### Development Mode (auto-reload)

```bash
npm dev
```

## Features

- **View All Sites**: See all managed doctor websites with status at a glance
- **Add Sites**: Register new sites by providing URL and SSH credentials
- **Edit & Deploy Config**: Edit a site's `doctor-profile.json` and push changes via SSH
- **Remove Sites**: Unregister sites from the dashboard (does not affect deployed sites)
- **Health Monitoring**: SSL expiry warnings, stale config detection, connectivity checks
- **Deployment Log**: Audit trail of all deployment actions

## Architecture

```
admin/
├── server/          # Express.js backend (port 3500)
│   ├── index.js     # App entry point
│   ├── routes/      # API endpoint handlers
│   ├── services/    # Business logic (SSH, registry, health)
│   └── data/        # JSON file storage
├── public/          # Frontend (vanilla HTML/CSS/JS)
│   ├── index.html   # Single-page dashboard
│   ├── css/         # Styles
│   └── js/          # Client-side modules
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/sites | List all sites with status |
| POST | /api/sites | Register a new site |
| DELETE | /api/sites/:siteId | Remove a site |
| POST | /api/sites/:siteId/test-connection | Test connectivity |
| GET | /api/sites/:siteId/config | Fetch remote config |
| PUT | /api/sites/:siteId/config | Push config via SSH |
| POST | /api/sites/:siteId/config/diff | Compare config changes |
| POST | /api/sites/refresh | Refresh all site statuses |
| GET | /api/sites/:siteId/health | Get health details |
| GET | /api/logs | Get deployment log |

## Security Notes

- SSH passwords are stored in the OS keychain (via `keytar`), never in JSON files
- SSH key paths are validated to exist on the local filesystem
- Input validation prevents path traversal in remote config paths
- This tool is designed for **local use only** — do not expose to the internet
