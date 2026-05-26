const DEFAULT_SITE_KEY = '0x4AAAAAADWaE0y00QJjck_o'

export interface ChallengeEnv {
  ALLOWED_ORIGINS: string
  TURNSTILE_SITE_KEY: string
}

function parseAllowedOrigins(raw: string): string[] {
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean)
}

function frameAncestors(allowed: string[]): string {
  return allowed.join(' ')
}

export function handleChallenge(request: Request, env: ChallengeEnv): Response {
  const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS)
  const url = new URL(request.url)
  const parentOrigin = url.searchParams.get('origin')?.trim() ?? ''
  const parent = allowed.includes(parentOrigin) ? parentOrigin : allowed[0] ?? 'https://nilanjan.github.io'
  const siteKey = env.TURNSTILE_SITE_KEY?.trim() || DEFAULT_SITE_KEY

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification</title>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 120px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-family: system-ui, sans-serif;
      background: #fff;
    }
    #status { font-size: 13px; color: #444; text-align: center; max-width: 22rem; line-height: 1.45; }
    #status.err { color: #b91c1c; }
    .cf-turnstile { min-height: 65px; }
    .hint { font-size: 12px; color: #666; text-align: center; max-width: 24rem; }
  </style>
</head>
<body>
  <p id="status">Loading challenge…</p>
  <div
    id="widget"
    class="cf-turnstile"
    data-sitekey="${siteKey.replace(/"/g, '&quot;')}"
    data-theme="auto"
    data-callback="onTurnstileSuccess"
    data-error-callback="onTurnstileError"
  ></div>
  <script>
    (function () {
      var parentOrigin = ${JSON.stringify(parent)};
      var status = document.getElementById('status');
      var timeoutId;

      function notifyParent(payload) {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, parentOrigin);
          return;
        }
        if (window.parent !== window) {
          window.parent.postMessage(payload, parentOrigin);
        }
      }

      function fail(msg) {
        clearTimeout(timeoutId);
        status.textContent = msg;
        status.className = 'err';
        notifyParent({ type: 'turnstile-error', message: msg });
      }

      window.onTurnstileSuccess = function (token) {
        clearTimeout(timeoutId);
        status.textContent = '';
        notifyParent({ type: 'turnstile-token', token: token });
        if (window.opener && !window.opener.closed) {
          status.textContent = 'Verified. Returning to site…';
          setTimeout(function () { window.close(); }, 400);
        }
      };

      window.onTurnstileError = function () {
        fail('Turnstile rejected this page. Add ng-web-verify.nilanjan.workers.dev to your Turnstile widget hostnames.');
      };

      timeoutId = setTimeout(function () {
        if (!window.turnstile) {
          fail('Turnstile did not start. Reload and try again.');
        }
      }, 35000);
    })();
  </script>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': `frame-ancestors ${frameAncestors(allowed)}`,
    },
  })
}
