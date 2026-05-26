import { describe, expect, it, vi } from 'vitest'
import { getChallengePageUrl } from './verifyApi'

describe('verifyApi', () => {
  it('challenge URL is same-origin with cache-busting version', () => {
    vi.stubGlobal('window', { location: { origin: 'https://nilanjan.github.io' } })
    expect(getChallengePageUrl()).toBe('/challenge.html?v=20260526c')
    vi.unstubAllGlobals()
  })
})
