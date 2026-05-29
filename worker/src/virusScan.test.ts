import { afterEach, describe, expect, it, vi } from 'vitest'
import { scanAttachment } from './virusScan'

describe('scanAttachment', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns clean when hash lookup is already clean', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: { attributes: { last_analysis_stats: { malicious: 0, suspicious: 0 } } },
          }),
          { status: 200 },
        ),
      ),
    )

    await expect(scanAttachment('vt-key', 'a.pdf', new TextEncoder().encode('hello'))).resolves.toBe(
      'clean',
    )
  })

  it('returns malicious when lookup reports detections', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: { attributes: { last_analysis_stats: { malicious: 1, suspicious: 0 } } },
          }),
          { status: 200 },
        ),
      ),
    )

    await expect(scanAttachment('vt-key', 'a.pdf', new TextEncoder().encode('hello'))).resolves.toBe(
      'malicious',
    )
  })

  it('returns unverified when VT cannot complete scan', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('not found', { status: 404 })) // hash unknown
      .mockResolvedValueOnce(new Response('upload failed', { status: 500 })) // upload fails
    vi.stubGlobal('fetch', fetchMock)

    await expect(scanAttachment('vt-key', 'a.pdf', new TextEncoder().encode('hello'))).resolves.toBe(
      'unverified',
    )
  })
})
