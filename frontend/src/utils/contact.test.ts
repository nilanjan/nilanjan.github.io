import { describe, expect, it, beforeEach, vi } from 'vitest'
import { canSendContactMessage, submitContactMessage } from './contact'

vi.mock('./humanAccess', () => ({
  canAccessProtectedContent: vi.fn(),
  getServerSessionToken: vi.fn(),
}))

vi.mock('./botDetection', () => ({
  hasAutomationSignals: vi.fn(),
}))

vi.mock('./verifyApi', () => ({
  isVerifyApiConfigured: vi.fn(),
  sendContactMessage: vi.fn(),
}))

import { canAccessProtectedContent, getServerSessionToken } from './humanAccess'
import { hasAutomationSignals } from './botDetection'
import { isVerifyApiConfigured, sendContactMessage } from './verifyApi'

describe('contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(canAccessProtectedContent).mockReturnValue(false)
    vi.mocked(getServerSessionToken).mockReturnValue(null)
    vi.mocked(hasAutomationSignals).mockReturnValue(false)
    vi.mocked(isVerifyApiConfigured).mockReturnValue(true)
    vi.mocked(sendContactMessage).mockResolvedValue({ ok: true })
  })

  it('blocks contact when automation is detected', () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    vi.mocked(hasAutomationSignals).mockReturnValue(true)
    expect(canSendContactMessage()).toBe(false)
  })

  it('allows contact only for verified humans with verify API configured', () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    expect(canSendContactMessage()).toBe(true)

    vi.mocked(isVerifyApiConfigured).mockReturnValue(false)
    expect(canSendContactMessage()).toBe(false)
  })

  it('sends the message through the worker for verified humans', async () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    vi.mocked(getServerSessionToken).mockReturnValue('session-token')

    const message = { name: 'Ada', email: 'ada@example.com', message: 'hi' }
    await expect(submitContactMessage(message)).resolves.toEqual({ ok: true })
    expect(sendContactMessage).toHaveBeenCalledWith('session-token', message, [])
  })

  it('forwards attachments when provided', async () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    vi.mocked(getServerSessionToken).mockReturnValue('session-token')
    const file = new File(['hello'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const message = { name: 'Ada', email: 'ada@example.com', message: 'hi' }

    await expect(submitContactMessage(message, [file])).resolves.toEqual({ ok: true })
    expect(sendContactMessage).toHaveBeenCalledWith('session-token', message, [file])
  })

  it('does not send when verification is missing', async () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(false)
    await expect(
      submitContactMessage({ name: 'Ada', email: 'ada@example.com', message: 'hi' }),
    ).resolves.toEqual({ ok: false, error: 'verification-required' })
    expect(sendContactMessage).not.toHaveBeenCalled()
  })
})
