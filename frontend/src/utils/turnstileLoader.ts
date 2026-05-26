const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export type TurnstileLoadError =
  | 'script-blocked'
  | 'api-timeout'
  | 'script-loaded-no-api'

let apiPromise: Promise<void> | null = null
let lastError: TurnstileLoadError | null = null

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
      window.setTimeout(tick, 50)
    }
    tick()
  })
}

function isScriptAlreadyLoaded(script: HTMLScriptElement): boolean {
  if (script.dataset.ready === '1') return true
  // Completed classic script (load may have fired before we subscribed).
  const state = (script as HTMLScriptElement & { readyState?: string }).readyState
  return state === 'complete' || state === 'loaded'
}

function scriptAppearsInNetworkLog(): boolean {
  try {
    return performance
      .getEntriesByType('resource')
      .some((entry) => entry.name.includes('challenges.cloudflare.com/turnstile'))
  } catch {
    return false
  }
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

export function getLastTurnstileLoadError(): TurnstileLoadError | null {
  return lastError
}

/** Single shared load of the Turnstile API (safe under React StrictMode). */
export function ensureTurnstileApi(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (apiPromise) return apiPromise

  lastError = null

  apiPromise = new Promise((resolve, reject) => {
    const script = getOrCreateScript()
    let settled = false
    let scriptLoaded = isScriptAlreadyLoaded(script)

    const fail = (kind: TurnstileLoadError) => {
      if (settled) return
      settled = true
      lastError = kind
      apiPromise = null
      reject(new Error(kind))
    }

    const succeed = () => {
      if (settled) return
      settled = true
      script.dataset.ready = '1'
      resolve()
    }

    const waitForApiAfterScript = () => {
      scriptLoaded = true
      void waitForApi(90_000)
        .then(succeed)
        .catch(() => {
          if (window.turnstile) {
            succeed()
            return
          }
          if (scriptLoaded || scriptAppearsInNetworkLog()) {
            fail('script-loaded-no-api')
          } else {
            fail('api-timeout')
          }
        })
    }

    script.addEventListener(
      'error',
      () => fail('script-blocked'),
      { once: true },
    )

    script.addEventListener('load', waitForApiAfterScript, { once: true })

    if (scriptLoaded) {
      waitForApiAfterScript()
    }
  })

  return apiPromise
}

/** Clear loader state so a retry can inject a fresh Turnstile script. */
export function resetTurnstileLoader(): void {
  apiPromise = null
  lastError = null
  document.getElementById(SCRIPT_ID)?.remove()
  delete window.turnstile
}

export function resetTurnstileLoaderForTests(): void {
  resetTurnstileLoader()
}
