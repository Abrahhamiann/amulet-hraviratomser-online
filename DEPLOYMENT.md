# Amulet — деплой с нуля (Ubuntu 24.04 + nginx + PM2 + Certbot)

Домены:

| Домен | Что там | Как работает |
|---|---|---|
| `amulet.am`, `www.amulet.am` | публичный сайт (React/Vite SPA) | nginx отдаёт статику из `client/dist` |
| `server.amulet.am` | API (Node/Express) | nginx → `127.0.0.1:5000` (PM2) |
| `admin.amulet.am` | админка (TanStack Start / Nitro SSR) | nginx → `127.0.0.1:3000` (PM2) |
| — | Telegram-бот (Node.js, long polling) | PM2 запускает `server/telegram-bot/bot.js`; бот ходит в API на `127.0.0.1:5000`, порт наружу не нужен |
| — | MongoDB | только `127.0.0.1:27017`, наружу закрыт |

Все три сайта живут на **одном** VPS. Всё, что зависит от окружения (адреса, ключи, контакты), задаётся **только в `.env`-файлах** — в коде хардкода адресов нет.

---

## 0. Что нужно приготовить заранее

- VPS: Ubuntu 24.04 LTS, **минимум 2 vCPU / 4 GB RAM / 40 GB SSD** (сборка клиента прожорливая; при 2 GB обязательно добавить swap — шаг 2.4).
- Доступ к DNS домена `amulet.am`.
- Доступ к GitHub-репозиторию `Abrahhamiann/amulet-hraviratomser-online`.
- Ключи/доступы: Google OAuth Client ID, Stripe (secret + publishable), SMTP-пароль приложения Gmail, токен бота от @BotFather.

---

## 1. DNS

В панели регистратора домена `amulet.am` создай A-записи на IP сервера (`SERVER_IP`):

```
A     @        SERVER_IP     TTL 300
A     www      SERVER_IP     TTL 300
A     server   SERVER_IP     TTL 300
A     admin    SERVER_IP     TTL 300
```

Проверка (с любого компьютера), пока не ответит правильный IP — дальше не идём, Certbot без DNS не выдаст сертификат:

```bash
dig +short amulet.am server.amulet.am admin.amulet.am
```

---

## 2. Базовая настройка сервера

### 2.1 Первый вход и пользователь

```bash
ssh root@SERVER_IP

adduser deploy                    # придумай пароль
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy   # перенести ssh-ключ
```

Дальше всё делаем под `deploy`:

```bash
ssh deploy@SERVER_IP
```

### 2.2 Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw build-essential ca-certificates gnupg
sudo timedatectl set-timezone Asia/Yerevan
```

### 2.3 Файрвол

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'      # 80 + 443
sudo ufw enable
sudo ufw status
```

Порты 5000, 3000, 27017 наружу **не открываем** — они слушают только localhost.

### 2.4 Swap (если RAM < 4 GB)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2.5 (Рекомендуется) Отключить вход по паролю

```bash
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
# PasswordAuthentication no
sudo systemctl restart ssh
```

---

## 3. Установка софта

### 3.1 Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v          # ожидаем v20.x
```

### 3.2 MongoDB 8.0

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
sudo systemctl status mongod --no-pager
```

Убедись, что Mongo слушает только localhost (`bindIp: 127.0.0.1` в `/etc/mongod.conf` — это значение по умолчанию):

```bash
grep -A2 "net:" /etc/mongod.conf
```

**Опционально, но правильно — включить авторизацию в Mongo:**

```bash
mongosh
```
```js
use admin
db.createUser({
  user: "amulet_admin",
  pwd: "ПРИДУМАЙ_ДЛИННЫЙ_ПАРОЛЬ",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }, { role: "readWriteAnyDatabase", db: "admin" }]
})
exit
```
```bash
sudo nano /etc/mongod.conf
# добавить:
# security:
#   authorization: enabled
sudo systemctl restart mongod
```

Тогда в `server/.env` строка подключения будет:
`MONGO_URI=mongodb://amulet_admin:ПАРОЛЬ@127.0.0.1:27017/amulet?authSource=admin`

### 3.3 nginx и Certbot

```bash
sudo apt install -y nginx
sudo apt install -y certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```

### 3.4 PM2

