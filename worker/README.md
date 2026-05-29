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
wrangler secret put SESSION_SECRET     # random 32+ char string
wrangler secret put CONTACT_EMAIL      # your address (never commit)
wrangler secret put RESEND_API_KEY     # Resend API key for sending contact mail
wrangler secret put VIRUSTOTAL_API_KEY # for scanning form attachments
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
| POST | `/api/contact` | Send a contact message (JSON or multipart with attachments) via Resend for valid session |

## Attachments

The contact form accepts optional file attachments (max 3 files, 5 MB each, 10 MB total).
Allowed types — verified by magic bytes, not the filename — are PNG, JPEG, GIF, WebP, PDF,
and `.docx` (macro-enabled Office files are rejected). Each file is scanned with
[VirusTotal](https://www.virustotal.com): the worker checks the file hash and, if unknown,
uploads it for a multi-engine scan. Scanning is **fail-closed** — anything flagged or that
cannot be verified is rejected. Get a free `VIRUSTOTAL_API_KEY` from your VirusTotal account.

## Local dev

```bash
# Terminal 1
cd worker && npm run dev

# Terminal 2 — frontend/.env.local
VITE_VERIFY_API_URL=http://127.0.0.1:8787
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Use Turnstile test keys in development; pair with matching test secret in the worker.
