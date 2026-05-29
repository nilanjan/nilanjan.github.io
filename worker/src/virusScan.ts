export type ScanStatus =
  | 'clean'
  | 'malicious'
  | 'vt-auth-failed'
  | 'vt-rate-limited'
  | 'vt-timeout'
  | 'vt-error'

export interface ScanResult {
  status: ScanStatus
}

interface AnalysisStats {
  malicious?: number
  suspicious?: number
}

const VT_BASE = 'https://www.virustotal.com/api/v3'
const MAX_POLLS = 12
const POLL_DELAY_MS = 2000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function statusFromStats(stats: AnalysisStats | undefined): ScanStatus {
  if (!stats) return 'vt-error'
  const flagged = (stats.malicious ?? 0) + (stats.suspicious ?? 0)
  return flagged > 0 ? 'malicious' : 'clean'
}

function statusFromHttp(response: Response): ScanStatus {
  if (response.status === 401 || response.status === 403) return 'vt-auth-failed'
  if (response.status === 429) return 'vt-rate-limited'
  return 'vt-error'
}

async function lookupByHash(
  apiKey: string,
  hash: string,
): Promise<{ kind: 'unknown' } | { kind: 'known'; status: ScanStatus } | { kind: 'error'; status: ScanStatus }> {
  const response = await fetch(`${VT_BASE}/files/${hash}`, {
    headers: { 'x-apikey': apiKey },
  })
  if (response.status === 404) return { kind: 'unknown' } // unknown to VirusTotal
  if (!response.ok) return { kind: 'error', status: statusFromHttp(response) }

  const data = (await response.json()) as {
    data?: { attributes?: { last_analysis_stats?: AnalysisStats } }
  }
  return { kind: 'known', status: statusFromStats(data.data?.attributes?.last_analysis_stats) }
}

async function uploadForAnalysis(
  apiKey: string,
  filename: string,
  bytes: Uint8Array,
): Promise<{ ok: true; analysisId: string } | { ok: false; status: ScanStatus }> {
  const form = new FormData()
  form.append('file', new Blob([bytes]), filename)

  const response = await fetch(`${VT_BASE}/files`, {
    method: 'POST',
    headers: { 'x-apikey': apiKey },
    body: form,
  })
  if (!response.ok) return { ok: false, status: statusFromHttp(response) }

  const data = (await response.json()) as { data?: { id?: string } }
  const analysisId = data.data?.id
  if (!analysisId) return { ok: false, status: 'vt-error' }
  return { ok: true, analysisId }
}

async function pollAnalysis(apiKey: string, analysisId: string): Promise<ScanStatus> {
  let sawTransientError = false
  for (let attempt = 0; attempt < MAX_POLLS; attempt += 1) {
    await delay(POLL_DELAY_MS)
    const response = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
      headers: { 'x-apikey': apiKey },
    })
    if (!response.ok) {
      const status = statusFromHttp(response)
      if (status === 'vt-auth-failed' || status === 'vt-rate-limited') return status
      sawTransientError = true
      continue
    }

    const data = (await response.json()) as {
      data?: { attributes?: { status?: string; stats?: AnalysisStats } }
    }
    const attrs = data.data?.attributes
    if (attrs?.status === 'completed') {
      return statusFromStats(attrs.stats)
    }
  }
  return sawTransientError ? 'vt-error' : 'vt-timeout'
}

/**
 * Scan a file with VirusTotal. Fail-closed: any error or inability to complete
 * a scan returns 'unverified' so the caller can reject the upload.
 */
export async function scanAttachment(
  apiKey: string,
  filename: string,
  bytes: Uint8Array,
): Promise<ScanResult> {
  try {
    const hash = await sha256Hex(bytes)

    const known = await lookupByHash(apiKey, hash)
    if (known.kind === 'error') return { status: known.status }
    if (known.kind === 'known') return { status: known.status }

    const upload = await uploadForAnalysis(apiKey, filename, bytes)
    if (!upload.ok) return { status: upload.status }

    return { status: await pollAnalysis(apiKey, upload.analysisId) }
  } catch {
    return { status: 'vt-error' }
  }
}
