import { describe, expect, it } from 'vitest'
import {
  bytesToBase64,
  sanitizeFilename,
  sniffAttachmentType,
  validateAttachmentBytes,
} from './attachments'

describe('attachments', () => {
  it('accepts png/pdf/docx signatures', () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2])
    const pdf = new TextEncoder().encode('%PDF-1.7\n...')
    const docx = new TextEncoder().encode('PK\x03\x04...word/document.xml...')

    expect(sniffAttachmentType(png)).toEqual({ contentType: 'image/png', label: 'PNG image' })
    expect(sniffAttachmentType(pdf)).toEqual({
      contentType: 'application/pdf',
      label: 'PDF document',
    })
    expect(sniffAttachmentType(docx)).toEqual({
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      label: 'Word document',
    })
  })

  it('rejects macro-enabled docx payloads', () => {
    const docmLike = new TextEncoder().encode('PK\x03\x04...word/document.xml...vbaProject.bin...')
    expect(validateAttachmentBytes('resume.docx', docmLike)).toEqual({
      ok: false,
      error: 'attachment-macro',
    })
  })

  it('sanitizes risky filenames and base64-encodes bytes', () => {
    expect(sanitizeFilename('../evil<>name?.pdf')).toBe('evilname.pdf')
    expect(bytesToBase64(new Uint8Array([72, 105]))).toBe('SGk=')
  })
})
