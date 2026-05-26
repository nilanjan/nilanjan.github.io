import { describe, expect, it, beforeEach, vi } from 'vitest'
import { canSendContactMessage, getContactEmail } from './contact'

vi.mock('./humanAccess', () => ({
  canAccessProtectedContent: vi.fn(),
}))

vi.mock('./botDetection', () => ({
  hasAutomationSignals: vi.fn(),
}))

import { canAccessProtectedContent } from './humanAccess'
import { hasAutomationSignals } from './botDetection'

describe('contact', () => {
  beforeEach(() => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(false)
    vi.mocked(hasAutomationSignals).mockReturnValue(false)
  })

  it('does not expose email without human verification', () => {
    expect(getContactEmail()).toBeNull()
  })

  it('assembles zx1q@tuta.io after human verification', () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    expect(getContactEmail()).toBe('zx1q@tuta.io')
  })

  it('blocks contact when automation is detected', () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    vi.mocked(hasAutomationSignals).mockReturnValue(true)
    expect(getContactEmail()).toBeNull()
    expect(canSendContactMessage()).toBe(false)
  })

  it('allows contact only for verified humans', () => {
    vi.mocked(canAccessProtectedContent).mockReturnValue(true)
    expect(canSendContactMessage()).toBe(true)
  })
})
