# Amulet Telegram Bot

The bot connects a Telegram private chat to an authenticated Amulet account,
shows purchased invitations and RSVP replies, and receives automatic RSVP
notifications from the Node.js API.

## Setup

1. Create a bot with `@BotFather` and copy its token and username.
2. Copy `telegram_bot/.env.example` to `telegram_bot/.env`.
3. For local development, `server` automatically reads Telegram credentials
   from `telegram_bot/.env`, so this file is the single source of truth.
4. In a separate production deployment, add `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_BOT_USERNAME`, and the same `TELEGRAM_BOT_API_SECRET` directly
   to the server environment.
5. Install and run:

```powershell
cd telegram_bot
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python bot.py
```

The Node.js API must be running at `TELEGRAM_BOT_API_URL`. For production,
use the public HTTPS API URL and the public `CLIENT_URL`.
