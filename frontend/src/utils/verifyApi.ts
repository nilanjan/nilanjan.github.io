import {
  normalizeTurnstileSiteKey,
  PROD_TURNSTILE_SITE_KEY,
  resolveProductionSiteKey,
} from './turnstileSiteKey'

export { normalizeTurnstileSiteKey, PROD_TURNSTILE_SITE_KEY }

const PROD_VERIFY_API_URL = 'https://ng-web-verify.nilanjan.workers.dev'
const CHALLENGE_CACHE_BUST = '20260526h'

function resolveApiBase(): string {
  const fromEnv = import.meta.env.VITE_VERIFY_API_URL?.replace(/\/$/, '') ?? ''
  if (fromEnv) return fromEnv
  if (import.meta.env.PROD) return PROD_VERIFY_API_URL
  return ''
}

function resolveSiteKey(): string {
  if (import.meta.env.PROD) {
    return resolveProductionSiteKey(import.meta.env.VITE_TURNSTILE_SITE_KEY)
  }
  return normalizeTurnstileSiteKey(import.meta.env.VITE_TURNSTILE_SITE_KEY)
}

const API_BASE = resolveApiBase()

export function isVerifyApiConfigured(): boolean {
  return API_BASE.length > 0
}

export function getVerifyApiBase(): string {
  return API_BASE
}

/** Same-origin challenge page (uses nilanjan.github.io Turnstile hostname). */
export function getChallengePageUrl(): string {
  if (typeof window === 'undefined') return ''
  return `/challenge.html?v=${CHALLENGE_CACHE_BUST}`
}

export function getTurnstileSiteKey(): string {
  return resolveSiteKey()
}

interface VerifyResponse {
  ok: boolean
  sessionToken?: string
  expiresAt?: number
  error?: string
}

interface SessionResponse {
  ok: boolean
  expiresAt?: number
}

export async function exchangeTurnstileToken(
  token: string,
): Promise<{ sessionToken: string; expiresAt: number } | null> {
  if (!API_BASE) return null

  const response = await fetch(`${API_BASE}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })

  if (!response.ok) return null

  const data = (await response.json()) as VerifyResponse
  if (!data.ok || !data.sessionToken || !data.expiresAt) return null

  return { sessionToken: data.sessionToken, expiresAt: data.expiresAt }
}

export async function validateServerSession(sessionToken: string): Promise<boolean> {
  if (!API_BASE || !sessionToken) return false

  const response = await fetch(`${API_BASE}/api/session`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })

  if (!response.ok) return false

  const data = (await response.json()) as SessionResponse
  return data.ok === true
}

export async function sendContactMessage(
  sessionToken: string,
  message: { name: string; email: string; message: string },
  attachments: File[] = [],
): Promise<{ ok: boolean; error?: string }> {
  if (!API_BASE || !sessionToken) return { ok: false, error: 'contact-unavailable' }

  const hasAttachments = attachments.length > 0
  const headers: Record<string, string> = { Authorization: `Bearer ${sessionToken}` }
  let body: BodyInit
  if (hasAttachments) {
    const formData = new FormData()
    formData.set('name', message.name)
    formData.set('email', message.email)
    formData.set('message', message.message)
    for (const file of attachments) formData.append('attachments', file)
    body = formData
  } else {
    body = JSON.stringify(message)
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers,
    body,
  })

  const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string }
  if (!response.ok) {
    return { ok: false, error: data.error ?? `http-${response.status}` }
  }
  if (data.ok !== true) {
    return { ok: false, error: data.error ?? 'send-failed' }
  }
  return { ok: true }
}
