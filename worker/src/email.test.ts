import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendContactEmail, validateSubmission } from './email'

describe('validateSubmission', () => {
  it('accepts a well-formed submission and trims fields', () => {
    expect(
      validateSubmission({ name: '  Ada  ', email: ' ada@example.com ', message: ' hi ' }),
    ).toEqual({ name: 'Ada', email: 'ada@example.com', message: 'hi' })
  })

  it('rejects missing or non-string fields', () => {
    expect(validateSubmission(null)).toBeNull()
    expect(validateSubmission({ name: 'Ada', email: 'ada@example.com' })).toBeNull()
    expect(validateSubmission({ name: 1, email: 'a@b.co', message: 'x' })).toBeNull()
  })

  it('rejects blank name/message and invalid email', () => {
    expect(validateSubmission({ name: '   ', email: 'a@b.co', message: 'hi' })).toBeNull()
    expect(validateSubmission({ name: 'Ada', email: 'a@b.co', message: '   ' })).toBeNull()
    expect(validateSubmission({ name: 'Ada', email: 'not-an-email', message: 'hi' })).toBeNull()
  })

  it('rejects oversized fields', () => {
    expect(
      validateSubmission({ name: 'Ada', email: 'a@b.co', message: 'm'.repeat(5001) }),
    ).toBeNull()
  })
})

describe('sendContactEmail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const env = {
    RESEND_API_KEY: 'test-key',
    CONTACT_EMAIL: 'owner@example.com',
    CONTACT_FROM: 'onboarding@resend.dev',
  }
  const submission = { name: 'Ada', email: 'ada@example.com', message: 'hello' }

  it('posts to Resend with reply-to set to the visitor and returns true on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(sendContactEmail(env, submission)).resolves.toBe(true)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect((init as RequestInit).method).toBe('POST')
    const body = JSON.parse((init as RequestInit).body as string)
    expect(body.to).toEqual(['owner@example.com'])
    expect(body.reply_to).toBe('ada@example.com')
    expect(body.from).toContain('onboarding@resend.dev')
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer test-key',
    })
  })

  it('returns false when Resend responds with an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 422 })))
    await expect(sendContactEmail(env, submission)).resolves.toBe(false)
  })

  it('falls back to the default sender when CONTACT_FROM is unset', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await sendContactEmail({ RESEND_API_KEY: 'k', CONTACT_EMAIL: 'owner@example.com' }, submission)

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
    expect(body.from).toContain('onboarding@resend.dev')
  })
})
