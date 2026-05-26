import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ensureTurnstileApi, resetTurnstileLoaderForTests } from './turnstileLoader'

describe('ensureTurnstileApi', () => {
  beforeEach(() => {
    resetTurnstileLoaderForTests()
  })

  afterEach(() => {
    resetTurnstileLoaderForTests()
  })

  it('resolves immediately when turnstile is already on window', async () => {
    window.turnstile = {
      render: vi.fn(),
      reset: vi.fn(),
      remove: vi.fn(),
    }

    await expect(ensureTurnstileApi()).resolves.toBeUndefined()
  })

  it('reuses a single script tag in the document', async () => {
    window.turnstile = {
      render: vi.fn(),
      reset: vi.fn(),
      remove: vi.fn(),
    }

    const script = document.createElement('script')
    script.id = 'cf-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    document.head.appendChild(script)

    await ensureTurnstileApi()

    expect(document.querySelectorAll('#cf-turnstile-script')).toHaveLength(1)
  })
})
