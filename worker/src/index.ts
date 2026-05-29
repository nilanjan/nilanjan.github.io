import {
  bytesToBase64,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  validateAttachmentBytes,
  type ValidatedAttachment,
} from './attachments'
import { handleChallenge } from './challenge'
import { sendContactEmail, validateSubmission, type EmailAttachment } from './email'
import {
  createSessionToken,
  verifySessionToken,
  verifyTurnstileToken,
} from './session'
import { isAllowedTurnstileHostname, parseAllowedHostnames } from './turnstileHostname'
import { scanAttachment } from './virusScan'

export interface Env {
  TURNSTILE_SECRET: string
  SESSION_SECRET: string
  CONTACT_EMAIL: string
  ALLOWED_ORIGINS: string
  ALLOWED_TURNSTILE_HOSTNAMES: string
  TURNSTILE_SITE_KEY: string
  RESEND_API_KEY: string
  CONTACT_FROM?: string
  VIRUSTOTAL_API_KEY?: string
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

interface ParsedContact {
  payload: unknown
  files: UploadFile[]
}

interface UploadFile {
  name: string
  arrayBuffer: () => Promise<ArrayBuffer>
}

function isUploadFile(entry: unknown): entry is UploadFile {
  if (!entry || typeof entry !== 'object') return false
  const candidate = entry as Record<string, unknown>
  return typeof candidate.name === 'string' && typeof candidate.arrayBuffer === 'function'
}

async function parseContactRequest(request: Request): Promise<ParsedContact | null> {
  const contentType = request.headers.get('Content-Type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData()
    const files: UploadFile[] = []
    const entries = form.getAll('attachments') as unknown[]
    for (const entry of entries) {
      if (isUploadFile(entry)) files.push(entry)
    }
    return {
      payload: {
        name: form.get('name'),
        email: form.get('email'),
        message: form.get('message'),
      },
      files,
    }
  }

  return { payload: await request.json(), files: [] }
}

/**
 * Validate, then virus-scan, every uploaded file. Fail-closed: any unscannable
 * or flagged file rejects the whole submission.
 */
async function buildScannedAttachments(
  env: Env,
  files: UploadFile[],
): Promise<{ ok: true; attachments: EmailAttachment[] } | { ok: false; error: string; status: number }> {
  if (files.length === 0) return { ok: true, attachments: [] }

  if (!env.VIRUSTOTAL_API_KEY) {
    return { ok: false, error: 'attachments-unavailable', status: 503 }
  }
  if (files.length > MAX_FILES) {
    return { ok: false, error: 'too-many-attachments', status: 400 }
  }

  const validated: ValidatedAttachment[] = []
  let totalBytes = 0

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer())
    totalBytes += bytes.length
    if (totalBytes > MAX_TOTAL_BYTES) {
      return { ok: false, error: 'attachment-too-large', status: 400 }
    }

    const result = validateAttachmentBytes(file.name, bytes)
    if (!result.ok) {
      return { ok: false, error: result.error, status: 400 }
    }
    validated.push(result.value)
  }

  const attachments: EmailAttachment[] = []
  for (const item of validated) {
    const scan = await scanAttachment(env.VIRUSTOTAL_API_KEY, item.filename, item.bytes)
    if (scan.status === 'malicious') {
      return { ok: false, error: 'attachment-infected', status: 422 }
    }
    if (scan.status === 'vt-auth-failed') {
      return { ok: false, error: 'attachment-scan-auth-failed', status: 503 }
    }
    if (scan.status === 'vt-rate-limited') {
      return { ok: false, error: 'attachment-scan-rate-limited', status: 503 }
    }
    if (scan.status === 'vt-timeout') {
      return { ok: false, error: 'attachment-scan-timeout', status: 503 }
    }
    if (scan.status === 'vt-error') {
      return { ok: false, error: 'attachment-unverified', status: 503 }
    }
    attachments.push({ filename: item.filename, content: bytesToBase64(item.bytes) })
  }

  return { ok: true, attachments }
}

async function handleContactSend(
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

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    return jsonResponse({ ok: false, error: 'contact-unavailable' }, 503, origin, allowed)
  }

  let parsed: ParsedContact
  try {
    const result = await parseContactRequest(request)
    if (!result) {
      return jsonResponse({ ok: false, error: 'invalid-json' }, 400, origin, allowed)
    }
    parsed = result
  } catch {
    return jsonResponse({ ok: false, error: 'invalid-json' }, 400, origin, allowed)
  }

  const submission = validateSubmission(parsed.payload)
  if (!submission) {
    return jsonResponse({ ok: false, error: 'invalid-submission' }, 400, origin, allowed)
  }

  const scanned = await buildScannedAttachments(env, parsed.files)
  if (!scanned.ok) {
    return jsonResponse({ ok: false, error: scanned.error }, scanned.status, origin, allowed)
  }

  const sent = await sendContactEmail(env, submission, scanned.attachments)
  if (!sent) {
    return jsonResponse({ ok: false, error: 'send-failed' }, 502, origin, allowed)
  }

  return jsonResponse({ ok: true }, 200, origin, allowed)
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

    if (path === '/api/contact' && request.method === 'POST') {
      return handleContactSend(request, env, origin, allowed)
    }

    return jsonResponse({ ok: false, error: 'not-found' }, 404, origin, allowed)
  },
}
