const API_BASE = import.meta.env.VITE_VERIFY_API_URL?.replace(/\/$/, '') ?? ''

export function isVerifyApiConfigured(): boolean {
  return API_BASE.length > 0
}

export function getTurnstileSiteKey(): string {
  return import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''
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
