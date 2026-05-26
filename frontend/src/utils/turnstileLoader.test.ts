import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ensureTurnstileApi,
  getLastTurnstileLoadError,
  resetTurnstileLoaderForTests,
} from './turnstileLoader'

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

  it('reports script-loaded-no-api when script finished but window.turnstile is missing', async () => {
    vi.useFakeTimers()

    const script = document.createElement('script')
    script.id = 'cf-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.dataset.ready = '1'
    Object.defineProperty(script, 'readyState', { value: 'complete' })
    document.head.appendChild(script)

    const promise = ensureTurnstileApi()
    const assertion = expect(promise).rejects.toThrow('script-loaded-no-api')
    await vi.advanceTimersByTimeAsync(91_000)
    await assertion
    expect(getLastTurnstileLoadError()).toBe('script-loaded-no-api')

    vi.useRealTimers()
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
