#!/usr/bin/env bash
# Обновление продакшена одной командой:  bash deploy/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

GITHUB_REPOSITORY="Abrahhamiann/amulet-hraviratomser-online"
GITHUB_HTTPS_REMOTE="https://github.com/${GITHUB_REPOSITORY}.git"

configure_github_access() {
  local origin_url
  origin_url="$(git remote get-url origin 2>/dev/null || true)"

  case "$origin_url" in
    "$GITHUB_HTTPS_REMOTE"|"git@github.com:${GITHUB_REPOSITORY}.git"|"https://"*"@github.com/${GITHUB_REPOSITORY}.git") ;;
    *)
      echo "!! Անսպասելի origin URL: ${origin_url:-<չկա>}" >&2
      echo "!! Անվտանգության համար deploy-ը remote-ը չի փոխել։" >&2
      exit 1
      ;;
  esac

  if [ "$origin_url" != "$GITHUB_HTTPS_REMOTE" ]; then
    echo "==> switching GitHub origin to public read-only HTTPS"
    git remote set-url origin "$GITHUB_HTTPS_REMOTE"
  fi

  export GIT_TERMINAL_PROMPT=0

  echo "==> GitHub public HTTPS access preflight"
  if ! git ls-remote --exit-code origin HEAD >/dev/null 2>&1; then
    echo "!! GitHub repository-ն HTTPS-ով հասանելի չէ։ Ստուգեք VPS-ի ինտերնետ կապը և GitHub-ի հասանելիությունը։" >&2
    exit 1
  fi
}

configure_github_access

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

PRODUCTION_MEDIA_ROOT="/var/lib/amulet/media"
LEGACY_MEDIA_ROOT="$ROOT/server/media"
NGINX_MEDIA_SITE="/etc/nginx/sites-enabled/server.amulet.am"
if [ ! -d "$PRODUCTION_MEDIA_ROOT" ] || [ ! -w "$PRODUCTION_MEDIA_ROOT" ] || ! grep -q 'location \^~ /media/' "$NGINX_MEDIA_SITE" 2>/dev/null; then
  echo "==> configuring persistent template media storage"
  bash "$ROOT/deploy/setup-media-storage.sh"
fi
if [ -d "$LEGACY_MEDIA_ROOT" ]; then
  echo "==> migrating legacy uploaded template images"
  cp -a -n "$LEGACY_MEDIA_ROOT/." "$PRODUCTION_MEDIA_ROOT/"
fi

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
