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
npm run deploy
```

3. Copy the worker URL (e.g. `https://ng-web-verify.your-subdomain.workers.dev`) into GitHub repo secrets:
   - `VITE_VERIFY_API_URL` — worker base URL
   - `VITE_TURNSTILE_SITE_KEY` — Turnstile site key

4. Rebuild and deploy the frontend.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/verify` | Verify Turnstile token → issue signed session |
| GET | `/api/session` | Validate session (`Authorization: Bearer …`) |
| GET | `/api/contact` | Return contact email for valid session |

## Local dev

```bash
# Terminal 1
cd worker && npm run dev

# Terminal 2 — frontend/.env.local
VITE_VERIFY_API_URL=http://127.0.0.1:8787
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Use Turnstile test keys in development; pair with matching test secret in the worker.
