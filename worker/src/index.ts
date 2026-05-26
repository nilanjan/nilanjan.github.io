import { handleChallenge } from './challenge'
import {
  createSessionToken,
  verifySessionToken,
  verifyTurnstileToken,
} from './session'
import { isAllowedTurnstileHostname, parseAllowedHostnames } from './turnstileHostname'

export interface Env {
  TURNSTILE_SECRET: string
  SESSION_SECRET: string
  CONTACT_EMAIL: string
  ALLOWED_ORIGINS: string
  ALLOWED_TURNSTILE_HOSTNAMES: string
  TURNSTILE_SITE_KEY: string
}

interface VerifyRequest {
  token: string
}

function parseAllowedOrigins(raw: string): string[] {
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean)
}

function isAllowedOrigin(origin: string | null, allowed: string[]): boolean {
  if (!origin) return false
  return allowed.includes(origin)
}

function corsHeaders(origin: string | null, allowed: string[]): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  }

  if (origin && isAllowedOrigin(origin, allowed)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
  allowed: string[],
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin, allowed),
    },
  })
}

function readBearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length).trim() || null
}

async function handleVerify(
  request: Request,
  env: Env,
  origin: string | null,
  allowed: string[],
): Promise<Response> {
  let payload: VerifyRequest
  try {
    payload = (await request.json()) as VerifyRequest
  } catch {
    return jsonResponse({ ok: false, error: 'invalid-json' }, 400, origin, allowed)
  }

  if (!payload.token) {
    return jsonResponse({ ok: false, error: 'missing-token' }, 400, origin, allowed)
  }

  const turnstile = await verifyTurnstileToken(
    payload.token,
    env.TURNSTILE_SECRET,
    request.headers.get('CF-Connecting-IP') ?? undefined,
  )

  if (!turnstile.success) {
    return jsonResponse(
      { ok: false, error: 'turnstile-failed', codes: turnstile['error-codes'] ?? [] },
      403,
      origin,
      allowed,
    )
  }

  const allowedHostnames = parseAllowedHostnames(env.ALLOWED_TURNSTILE_HOSTNAMES)
  if (!isAllowedTurnstileHostname(turnstile.hostname, allowedHostnames)) {
    return jsonResponse({ ok: false, error: 'hostname-not-allowed' }, 403, origin, allowed)
  }

  const sessionToken = await createSessionToken(env.SESSION_SECRET)
  const session = await verifySessionToken(sessionToken, env.SESSION_SECRET)
  if (!session) {
    return jsonResponse({ ok: false, error: 'session-issue' }, 500, origin, allowed)
  }

  return jsonResponse(
    { ok: true, sessionToken, expiresAt: session.exp },
    200,
    origin,
    allowed,
  )
}

async function handleSessionCheck(
  request: Request,
  env: Env,
  origin: string | null,
  allowed: string[],
): Promise<Response> {
  const token = readBearerToken(request)
  if (!token) {
    return jsonResponse({ ok: false, error: 'missing-session' }, 401, origin, allowed)
  }

  const session = await verifySessionToken(token, env.SESSION_SECRET)
  if (!session) {
    return jsonResponse({ ok: false, error: 'invalid-session' }, 401, origin, allowed)
  }

  return jsonResponse({ ok: true, expiresAt: session.exp }, 200, origin, allowed)
}

async function handleContact(
  request: Request,
  env: Env,
  origin: string | null,
  allowed: string[],
): Promise<Response> {
  const token = readBearerToken(request)
  if (!token) {
    return jsonResponse({ ok: false, error: 'missing-session' }, 401, origin, allowed)
  }

  const session = await verifySessionToken(token, env.SESSION_SECRET)
  if (!session) {
    return jsonResponse({ ok: false, error: 'invalid-session' }, 401, origin, allowed)
  }

  if (!env.CONTACT_EMAIL) {
    return jsonResponse({ ok: false, error: 'contact-unavailable' }, 503, origin, allowed)
  }

  return jsonResponse({ ok: true, email: env.CONTACT_EMAIL }, 200, origin, allowed)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS)
    const origin = request.headers.get('Origin')
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (path === '/challenge' && request.method === 'GET') {
      return handleChallenge(request, env)
    }

    if (request.method === 'OPTIONS') {
      if (!isAllowedOrigin(origin, allowed)) {
        return new Response(null, { status: 403 })
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin, allowed) })
    }

    if (!isAllowedOrigin(origin, allowed)) {
      return jsonResponse({ ok: false, error: 'origin-not-allowed' }, 403, origin, allowed)
    }

    if (path === '/health' && request.method === 'GET') {
      return jsonResponse({ ok: true }, 200, origin, allowed)
    }

    if (path === '/api/verify' && request.method === 'POST') {
      return handleVerify(request, env, origin, allowed)
    }

    if (path === '/api/session' && request.method === 'GET') {
      return handleSessionCheck(request, env, origin, allowed)
    }

    if (path === '/api/contact' && request.method === 'GET') {
      return handleContact(request, env, origin, allowed)
    }

    return jsonResponse({ ok: false, error: 'not-found' }, 404, origin, allowed)
  },
}
