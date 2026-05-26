import { describe, expect, it, vi } from 'vitest'
import { getChallengePageUrl } from './verifyApi'

describe('verifyApi', () => {
  it('challenge URL is same-origin without query parameters', () => {
    vi.stubGlobal('window', { location: { origin: 'https://nilanjan.github.io' } })
    expect(getChallengePageUrl()).toBe('/challenge.html')
    vi.unstubAllGlobals()
  })
})
