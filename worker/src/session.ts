export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000

export interface SessionPayload {
  exp: number
  iat: number
  nonce: string
}

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const padLen = (4 - (padded.length % 4)) % 4
  return atob(padded + '='.repeat(padLen))
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function createSessionToken(secret: string, now = Date.now()): Promise<string> {
  const payload: SessionPayload = {
    iat: now,
    exp: now + SESSION_MAX_AGE_MS,
    nonce: crypto.randomUUID(),
  }
  const encoded = toBase64Url(JSON.stringify(payload))
  const signature = await hmacSha256Hex(secret, encoded)
  return `${encoded}.${signature}`
}

export async function verifySessionToken(
  token: string,
  secret: string,
  now = Date.now(),
): Promise<SessionPayload | null> {
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = await hmacSha256Hex(secret, encoded)
  if (signature.length !== expected.length) return null

  let mismatch = 0
  for (let i = 0; i < signature.length; i += 1) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  if (mismatch !== 0) return null

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload
    if (!payload.exp || !payload.iat || !payload.nonce) return null
    if (now > payload.exp) return null
    if (now < payload.iat - 60_000) return null
    return payload
  } catch {
    return null
  }
}

export interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  hostname?: string
}

export async function verifyTurnstileToken(
  token: string,
  secret: string,
  remoteIp?: string,
): Promise<TurnstileVerifyResponse> {
  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (remoteIp) body.set('remoteip', remoteIp)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    return { success: false, 'error-codes': ['internal-error'] }
  }

  return (await response.json()) as TurnstileVerifyResponse
}
