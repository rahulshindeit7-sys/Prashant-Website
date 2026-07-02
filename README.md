# Doctor Website Template

Config-first, SEO-focused doctor website template built with HTML, CSS, and vanilla JavaScript.

## Run Locally

1. Start local server from repo root:

- Python: `python -m http.server 8000`
- Node: `npx serve . -p 8000`

2. Open http://localhost:8000

## Update Content

Edit only [config/doctor-profile.json](config/doctor-profile.json).

Detailed field guidance: [CONFIG-GUIDE.md](CONFIG-GUIDE.md)

## Reuse For New Doctor

1. Copy this project.
2. Replace values in [config/doctor-profile.json](config/doctor-profile.json).
3. Add doctor photo and OG image in assets/images.
4. Update theme colors in [assets/css/style.css](assets/css/style.css) root variables.
5. Deploy using [deploy.sh](deploy.sh).

## Clone and Deploy (v1 Multi-Site)

1. Set a unique `site_id` in [config/doctor-profile.json](config/doctor-profile.json).
2. Ensure VPS access with shared SSH key is configured for deployment runner.
3. Run deploy with environment values:
	- `VPS_HOST=<server-ip>`
	- `VPS_USER=<ssh-user>`
	- optional `REMOTE_BASE_DIR=/var/www/doctor-sites`
4. Script creates versioned release folder and updates `current` symlink atomically.
5. If activation fails, script automatically rolls back to previous `current` target.

## Deployment

- Deployment script: [deploy.sh](deploy.sh)
- Nginx config: [nginx.conf](nginx.conf)
- v1 multi-site path: /var/www/doctor-sites/<site_id>/
- v1 config path: /var/www/doctor-sites/<site_id>/config/doctor-profile.json

Important runtime contract:

- Config must be readable at /config/doctor-profile.json
- Endpoint is read-only over HTTP
- Admin dashboard writes updates via SSH/rsync only

## Operational Notes (v1 SaaS)

- Deploy strategy: versioned release folders with atomic symlink switch.
- Rollback policy: automatic rollback to previous release when deployment fails.
- Auth model: one shared SSH key for all managed sites.
- Key rotation: rotate the shared key on schedule and update all deployment runners in the same change window.

Key rotation checklist:

1. Generate replacement key pair.
2. Add new public key on VPS and verify login.
3. Update all CI/local deployment runners to use new private key.
4. Run one successful deploy for verification.
5. Remove old public key from VPS authorized_keys.

## Notes

- No framework and no build step required.
- Designed for non-technical clinic staff to update content safely.
