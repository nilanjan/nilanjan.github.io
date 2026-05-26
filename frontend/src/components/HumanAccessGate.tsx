import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { useHumanAccess } from '../context/HumanAccessContext'
import TurnstileWidget from './TurnstileWidget'
import {
  getChallengePageUrl,
  getTurnstileSiteKey,
  isVerifyApiConfigured,
} from '../utils/verifyApi'
import {
  getLastTurnstileLoadError,
  type TurnstileLoadError,
} from '../utils/turnstileLoader'

interface HumanAccessGateProps {
  children: ReactNode
}

const HumanAccessGate = ({ children }: HumanAccessGateProps) => {
  const { verified, checking, blockedReason, verifyAccess } = useHumanAccess()
  const [verifying, setVerifying] = useState(false)
  const [scriptBlocked, setScriptBlocked] = useState(false)
  const [loadError, setLoadError] = useState<TurnstileLoadError | null>(null)
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
    setLoadError(getLastTurnstileLoadError())
    setScriptBlocked(true)
  }, [])

  const handleRetry = useCallback(() => {
    setScriptBlocked(false)
    setLoadError(null)
    setVerifyFailed(false)
    setWidgetKey((key) => key + 1)
  }, [])

  const challengePageUrl = getChallengePageUrl()
  const siteKeySuffix = getTurnstileSiteKey().trim().slice(-8)

  const openChallengeTab = useCallback(() => {
    if (!challengePageUrl) return
    window.open(challengePageUrl, 'turnstile-verify', 'width=420,height=360')
  }, [challengePageUrl])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as { type?: string; token?: string }
      if (data?.type === 'turnstile-token' && data.token) {
        void handleTurnstileToken(data.token)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [handleTurnstileToken])

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
            {!scriptBlocked && (
              <TurnstileWidget
                key={widgetKey}
                onToken={handleTurnstileToken}
                onScriptError={handleScriptError}
              />
            )}

            {scriptBlocked && (
              <div className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300 space-y-2 text-left">
                {loadError === 'script-blocked' ? (
                  <p>
                    Turnstile could not download. Allow{' '}
                    <code className="text-xs">challenges.cloudflare.com</code> in your blocker or try a private
                    window.
                  </p>
                ) : loadError === 'script-loaded-no-api' ? (
                  <p>
                    Turnstile&apos;s script loaded but the challenge did not start. Try again or use the new-tab
                    option below.
                  </p>
                ) : (
                  <p>
                    Turnstile timed out. Check that <code className="text-xs">challenges.cloudflare.com</code> is
                    not blocked, then retry.
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={handleRetry} className="btn-secondary !min-h-9 !py-2 !px-4 text-xs w-full">
                    Retry
                  </button>
                  {challengePageUrl && (
                    <button
                      type="button"
                      onClick={openChallengeTab}
                      className="btn-secondary !min-h-9 !py-2 !px-4 text-xs w-full"
                    >
                      Open verification in new tab
                    </button>
                  )}
                </div>
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
