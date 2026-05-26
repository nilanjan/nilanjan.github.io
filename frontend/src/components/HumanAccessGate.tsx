import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Loader2, Lock, ShieldCheck } from 'lucide-react'
import MeshBackground from './MeshBackground'
import ThemeToggle from './ThemeToggle'
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

function VerifyAlert({
  children,
  actions,
}: {
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="verify-alert" role="alert">
      <p className="verify-alert__text">{children}</p>
      {actions ? <div className="verify-alert__actions">{actions}</div> : null}
    </div>
  )
}

const cardMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
}

const HumanAccessGate = ({ children }: HumanAccessGateProps) => {
  const { verified, checking, blockedReason, verifyAccess } = useHumanAccess()
  const [verifying, setVerifying] = useState(false)
  const [scriptBlocked, setScriptBlocked] = useState(false)
  const [loadError, setLoadError] = useState<TurnstileLoadError | null>(null)
  const [verifyFailed, setVerifyFailed] = useState(false)
  const [useFrameChallenge, setUseFrameChallenge] = useState(false)
  const [showAlternates, setShowAlternates] = useState(false)
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
    setScriptBlocked(true)
    setLoadError('script-loaded-no-api')
  }, [])

  const handleInlineScriptError = useCallback(() => {
    setLoadError(getLastTurnstileLoadError())
    setScriptBlocked(true)
  }, [])

  const handleRetry = useCallback(() => {
    setScriptBlocked(false)
    setLoadError(null)
    setVerifyFailed(false)
    setUseFrameChallenge(false)
    setShowAlternates(false)
    verifyInFlightRef.current = false
    setChallengeKey((key) => key + 1)
    setWidgetKey((key) => key + 1)
  }, [])

  const challengePageUrl = getChallengePageUrl()

  const openChallengeTab = useCallback(() => {
    if (!challengePageUrl) return
    window.open(challengePageUrl, 'turnstile-verify', 'width=440,height=520')
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
      <div className="verify-screen">
        <MeshBackground />
        <header className="verify-screen__header safe-x">
          <div className="verify-screen__brand">
            <span className="verify-screen__brand-mark" aria-hidden="true" />
            <div>
              <p className="verify-screen__brand-name">Nilanjan Goswami</p>
              <p className="verify-screen__brand-role">Principal Computer Architect</p>
            </div>
          </div>
        </header>
        <div className="verify-screen__loading safe-x">
          <Loader2 className="verify-spinner" aria-label="Loading" />
          <p className="verify-screen__loading-text">Preparing secure access…</p>
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
    'The security check could not load. Allow challenges.cloudflare.com in your browser settings, then try again.'
  if (loadError === 'script-blocked') {
    scriptErrorMessage =
      'Verification was blocked. Allow challenges.cloudflare.com in your privacy extension, or try a private window.'
  } else if (loadError === 'script-loaded-no-api') {
    scriptErrorMessage =
      'The check loaded but did not start. Retry below or switch to an alternate method.'
  }

  return (
    <div className="verify-screen">
      <MeshBackground />

      <header className="verify-screen__header safe-x">
        <div className="verify-screen__brand">
          <span className="verify-screen__brand-mark" aria-hidden="true" />
          <div>
            <p className="verify-screen__brand-name">Nilanjan Goswami</p>
            <p className="verify-screen__brand-role">Principal Computer Architect</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="verify-screen__main safe-x">
        <motion.article
          className="verify-card"
          {...cardMotion}
          aria-labelledby="verify-title"
        >
          <div className="verify-card__top">
            <div className="verify-card__icon" aria-hidden="true">
              <ShieldCheck strokeWidth={1.75} />
            </div>
            <span className="verify-card__step">Access check</span>
          </div>

          <h1 id="verify-title" className="verify-card__title">
            Verify you&apos;re human
          </h1>
          <p className="verify-card__lead">
            This portfolio uses a one-time Cloudflare check to block automated scrapers.
            It takes a few seconds and does not replace cookie consent.
          </p>

          <div className="verify-card__rule" aria-hidden="true" />

          {showConfigError && (
            <VerifyAlert>Verification is not configured for this deployment.</VerifyAlert>
          )}

          {showBlocked && (
            <VerifyAlert
              actions={
                <button type="button" onClick={handleRetry} className="btn-secondary verify-btn">
                  Try again
                </button>
              }
            >
              {blockedReason}
            </VerifyAlert>
          )}

          {showWidget && (
            <section className="verify-card__challenge" aria-labelledby="verify-challenge-label">
              <p id="verify-challenge-label" className="verify-card__challenge-label">
                Complete the security check
              </p>

              <div
                className="verify-card__widget"
                data-verifying={verifying || undefined}
                aria-busy={verifying}
              >
                {verifying && (
                  <div className="verify-card__widget-overlay" aria-hidden="true">
                    <Loader2 className="verify-spinner verify-spinner--sm" />
                    <span>Confirming with server…</span>
                  </div>
                )}

                {!useFrameChallenge ? (
                  <TurnstileWidget
                    key={widgetKey}
                    onToken={handleTurnstileToken}
                    onScriptError={handleInlineScriptError}
                  />
                ) : (
                  <TurnstileChallengeFrame
                    key={challengeKey}
                    onError={handleChallengeFrameError}
                  />
                )}
              </div>

              <button
                type="button"
                className="verify-card__trouble"
                aria-expanded={showAlternates}
                onClick={() => setShowAlternates((open) => !open)}
              >
                Having trouble with the check?
              </button>

              {showAlternates && (
                <div className="verify-card__alternates">
                  {!useFrameChallenge && (
                    <button
                      type="button"
                      className="btn-secondary verify-btn"
                      onClick={() => {
                        setUseFrameChallenge(true)
                        setChallengeKey((k) => k + 1)
                      }}
                    >
                      Try embedded challenge page
                    </button>
                  )}
                  {challengePageUrl && (
                    <button
                      type="button"
                      className="btn-ghost verify-btn verify-btn--link"
                      onClick={openChallengeTab}
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                      Open check in a new tab
                    </button>
                  )}
                </div>
              )}
            </section>
          )}

          {showScriptError && (
            <VerifyAlert
              actions={
                <>
                  <button type="button" onClick={handleRetry} className="btn-primary verify-btn">
                    Retry
                  </button>
                  {challengePageUrl && (
                    <button type="button" onClick={openChallengeTab} className="btn-secondary verify-btn">
                      New tab
                    </button>
                  )}
                </>
              }
            >
              {scriptErrorMessage}
            </VerifyAlert>
          )}

          {showVerifyError && (
            <VerifyAlert
              actions={
                <>
                  <button type="button" onClick={handleRetry} className="btn-primary verify-btn">
                    Retry
                  </button>
                  {challengePageUrl && (
                    <button type="button" onClick={openChallengeTab} className="btn-secondary verify-btn">
                      New tab
                    </button>
                  )}
                </>
              }
            >
              The check succeeded locally but the server could not confirm it. Wait a moment,
              then retry or use a new tab.
            </VerifyAlert>
          )}
        </motion.article>
      </main>

      <footer className="verify-screen__footer safe-x">
        <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <span>Secured with Cloudflare Turnstile · Privacy-first, no ad tracking</span>
      </footer>
    </div>
  )
}

export default HumanAccessGate