```bash
sudo npm install -g pm2
pm2 -v
```

---

## 4. Код проекта

```bash
sudo mkdir -p /var/www/amulet
sudo chown -R deploy:deploy /var/www/amulet
cd /var/www/amulet

git clone https://github.com/Abrahhamiann/amulet-hraviratomser-online.git
cd amulet-hraviratomser-online
```

> Если репозиторий приватный — сгенерируй на сервере ключ `ssh-keygen -t ed25519 -C "amulet-server"`, добавь `~/.ssh/id_ed25519.pub` в GitHub → Settings → Deploy keys, и клонируй по SSH: `git clone git@github.com:Abrahhamiann/amulet-hraviratomser-online.git`.

Итоговый путь к проекту: **`/var/www/amulet/amulet-hraviratomser-online`** — он используется во всех конфигах ниже.

---

## 5. Переменные окружения и секреты (самый важный шаг)

Сгенерируй два случайных секрета:

```bash
openssl rand -hex 32     # -> JWT_SECRET
openssl rand -hex 32     # -> TELEGRAM_BOT_API_SECRET
```

### 5.1 `server/.env`

```bash
cd /var/www/amulet/amulet-hraviratomser-online
cp server/.env.example server/.env
nano server/.env
```

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/amulet
JWT_SECRET=<первый openssl rand -hex 32>

CLIENT_URL=https://amulet.am
ADMIN_URL=https://admin.amulet.am
SERVER_URL=https://server.amulet.am
CORS_EXTRA_ORIGINS=https://www.amulet.am

AUTH_COOKIE_NAME=amulet_auth
AUTH_COOKIE_MAX_AGE_MS=604800000
AUTH_COOKIE_DOMAIN=.amulet.am

GOOGLE_CLIENT_ID=954385897484-mvsr9ocebf559dl1b9v7rfvvu4unfqbr.apps.googleusercontent.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=amuletarmenia@gmail.com
SMTP_PASS=<app password Gmail, 16 символов без пробелов>
AMULET_EMAIL_FROM="Amulet <amuletarmenia@gmail.com>"

STRIPE_SECRET_KEY=sk_live_...

TELEGRAM_BOT_TOKEN=<токен от @BotFather>
TELEGRAM_BOT_USERNAME=<имя бота без @>
TELEGRAM_BOT_API_SECRET=<второй openssl rand -hex 32>
TELEGRAM_BOT_API_URL=http://127.0.0.1:5000/api/telegram/bot
TELEGRAM_ADMIN_CHAT_IDS=<твой chat id>,<второй chat id>
```

`server/.env` — единый файл окружения для API и Node.js Telegram-бота. Отдельного `telegram_bot/.env` нет: `server/server.js` и `server/telegram-bot/bot.js` читают одни и те же настройки. Локальный `TELEGRAM_BOT_API_URL` позволяет боту обращаться к API напрямую, минуя nginx и внешний SSL.

### 5.2 `client/.env`

```bash
cp client/.env.example client/.env
nano client/.env
```

```env
VITE_API_URL=https://server.amulet.am/api
VITE_SITE_URL=https://amulet.am

VITE_GOOGLE_CLIENT_ID=954385897484-mvsr9ocebf559dl1b9v7rfvvu4unfqbr.apps.googleusercontent.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

VITE_CONTACT_PHONE_DISPLAY=041 401415
VITE_CONTACT_PHONE_E164=+37441401415
VITE_CONTACT_PHONE_DIGITS=37441401415
VITE_CONTACT_TELEGRAM=amulet_invitiations
VITE_CONTACT_EMAIL=amuletarmenia@gmail.com
VITE_WHATSAPP_BASE_URL=https://wa.me
VITE_QR_API_URL=https://api.qrserver.com/v1/create-qr-code/
VITE_CREATION_VIDEO_URL=https://youtu.be/WUPRFyeUwCU?si=sAyLMnUu_QknEBLF
VITE_COMPANY_SITE_URL=https://rsoft.am
```

> ⚠️ `VITE_*` вшиваются в бандл **на этапе сборки**. После правки `client/.env` обязательно пересобрать клиент.

### 5.3 `admin/.env`

```bash
cp admin/.env.example admin/.env
nano admin/.env
```

```env
VITE_API_URL=https://server.amulet.am/api
VITE_CLIENT_URL=https://amulet.am
PORT=3000
```

### 5.4 Проверка, что `.env` не уедут в git

```bash
git status --short          # .env файлов в списке быть не должно
```

---

## 6. Установка зависимостей и сборка

```bash
cd /var/www/amulet/amulet-hraviratomser-online

