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
  const [scriptBlocked, setScriptBlocked] = useState(false)
  const [verifyFailed, setVerifyFailed] = useState(false)
  const [widgetKey, setWidgetKey] = useState(0)

  const handleTurnstileToken = useCallback(async (token: string) => {
    setVerifyFailed(false)
    setScriptBlocked(false)
    setVerifying(true)
    try {
      const ok = await verifyAccess(token)
      if (!ok) setVerifyFailed(true)
    } finally {
      setVerifying(false)
    }
  }, [verifyAccess])

  const handleScriptError = useCallback(() => {
    setScriptBlocked(true)
  }, [])

  const handleRetry = useCallback(() => {
    setScriptBlocked(false)
    setVerifyFailed(false)
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

  const siteKeySuffix = getTurnstileSiteKey().trim().slice(-8)

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
          Complete the Cloudflare check below to continue.
        </p>

        {!isVerifyApiConfigured() && (
          <p className="text-sm mb-4 rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
            Verification service is not configured.
          </p>
        )}

        {blockedReason && (
          <p className="text-sm mb-4 rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
            {blockedReason}
          </p>
        )}

        {isVerifyApiConfigured() && (
          <div className="mb-4 space-y-3">
            <TurnstileWidget
              key={widgetKey}
              onToken={handleTurnstileToken}
              onScriptError={handleScriptError}
            />

            {scriptBlocked && (
              <div className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300 space-y-2 text-left">
                <p>
                  Turnstile could not load. Allow <code className="text-xs">challenges.cloudflare.com</code> in
                  your ad blocker or try a private window (Safari/Chrome incognito).
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Diagnostic:{' '}
                  <a href="/turnstile-check.html" className="underline">
                    turnstile-check.html
                  </a>{' '}
                  (or open{' '}
                  <a
                    href="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    challenges.cloudflare.com
                  </a>{' '}
                  in a new tab). Hard refresh this page (Cmd+Shift+R) if the message looks outdated.
                </p>
                <button type="button" onClick={handleRetry} className="btn-secondary !min-h-9 !py-2 !px-4 text-xs w-full">
                  Retry
                </button>
              </div>
            )}

            {verifyFailed && (
              <div className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300 space-y-2 text-left">
                <p>
                  Challenge completed but server verification failed. Update the worker{' '}
                  <code className="text-xs">TURNSTILE_SECRET</code> to match the Secret Key on your
                  &quot;Nilanjan Portfolio&quot; widget (same widget as site key …{siteKeySuffix}).
                </p>
                <button type="button" onClick={handleRetry} className="btn-secondary !min-h-9 !py-2 !px-4 text-xs w-full">
                  Retry
                </button>
              </div>
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
          Protected by Cloudflare Turnstile · key …{siteKeySuffix}
        </p>
      </div>
    </div>
  )
}

export default HumanAccessGate
