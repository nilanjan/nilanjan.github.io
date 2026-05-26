import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { hasAutomationSignals } from '../utils/botDetection'
import {
  canAccessProtectedContent,
  clearHumanSession,
  verifyHumanAccess,
} from '../utils/humanAccess'

interface HumanAccessContextValue {
  verified: boolean
  blockedReason: string | null
  verifyAccess: (pointerMoves: number, dwellMs: number) => boolean
  revokeAccess: () => void
}

const HumanAccessContext = createContext<HumanAccessContextValue | null>(null)

export function HumanAccessProvider({ children }: { children: ReactNode }) {
  const [verified, setVerified] = useState(() => canAccessProtectedContent())
  const [blockedReason, setBlockedReason] = useState<string | null>(null)

  const revokeAccess = useCallback(() => {
    clearHumanSession()
    setVerified(false)
  }, [])

  const verifyAccess = useCallback((pointerMoves: number, dwellMs: number) => {
    if (hasAutomationSignals()) {
      setBlockedReason('Automated access is not permitted on this site.')
      setVerified(false)
      return false
    }

    const ok = verifyHumanAccess(pointerMoves, dwellMs)
    if (ok) {
      setBlockedReason(null)
      setVerified(true)
    } else {
      setBlockedReason('Please interact with the page naturally before continuing.')
    }
    return ok
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (verified && hasAutomationSignals()) {
        revokeAccess()
        setBlockedReason('Automated access detected. This site is for human visitors only.')
      }
    }, 15_000)

    return () => window.clearInterval(interval)
  }, [verified, revokeAccess])

  const value = useMemo(
    () => ({ verified, blockedReason, verifyAccess, revokeAccess }),
    [verified, blockedReason, verifyAccess, revokeAccess],
  )

  return <HumanAccessContext.Provider value={value}>{children}</HumanAccessContext.Provider>
}

export function useHumanAccess(): HumanAccessContextValue {
  const ctx = useContext(HumanAccessContext)
  if (!ctx) {
    throw new Error('useHumanAccess must be used within HumanAccessProvider')
  }
  return ctx
}
