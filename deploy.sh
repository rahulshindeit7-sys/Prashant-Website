#!/bin/bash
# =============================================================
# deploy.sh — Multi-site deploy for Doctor Website (v1)
# =============================================================
# USAGE:
#   ./deploy.sh
#   VPS_HOST=1.2.3.4 VPS_USER=root ./deploy.sh
#
# REQUIRED:
#   - config/doctor-profile.json with non-empty site_id
#   - SSH key access to VPS (shared key model for v1)
#
# DEPLOY MODEL:
#   /var/www/doctor-sites/<site_id>/
#     ├── releases/<timestamp>/
#     └── current -> releases/<timestamp>
#
# If activation fails, script rolls back current symlink to previous release.
# =============================================================

set -euo pipefail

VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-YOUR_VPS_IP_HERE}"
DOMAIN="${DOMAIN:-yourdomain.com}"
REMOTE_BASE_DIR="${REMOTE_BASE_DIR:-/var/www/doctor-sites}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

command -v rsync >/dev/null 2>&1 || error "rsync is not installed."
command -v ssh >/dev/null 2>&1 || error "ssh is not installed."
command -v python >/dev/null 2>&1 || error "python is required to parse config JSON."

[[ "$VPS_HOST" == "YOUR_VPS_IP_HERE" ]] && error "Set VPS_HOST before deploying."
[[ -f "index.html" ]] || error "index.html not found in current directory."
[[ -f "config/doctor-profile.json" ]] || error "config/doctor-profile.json not found."

python -m json.tool config/doctor-profile.json >/dev/null 2>&1 || error "config/doctor-profile.json is not valid JSON."

SITE_ID="$(python - <<'PY'
import json
with open('config/doctor-profile.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(str(data.get('site_id', '')).strip())
PY
)"

[[ -z "$SITE_ID" ]] && error "site_id is required in config/doctor-profile.json for multi-site deployment."
[[ ! "$SITE_ID" =~ ^[a-zA-Z0-9._-]+$ ]] && error "site_id contains invalid characters. Use only letters, numbers, dot, underscore, hyphen."

REMOTE_SITE_DIR="${REMOTE_BASE_DIR}/${SITE_ID}"
REMOTE_RELEASES_DIR="${REMOTE_SITE_DIR}/releases"
RELEASE_TAG="$(date +%Y%m%d%H%M%S)"
REMOTE_RELEASE_DIR="${REMOTE_RELEASES_DIR}/${RELEASE_TAG}"

info "Validating SSH connectivity..."
ssh -o BatchMode=yes -o ConnectTimeout=8 "${VPS_USER}@${VPS_HOST}" "echo SSH_OK" >/dev/null 2>&1 || error "Unable to connect to ${VPS_USER}@${VPS_HOST}."

info "Preparing remote path ${REMOTE_SITE_DIR} ..."
ssh "${VPS_USER}@${VPS_HOST}" "mkdir -p '${REMOTE_RELEASES_DIR}' && test -w '${REMOTE_SITE_DIR}'" || error "Remote path is not writable: ${REMOTE_SITE_DIR}"

info "Syncing files to release ${RELEASE_TAG} ..."
ssh "${VPS_USER}@${VPS_HOST}" "mkdir -p '${REMOTE_RELEASE_DIR}'"

rsync -avz --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.specify/' \
  --exclude '.vscode/' \
  --exclude 'admin/' \
  --exclude 'deploy.sh' \
  --exclude '*.md' \
  --exclude '.DS_Store' \
  --exclude 'nginx.conf' \
  --checksum \
  ./ "${VPS_USER}@${VPS_HOST}:${REMOTE_RELEASE_DIR}/"

info "Activating release with rollback safety..."
ssh "${VPS_USER}@${VPS_HOST}" bash <<REMOTE
set -euo pipefail

site_dir='${REMOTE_SITE_DIR}'
release_dir='${REMOTE_RELEASE_DIR}'
current_link="\${site_dir}/current"
previous_target=''

if [ -L "\${current_link}" ] || [ -e "\${current_link}" ]; then
  previous_target="\$(readlink -f "\${current_link}" || true)"
fi

chown -R www-data:www-data "\${release_dir}"
find "\${release_dir}" -type f -exec chmod 644 {} \;
find "\${release_dir}" -type d -exec chmod 755 {} \;

ln -sfn "\${release_dir}" "\${current_link}"

if nginx -t >/dev/null 2>&1; then
  systemctl reload nginx
  echo "[REMOTE] Release activated: \${release_dir}"
else
  echo "[REMOTE] Nginx test failed. Rolling back..."
  if [ -n "\${previous_target}" ] && [ -d "\${previous_target}" ]; then
    ln -sfn "\${previous_target}" "\${current_link}"
    nginx -t >/dev/null 2>&1 && systemctl reload nginx || true
    echo "[REMOTE] Rolled back to: \${previous_target}"
  else
    echo "[REMOTE] No previous release available for rollback."
  fi
  exit 1
fi
REMOTE

info "✅ Deploy successful for site_id=${SITE_ID}"
info "Site path: ${REMOTE_SITE_DIR}/current"
info "Expected URL: https://${DOMAIN}"
