import { describe, expect, it } from 'vitest'
import {
  isHumanSessionValid,
  saveHumanSession,
  SESSION_MAX_AGE_MS,
} from './humanAccess'

describe('humanAccess', () => {
  it('accepts a fresh server-backed session', () => {
    const expiresAt = Date.now() + SESSION_MAX_AGE_MS
    saveHumanSession('server-token-abc', expiresAt)
    expect(isHumanSessionValid({
      serverToken: 'server-token-abc',
      verifiedAt: Date.now(),
      expiresAt,
    })).toBe(true)
  })

  it('rejects expired sessions', () => {
    expect(isHumanSessionValid({
      serverToken: 'server-token-abc',
      verifiedAt: Date.now() - SESSION_MAX_AGE_MS,
      expiresAt: Date.now() - 1,
    })).toBe(false)
  })

  it('rejects sessions without a server token', () => {
    expect(isHumanSessionValid({
      serverToken: '',
      verifiedAt: Date.now(),
      expiresAt: Date.now() + SESSION_MAX_AGE_MS,
    })).toBe(false)
  })
})
