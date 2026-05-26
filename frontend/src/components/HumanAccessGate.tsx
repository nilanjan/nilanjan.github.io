import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { useHumanAccess } from '../context/HumanAccessContext'
import TurnstileWidget from './TurnstileWidget'
import TurnstileIframe from './TurnstileIframe'
import {
  getChallengePageUrl,
  getTurnstileSiteKey,
  isVerifyApiConfigured,
} from '../utils/verifyApi'
import { isBraveBrowser } from '../utils/braveDetection'
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
  const [usingBrave, setUsingBrave] = useState(false)
  const [verifyFailed, setVerifyFailed] = useState(false)
  const [widgetKey, setWidgetKey] = useState(0)
  // navigator.brave exists in Brave; use iframe immediately (Shields blocks inline Turnstile).
  const [useIframe, setUseIframe] = useState(() => isBraveBrowser())

  useEffect(() => {
    if (!isBraveBrowser()) return
    setUsingBrave(true)
    setUseIframe(true)
    const brave = (navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } }).brave
    void brave?.isBrave?.().then((yes) => {
      if (yes) {
        setUsingBrave(true)
        setUseIframe(true)
      }
    })
  }, [])

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
    setUseIframe(true)
  }, [])

  const handleRetry = useCallback(() => {
    setScriptBlocked(false)
    setLoadError(null)
    setVerifyFailed(false)
    setWidgetKey((key) => key + 1)
  }, [])

  const handleUseIframe = useCallback(() => {
    setScriptBlocked(false)
    setUseIframe(true)
  }, [])

  const challengePageUrl = getChallengePageUrl()
  const siteKeySuffix = getTurnstileSiteKey().trim().slice(-8)

  const openChallengeTab = useCallback(() => {
    if (!challengePageUrl) return
    window.open(challengePageUrl, 'turnstile-verify', 'width=420,height=360')
  }, [challengePageUrl])

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
            {useIframe ? (
              <>
                {usingBrave && (
                  <div
                    className="text-sm rounded-lg px-3 py-2 text-left space-y-2"
                    style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--text)' }}
                  >
                    <p className="font-medium">Brave detected</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Lion icon → Shields down for this site, then use the button below. Or use Chrome/Firefox.
                    </p>
                  </div>
                )}
                {!scriptBlocked && (
                  <TurnstileIframe onToken={handleTurnstileToken} onError={handleScriptError} />
                )}
                {challengePageUrl && (
                  <button
                    type="button"
                    onClick={openChallengeTab}
                    className="btn-primary !min-h-10 !py-2 !px-4 text-sm w-full"
                  >
                    Open verification in new tab
                  </button>
                )}
              </>
            ) : (
              <TurnstileWidget
                key={widgetKey}
                onToken={handleTurnstileToken}
                onScriptError={handleScriptError}
              />
            )}

            {scriptBlocked && useIframe && (
              <div className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300 space-y-2 text-left">
                <p>
                  Turnstile could not start (Brave Shields often block fingerprinting). Lower Shields for this
                  site, then use the new-tab button.
                </p>
                <div className="flex flex-col gap-2">
                  {challengePageUrl && (
                    <button
                      type="button"
                      onClick={openChallengeTab}
                      className="btn-secondary !min-h-9 !py-2 !px-4 text-xs w-full"
                    >
                      Open verification in new tab
                    </button>
                  )}
                  <button type="button" onClick={handleRetry} className="btn-secondary !min-h-9 !py-2 !px-4 text-xs w-full">
                    Retry
                  </button>
                </div>
              </div>
            )}

            {scriptBlocked && !useIframe && (
              <div className="text-sm rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300 space-y-2 text-left">
                {loadError === 'script-loaded-no-api' || usingBrave ? (
                  <p>
                    Turnstile&apos;s script downloaded (check Network: <code className="text-xs">api.js</code>{' '}
                    200) but the challenge did not start. In Brave: click the lion icon → set Shields down for
                    this site (or allow all fingerprinting), then Retry.
                  </p>
                ) : loadError === 'script-blocked' ? (
                  <p>
                    Turnstile could not download. Allow{' '}
                    <code className="text-xs">challenges.cloudflare.com</code> in your blocker or try a private
                    window.
                  </p>
                ) : (
                  <p>
                    Turnstile timed out waiting to start. Check Network for blocked{' '}
                    <code className="text-xs">challenges.cloudflare.com</code> requests after{' '}
                    <code className="text-xs">api.js</code>, then Retry.
                  </p>
                )}
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  <a href="/turnstile-check.html" className="underline">
                    turnstile-check.html
                  </a>{' '}
                  · Hard refresh (Cmd+Shift+R) after changing Shields.
                </p>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={handleRetry} className="btn-secondary !min-h-9 !py-2 !px-4 text-xs w-full">
                    Retry
                  </button>
                  <button type="button" onClick={handleUseIframe} className="btn-secondary !min-h-9 !py-2 !px-4 text-xs w-full">
                    Try alternate verification
                  </button>
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
