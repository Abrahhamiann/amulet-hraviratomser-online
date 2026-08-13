#!/usr/bin/env bash
# Обновление продакшена одной командой:  bash deploy/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> git pull"
git pull --ff-only

echo "==> npm install (client + server workspaces)"
npm install

echo "==> сборка client"
npm run build --workspace client

echo "==> npm install + сборка admin"
npm install --prefix admin
( cd admin && NITRO_PRESET="${NITRO_PRESET:-node-server}" npm run build )

if [ ! -f admin/.output/server/index.mjs ]; then
  echo "!! admin/.output/server/index.mjs не создан — см. раздел «Админка не собралась» в DEPLOYMENT.md" >&2
  exit 1
fi

echo "==> зависимости бота"
.venv/bin/pip install -q -r telegram_bot/requirements.txt

echo "==> перезапуск процессов"
pm2 reload ecosystem.config.cjs --update-env
pm2 save

echo "==> health check"
sleep 3
curl -fsS https://server.amulet.am/api/health && echo
echo "Готово."
