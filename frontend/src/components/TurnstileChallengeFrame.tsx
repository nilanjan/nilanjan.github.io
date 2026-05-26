import { useEffect, useMemo, useRef, useState } from 'react'
import { getChallengePageUrl } from '../utils/verifyApi'

interface TurnstileChallengeFrameProps {
  onError?: () => void
}

/** Same-origin challenge.html — implicit Turnstile; height reported via postMessage. */
const TurnstileChallengeFrame = ({ onError }: TurnstileChallengeFrameProps) => {
  const onErrorRef = useRef(onError)
  const src = useMemo(() => getChallengePageUrl(), [])
  const [frameHeight, setFrameHeight] = useState(72)

  onErrorRef.current = onError

  useEffect(() => {
    if (!src) return

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as { type?: string; height?: number }
      if (data?.type === 'turnstile-resize' && typeof data.height === 'number') {
        setFrameHeight(Math.min(Math.max(Math.ceil(data.height), 72), 200))
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
      className="verify-iframe"
      style={{ height: frameHeight }}
      referrerPolicy="strict-origin-when-cross-origin"
      scrolling="no"
    />
  )
}

export default TurnstileChallengeFrame
