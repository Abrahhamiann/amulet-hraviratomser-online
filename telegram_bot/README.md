# Amulet Telegram Bot

The bot connects a Telegram private chat to an authenticated Amulet account,
shows purchased invitations and RSVP replies, and receives automatic RSVP
notifications from the Node.js API. Configured administrators also receive new
purchase and contact-form alerts and can manage them from a private Telegram
admin panel.

## Setup

1. Create a bot with `@BotFather` and copy its token and username.
2. Copy `telegram_bot/.env.example` to `telegram_bot/.env`.
   Set `TELEGRAM_ADMIN_CHAT_IDS` to the two administrator chat IDs separated by
   a comma. Only those chats can open `/admin` or call admin bot API endpoints.
3. For local development, `server` automatically reads Telegram credentials
   from `telegram_bot/.env`, so this file is the single source of truth.
4. In a separate production deployment, add `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_BOT_USERNAME`, `TELEGRAM_ADMIN_CHAT_IDS`, and the same
   `TELEGRAM_BOT_API_SECRET` directly to the server environment.
5. Install and run:

```powershell
cd telegram_bot
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python bot.py
```

The Node.js API must be running at `TELEGRAM_BOT_API_URL`. For production,
use the public HTTPS API URL and the public `CLIENT_URL`. The bot is a required
long-running service: if neither this polling process nor a Telegram webhook is
running, `/start` links remain pending and website accounts cannot connect.

Opening the bot directly by username never grants administrator access. Direct
`/start` shows the linked-account flow; the admin panel requires the explicit
`/admin` command, a configured Telegram chat ID, and a linked Amulet account
whose role is `super_admin`.

## Administrator flow

- `/admin` opens the dashboard with totals, paid orders, revenue, and unanswered
  contact messages.
- **Orders** lists purchases and custom-order requests and shows the customer,
  invitation, payment, event, and contact details used by the website.
- **Messages** lists contact requests. A reply is sent to the customer's linked
  Telegram account; if no account is linked or Telegram delivery fails, email is
  used automatically.
- New purchase and contact alerts include inline buttons that open the matching
  item directly in the admin panel. Times shown to administrators use
  `Asia/Yerevan`.

Administrators receive a persistent `🛡 Ադմին Պանել` keyboard button. Contact
messages that remain unanswered trigger a reminder to every configured
administrator after 15 minutes and again every 15 minutes until a reply is sent.
