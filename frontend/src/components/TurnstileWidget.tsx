import { useEffect, useRef } from 'react'
import { getTurnstileSiteKey } from '../utils/verifyApi'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

interface TurnstileWidgetProps {
  onToken: (token: string) => void
  onScriptError?: () => void
}

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()

  const existing = document.querySelector(`script[src^="${SCRIPT_SRC}"]`)
  if (existing) {
    return waitForApi(20_000)
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${SCRIPT_SRC}?render=explicit`
    script.async = true
    script.defer = true
    script.onload = () => {
      waitForApi(20_000).then(resolve).catch(reject)
    }
    script.onerror = () => reject(new Error('script-blocked'))
    document.head.appendChild(script)
  })
}

function waitForApi(timeoutMs: number): Promise<void> {
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

const TurnstileWidget = ({ onToken, onScriptError }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const onTokenRef = useRef(onToken)
  const onScriptErrorRef = useRef(onScriptError)
  const siteKey = getTurnstileSiteKey().trim()

  onTokenRef.current = onToken
  onScriptErrorRef.current = onScriptError

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let disposed = false
    let widgetId: string | null = null
    const container = containerRef.current

    loadTurnstileScript()
      .then(() => {
        if (disposed || !containerRef.current || !window.turnstile) return

        const renderWidget = () => {
          if (disposed || !containerRef.current) return

          widgetId = window.turnstile!.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => onTokenRef.current(token),
            theme: 'auto',
            // Do not use error-callback — it fires on React teardown and looks like a hostname failure.
          })
        }

        if (typeof window.turnstile.ready === 'function') {
          window.turnstile.ready(renderWidget)
        } else {
          renderWidget()
        }
      })
      .catch(() => {
        if (!disposed) onScriptErrorRef.current?.()
      })

    return () => {
      disposed = true
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId)
        } catch {
          // ignore teardown errors
        }
        widgetId = null
      }
      container.replaceChildren()
    }
  }, [siteKey])

  if (!siteKey) {
    return (
      <p className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
        Turnstile site key is not configured.
      </p>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center min-h-[65px] min-w-[300px] mx-auto"
      aria-label="Cloudflare Turnstile challenge"
    />
  )
}

export default TurnstileWidget
