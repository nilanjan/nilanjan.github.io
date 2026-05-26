import { useCallback, useState, type ReactNode } from 'react'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { useHumanAccess } from '../context/HumanAccessContext'
import TurnstileWidget from './TurnstileWidget'
import { getTurnstileSiteKey, isVerifyApiConfigured } from '../utils/verifyApi'

interface HumanAccessGateProps {
  children: ReactNode
}

const HumanAccessGate = ({ children }: HumanAccessGateProps) => {
  const { verified, checking, blockedReason, verifyAccess } = useHumanAccess()
  const [verifying, setVerifying] = useState(false)
  const [turnstileError, setTurnstileError] = useState(false)
  const [widgetKey, setWidgetKey] = useState(0)

  const handleTurnstileToken = useCallback(async (token: string) => {
    setTurnstileError(false)
    setVerifying(true)
    try {
      await verifyAccess(token)
    } finally {
      setVerifying(false)
    }
  }, [verifyAccess])

  const handleTurnstileError = useCallback(() => {
    setTurnstileError(true)
  }, [])

  const handleRetry = useCallback(() => {
    setTurnstileError(false)
    setWidgetKey((key) => key + 1)
  }, [])

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 safe-x"
        style={{
          backgroundColor: 'var(--bg)',
          paddingTop: 'var(--safe-top)',
          paddingBottom: 'var(--safe-bottom)',
        }}
      >
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} aria-label="Loading" />
      </div>
    )
  }

  if (verified) return <>{children}</>

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 safe-x"
      style={{
        backgroundColor: 'var(--bg)',
        paddingTop: 'var(--safe-top)',
        paddingBottom: 'var(--safe-bottom)',
      }}
    >
      <div className="card max-w-md w-full card-pad text-center">
        <div
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
        >
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight mb-2">Human Verification Required</h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          Complete the check below to continue. Automated crawlers, scrapers, and AI agents are not
          authorized to access personal or professional information on this site.
        </p>

        {!isVerifyApiConfigured() && (
          <p className="text-sm mb-4 rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
            Verification service is not configured. The site owner must set{' '}
            <code className="text-xs">VITE_VERIFY_API_URL</code> before this gate can work.
          </p>
        )}

        {blockedReason && !turnstileError && (
          <p className="text-sm mb-4 rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
            {blockedReason}
          </p>
        )}

        {isVerifyApiConfigured() && (
          <div className="mb-4">
            {turnstileError ? (
              <div className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300 space-y-3">
                <p>
                  Turnstile could not load. In Cloudflare → Turnstile → <strong>Nilanjan Portfolio</strong>,
                  confirm the site key ends with{' '}
                  <code className="text-xs">{getTurnstileSiteKey().slice(-8)}</code>, disable ad blockers
                  for <code className="text-xs">challenges.cloudflare.com</code>, then retry.
                </p>
                <button type="button" onClick={handleRetry} className="btn-secondary !min-h-9 !py-2 !px-4 text-xs">
                  Retry
                </button>
              </div>
            ) : (
              <TurnstileWidget
                key={widgetKey}
                onToken={handleTurnstileToken}
                onError={handleTurnstileError}
              />
            )}
          </div>
        )}

        {verifying && (
          <p className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Verifying…
          </p>
        )}

        <p className="mt-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Protected by Cloudflare Turnstile. Session expires after 8 hours or when you close this tab.
        </p>
      </div>
    </div>
  )
}

export default HumanAccessGate
