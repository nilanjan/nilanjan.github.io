import { useEffect, useRef } from 'react'
import { getTurnstileSiteKey } from '../utils/verifyApi'

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad'

interface TurnstileWidgetProps {
  onToken: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
}

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID)
    if (existing) {
      window.onTurnstileLoad = () => resolve()
      if (window.turnstile) resolve()
      return
    }

    window.onTurnstileLoad = () => resolve()
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('turnstile-load-failed'))
    document.head.appendChild(script)
  })
}

const TurnstileWidget = ({
  onToken,
  onError,
  onExpire,
  theme = 'auto',
}: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = getTurnstileSiteKey()

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let cancelled = false

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current)
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onToken,
          'error-callback': onError,
          'expired-callback': onExpire,
          theme,
          appearance: 'always',
        })
      })
      .catch(() => onError?.())

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, onToken, onError, onExpire, theme])

  if (!siteKey) {
    return (
      <p className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
        Turnstile site key is not configured.
      </p>
    )
  }

  return <div ref={containerRef} className="flex justify-center min-h-[65px]" />
}

export default TurnstileWidget
