import { useEffect, useMemo, useRef } from 'react'
import { getVerifyApiBase } from '../utils/verifyApi'

interface TurnstileIframeProps {
  onToken: (token: string) => void
  onError?: () => void
}

const TurnstileIframe = ({ onToken, onError }: TurnstileIframeProps) => {
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)
  const apiBase = getVerifyApiBase()

  onTokenRef.current = onToken
  onErrorRef.current = onError

  const src = useMemo(() => {
    if (!apiBase) return ''
    const origin = encodeURIComponent(window.location.origin)
    return `${apiBase}/challenge?origin=${origin}`
  }, [apiBase])

  useEffect(() => {
    if (!apiBase) return

    const expectedOrigin = new URL(apiBase).origin

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== expectedOrigin) return
      const data = event.data as { type?: string; token?: string }
      if (data?.type === 'turnstile-token' && data.token) {
        onTokenRef.current(data.token)
      }
      if (data?.type === 'turnstile-error') {
        onErrorRef.current?.()
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [apiBase])

  if (!src) return null

  return (
    <iframe
      title="Cloudflare Turnstile verification"
      src={src}
      className="w-full min-h-[120px] border-0 rounded-lg"
      sandbox="allow-scripts allow-same-origin allow-popups"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
}

export default TurnstileIframe
