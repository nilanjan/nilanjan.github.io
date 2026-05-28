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
  resetTurnstileLoader,
  type TurnstileLoadError,
} from '../utils/turnstileLoader'

interface HumanAccessGateProps {
  children: ReactNode
}

function VerifyAlert({
  children,
  actions,
  hint,
  tone = 'error',
}: {
  children: ReactNode
  actions?: ReactNode
  hint?: ReactNode
  tone?: 'error' | 'info'
}) {
  return (
    <div
      className={`verify-alert${tone === 'error' ? ' verify-alert--error' : ''}`}
      role="alert"
    >
      <p className="verify-alert__text">{children}</p>
      {hint ? <p className="verify-alert__hint">{hint}</p> : null}
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
  const [loadError, setLoadError] = useState<TurnstileLoadError | null>(null)
  const [verifyFailed, setVerifyFailed] = useState(false)
  const [challengeMode, setChallengeMode] = useState<'iframe' | 'inline'>('inline')
  const [showAlternates, setShowAlternates] = useState(false)
  const [challengeKey, setChallengeKey] = useState(0)
  const [widgetKey, setWidgetKey] = useState(0)
  const verifyInFlightRef = useRef(false)
  const triedAlternateChallengeRef = useRef(false)

  const handleTurnstileToken = useCallback(
    async (token: string) => {
      if (verifyInFlightRef.current) return
      verifyInFlightRef.current = true
      setVerifyFailed(false)
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

  const failChallengeLoad = useCallback((error: TurnstileLoadError | null = null) => {
    setLoadError(error ?? getLastTurnstileLoadError() ?? 'api-timeout')
  }, [])

  const switchChallengeMode = useCallback(() => {
    if (triedAlternateChallengeRef.current) {
      failChallengeLoad()
      return false
    }
    triedAlternateChallengeRef.current = true
    resetTurnstileLoader()
    setChallengeMode((mode) => {
      const next = mode === 'iframe' ? 'inline' : 'iframe'
      if (next === 'iframe') setChallengeKey((key) => key + 1)
      else setWidgetKey((key) => key + 1)
      return next
    })
    return true
  }, [failChallengeLoad])

  const handleChallengeFrameError = useCallback(() => {
    void switchChallengeMode()
  }, [switchChallengeMode])

  const handleInlineScriptError = useCallback(() => {
    void switchChallengeMode()
  }, [switchChallengeMode])

  const handleRetry = useCallback(() => {
    setLoadError(null)
    setVerifyFailed(false)
    setChallengeMode('inline')
    setShowAlternates(false)
    triedAlternateChallengeRef.current = false
    verifyInFlightRef.current = false
    resetTurnstileLoader()
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
    Boolean(blockedReason) && !verifyFailed && !loadError && !showConfigError
  const showScriptError = Boolean(loadError) && isVerifyApiConfigured()
  const showVerifyError = verifyFailed && isVerifyApiConfigured()
  const showWidget = isVerifyApiConfigured() && !showConfigError

  let scriptErrorTitle = 'We couldn’t load the security check.'
  let scriptErrorHint =
    'Allow challenges.cloudflare.com in your browser, then retry — or open the check in a new tab.'
  if (loadError === 'script-blocked') {
    scriptErrorTitle = 'Your browser blocked the security check.'
    scriptErrorHint =
      'A privacy extension or content blocker is stopping challenges.cloudflare.com. Allow it or try a private window.'
  } else if (loadError === 'script-loaded-no-api') {
    scriptErrorTitle = 'The check loaded but didn’t start.'
    scriptErrorHint = 'Retry below, or open the challenge in a new tab.'
  } else if (loadError === 'api-timeout') {
    scriptErrorTitle = 'The check is taking longer than expected.'
    scriptErrorHint =
      'This usually means challenges.cloudflare.com is slow or blocked on your network. Retry, or open the check in a new tab.'
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

                {challengeMode === 'iframe' ? (
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
                  <button
                    type="button"
                    className="btn-secondary verify-btn"
                    onClick={() => {
                      triedAlternateChallengeRef.current = false
                      resetTurnstileLoader()
                      setChallengeMode((mode) => {
                        const next = mode === 'iframe' ? 'inline' : 'iframe'
                        if (next === 'iframe') setChallengeKey((k) => k + 1)
                        else setWidgetKey((k) => k + 1)
                        return next
                      })
                    }}
                  >
                    {challengeMode === 'iframe' ? 'Try inline challenge' : 'Try embedded challenge'}
                  </button>
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
              hint={scriptErrorHint}
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
              {scriptErrorTitle}
            </VerifyAlert>
          )}

          {showVerifyError && (
            <VerifyAlert
              hint="Wait a moment, then retry — or open the check in a new tab."
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
              We couldn’t confirm the check with the server.
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
