# Verification Worker

Server-side Turnstile verification for the portfolio site. GitHub Pages serves static files only; this worker is the safety net.

## Setup

1. Create a [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) widget for `nilanjan.github.io` (and `localhost` for dev).
2. Install and deploy:

```bash
cd worker
npm install
wrangler login
wrangler secret put TURNSTILE_SECRET
wrangler secret put SESSION_SECRET   # random 32+ char string
wrangler secret put CONTACT_EMAIL    # your address (never commit)
wrangler secret put RESEND_API_KEY   # Resend API key for sending contact mail
npm run deploy
```

Get a `RESEND_API_KEY` at [resend.com](https://resend.com). Until you verify a sending domain,
leave `CONTACT_FROM = "onboarding@resend.dev"` in `wrangler.toml` and make sure `CONTACT_EMAIL`
is the address registered on your Resend account (Resend only delivers to the account owner from the
shared sender). After verifying a domain, set `CONTACT_FROM` to an address on that domain.

3. Copy the worker URL (e.g. `https://ng-web-verify.your-subdomain.workers.dev`) into GitHub repo secrets:
   - `VITE_VERIFY_API_URL` — worker base URL
   - `VITE_TURNSTILE_SITE_KEY` — Turnstile site key

4. Rebuild and deploy the frontend.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/verify` | Verify Turnstile token → issue signed session |
| GET | `/api/session` | Validate session (`Authorization: Bearer …`) |
| POST | `/api/contact` | Send a contact message via Resend for valid session |

## Local dev

```bash
# Terminal 1
cd worker && npm run dev

# Terminal 2 — frontend/.env.local
VITE_VERIFY_API_URL=http://127.0.0.1:8787
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Use Turnstile test keys in development; pair with matching test secret in the worker.
