import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  canSendContactMessage,
  resetContactEmailCache,
  resolveContactEmail,
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
}))

import { canAccessProtectedContent, getServerSessionToken } from './humanAccess'
import { hasAutomationSignals } from './botDetection'
import { fetchProtectedContactEmail, isVerifyApiConfigured } from './verifyApi'

describe('contact', () => {
  beforeEach(() => {
    resetContactEmailCache()
    vi.mocked(canAccessProtectedContent).mockReturnValue(false)
    vi.mocked(getServerSessionToken).mockReturnValue(null)
    vi.mocked(hasAutomationSignals).mockReturnValue(false)
    vi.mocked(isVerifyApiConfigured).mockReturnValue(true)
    vi.mocked(fetchProtectedContactEmail).mockResolvedValue('protected@example.com')
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
})
