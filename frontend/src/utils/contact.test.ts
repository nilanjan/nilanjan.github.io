import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  canSendContactMessage,
  resetContactEmailCache,
  resolveContactEmail,
  submitContactMessage,
} from './contact'

vi.mock('./humanAccess', () => ({
  canAccessProtectedContent: vi.fn(),
  getServerSessionToken: vi.fn(),
}))

vi.mock('./botDetection', () => ({
  hasAutomationSignals: vi.fn(),
}))

vi.mock('./verifyApi', () => ({
  isVerifyApiConfigured: vi.fn(),
  fetchProtectedContactEmail: vi.fn(),
  sendContactMessage: vi.fn(),
}))

import { canAccessProtectedContent, getServerSessionToken } from './humanAccess'
import { hasAutomationSignals } from './botDetection'
import { fetchProtectedContactEmail, isVerifyApiConfigured, sendContactMessage } from './verifyApi'

describe('contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetContactEmailCache()
    vi.mocked(canAccessProtectedContent).mockReturnValue(false)
    vi.mocked(getServerSessionToken).mockReturnValue(null)
    vi.mocked(hasAutomationSignals).mockReturnValue(false)
    vi.mocked(isVerifyApiConfigured).mockReturnValue(true)
    vi.mocked(fetchProtectedContactEmail).mockResolvedValue('protected@example.com')
    vi.mocked(sendContactMessage).mockResolvedValue(true)
  })

  it('does not fetch email without human verification', async () => {
    expect(await resolveContactEmail()).toBeNull()
    expect(fetchProtectedContactEmail).not.toHaveBeenCalled()
  })

  it('fetches email from the worker after verification', async () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    vi.mocked(getServerSessionToken).mockReturnValue('session-token')

    await expect(resolveContactEmail()).resolves.toBe('protected@example.com')
    expect(fetchProtectedContactEmail).toHaveBeenCalledWith('session-token')
  })

  it('blocks contact when automation is detected', async () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    vi.mocked(hasAutomationSignals).mockReturnValue(true)
    expect(await resolveContactEmail()).toBeNull()
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
    await expect(submitContactMessage(message)).resolves.toBe(true)
    expect(sendContactMessage).toHaveBeenCalledWith('session-token', message)
  })

  it('does not send when verification is missing', async () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(false)
    await expect(
      submitContactMessage({ name: 'Ada', email: 'ada@example.com', message: 'hi' }),
    ).resolves.toBe(false)
    expect(sendContactMessage).not.toHaveBeenCalled()
  })
})
