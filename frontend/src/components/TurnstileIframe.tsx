import { useEffect, useMemo, useRef } from 'react'
import { getTurnstileSiteKey } from '../utils/verifyApi'

interface TurnstileIframeProps {
  onToken: (token: string) => void
  onError?: () => void
}

const TurnstileIframe = ({ onToken, onError }: TurnstileIframeProps) => {
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)

  onTokenRef.current = onToken
  onErrorRef.current = onError

  const src = useMemo(() => {
    const origin = encodeURIComponent(window.location.origin)
    const sitekey = encodeURIComponent(getTurnstileSiteKey())
    return `/challenge.html?origin=${origin}&sitekey=${sitekey}`
  }, [])

  useEffect(() => {
    const expectedOrigin = window.location.origin

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
  }, [])

  return (
    <iframe
      title="Cloudflare Turnstile verification"
      src={src}
      className="w-full min-h-[120px] border-0 rounded-lg"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
}

export default TurnstileIframe
