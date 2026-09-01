# Amulet MERN Platform

Original full-stack digital invitation platform inspired by the purpose of modern online invitation services, without copying their design, text, images, code, or branding.

## Tech Stack

- React + Vite, React Router, Axios
- Node.js, Express.js, MongoDB, Mongoose
- JWT admin authentication and bcrypt password hashing
- Custom translation system with Armenian as the default language

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `server/.env` from `server/.env.example`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/e_invite
MONGO_DB_NAME=e_invite
JWT_SECRET=change_this_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

3. Create or update only a super administrator (does not delete any database data):

Linux/macOS:

```bash
SUPER_ADMIN_NAME="Site Owner" \
SUPER_ADMIN_EMAIL="owner@example.com" \
SUPER_ADMIN_PASSWORD="Use-A-Strong-Password1!" \
npm run super-admin:create
```

PowerShell:

```powershell
$env:SUPER_ADMIN_NAME = "Site Owner"
$env:SUPER_ADMIN_EMAIL = "owner@example.com"
$env:SUPER_ADMIN_PASSWORD = "Use-A-Strong-Password1!"
npm run super-admin:create
Remove-Item Env:SUPER_ADMIN_NAME, Env:SUPER_ADMIN_EMAIL, Env:SUPER_ADMIN_PASSWORD
```

Running the same command with an existing super-admin email changes that account's password and revokes its existing sessions. For safety, it refuses to promote an existing regular user or admin automatically.

> Warning: `npm run seed` is the destructive demo-data seed. It deletes users, templates, orders, invitations, RSVPs, and contact messages before recreating sample data. Use it only on a new/disposable database.
> Production startup never seeds templates or reviews and never runs legacy catalog cleanup. Templates are changed only through the admin panel.

4. Optional: seed sample data on a new/disposable database only:

```bash
npm run seed
```

5. Run the app:

```bash
npm run dev
```

Telegram linking uses the Node.js polling service in `server/telegram-bot`.
All Telegram settings belong in `server/.env`; no Python runtime or separate
bot environment file is required. `npm run dev` starts the API, website and bot
together. Use `npm run dev:bot` when only the bot process needs to be restarted.
In production the bot must run continuously and `TELEGRAM_BOT_API_URL` must
point to the public HTTPS API when it is deployed on another machine.

Client: `http://localhost:5173`

Server: `http://localhost:5000`

## Main Features

- Browse and filter invitation templates
- Multilingual UI: hy, en, ru, es, fr, de, it
- Order personalized digital invitations
- Public invitation pages with RSVP, map, share, and calendar actions
- Admin dashboard for templates, orders, invitations, RSVPs, and contact messages
