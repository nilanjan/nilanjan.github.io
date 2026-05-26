import { describe, expect, it } from 'vitest'
import { isBlockedUserAgent } from './botDetection'

describe('botDetection', () => {
  it('blocks known AI crawler user agents', () => {
    expect(isBlockedUserAgent('Mozilla/5.0 compatible; GPTBot/1.0')).toBe(true)
    expect(isBlockedUserAgent('Mozilla/5.0 compatible; ClaudeBot/1.0')).toBe(true)
    expect(isBlockedUserAgent('Mozilla/5.0 compatible; PerplexityBot/1.0')).toBe(true)
  })

  it('blocks common HTTP client user agents', () => {
    expect(isBlockedUserAgent('curl/8.4.0')).toBe(true)
    expect(isBlockedUserAgent('python-requests/2.31.0')).toBe(true)
  })

  it('allows normal browser user agents', () => {
    expect(
      isBlockedUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      ),
    ).toBe(false)
  })
})
