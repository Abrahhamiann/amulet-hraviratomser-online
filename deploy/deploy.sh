#!/usr/bin/env bash
# Обновление продакшена одной командой:  bash deploy/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 22 || (major === 22 && minor >= 12) ? 0 : 1)'; then
  echo "!! Требуется Node.js >= 22.12.0 (сейчас: $(node --version 2>/dev/null || echo 'не установлен'))." >&2
  echo "!! Обновите Node.js до 22 LTS по инструкции в DEPLOYMENT.md и повторите deploy." >&2
  exit 1
fi

LOCKFILES=(package-lock.json admin/package-lock.json)
if [ -n "$(git status --porcelain -- "${LOCKFILES[@]}")" ]; then
  echo "==> վերականգնում ենք production-ում փոփոխված lock file-ները"
  git restore --source=HEAD --staged --worktree -- "${LOCKFILES[@]}"
fi

echo "==> git pull"
git pull --ff-only

echo "==> npm ci (client + server workspaces)"
npm ci --include=dev

echo "==> production environment preflight"
npm run check:production

echo "==> сборка client"
npm run build --workspace client

echo "==> npm ci + сборка admin"
npm ci --include=dev --prefix admin
( cd admin && NITRO_PRESET="${NITRO_PRESET:-node-server}" npm run build )

if [ ! -f admin/.output/server/index.mjs ]; then
  echo "!! admin/.output/server/index.mjs не создан — см. раздел «Админка не собралась» в DEPLOYMENT.md" >&2
  exit 1
fi

echo "==> перезапуск процессов"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

echo "==> health check"
sleep 3
curl -fsS https://server.amulet.am/api/health && echo
echo "Готово."
