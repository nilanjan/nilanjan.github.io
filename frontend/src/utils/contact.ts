import {
  canAccessProtectedContent,
  clearHumanSession,
  getServerSessionToken,
  readHumanSession,
  saveHumanSession,
} from './humanAccess'
import { hasAutomationSignals } from './botDetection'
import {
  exchangeTurnstileToken,
  isVerifyApiConfigured,
  sendContactMessage,
  validateServerSession,
} from './verifyApi'
import type { ContactMessage } from '../../../shared/types'

export function canSendContactMessage(): boolean {
  return (
    isVerifyApiConfigured() &&
    canAccessProtectedContent() &&
    !hasAutomationSignals()
  )
}

/** Send the contact message through the worker (Resend). Returns true on confirmed delivery. */
export async function submitContactMessage(
  message: ContactMessage,
  attachments: File[] = [],
): Promise<boolean> {
  if (!canSendContactMessage()) return false

  const sessionToken = getServerSessionToken()
  if (!sessionToken) return false

  return sendContactMessage(sessionToken, message, attachments)
}

export async function completeHumanVerification(turnstileToken: string): Promise<boolean> {
  if (hasAutomationSignals()) return false

  const result = await exchangeTurnstileToken(turnstileToken)
  if (!result) return false

  return saveHumanSession(result.sessionToken, result.expiresAt)
}

export async function restoreHumanSessionFromStorage(): Promise<boolean> {
  if (!isVerifyApiConfigured()) return false

  const session = readHumanSession()
  if (!session) return false

  const valid = await validateServerSession(session.serverToken)
  if (!valid) {
    clearHumanSession()
    return false
  }

  return true
}

export const LOCATION = 'San Francisco Bay Area, CA, USA'
