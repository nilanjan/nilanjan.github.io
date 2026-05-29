export const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB per file
export const MAX_FILES = 3
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024 // 10 MB across all files

export interface SniffResult {
  /** Canonical content type to send to Resend. */
  contentType: string
  /** Human label used in error messages. */
  label: string
}

export interface ValidatedAttachment {
  filename: string
  contentType: string
  bytes: Uint8Array
}

export type AttachmentError =
  | 'too-many-attachments'
  | 'attachment-too-large'
  | 'attachment-empty'
  | 'attachment-type'
  | 'attachment-macro'

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false
  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[offset + i] !== signature[i]) return false
  }
  return true
}

function asciiAt(bytes: Uint8Array, offset: number, text: string): boolean {
  if (bytes.length < offset + text.length) return false
  for (let i = 0; i < text.length; i += 1) {
    if (bytes[offset + i] !== text.charCodeAt(i)) return false
  }
  return true
}

/** Find an ASCII needle within the first `limit` bytes (ZIP stores entry names in cleartext). */
function containsAscii(bytes: Uint8Array, needle: string, limit = bytes.length): boolean {
  const end = Math.min(bytes.length, limit)
  const first = needle.charCodeAt(0)
  for (let i = 0; i <= end - needle.length; i += 1) {
    if (bytes[i] !== first) continue
    let matched = true
    for (let j = 1; j < needle.length; j += 1) {
      if (bytes[i + j] !== needle.charCodeAt(j)) {
        matched = false
        break
      }
    }
    if (matched) return true
  }
  return false
}

const ZIP_LOCAL_HEADER = [0x50, 0x4b, 0x03, 0x04]

/**
 * Determine the true file type from its content (not the declared name).
 * Returns null for anything outside the allowlist. For Office Open XML it also
 * rejects macro-enabled containers.
 */
export function sniffAttachmentType(bytes: Uint8Array): SniffResult | { macro: true } | null {
  // PNG
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { contentType: 'image/png', label: 'PNG image' }
  }
  // JPEG
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { contentType: 'image/jpeg', label: 'JPEG image' }
  }
  // GIF
  if (asciiAt(bytes, 0, 'GIF87a') || asciiAt(bytes, 0, 'GIF89a')) {
    return { contentType: 'image/gif', label: 'GIF image' }
  }
  // WEBP: "RIFF"...."WEBP"
  if (asciiAt(bytes, 0, 'RIFF') && asciiAt(bytes, 8, 'WEBP')) {
    return { contentType: 'image/webp', label: 'WebP image' }
  }
  // PDF
  if (asciiAt(bytes, 0, '%PDF-')) {
    return { contentType: 'application/pdf', label: 'PDF document' }
  }
  // DOCX (Office Open XML) — a ZIP container. Distinguish a real Word doc and
  // reject macro-enabled variants. ZIP stores entry names in cleartext, so we
  // can detect a VBA project without decompressing.
  if (startsWith(bytes, ZIP_LOCAL_HEADER)) {
    const isWord = containsAscii(bytes, 'word/document.xml')
    if (!isWord) return null
    const hasMacro =
      containsAscii(bytes, 'vbaProject.bin') || containsAscii(bytes, 'word/vbaData.xml')
    if (hasMacro) return { macro: true }
    return {
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      label: 'Word document',
    }
  }
  return null
}

/** Validate a single decoded file. Returns the normalized attachment or an error code. */
export function validateAttachmentBytes(
  filename: string,
  bytes: Uint8Array,
): { ok: true; value: ValidatedAttachment } | { ok: false; error: AttachmentError } {
  if (bytes.length === 0) return { ok: false, error: 'attachment-empty' }
  if (bytes.length > MAX_FILE_BYTES) return { ok: false, error: 'attachment-too-large' }

  const sniff = sniffAttachmentType(bytes)
  if (sniff === null) return { ok: false, error: 'attachment-type' }
  if ('macro' in sniff) return { ok: false, error: 'attachment-macro' }

  return {
    ok: true,
    value: { filename: sanitizeFilename(filename), contentType: sniff.contentType, bytes },
  }
}

/** Encode bytes to base64 (chunked to avoid call-stack limits on large inputs). */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

/** Strip path components and control chars from a client-supplied filename. */
export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'attachment'
  const cleaned = base.replace(/[\u0000-\u001f<>:"|?*]/g, '').trim()
  return cleaned.slice(0, 200) || 'attachment'
}
