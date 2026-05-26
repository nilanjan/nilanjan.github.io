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
  clearHumanSession,
  getServerSessionToken,
} from '../utils/humanAccess'
import {
  completeHumanVerification,
  resetContactEmailCache,
  restoreHumanSessionFromStorage,
} from '../utils/contact'
import { isVerifyApiConfigured, validateServerSession } from '../utils/verifyApi'

interface HumanAccessContextValue {
  verified: boolean
  checking: boolean
  blockedReason: string | null
  verifyAccess: (turnstileToken: string) => Promise<boolean>
  revokeAccess: () => void
}

const HumanAccessContext = createContext<HumanAccessContextValue | null>(null)

export function HumanAccessProvider({ children }: { children: ReactNode }) {
  const [verified, setVerified] = useState(false)
  const [checking, setChecking] = useState(true)
  const [blockedReason, setBlockedReason] = useState<string | null>(null)

  const revokeAccess = useCallback(() => {
    clearHumanSession()
    resetContactEmailCache()
    setVerified(false)
  }, [])

  const verifyAccess = useCallback(async (turnstileToken: string) => {
    if (!isVerifyApiConfigured()) {
      setBlockedReason('Verification service is not configured for this site.')
      setVerified(false)
      return false
    }

    if (hasAutomationSignals()) {
      setBlockedReason('Automated access is not permitted on this site.')
      setVerified(false)
      return false
    }

    const ok = await completeHumanVerification(turnstileToken)
    if (ok) {
      setBlockedReason(null)
      setVerified(true)
    } else {
      setBlockedReason('Verification failed. Please try again.')
      setVerified(false)
    }
    return ok
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!isVerifyApiConfigured()) {
        if (!cancelled) {
          setBlockedReason('Verification service is not configured for this site.')
          setChecking(false)
        }
        return
      }

      if (hasAutomationSignals()) {
        if (!cancelled) {
          setBlockedReason('Automated access is not permitted on this site.')
          setChecking(false)
        }
        return
      }

      const restored = await restoreHumanSessionFromStorage()
      if (!cancelled) {
        setVerified(restored)
        setChecking(false)
      }
    }

    bootstrap()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!verified) return

    const interval = window.setInterval(async () => {
      if (hasAutomationSignals()) {
        revokeAccess()
        setBlockedReason('Automated access detected. This site is for human visitors only.')
        return
      }

      const token = getServerSessionToken()
      if (!token) {
        revokeAccess()
        setBlockedReason('Your session expired. Please verify again.')
        return
      }

      const stillValid = await validateServerSession(token)
      if (!stillValid) {
        revokeAccess()
        setBlockedReason('Your session expired. Please verify again.')
      }
    }, 60_000)

    return () => window.clearInterval(interval)
  }, [verified, revokeAccess])

  const value = useMemo(
    () => ({ verified, checking, blockedReason, verifyAccess, revokeAccess }),
    [verified, checking, blockedReason, verifyAccess, revokeAccess],
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
