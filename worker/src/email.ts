export interface ContactSubmission {
  name: string
  email: string
  message: string
}

export interface SendEmailEnv {
  RESEND_API_KEY: string
  CONTACT_EMAIL: string
  CONTACT_FROM?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_FROM = 'onboarding@resend.dev'

/** Validate and normalize an untrusted contact payload. Returns null when invalid. */
export function validateSubmission(input: unknown): ContactSubmission | null {
  if (!input || typeof input !== 'object') return null

  const { name, email, message } = input as Record<string, unknown>
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return null
  }

  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const trimmedMessage = message.trim()

  if (!trimmedName || !trimmedMessage) return null
  if (!EMAIL_RE.test(trimmedEmail)) return null
  if (trimmedName.length > 200 || trimmedEmail.length > 320 || trimmedMessage.length > 5000) {
    return null
  }

  return { name: trimmedName, email: trimmedEmail, message: trimmedMessage }
}

/** Send the contact message to the owner via Resend. Reply-To is the visitor so replies go back to them. */
export async function sendContactEmail(
  env: SendEmailEnv,
  submission: ContactSubmission,
): Promise<boolean> {
  const from = env.CONTACT_FROM?.trim() || DEFAULT_FROM

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Portfolio Contact <${from}>`,
      to: [env.CONTACT_EMAIL],
      reply_to: submission.email,
      subject: `Portfolio Contact from ${submission.name}`,
      text: `Name: ${submission.name}\nEmail: ${submission.email}\n\nMessage:\n${submission.message}`,
    }),
  })

  return response.ok
}
