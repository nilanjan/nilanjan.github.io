import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import type { ContactMessage } from '../../../shared/types'
import SectionHeader from './SectionHeader'
import { canSendContactMessage, LOCATION, submitContactMessage } from '../utils/contact'
import { useHumanAccess } from '../context/HumanAccessContext'

const MAX_FILES = 3
const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const ContactSection = () => {
  const { verified } = useHumanAccess()
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState<ContactMessage>({ name: '', email: '', message: '' })
  const [honeypot, setHoneypot] = useState('')
  const [consent, setConsent] = useState(false)
  const [humanConfirmed, setHumanConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentError, setAttachmentError] = useState('')

  const canSubmit = verified && consent && humanConfirmed && canSendContactMessage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    setAttachmentError('')

    if (selected.length > MAX_FILES) {
      setAttachments([])
      setAttachmentError(`You can attach up to ${MAX_FILES} files.`)
      return
    }

    const totalBytes = selected.reduce((sum, file) => sum + file.size, 0)
    if (totalBytes > MAX_TOTAL_BYTES) {
      setAttachments([])
      setAttachmentError('Total attachment size must be 10 MB or less.')
      return
    }

    for (const file of selected) {
      if (!ALLOWED_TYPES.has(file.type)) {
        setAttachments([])
        setAttachmentError('Allowed files: PNG/JPG/GIF/WebP, PDF, and DOCX only.')
        return
      }
      if (file.size === 0 || file.size > MAX_FILE_BYTES) {
        setAttachments([])
        setAttachmentError('Each file must be between 1 byte and 5 MB.')
        return
      }
    }

    setAttachments(selected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || honeypot || attachmentError) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      if (!canSendContactMessage()) {
        setSubmitStatus('error')
        setSubmitMessage('Complete human verification first, then try again.')
        return
      }

      const sent = await submitContactMessage(formData, attachments)
      if (!sent) {
        setSubmitStatus('error')
        setSubmitMessage('Could not send your message. Please try again in a moment.')
        return
      }
      setSubmitStatus('success')
      setSubmitMessage('Thanks — your message has been sent. I’ll get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setAttachments([])
      if (formRef.current) formRef.current.reset()
      setConsent(false)
      setHumanConfirmed(false)
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('Could not send your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section" data-nosnippet translate="no">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Contact"
          title="Get in Touch"
          description="For architecture discussions, selective collaborations, or speaking inquiries."
        />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card card-pad"
          >
            <h3 className="font-semibold mb-6">Send a Message</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
              />
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="input-field" placeholder="your.email@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={5} className="input-field resize-none" placeholder="Your message..." />
              </div>
              <div>
                <label htmlFor="attachments" className="block text-sm font-medium mb-2">Attachments (optional)</label>
                <input
                  id="attachments"
                  name="attachments"
                  type="file"
                  multiple
                  onChange={handleAttachmentChange}
                  accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.docx"
                  className="input-field"
                />
                <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Up to 3 files, 5 MB each, 10 MB total. Allowed: images, PDF, DOCX. Files are virus-scanned.
                </p>
                {attachmentError && (
                  <p className="mt-2 text-xs text-red-700 dark:text-red-300">{attachmentError}</p>
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={humanConfirmed}
                  onChange={(e) => setHumanConfirmed(e.target.checked)}
                  className="mt-1 rounded"
                  required
                />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  I confirm I am a human sending this message manually — not an automated agent, scraper, or bot.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 rounded"
                  required
                />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  I consent to the processing of my personal data to respond to my inquiry, as described in the Privacy Policy.
                </span>
              </label>

              {submitStatus !== 'idle' && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${submitStatus === 'success' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}>
                  {submitStatus === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {submitMessage}
                </div>
              )}

              <button type="submit" disabled={isSubmitting || !canSubmit} className="w-full btn-primary disabled:opacity-50">
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="card card-pad">
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--accent-subtle)' }}>
                    <MapPin className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Location</p>
                    <p className="font-medium">{LOCATION}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
