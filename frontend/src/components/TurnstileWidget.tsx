import { useEffect, useRef, useState } from 'react'
import { getTurnstileSiteKey } from '../utils/verifyApi'

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface TurnstileWidgetProps {
  onToken: (token: string) => void
  onScriptError?: () => void
}

function waitForTurnstileApi(timeoutMs: number): Promise<void> {
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

function injectTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()

  return new Promise((resolve, reject) => {
    document.getElementById(SCRIPT_ID)?.remove()

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => {
      waitForTurnstileApi(30_000).then(resolve).catch(reject)
    }
    script.onerror = () => reject(new Error('script-blocked'))
    document.head.appendChild(script)
  })
}

const TurnstileWidget = ({ onToken, onScriptError }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const onTokenRef = useRef(onToken)
  const onScriptErrorRef = useRef(onScriptError)
  const [loading, setLoading] = useState(true)
  const siteKey = getTurnstileSiteKey().trim()

  onTokenRef.current = onToken
  onScriptErrorRef.current = onScriptError

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let disposed = false
    let widgetId: string | null = null
    const container = containerRef.current

    setLoading(true)

    waitForTurnstileApi(8_000)
      .catch(() => injectTurnstileScript())
      .then(() => {
        if (disposed || !containerRef.current || !window.turnstile) return

        const renderWidget = () => {
          if (disposed || !containerRef.current) return

          widgetId = window.turnstile!.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => onTokenRef.current(token),
            theme: 'auto',
          })
          setLoading(false)
        }

        if (typeof window.turnstile.ready === 'function') {
          window.turnstile.ready(renderWidget)
        } else {
          renderWidget()
        }
      })
      .catch(() => {
        if (!disposed) {
          setLoading(false)
          onScriptErrorRef.current?.()
        }
      })

    return () => {
      disposed = true
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId)
        } catch {
          // ignore
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
    <div className="flex flex-col items-center gap-2 min-w-[300px] mx-auto">
      {loading && (
        <p className="text-xs py-4" style={{ color: 'var(--text-muted)' }}>
          Loading verification…
        </p>
      )}
      <div
        ref={containerRef}
        className={`flex justify-center min-h-[65px] w-full ${loading ? 'hidden' : ''}`}
        aria-label="Cloudflare Turnstile challenge"
      />
    </div>
  )
}

export default TurnstileWidget
