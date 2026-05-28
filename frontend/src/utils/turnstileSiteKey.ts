export const PROD_TURNSTILE_SITE_KEY = '0x4AAAAAADWaE0yOOQJjck_o'

/** Normalize Turnstile site key and undo the common 00-vs-OO typo when a
 * secret is set with zeros instead of the registered letter-O form. */
export function normalizeTurnstileSiteKey(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return ''
  const corrected = trimmed.replace('y00Q', 'yOOQ')
  if (corrected === PROD_TURNSTILE_SITE_KEY) return PROD_TURNSTILE_SITE_KEY
  return corrected
}

/** Site key used in production builds (always the registered widget key). */
export function resolveProductionSiteKey(raw: string | undefined): string {
  const normalized = normalizeTurnstileSiteKey(raw)
  if (normalized === PROD_TURNSTILE_SITE_KEY) return PROD_TURNSTILE_SITE_KEY
  return PROD_TURNSTILE_SITE_KEY
}
