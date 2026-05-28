import { describe, expect, it } from 'vitest'
import {
  normalizeTurnstileSiteKey,
  PROD_TURNSTILE_SITE_KEY,
  resolveProductionSiteKey,
} from './turnstileSiteKey'

describe('turnstileSiteKey', () => {
  it('corrects OO typo to the production site key', () => {
    expect(normalizeTurnstileSiteKey('0x4AAAAAADWaE0yOOQJjck_o')).toBe(PROD_TURNSTILE_SITE_KEY)
  })

  it('always resolves production builds to the registered key', () => {
    expect(resolveProductionSiteKey('0x4AAAAAADWaE0yOOQJjck_o')).toBe(PROD_TURNSTILE_SITE_KEY)
    expect(resolveProductionSiteKey('')).toBe(PROD_TURNSTILE_SITE_KEY)
  })
})
