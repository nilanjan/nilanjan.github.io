export const PROD_TURNSTILE_SITE_KEY = '0x4AAAAAADWaE0y00QJjck_o'

/** Normalize Turnstile site key and fix common GitHub Secret typo (OO vs 00). */
export function normalizeTurnstileSiteKey(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return ''
  const corrected = trimmed.replace('yOOQ', 'y00Q')
  if (corrected === PROD_TURNSTILE_SITE_KEY) return PROD_TURNSTILE_SITE_KEY
  return corrected
}

/** Site key used in production builds (always the registered widget key). */
export function resolveProductionSiteKey(raw: string | undefined): string {
  const normalized = normalizeTurnstileSiteKey(raw)
  if (normalized === PROD_TURNSTILE_SITE_KEY) return PROD_TURNSTILE_SITE_KEY
  return PROD_TURNSTILE_SITE_KEY
}