# client + server (npm workspaces)
npm install

# сборка публичного сайта -> client/dist
npm run build --workspace client
ls client/dist/index.html          # должен существовать

# админка
npm install --prefix admin
cd admin && NITRO_PRESET=node-server npm run build && cd ..
ls admin/.output/server/index.mjs  # должен существовать

# Node.js Telegram-бот входит в server и использует server/.env
node --check server/telegram-bot/bot.js
```

> **Если сборка клиента падает по памяти** (`JavaScript heap out of memory`):
> `NODE_OPTIONS=--max-old-space-size=3072 npm run build --workspace client`

> **Если `admin/.output/server/index.mjs` не появился** — см. раздел «Админка не собралась» внизу.

### 6.1 Создание super admin без удаления данных

```bash
SUPER_ADMIN_NAME="Site Owner" \
SUPER_ADMIN_EMAIL="owner@example.com" \
SUPER_ADMIN_PASSWORD="Use-A-Strong-Password1!" \
npm run super-admin:create
```

Команда создаёт только super admin и не удаляет данные. Повторный запуск с тем же email меняет пароль этого super admin и завершает его старые сессии. Если пользователь с таким email уже существует, но не является super admin, команда безопасно завершится с ошибкой и не повысит его роль.

> **Опасно:** `npm run seed` — это только demo seed для новой/одноразовой базы. Он удаляет пользователей, шаблоны, заказы, приглашения, RSVP и сообщения перед созданием тестовых данных. Не запускай его на рабочей базе.

---

## 7. Запуск процессов через PM2

```bash
cd /var/www/amulet/amulet-hraviratomser-online
pm2 start ecosystem.config.cjs
pm2 status
pm2 logs --lines 50
```

Должны быть три `online`-процесса: `amulet-api`, `amulet-admin`, `amulet-bot`. В `ecosystem.config.cjs` процесс `amulet-bot` запускает Node.js-файл `server/telegram-bot/bot.js` в одном экземпляре; Python/venv не используются.

Автозапуск после перезагрузки сервера:

```bash
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy
# выполнить команду sudo ..., которую выведет pm2
```

Быстрая проверка до nginx:

```bash
curl -s http://127.0.0.1:5000/api/health     # {"status":"ok"}
curl -sI http://127.0.0.1:3000 | head -1     # HTTP/1.1 200 OK
```

---

## 8. nginx

Готовые конфиги лежат в репозитории — просто копируем:

```bash
cd /var/www/amulet/amulet-hraviratomser-online

sudo cp deploy/nginx/amulet.am.conf        /etc/nginx/sites-available/amulet.am
sudo cp deploy/nginx/server.amulet.am.conf /etc/nginx/sites-available/server.amulet.am
sudo cp deploy/nginx/admin.amulet.am.conf  /etc/nginx/sites-available/admin.amulet.am

sudo ln -sf /etc/nginx/sites-available/amulet.am        /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/server.amulet.am /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/admin.amulet.am  /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl reload nginx
```

nginx должен иметь доступ на чтение `client/dist`:

```bash
sudo chmod o+x /var/www /var/www/amulet /var/www/amulet/amulet-hraviratomser-online
```

Проверь по HTTP (пока без SSL): `http://amulet.am`, `http://server.amulet.am/api/health`, `http://admin.amulet.am`.

---

## 9. SSL — Certbot

Один вызов на все четыре имени:

```bash
sudo certbot --nginx \
  -d amulet.am -d www.amulet.am \
  -d server.amulet.am \
  -d admin.amulet.am \
  --email amuletarmenia@gmail.com --agree-tos --no-eff-email --redirect
```

`--redirect` сам добавит редирект 80 → 443 во все три конфига.

Проверка автопродления (сертификаты живут 90 дней, systemd-таймер `certbot.timer` продлевает сам):

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

