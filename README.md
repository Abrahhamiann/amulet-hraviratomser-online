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

2. For local development, copy each `.env.development.example` to its matching
   `.env.development` in `server`, `client`, and `admin`. Set a unique server
   `JWT_SECRET` (at least 32 characters). Start a local MongoDB instance first.
   `npm run dev` reads these files and uses the separate `e_invite` database.
   The local API and bot never load the production `server/.env`.

   On Windows, install MongoDB Community Server as a Windows service using the
   [official instructions](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/).
   The local connection is `mongodb://127.0.0.1:27017/e_invite`. Verify the
   service with `Get-Service MongoDB` and start it with `Start-Service MongoDB`
   from an elevated PowerShell window if needed. MongoDB creates the `e_invite`
   database on the first write; no separate database seed is required.

   Keep `server/.env` for production deployment. Its MongoDB URI and database
   name must point to the production database.

Example local values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/e_invite
# Optional: when set, it must match the database name inside MONGO_URI.
MONGO_DB_NAME=e_invite
JWT_SECRET=replace_with_a_unique_secret_at_least_32_characters
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:8080
```

3. Create or update only a super administrator (does not delete any database data):

For local development, set your own email and strong password, then run:

```powershell
$env:SUPER_ADMIN_EMAIL = "you@example.com"
$env:SUPER_ADMIN_PASSWORD = "Replace-With-Your-Strong-Password1!"
npm run super-admin:create:local
Remove-Item Env:SUPER_ADMIN_EMAIL, Env:SUPER_ADMIN_PASSWORD
```

The commands below target the production `server/.env` and should be run on
the deployed server only.

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
> Production startup never seeds templates or reviews and never removes active templates. It only finalizes records already marked deleted by an administrator; all catalog changes originate in the admin panel.

4. Optional: seed sample data on a new/disposable database only:

Set `SEED_ADMIN_PASSWORD` to a unique strong password first. The seed refuses
to run without it and no longer creates an account with a shared password.

```bash
npm run seed
```

5. Run the local API, public site, and admin panel:

```bash
npm run dev
```

To preview a built client locally, run `npm run preview --workspace client`.
This command rebuilds in development mode, so it uses the local API and
`e_invite` database through the local server. A normal `npm run build` remains
the production build.

Open `http://localhost:8080` for the admin panel. The Vite admin points to `http://localhost:5000/api`
in development; production builds use `admin/.env` instead. Check
`http://localhost:5000/api/health` before logging in. A locally seeded admin
exists only in the local database. Create it with the same `SUPER_ADMIN_EMAIL`
and `SUPER_ADMIN_PASSWORD` environment variables shown above, replacing the
command with `npm run super-admin:create:local`. For the deployed site, run
`npm run super-admin:create` on the server with its production `server/.env`,
then sign in at `https://admin.amulet.am`.

Telegram linking uses the Node.js polling service in `server/telegram-bot`.
The bot is optional locally: set a separate local bot token and API secret in
`server/.env.development`, then run `npm run dev:bot` or `npm run dev:all`.
Production runs the bot using `server/.env` through PM2.

Client: `http://localhost:5173`

Server: `http://localhost:5000`

## Main Features

- Browse and filter invitation templates
- Multilingual UI: hy, en, ru, es, fr, de, it
- Order personalized digital invitations
- Public invitation pages with RSVP, map, share, and calendar actions
- Admin dashboard for templates, orders, invitations, RSVPs, and contact messages
