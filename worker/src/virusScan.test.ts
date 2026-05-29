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

    await expect(scanAttachment('vt-key', 'a.pdf', new TextEncoder().encode('hello'))).resolves.toEqual(
      { status: 'clean' },
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

    await expect(scanAttachment('vt-key', 'a.pdf', new TextEncoder().encode('hello'))).resolves.toEqual(
      { status: 'malicious' },
    )
  })

  it('returns vt-error when VT cannot complete upload', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('not found', { status: 404 })) // hash unknown
      .mockResolvedValueOnce(new Response('upload failed', { status: 500 })) // upload fails
    vi.stubGlobal('fetch', fetchMock)

    await expect(scanAttachment('vt-key', 'a.pdf', new TextEncoder().encode('hello'))).resolves.toEqual(
      { status: 'vt-error' },
    )
  })

  it('returns vt-auth-failed for bad API key responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('unauthorized', { status: 401 })))
    await expect(scanAttachment('bad-key', 'a.pdf', new TextEncoder().encode('hello'))).resolves.toEqual(
      { status: 'vt-auth-failed' },
    )
  })

  it('returns vt-rate-limited when VirusTotal throttles requests', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('too many', { status: 429 })))
    await expect(scanAttachment('vt-key', 'a.pdf', new TextEncoder().encode('hello'))).resolves.toEqual(
      { status: 'vt-rate-limited' },
    )
  })
})
