const PROD_VERIFY_API_URL = 'https://ng-web-verify.nilanjan.workers.dev'
const PROD_TURNSTILE_SITE_KEY = '0x4AAAAAADWaE0y00QJjck_o'
const CHALLENGE_CACHE_BUST = '20260526b'

function resolveApiBase(): string {
  const fromEnv = import.meta.env.VITE_VERIFY_API_URL?.replace(/\/$/, '') ?? ''
  if (fromEnv) return fromEnv
  if (import.meta.env.PROD) return PROD_VERIFY_API_URL
  return ''
}

function resolveSiteKey(): string {
  const fromEnv = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '').trim()
  if (fromEnv) return fromEnv
  if (import.meta.env.PROD) return PROD_TURNSTILE_SITE_KEY
  return ''
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

interface ContactResponse {
  ok: boolean
  email?: string
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

export async function fetchProtectedContactEmail(sessionToken: string): Promise<string | null> {
  if (!API_BASE || !sessionToken) return null

  const response = await fetch(`${API_BASE}/api/contact`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })

  if (!response.ok) return null

  const data = (await response.json()) as ContactResponse
  if (!data.ok || !data.email) return null

  return data.email
}
