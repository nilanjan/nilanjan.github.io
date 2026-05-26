/** Known automated crawler / AI agent user-agent substrings. */
export const BLOCKED_USER_AGENT_PATTERNS = [
  'bot',
  'crawler',
  'spider',
  'scraper',
  'headless',
  'gptbot',
  'chatgpt-user',
  'claudebot',
  'claude-web',
  'anthropic',
  'perplexitybot',
  'bytespider',
  'amazonbot',
  'cohere-ai',
  'diffbot',
  'facebookexternalhit',
  'meta-externalagent',
  'google-extended',
  'applebot-extended',
  'omgili',
  'youbot',
  'scrapy',
  'curl/',
  'wget/',
  'python-requests',
  'httpclient',
  'libwww',
  'go-http-client',
  'java/',
  'phantomjs',
  'selenium',
  'playwright',
  'puppeteer',
] as const

export type AutomationSignal =
  | 'webdriver'
  | 'playwright'
  | 'puppeteer'
  | 'selenium'
  | 'phantom'
  | 'headless-chrome'
  | 'blocked-user-agent'
  | 'no-pointer-support'

type WindowWithAutomation = Window &
  Partial<{
    __playwright: unknown
    __puppeteer: unknown
    _Selenium_IDE_Recorder: unknown
    callPhantom: unknown
    domAutomation: unknown
    domAutomationController: unknown
  }>

/** Hard automation signals — immediate block. */
export function detectHardAutomationSignals(): AutomationSignal[] {
  const signals: AutomationSignal[] = []
  const win = window as WindowWithAutomation

  if (navigator.webdriver) signals.push('webdriver')
  if (win.__playwright) signals.push('playwright')
  if (win.__puppeteer) signals.push('puppeteer')
  if (win._Selenium_IDE_Recorder || win.domAutomation || win.domAutomationController) {
    signals.push('selenium')
  }
  if (win.callPhantom) signals.push('phantom')

  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('headlesschrome')) signals.push('headless-chrome')

  if (BLOCKED_USER_AGENT_PATTERNS.some((pattern) => ua.includes(pattern))) {
    signals.push('blocked-user-agent')
  }

  return signals
}

/** Pure helper for unit tests — match user agent against blocked patterns. */
export function isBlockedUserAgent(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return BLOCKED_USER_AGENT_PATTERNS.some((pattern) => ua.includes(pattern))
}

export function hasAutomationSignals(): boolean {
  return detectHardAutomationSignals().length > 0
}
