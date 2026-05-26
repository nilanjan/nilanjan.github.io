/** Brave exposes navigator.brave.isBrave(); shields often block Turnstile after the script downloads. */
export function isBraveBrowser(): boolean {
  const nav = navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } }
  return typeof nav.brave?.isBrave === 'function'
}
