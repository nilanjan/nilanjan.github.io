import { useEffect, useMemo, useRef } from 'react'
import { getChallengePageUrl } from '../utils/verifyApi'

interface TurnstileChallengeFrameProps {
  onToken: (token: string) => void
  onError?: () => void
}

/** Same-origin challenge.html — uses implicit Turnstile (most reliable on Brave). */
const TurnstileChallengeFrame = ({ onToken, onError }: TurnstileChallengeFrameProps) => {
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)
  const src = useMemo(() => getChallengePageUrl(), [])

  onTokenRef.current = onToken
  onErrorRef.current = onError

  useEffect(() => {
    if (!src) return

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
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
  }, [src])

  if (!src) return null

  return (
    <iframe
      title="Cloudflare Turnstile verification"
      src={src}
      className="w-full min-h-[140px] border-0 rounded-lg"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
}

export default TurnstileChallengeFrame
