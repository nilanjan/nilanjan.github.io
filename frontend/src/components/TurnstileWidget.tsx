import { useEffect, useRef, useState } from 'react'
import { getTurnstileSiteKey } from '../utils/verifyApi'
import { ensureTurnstileApi } from '../utils/turnstileLoader'

interface TurnstileWidgetProps {
  onToken: (token: string) => void
  onScriptError?: () => void
}

const TurnstileWidget = ({ onToken, onScriptError }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const onTokenRef = useRef(onToken)
  const onScriptErrorRef = useRef(onScriptError)
  const mountGenRef = useRef(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const siteKey = getTurnstileSiteKey().trim()

  onTokenRef.current = onToken
  onScriptErrorRef.current = onScriptError

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    const mountGen = ++mountGenRef.current
    const container = containerRef.current
    let widgetId: string | null = null

    setStatus('loading')

    ensureTurnstileApi()
      .then(() => {
        if (mountGenRef.current !== mountGen || !containerRef.current) return

        if (!window.turnstile) {
          setStatus('error')
          onScriptErrorRef.current?.()
          return
        }

        const renderWidget = () => {
          if (mountGenRef.current !== mountGen || !containerRef.current || !window.turnstile) return

          try {
            widgetId = window.turnstile.render(containerRef.current, {
              sitekey: siteKey,
              callback: (token: string) => onTokenRef.current(token),
              theme: 'auto',
              size: 'flexible',
              appearance: 'always',
            })
            setStatus('ready')
          } catch {
            setStatus('error')
            onScriptErrorRef.current?.()
          }
        }

        if (typeof window.turnstile.ready === 'function') {
          window.turnstile.ready(renderWidget)
        } else {
          renderWidget()
        }
      })
      .catch(() => {
        if (mountGenRef.current !== mountGen) return
        setStatus('error')
        onScriptErrorRef.current?.()
      })

    return () => {
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
    return <p className="verify-widget__hint">Turnstile site key is not configured.</p>
  }

  return (
    <div className="verify-widget">
      {status === 'loading' && (
        <p className="verify-widget__hint">Loading security check…</p>
      )}
      <div
        ref={containerRef}
        className="verify-widget__mount"
        aria-label="Cloudflare Turnstile challenge"
        aria-busy={status === 'loading'}
      />
    </div>
  )
}

export default TurnstileWidget