После получения сертификатов:

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -s https://server.amulet.am/api/health
```

---

## 10. Внешние сервисы — что дописать после деплоя

### Google OAuth (вход через Google)
Google Cloud Console → APIs & Services → Credentials → твой OAuth Client ID:
- **Authorized JavaScript origins:** `https://amulet.am`, `https://www.amulet.am`
- **Authorized redirect URIs:** не нужны (используется Google Identity Services на клиенте)

Без этого кнопка «Войти через Google» молча не работает.

### Stripe
- В `server/.env` — `sk_live_...`, в `client/.env` — `pk_live_...`.
- Success/cancel URL строятся из `CLIENT_URL`, отдельной настройки в Stripe не требуют.
- Вебхуки в проекте не используются: оплата подтверждается через `POST /api/payments/confirm-checkout-session`.

### Telegram
- У @BotFather: `/setcommands`, `/setdescription` — по желанию.
- Node.js-бот находится в `server/telegram-bot/bot.js`, работает на **long polling**, вебхук настраивать не нужно, порт наружу не нужен.
- API и бот используют общий `server/.env`; отдельный env-файл для бота создавать не нужно.
- Свой `chat id` узнать: написать боту `/start`, затем `pm2 logs amulet-bot`.

### SMTP (Gmail)
- Нужен **App Password** (аккаунт с 2FA), обычный пароль не подойдёт.
- Проверь, что провайдер VPS не блокирует исходящий 465/587.

---

## 11. Обновление проекта (каждый следующий деплой)

```bash
cd /var/www/amulet/amulet-hraviratomser-online
bash deploy/deploy.sh
```

`deploy/deploy.sh` использует текущий Node.js flow: `git pull` → `npm install` → сборка клиента → установка и сборка админки → перезапуск API, админки и Node.js Telegram-бота через `ecosystem.config.cjs` → health-check. Python/venv в деплое не нужны.

Вручную то же самое:

```bash
git pull
npm install
npm run build --workspace client
npm install --prefix admin && (cd admin && NITRO_PRESET=node-server npm run build)
node --check server/telegram-bot/bot.js
pm2 reload ecosystem.config.cjs --update-env
```

**Правило:** поменял `client/.env` или `admin/.env` → нужна **пересборка**. Поменял общий для API и бота `server/.env` → достаточно `pm2 reload ecosystem.config.cjs --update-env`.

---

## 12. Бэкапы MongoDB

```bash
sudo apt install -y mongodb-database-tools
mkdir -p /home/deploy/backups
crontab -e
```

Добавить (каждый день в 03:30, хранить 14 дней):

```cron
30 3 * * * /usr/bin/mongodump --uri="mongodb://127.0.0.1:27017/amulet" --archive=/home/deploy/backups/amulet-$(date +\%F).gz --gzip >/dev/null 2>&1
40 3 * * * find /home/deploy/backups -name 'amulet-*.gz' -mtime +14 -delete
```

Восстановление:

```bash
mongorestore --uri="mongodb://127.0.0.1:27017" --archive=/home/deploy/backups/amulet-2026-08-13.gz --gzip --drop
```

---

## 13. Логи и диагностика

```bash
pm2 status
pm2 logs amulet-api --lines 100
pm2 logs amulet-admin --lines 100
pm2 logs amulet-bot --lines 100
pm2 monit

sudo tail -f /var/log/nginx/amulet.am.error.log
sudo tail -f /var/log/nginx/server.amulet.am.error.log
sudo journalctl -u mongod -n 100 --no-pager
```

---

## 14. Частые проблемы

**`JWT_SECRET must be configured with at least 32 characters`**
В `server/.env` секрет короче 32 символов или остался `change_this_secret`. Сгенерируй `openssl rand -hex 32`.

**Сайт открывается, но все запросы падают с CORS**
`CLIENT_URL` / `ADMIN_URL` в `server/.env` должны в точности совпадать с адресом в браузере — со схемой `https://` и **без** слэша в конце. Для `www.amulet.am` добавь его в `CORS_EXTRA_ORIGINS`. После правки — `pm2 reload amulet-api`.

**Логин проходит, но при перезагрузке страницы разлогинивает**
Проверь `NODE_ENV=production` (иначе кука без `Secure` и браузер её не примет по https) и `AUTH_COOKIE_DOMAIN=.amulet.am`.

