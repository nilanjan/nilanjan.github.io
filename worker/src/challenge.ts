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
  <script id="cf-turnstile-script" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
      background: transparent;
    }
    #widget { min-height: 65px; }
    #status { font-size: 12px; color: #666; text-align: center; padding: 8px; }
  </style>
</head>
<body>
  <div>
    <div id="widget"></div>
    <p id="status">Loading…</p>
  </div>
  <script>
    (function () {
      var parentOrigin = ${JSON.stringify(parent)};
      var sitekey = ${JSON.stringify(siteKey)};
      var status = document.getElementById('status');
      var widget = document.getElementById('widget');

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
        status.textContent = msg;
        notifyParent({ type: 'turnstile-error', message: msg });
      }

      function waitForApi(ms) {
        return new Promise(function (resolve, reject) {
          var start = Date.now();
          (function tick() {
            if (window.turnstile) return resolve();
            if (Date.now() - start > ms) return reject(new Error('timeout'));
            setTimeout(tick, 50);
          })();
        });
      }

      document.getElementById('cf-turnstile-script').addEventListener('error', function () {
        fail('Could not download Turnstile script on this origin.');
      });

      waitForApi(30000).then(function () {
        status.textContent = '';
        window.turnstile.ready(function () {
          window.turnstile.render(widget, {
            sitekey: sitekey,
            theme: 'auto',
            callback: function (token) {
              notifyParent({ type: 'turnstile-token', token: token });
              if (window.opener && !window.opener.closed) {
                status.textContent = 'Verified. Returning to site…';
                setTimeout(function () { window.close(); }, 400);
              }
            },
            'error-callback': function () {
              fail('Hostname not allowed for this site key. Add ng-web-verify.nilanjan.workers.dev in Cloudflare Turnstile domains.');
            },
          });
        });
      }).catch(function () {
        fail('Turnstile script loaded but API did not start. Lower Brave Shields for this site.');
      });
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
