# Creator promo codes

Admin → Promo codes → Content creators contains the existing discount, expiry,
usage limit and activation fields plus creator name, contact and commission.
Commission is rounded to two decimal places from the actual discounted checkout amount.
The payment and order preserve the checkout terms; subsequent edits do not
recalculate past earnings. Refunded orders are excluded from the admin totals.
This records earnings; it does not transfer money to creators.

Generate a Telegram connection link on the creator card and privately give it
to that creator. It expires in 24 hours, is claimable by one chat, and grants the holder
the notification destination for that promo. The creator must press Start in
the existing bot. Contact information alone does not connect a Telegram chat.
Changing the contact disconnects the destination and invalidates pending links.
Repeated Start requests by the same chat work until the link expires, including
automatic retries after a lost API response. A different chat cannot reuse it.

The admin and bot must use the same API/database environment. A local admin
at `127.0.0.1:5000` cannot create links for a bot using a separate VPS database.
Link creation checks a fresh heartbeat from the matching bot with creator
support. `npm run check:bot` probes configuration without falsely marking a
polling process as online. Deploy/restart BOTH API and bot, then use that
environment's admin to generate a new link. Do not run a second poller against
the same Telegram bot token on your development machine.

Uses the existing TELEGRAM_SHARED_BOT_TOKEN / TELEGRAM_BOT_TOKEN and
TELEGRAM_SHARED_BOT_USERNAME / TELEGRAM_BOT_USERNAME configuration.
Restart the API and Telegram bot after deployment; rebuild the admin app.
The existing production deployment reloads `amulet-api` and `amulet-bot`
together through `ecosystem.config.cjs`.

Verified ArCa purchases trigger notifications with invitation, public viewing
link, original price, discount, paid amount, commission, order ID and Yerevan
purchase timestamp. A persistent retry queue runs every minute with five-minute
retry delays. A lease prevents concurrent sends; delivery is at least once
(a process crash after Telegram accepts a message can cause a duplicate).
Creator promos with payment history must be disabled instead of deleted.

Creators can open `/creator` or the dashboard button on purchase alerts.
The commands menu is installed on bot startup and a creator-specific menu is
installed when a linked creator opens the dashboard. It shows all-time and
current Yerevan-month net earnings, with five purchases per page and protected
purchase details. Refunded purchases remain visible but do not count as earnings.
Every request checks the chat's linked promo IDs; order IDs cannot grant access
to another creator's purchases. Customer email and phone are not exposed.

Purchase alerts and details omit event date, event time and venue. Invitation
URLs are provided through Open and Copy buttons, with no raw URL in the text.
Loopback development URLs only receive Copy buttons: configure CLIENT_URL to
the real public website URL on the VPS so Open links work on creators' devices.

Integration verification: set `CREATOR_TEST_MONGO_URI` and run
`node --test tests/creatorFlow.integration.test.js` from `server`.
It creates and removes a uniquely named isolated test database and stubs all
bank and Telegram requests. It covers environment readiness, rotation, repeated
Start, wrong chat, discounted checkout, historical terms after edits, payment
confirmation, notification failure/retry/concurrency, and refund totals.