**Клиент стучится на `localhost:5000`**
Клиент собран без `client/.env`. Проверь файл и пересобери: `npm run build --workspace client`.

**404 при обновлении страницы на внутреннем маршруте сайта**
Не сработал `try_files ... /index.html` — проверь, что подключён именно `deploy/nginx/amulet.am.conf` и путь `root` указывает на реальный `client/dist`.

**Бот отвечает «Amulet API is unavailable» / 401**
Проверь `pm2 logs amulet-api` и `pm2 logs amulet-bot`, затем убедись, что в общем `server/.env` заданы корректные `TELEGRAM_BOT_API_URL` и `TELEGRAM_BOT_API_SECRET`. После правки выполни `pm2 reload ecosystem.config.cjs --update-env`.

**Бот падает с `Conflict: terminated by other getUpdates request`**
Запущено больше одного экземпляра бота (например, локально на компьютере и на сервере, или два процесса PM2). Оставь ровно один: `pm2 delete amulet-bot && pm2 start ecosystem.config.cjs --only amulet-bot`.

**Certbot: `Could not bind to IPv4/IPv6` или `DNS problem`**
DNS ещё не разошёлся (`dig +short amulet.am`) либо nginx не отвечает на 80 порту. Дождись DNS и повтори.

**Админка не собралась (`admin/.output/server/index.mjs` отсутствует)**
Админка на TanStack Start + Nitro, и пресет сборки по умолчанию — облачный (Cloudflare), а нам нужен обычный Node. Перебери варианты пресета:

```bash
cd admin
NITRO_PRESET=node-server npm run build   # основной вариант
NITRO_PRESET=node_server npm run build   # альтернативное написание
NITRO_PRESET=node npm run build          # для Nitro v3
ls -R .output | head -40                 # посмотреть, что реально собралось
```

Тот вариант, который создал `.output/server/index.mjs`, зафиксируй в `deploy/deploy.sh` (переменная `NITRO_PRESET`). Если ни один не сработал — временно раздай админку через `pm2 start "npm run preview" --name amulet-admin --cwd admin` и подними вопрос с пресетом отдельно.

---

## 15. Карта переменных окружения

| Файл | Переменная | Прод-значение | Когда применяется |
|---|---|---|---|
| `server/.env` | `CLIENT_URL` | `https://amulet.am` | CORS, ссылки в письмах/Telegram, Stripe success/cancel |
| `server/.env` | `ADMIN_URL` | `https://admin.amulet.am` | CORS |
| `server/.env` | `SERVER_URL` | `https://server.amulet.am` | справочно / внешние интеграции |
| `server/.env` | `CORS_EXTRA_ORIGINS` | `https://www.amulet.am` | дополнительные origin-ы |
| `server/.env` | `AUTH_COOKIE_DOMAIN` | `.amulet.am` | общая кука на поддоменах |
| `server/.env` | `TELEGRAM_BOT_TOKEN` | токен от BotFather | при старте Node.js-бота |
| `server/.env` | `TELEGRAM_BOT_USERNAME` | username без `@` | при старте Node.js-бота |
| `server/.env` | `TELEGRAM_BOT_API_URL` | `http://127.0.0.1:5000/api/telegram/bot` | локальная связь бота с API |
| `server/.env` | `TELEGRAM_BOT_API_SECRET` | случайный секрет ≥ 32 символов | аутентификация запросов бота к API |
| `server/.env` | `TELEGRAM_ADMIN_CHAT_IDS` | chat ID через запятую | права Telegram-администраторов |
| `client/.env` | `VITE_API_URL` | `https://server.amulet.am/api` | **на сборке** |
| `client/.env` | `VITE_SITE_URL` | `https://amulet.am` | **на сборке** (ссылки на приглашения, QR) |
| `admin/.env` | `VITE_API_URL` | `https://server.amulet.am/api` | **на сборке** |
| `admin/.env` | `VITE_CLIENT_URL` | `https://amulet.am` | **на сборке** (превью шаблонов) |
Точки, где эти значения читаются в коде (единственные — больше нигде адресов нет):
`server/config/env.js`, `server/telegram-bot/config.js`, `client/src/config/env.js`, `admin/src/lib/env.ts`.
