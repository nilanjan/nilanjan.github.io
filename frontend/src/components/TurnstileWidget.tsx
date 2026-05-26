import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'
import { getTurnstileSiteKey } from '../utils/verifyApi'

interface TurnstileWidgetProps {
  onToken: (token: string) => void
  onError?: (code?: string) => void
}

const TurnstileWidget = ({ onToken, onError }: TurnstileWidgetProps) => {
  const siteKey = getTurnstileSiteKey()
  const turnstileRef = useRef<TurnstileInstance>(null)

  if (!siteKey) {
    return (
      <p className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
        Turnstile site key is not configured.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 min-h-[65px]">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onToken}
        onError={() => onError?.()}
        scriptOptions={{
          defer: true,
        }}
        options={{
          theme: 'auto',
          size: 'normal',
        }}
      />
    </div>
  )
}

export default TurnstileWidget
