export type ScanVerdict = 'clean' | 'malicious' | 'unverified'

interface AnalysisStats {
  malicious?: number
  suspicious?: number
}

const VT_BASE = 'https://www.virustotal.com/api/v3'
const MAX_POLLS = 5
const POLL_DELAY_MS = 2000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function verdictFromStats(stats: AnalysisStats | undefined): ScanVerdict {
  if (!stats) return 'unverified'
  const flagged = (stats.malicious ?? 0) + (stats.suspicious ?? 0)
  return flagged > 0 ? 'malicious' : 'clean'
}

async function lookupByHash(apiKey: string, hash: string): Promise<ScanVerdict | null> {
  const response = await fetch(`${VT_BASE}/files/${hash}`, {
    headers: { 'x-apikey': apiKey },
  })
  if (response.status === 404) return null // unknown to VirusTotal
  if (!response.ok) return 'unverified'

  const data = (await response.json()) as {
    data?: { attributes?: { last_analysis_stats?: AnalysisStats } }
  }
  return verdictFromStats(data.data?.attributes?.last_analysis_stats)
}

async function uploadForAnalysis(
  apiKey: string,
  filename: string,
  bytes: Uint8Array,
): Promise<string | null> {
  const form = new FormData()
  form.append('file', new Blob([bytes]), filename)

  const response = await fetch(`${VT_BASE}/files`, {
    method: 'POST',
    headers: { 'x-apikey': apiKey },
    body: form,
  })
  if (!response.ok) return null

  const data = (await response.json()) as { data?: { id?: string } }
  return data.data?.id ?? null
}

async function pollAnalysis(apiKey: string, analysisId: string): Promise<ScanVerdict> {
  for (let attempt = 0; attempt < MAX_POLLS; attempt += 1) {
    await delay(POLL_DELAY_MS)
    const response = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
      headers: { 'x-apikey': apiKey },
    })
    if (!response.ok) continue

    const data = (await response.json()) as {
      data?: { attributes?: { status?: string; stats?: AnalysisStats } }
    }
    const attrs = data.data?.attributes
    if (attrs?.status === 'completed') {
      return verdictFromStats(attrs.stats)
    }
  }
  return 'unverified'
}

/**
 * Scan a file with VirusTotal. Fail-closed: any error or inability to complete
 * a scan returns 'unverified' so the caller can reject the upload.
 */
export async function scanAttachment(
  apiKey: string,
  filename: string,
  bytes: Uint8Array,
): Promise<ScanVerdict> {
  try {
    const hash = await sha256Hex(bytes)

    const known = await lookupByHash(apiKey, hash)
    if (known !== null) return known

    const analysisId = await uploadForAnalysis(apiKey, filename, bytes)
    if (!analysisId) return 'unverified'

    return await pollAnalysis(apiKey, analysisId)
  } catch {
    return 'unverified'
  }
}
