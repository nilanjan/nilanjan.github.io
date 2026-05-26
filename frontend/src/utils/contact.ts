import { canAccessProtectedContent } from './humanAccess'
import { hasAutomationSignals } from './botDetection'

/** Assembles contact email at runtime only after human verification. */
export function getContactEmail(): string | null {
  if (!canAccessProtectedContent()) return null
  if (hasAutomationSignals()) return null
  const parts = ['zx', '1q', '@', 'tuta', '.', 'io']
  return parts.join('')
}

export function canSendContactMessage(): boolean {
  return canAccessProtectedContent() && !hasAutomationSignals()
}

export function openContactEmail(subject?: string, body?: string): boolean {
  if (!canSendContactMessage()) return false

  const email = getContactEmail()
  if (!email) return false

  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString()
  const href = `mailto:${email}${query ? `?${query}` : ''}`
  window.location.href = href
  return true
}

export const LOCATION = 'San Francisco Bay Area, CA, USA'
