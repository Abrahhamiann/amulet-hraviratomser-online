# Amulet Telegram Bot (Node.js)

The bot connects a private Telegram chat to an authenticated Amulet account,
shows purchased invitations and RSVP replies, delivers RSVP notifications, and
provides the existing administrator order/contact-message panel.

All configuration is read from `server/.env`:

- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_BOT_USERNAME` come from BotFather.
- `TELEGRAM_BOT_API_SECRET` is a long random value shared only by this process
  and the Amulet API.
- `TELEGRAM_BOT_API_URL` is the complete bot API path. It defaults to the local
  Node.js server and must be set to the HTTPS API URL when deployed elsewhere.
- `TELEGRAM_ADMIN_CHAT_IDS` is a comma-separated list of administrator chat IDs.

Run `npm run dev:bot` from the repository root. The service uses Telegram long
polling with retry/backoff, refreshes its API heartbeat, and verifies uncertain
one-time-link requests before showing an error to the user.

When working inside `server/telegram-bot`, use `npm run dev` to start the bot or
`npm run check` to validate its configuration.

Run `npm run check:bot` to validate the token, username, shared secret, and API
reachability without starting a second polling process.
