#!/usr/bin/env bash
set -euo pipefail

MEDIA_ROOT="/var/lib/amulet/media"
NGINX_SITE="/etc/nginx/sites-enabled/server.amulet.am"
BACKUP="${NGINX_SITE}.before-media.$(date +%Y%m%d%H%M%S)"

echo "==> persistent media directory"
sudo install -d -o deploy -g www-data -m 0755 "$MEDIA_ROOT"

if sudo grep -q 'location \^~ /media/' "$NGINX_SITE"; then
  echo "==> Nginx media location already exists"
else
  echo "==> adding Nginx media location"
  sudo cp "$NGINX_SITE" "$BACKUP"
  sudo sed -i '/^[[:space:]]*location \/ {/i\
    location ^~ /media/ {\
        alias /var/lib/amulet/media/;\
        sendfile on;\
        etag on;\
        add_header Cache-Control "public, max-age=31536000, immutable" always;\
        add_header Access-Control-Allow-Origin "*" always;\
        access_log off;\
    }\
' "$NGINX_SITE"
fi

if ! sudo nginx -t; then
  if [ -f "$BACKUP" ]; then
    echo "!! invalid Nginx configuration; restoring $BACKUP" >&2
    sudo cp "$BACKUP" "$NGINX_SITE"
  fi
  exit 1
fi

sudo systemctl reload nginx
echo "Media storage is ready at $MEDIA_ROOT"
