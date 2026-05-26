import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useHumanAccess } from '../context/HumanAccessContext'
import { MIN_DWELL_MS, MIN_POINTER_MOVES } from '../utils/humanAccess'

interface HumanAccessGateProps {
  children: ReactNode
}

const HumanAccessGate = ({ children }: HumanAccessGateProps) => {
  const { verified, blockedReason, verifyAccess } = useHumanAccess()
  const [pointerMoves, setPointerMoves] = useState(0)
  const [ready, setReady] = useState(false)
  const loadTime = useRef(Date.now())

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), MIN_DWELL_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onMove = () => setPointerMoves((count) => count + 1)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  if (verified) return <>{children}</>

  const dwellMs = Date.now() - loadTime.current
  const canContinue = ready && pointerMoves >= MIN_POINTER_MOVES

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="card max-w-md w-full p-8 text-center">
        <div
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
        >
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight mb-2">Human Verification Required</h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          This portfolio is intended for manual human browsing only. Automated crawlers, scrapers,
          and AI agents are not authorized to access personal or professional information on this site.
        </p>

        {blockedReason && (
          <p className="text-sm mb-4 rounded-lg px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-300">
            {blockedReason}
          </p>
        )}

        <button
          type="button"
          disabled={!canContinue}
          onClick={() => verifyAccess(pointerMoves, dwellMs)}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue as Human Visitor
        </button>

        <p className="mt-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Move your pointer on this page, then continue. Session expires when you close the browser tab.
        </p>
      </div>
    </div>
  )
}

export default HumanAccessGate
