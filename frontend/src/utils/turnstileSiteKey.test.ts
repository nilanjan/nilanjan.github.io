import { describe, expect, it } from 'vitest'
import { normalizeTurnstileSiteKey, PROD_TURNSTILE_SITE_KEY } from './turnstileSiteKey'

describe('turnstileSiteKey', () => {
  it('corrects common Turnstile site key typo', () => {
    expect(normalizeTurnstileSiteKey('0x4AAAAAADWaE0yOOQJjck_o')).toBe(PROD_TURNSTILE_SITE_KEY)
  })
})
