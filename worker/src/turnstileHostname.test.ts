import { describe, expect, it } from 'vitest'
import { isAllowedTurnstileHostname, parseAllowedHostnames } from './turnstileHostname'

describe('turnstileHostname', () => {
  it('parses comma-separated hostnames', () => {
    expect(parseAllowedHostnames('nilanjan.github.io, localhost')).toEqual([
      'nilanjan.github.io',
      'localhost',
    ])
  })

  it('allows listed hostnames case-insensitively', () => {
    const allowed = parseAllowedHostnames('nilanjan.github.io,localhost')
    expect(isAllowedTurnstileHostname('Nilanjan.GitHub.io', allowed)).toBe(true)
    expect(isAllowedTurnstileHostname('evil.example', allowed)).toBe(false)
  })

  it('rejects missing hostname', () => {
    expect(isAllowedTurnstileHostname(undefined, ['nilanjan.github.io'])).toBe(false)
  })
})
