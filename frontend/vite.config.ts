import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { normalizeTurnstileSiteKey, PROD_TURNSTILE_SITE_KEY } from './src/utils/turnstileSiteKey'

const TURNSTILE_SITE_KEY_PLACEHOLDER = '__TURNSTILE_SITE_KEY__'

function injectChallengeSiteKey(): Plugin {
  return {
    name: 'inject-challenge-site-key',
    closeBundle() {
      const siteKey =
        normalizeTurnstileSiteKey(process.env.VITE_TURNSTILE_SITE_KEY) ||
        (process.env.NODE_ENV === 'production' ? PROD_TURNSTILE_SITE_KEY : '')
      const challengePath = path.resolve(__dirname, 'dist/challenge.html')
      if (!fs.existsSync(challengePath)) return

      let html = fs.readFileSync(challengePath, 'utf8')
      if (!siteKey) {
        if (html.includes(TURNSTILE_SITE_KEY_PLACEHOLDER)) {
          console.warn(
            '[inject-challenge-site-key] VITE_TURNSTILE_SITE_KEY is unset; challenge.html will not work in production.',
          )
        }
        return
      }

      html = html.split(TURNSTILE_SITE_KEY_PLACEHOLDER).join(siteKey)
      fs.writeFileSync(challengePath, html)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), injectChallengeSiteKey()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
