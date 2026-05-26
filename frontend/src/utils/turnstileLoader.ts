const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let apiPromise: Promise<void> | null = null

function waitForApi(timeoutMs: number): Promise<void> {
  if (window.turnstile) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (window.turnstile) {
        resolve()
        return
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error('turnstile-timeout'))
        return
      }
      window.setTimeout(tick, 100)
    }
    tick()
  })
}

function getOrCreateScript(): HTMLScriptElement {
  const existing = document.getElementById(SCRIPT_ID)
  if (existing instanceof HTMLScriptElement) return existing

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.src = SCRIPT_SRC
  script.async = true
  script.defer = true
  document.head.appendChild(script)
  return script
}

/** Single shared load of the Turnstile API (safe under React StrictMode). */
export function ensureTurnstileApi(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    const script = getOrCreateScript()
    let settled = false

    const finish = () => {
      if (settled) return
      waitForApi(60_000)
        .then(() => {
          settled = true
          script.dataset.ready = '1'
          resolve()
        })
        .catch((err) => {
          settled = true
          apiPromise = null
          reject(err)
        })
    }

    script.addEventListener(
      'error',
      () => {
        if (settled) return
        settled = true
        apiPromise = null
        reject(new Error('script-blocked'))
      },
      { once: true },
    )

    script.addEventListener('load', finish, { once: true })

    // Script may already be in cache / loaded before listeners attach.
    void waitForApi(25_000)
      .then(() => {
        if (!settled) finish()
      })
      .catch(() => {
        if (!settled && !window.turnstile) {
          settled = true
          apiPromise = null
          reject(new Error('turnstile-timeout'))
        }
      })
  })

  return apiPromise
}

export function resetTurnstileLoaderForTests(): void {
  apiPromise = null
  document.getElementById(SCRIPT_ID)?.remove()
  delete window.turnstile
}
