import { describe, expect, it } from 'vitest'
import {
  createHumanSession,
  isHumanSessionValid,
  MIN_POINTER_MOVES,
  SESSION_MAX_AGE_MS,
} from './humanAccess'

describe('humanAccess', () => {
  it('accepts a fresh session with enough pointer movement', () => {
    const session = createHumanSession(MIN_POINTER_MOVES)
    expect(isHumanSessionValid(session)).toBe(true)
  })

  it('rejects sessions with insufficient pointer movement', () => {
    const session = createHumanSession(MIN_POINTER_MOVES - 1)
    expect(isHumanSessionValid(session)).toBe(false)
  })

  it('rejects expired sessions', () => {
    const session = createHumanSession(MIN_POINTER_MOVES)
    session.verifiedAt = Date.now() - SESSION_MAX_AGE_MS - 1
    expect(isHumanSessionValid(session)).toBe(false)
  })
})
