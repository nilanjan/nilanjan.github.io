export function parseAllowedHostnames(raw: string): string[] {
  return raw
    .split(',')
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedTurnstileHostname(
  hostname: string | undefined,
  allowed: string[],
): boolean {
  if (!hostname) return false
  const normalized = hostname.trim().toLowerCase()
  return allowed.includes(normalized)
}
