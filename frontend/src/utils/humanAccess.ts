import { hasAutomationSignals } from './botDetection'
import { readSessionStorage, removeSessionStorage, writeSessionStorage } from './storage'

export const HUMAN_ACCESS_KEY = 'human-access-session'
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000

export interface HumanAccessSession {
  serverToken: string
  verifiedAt: number
  expiresAt: number
}

export function saveHumanSession(serverToken: string, expiresAt: number): boolean {
  const session: HumanAccessSession = {
    serverToken,
    verifiedAt: Date.now(),
    expiresAt,
  }
  return writeSessionStorage(HUMAN_ACCESS_KEY, JSON.stringify(session))
}

export function readHumanSession(): HumanAccessSession | null {
  const raw = readSessionStorage(HUMAN_ACCESS_KEY)
  if (!raw) return null
  try {
    const session = JSON.parse(raw) as HumanAccessSession
    if (!session.serverToken || !session.expiresAt) return null
    return session
  } catch {
    return null
  }
}

export function isHumanSessionValid(session: HumanAccessSession | null, now = Date.now()): boolean {
  if (!session) return false
  if (!session.serverToken) return false
  if (now > session.expiresAt) return false
  if (hasAutomationSignals()) return false
  return true
}

export function clearHumanSession(): void {
  removeSessionStorage(HUMAN_ACCESS_KEY)
}

export function canAccessProtectedContent(): boolean {
  return isHumanSessionValid(readHumanSession())
}

export function getServerSessionToken(): string | null {
  const session = readHumanSession()
  if (!isHumanSessionValid(session)) return null
  return session?.serverToken ?? null
}
