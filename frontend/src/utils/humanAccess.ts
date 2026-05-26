import { hasAutomationSignals } from './botDetection'
import { readSessionStorage, removeSessionStorage, writeSessionStorage } from './storage'

export const HUMAN_ACCESS_KEY = 'human-access-session'
export const MIN_POINTER_MOVES = 2
export const MIN_DWELL_MS = 800
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000

export interface HumanAccessSession {
  verifiedAt: number
  pointerMoves: number
  nonce: string
}

export function createHumanSession(pointerMoves: number): HumanAccessSession {
  return {
    verifiedAt: Date.now(),
    pointerMoves,
    nonce: crypto.randomUUID(),
  }
}

export function isHumanSessionValid(session: HumanAccessSession | null, now = Date.now()): boolean {
  if (!session) return false
  if (session.pointerMoves < MIN_POINTER_MOVES) return false
  if (now - session.verifiedAt > SESSION_MAX_AGE_MS) return false
  if (hasAutomationSignals()) return false
  return true
}

export function readHumanSession(): HumanAccessSession | null {
  const raw = readSessionStorage(HUMAN_ACCESS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as HumanAccessSession
  } catch {
    return null
  }
}

export function writeHumanSession(session: HumanAccessSession): boolean {
  return writeSessionStorage(HUMAN_ACCESS_KEY, JSON.stringify(session))
}

export function clearHumanSession(): void {
  removeSessionStorage(HUMAN_ACCESS_KEY)
}

export function canAccessProtectedContent(): boolean {
  return isHumanSessionValid(readHumanSession())
}

export function verifyHumanAccess(pointerMoves: number, dwellMs: number): boolean {
  if (pointerMoves < MIN_POINTER_MOVES) return false
  if (dwellMs < MIN_DWELL_MS) return false
  if (hasAutomationSignals()) return false

  const session = createHumanSession(pointerMoves)
  writeHumanSession(session)
  return true
}
