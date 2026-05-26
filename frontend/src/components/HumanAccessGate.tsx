import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ExternalLink, Loader2, ShieldCheck } from 'lucide-react'
import MeshBackground from './MeshBackground'
import { useHumanAccess } from '../context/HumanAccessContext'
import TurnstileWidget from './TurnstileWidget'
import TurnstileChallengeFrame from './TurnstileChallengeFrame'
import { getChallengePageUrl, isVerifyApiConfigured } from '../utils/verifyApi'
import {
  getLastTurnstileLoadError,
  type TurnstileLoadError,
} from '../utils/turnstileLoader'

interface HumanAccessGateProps {
  children: ReactNode
}

function VerificationAlert({
  children,
  actions,
}: {
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="verification-alert" role="alert">
      <div className="verification-alert-body">{children}</div>
      {actions ? <div className="verification-alert-actions">{actions}</div> : null}
    </div>
  )
}

const HumanAccessGate = ({ children }: HumanAccessGateProps) => {
  const { verified, checking, blockedReason, verifyAccess } = useHumanAccess()
  const [verifying, setVerifying] = useState(false)
  const [scriptBlocked, setScriptBlocked] = useState(false)
  const [loadError, setLoadError] = useState<TurnstileLoadError | null>(null)
  const [verifyFailed, setVerifyFailed] = useState(false)
  const [useInlineWidget, setUseInlineWidget] = useState(false)
  const [challengeKey, setChallengeKey] = useState(0)
  const [widgetKey, setWidgetKey] = useState(0)
  const verifyInFlightRef = useRef(false)

  const handleTurnstileToken = useCallback(
    async (token: string) => {
      if (verifyInFlightRef.current) return
      verifyInFlightRef.current = true
      setVerifyFailed(false)
      setScriptBlocked(false)
      setVerifying(true)
      try {
        const ok = await verifyAccess(token)
        if (!ok) setVerifyFailed(true)
      } finally {
        setVerifying(false)
        verifyInFlightRef.current = false
      }
    },
    [verifyAccess],
  )

  const handleChallengeFrameError = useCallback(() => {
    setUseInlineWidget(true)
  }, [])

  const handleInlineScriptError = useCallback(() => {
    setLoadError(getLastTurnstileLoadError())
    setScriptBlocked(true)
  }, [])

  const handleRetry = useCallback(() => {
    setScriptBlocked(false)
    setLoadError(null)
    setVerifyFailed(false)
    setUseInlineWidget(false)
    verifyInFlightRef.current = false
    setChallengeKey((key) => key + 1)
    setWidgetKey((key) => key + 1)
  }, [])

  const challengePageUrl = getChallengePageUrl()

  const openChallengeTab = useCallback(() => {
    if (!challengePageUrl) return
    window.open(challengePageUrl, 'turnstile-verify', 'width=420,height=400')
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
      <div className="verification-gate">
        <MeshBackground />
        <div className="verification-gate-center safe-x">
          <Loader2 className="verification-spinner" aria-label="Loading" />
          <p className="verification-loading-label">Checking access…</p>
        </div>
      </div>
    )
  }

  if (verified) return <>{children}</>

  const showConfigError = !isVerifyApiConfigured()
  const showBlocked =
    Boolean(blockedReason) && !verifyFailed && !scriptBlocked && !showConfigError
  const showScriptError = scriptBlocked && isVerifyApiConfigured()
  const showVerifyError = verifyFailed && isVerifyApiConfigured()
  const showWidget = isVerifyApiConfigured() && !scriptBlocked && !showConfigError

  let scriptErrorMessage =
    'The verification challenge timed out. Allow challenges.cloudflare.com in your browser settings, then try again.'
  if (loadError === 'script-blocked') {
    scriptErrorMessage =
      'Verification could not load. Allow challenges.cloudflare.com in your blocker or try a private window.'
  } else if (loadError === 'script-loaded-no-api') {
    scriptErrorMessage =
      'Verification loaded but did not start. Retry below or open the challenge in a new tab.'
  }

  return (
    <div className="verification-gate">
      <MeshBackground />
      <div className="verification-gate-body safe-x">
        <div className="verification-panel">
          <div className="verification-panel-header">
            <div className="verification-icon" aria-hidden="true">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="verification-panel-copy">
              <p className="eyebrow verification-eyebrow">Portfolio access</p>
              <h1 className="verification-title">Confirm you&apos;re human</h1>
              <p className="verification-subtitle">
                A quick Cloudflare check keeps automated scrapers off this site.
              </p>
            </div>
          </div>

          {showConfigError && (
            <VerificationAlert>
              Verification is not configured for this deployment.
            </VerificationAlert>
          )}

          {showBlocked && (
            <VerificationAlert actions={
              <button type="button" onClick={handleRetry} className="btn-secondary verification-btn">
                Try again
              </button>
            }>
              {blockedReason}
            </VerificationAlert>
          )}

          {showWidget && (
            <div className="verification-widget-section">
              <div
                className="verification-widget-shell"
                data-verifying={verifying || undefined}
                aria-busy={verifying}
              >
                {verifying && (
                  <div className="verification-widget-overlay" aria-hidden="true">
                    <Loader2 className="verification-spinner verification-spinner--sm" />
                    <span>Verifying…</span>
                  </div>
                )}
                {!useInlineWidget ? (
                  <TurnstileChallengeFrame
                    key={challengeKey}
                    onError={handleChallengeFrameError}
                  />
                ) : (
                  <TurnstileWidget
                    key={widgetKey}
                    onToken={handleTurnstileToken}
                    onScriptError={handleInlineScriptError}
                  />
                )}
              </div>

              {challengePageUrl && !useInlineWidget && (
                <button
                  type="button"
                  onClick={openChallengeTab}
                  className="verification-alt-link"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Open challenge in new tab
                </button>
              )}
            </div>
          )}

          {showScriptError && (
            <VerificationAlert
              actions={
                <>
                  <button type="button" onClick={handleRetry} className="btn-secondary verification-btn">
                    Retry
                  </button>
                  {challengePageUrl && (
                    <button type="button" onClick={openChallengeTab} className="btn-primary verification-btn">
                      New tab
                    </button>
                  )}
                </>
              }
            >
              {scriptErrorMessage}
            </VerificationAlert>
          )}

          {showVerifyError && (
            <VerificationAlert
              actions={
                <>
                  <button type="button" onClick={handleRetry} className="btn-secondary verification-btn">
                    Retry
                  </button>
                  {challengePageUrl && (
                    <button type="button" onClick={openChallengeTab} className="btn-primary verification-btn">
                      New tab
                    </button>
                  )}
                </>
              }
            >
              The challenge passed but the server could not confirm it. Wait a moment and retry, or use a new tab.
            </VerificationAlert>
          )}
        </div>
      </div>
    </div>
  )
}

export default HumanAccessGate
