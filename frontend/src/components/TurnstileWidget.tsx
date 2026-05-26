import { useEffect, useRef } from 'react'
import { getTurnstileSiteKey } from '../utils/verifyApi'

interface TurnstileWidgetProps {
  onToken: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
}

function waitForTurnstile(timeoutMs = 20_000): Promise<NonNullable<Window['turnstile']>> {
  return new Promise((resolve, reject) => {
    const started = Date.now()

    const finish = () => {
      if (window.turnstile) {
        resolve(window.turnstile)
        return
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error('turnstile-timeout'))
        return
      }
      window.setTimeout(finish, 50)
    }

    finish()
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
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)
  const onExpireRef = useRef(onExpire)
  const siteKey = getTurnstileSiteKey()

  onTokenRef.current = onToken
  onErrorRef.current = onError
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let cancelled = false
    const container = containerRef.current
    container.replaceChildren()

    waitForTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return

        const renderWidget = () => {
          if (cancelled || !containerRef.current) return

          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => onTokenRef.current(token),
            'error-callback': () => onErrorRef.current?.(),
            'expired-callback': () => onExpireRef.current?.(),
            theme,
            appearance: 'always',
          })
        }

        if (typeof turnstile.ready === 'function') {
          turnstile.ready(renderWidget)
        } else {
          renderWidget()
        }
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current?.()
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
      container.replaceChildren()
    }
  }, [siteKey, theme])

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
