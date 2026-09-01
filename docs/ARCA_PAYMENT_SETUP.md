# ArCa / AraratBank payment setup

The application uses ArCa EPG only from the Node.js backend. The browser never receives merchant credentials and never sends card data to this application.

## Credentials and environment

Copy `server/.env.example` to `server/.env`. Use the merchant account whose login ends in `_api`. The `_web` account is only for the merchant/admin console and must not be configured in Node.js.

Required values:

```env
PAYMENT_PROVIDER=arca
ARCA_API_BASE_URL=https://epg.arca.am/payment/rest
ARCA_USERNAME=18535943_api
ARCA_PASSWORD=<API account password>
ARCA_CURRENCY=051
FRONTEND_URL=https://amulet.am
```

`ARCA_CURRENCY` is the three-digit ISO 4217 numeric code enabled for the merchant. `051` is AMD, but confirm the enabled currency with AraratBank before the first transaction.

Optional values:

```env
BACKEND_URL=https://server.amulet.am
ARCA_LANGUAGE=hy
ARCA_PAYMENT_DESCRIPTION=Amulet invitation
ARCA_REQUEST_TIMEOUT_MS=15000
ARCA_STATUS_ENDPOINT=getOrderStatusExtended.do
ARCA_CLIENT_ID=
ARCA_MERCHANT_ID=
ARCA_TERMINAL_ID=
ARCA_AMOUNT_MULTIPLIER=
```

The documented default amount multiplier is `100` because ArCa receives minor currency units. Leave `ARCA_AMOUNT_MULTIPLIER` empty to use that default. `ARCA_CLIENT_ID` is sent only when configured. Merchant and terminal IDs are retained as configuration placeholders but are not sent by the current documented REST operations. If extended status is disabled for this merchant, set `ARCA_STATUS_ENDPOINT=getOrderStatus.do`.

## Payment flow

1. The authenticated browser posts the template/draft context to `POST /api/payments/arca/create`.
2. The backend reloads the active template, recalculates its price and promo discount, saves a local `Payment`, and calls `register.do`.
3. The response contains the ArCa order ID and hosted payment-page URL. The browser is redirected to that URL.
4. ArCa returns the customer to `FRONTEND_URL/payment/success?paymentId=<local payment id>`.
5. The frontend calls `GET /api/payments/arca/:paymentId/status`. The backend calls the configured ArCa status method, verifies the merchant order number, amount, currency, and documented success status, then finalizes the purchase.
6. Finalization creates the paid order and published invitation, transfers the preview, consumes the promo exactly once, and sends the existing admin notification. Repeated status requests reuse the completed result.

The return page and its query string are not proof of payment. Only the server-to-server ArCa status response can set a payment to `PAID`.

## Refunds and reversals

Administrators can request a full refund with `POST /api/admin/payments/:paymentId/refund`. The route uses the existing cookie authentication plus admin-role middleware, accepts only a local `PAID` ArCa payment, prevents concurrent/double refunds, calls `refund.do`, and changes local state only after ArCa returns success.

`reverseOrder()` exists only in the internal ArCa service. It is intentionally not exposed as an HTTP route because reversal availability and time limits are merchant-specific and require bank permission.

## First test

```bash
npm install
npm run check:arca
npm test --workspace server
npm run dev:web
```

`npm run check:arca` validates local configuration and prints only safe values. It does not contact ArCa or create an order.

Then:

1. Sign in as a normal customer.
2. Open an active template, edit it, and optionally apply a valid promo code.
3. Start payment and confirm the amount shown by the ArCa hosted page.
4. Complete the bank-provided test card/3-D Secure flow.
5. Confirm the return URL contains only `paymentId` (plus an untrusted outcome hint on failure).
6. Confirm the result page becomes successful only after backend verification.
7. Confirm exactly one paid order, one invitation, one promo usage, and one admin notification exist after refreshing the result page repeatedly.
8. From an admin account, test a refund only after AraratBank has enabled refund permission for the `_api` user.

## Switching environments

Change only `ARCA_API_BASE_URL` to the REST base URL supplied by the bank, then restart the backend. Do not test availability by opening `https://epg.arca.am/`; a 403 at the root does not describe the REST endpoint configuration.

## Values to confirm with AraratBank

- The exact test and production REST base URLs for this merchant.
- The `_api` password and whether it must be changed on first use.
- The enabled three-digit currency code (normally `051` for AMD).
- Whether `getOrderStatusExtended.do` is enabled; otherwise use `getOrderStatus.do`.
- Whether the merchant uses the default minor-unit multiplier of 100.
- Whether refund and/or reversal permissions are enabled for the `_api` account.
- Whether AraratBank requires the public backend domain or a fixed outbound server IP to be allowlisted. This integration originates requests from the backend host; provide AraratBank with that host's static outbound IP if they enforce source allowlisting.
- Whether `ARCA_CLIENT_ID`, merchant ID, or terminal ID is required for this merchant profile. The standard registration method documents `clientId` as optional and does not require merchant/terminal IDs.

## Common failures

- `403` or `401`: verify the exact REST base URL, use `_api` rather than `_web`, confirm the password and source-IP allowlist with the bank.
- Registration error `1`: the merchant order number already exists. The application generates unique order numbers and reuses an active local payment on double clicks.
- Registration errors `2`–`6`: inspect the sanitized provider error in backend logs and confirm currency, mandatory fields, merchant permissions, and limits with the bank.
- Provider error `7`, timeout, or DNS failure: treat it as transient, check gateway/network availability, and retry without changing credentials in source code.
- Unknown order status: the payment remains pending and is never fulfilled. Compare the returned value with the current ArCa merchant manual before changing `server/utils/arcaStatus.js`.

