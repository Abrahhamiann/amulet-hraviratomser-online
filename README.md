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
JWT_SECRET=change_this_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

3. Seed sample data:

```bash
npm run seed
```

4. Run the app:

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
