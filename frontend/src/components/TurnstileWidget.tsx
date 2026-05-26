import { Turnstile } from '@marsidev/react-turnstile'
import { getTurnstileSiteKey } from '../utils/verifyApi'

interface TurnstileWidgetProps {
  onToken: (token: string) => void
  onError?: () => void
}

const TurnstileWidget = ({ onToken, onError }: TurnstileWidgetProps) => {
  const siteKey = getTurnstileSiteKey()

  if (!siteKey) {
    return (
      <p className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
        Turnstile site key is not configured.
      </p>
    )
  }

  return (
    <div className="flex justify-center min-h-[65px]">
      <Turnstile
        siteKey={siteKey}
        onSuccess={onToken}
        onError={() => onError?.()}
        onExpire={() => {
          // Managed widgets refresh automatically; do not treat expiry as a fatal error.
        }}
        options={{
          theme: 'auto',
          refreshExpired: 'auto',
          retry: 'auto',
        }}
      />
    </div>
  )
}

export default TurnstileWidget
