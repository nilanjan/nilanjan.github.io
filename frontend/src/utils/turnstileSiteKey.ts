export const PROD_TURNSTILE_SITE_KEY = '0x4AAAAAADWaE0y00QJjck_o'

/** Normalize Turnstile site key and fix common GitHub Secret typo (OO vs 00). */
export function normalizeTurnstileSiteKey(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return ''
  const corrected = trimmed.replace('yOOQ', 'y00Q')
  if (corrected === PROD_TURNSTILE_SITE_KEY) return PROD_TURNSTILE_SITE_KEY
  return corrected
}
