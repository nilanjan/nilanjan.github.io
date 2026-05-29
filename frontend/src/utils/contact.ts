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
  fetchProtectedContactEmail,
  isVerifyApiConfigured,
  sendContactMessage,
  validateServerSession,
} from './verifyApi'
import type { ContactMessage } from '../../../shared/types'

let cachedEmail: string | null = null

export function resetContactEmailCache(): void {
  cachedEmail = null
}

/** Contact email is fetched from the verification worker — never bundled in client code. */
export async function resolveContactEmail(): Promise<string | null> {
  if (!canAccessProtectedContent()) return null
  if (hasAutomationSignals()) return null
  if (cachedEmail) return cachedEmail

  const sessionToken = getServerSessionToken()
  if (!sessionToken) return null

  cachedEmail = await fetchProtectedContactEmail(sessionToken)
  return cachedEmail
}

export function canSendContactMessage(): boolean {
  return (
    isVerifyApiConfigured() &&
    canAccessProtectedContent() &&
    !hasAutomationSignals()
  )
}

/** Send the contact message through the worker (Resend). Returns true on confirmed delivery. */
export async function submitContactMessage(message: ContactMessage): Promise<boolean> {
  if (!canSendContactMessage()) return false

  const sessionToken = getServerSessionToken()
  if (!sessionToken) return false

  return sendContactMessage(sessionToken, message)
}

export async function openContactEmail(subject?: string, body?: string): Promise<boolean> {
  if (!canSendContactMessage()) return false

  const email = await resolveContactEmail()
  if (!email) return false

  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString()
  window.location.href = `mailto:${email}${query ? `?${query}` : ''}`
  return true
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
    resetContactEmailCache()
    return false
  }

  return true
}

export const LOCATION = 'San Francisco Bay Area, CA, USA'
