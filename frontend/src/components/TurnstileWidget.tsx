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
        if (mountGenRef.current !== mountGen || !containerRef.current || !window.turnstile) return

        const renderWidget = () => {
          if (mountGenRef.current !== mountGen || !containerRef.current) return

          widgetId = window.turnstile!.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => onTokenRef.current(token),
            theme: 'auto',
            appearance: 'always',
          })
          setStatus('ready')
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
    return (
      <p className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
        Turnstile site key is not configured.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 min-w-[300px] mx-auto">
      {status === 'loading' && (
        <p className="text-xs py-2" style={{ color: 'var(--text-muted)' }}>
          Loading verification…
        </p>
      )}
      <div
        ref={containerRef}
        className="flex justify-center min-h-[65px] w-full"
        aria-label="Cloudflare Turnstile challenge"
        aria-busy={status === 'loading'}
      />
    </div>
  )
}

export default TurnstileWidget
