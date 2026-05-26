import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { readStorage, writeStorage, removeStorage } from '../utils/storage'

const CONSENT_KEY = 'cookie-consent'

type ConsentValue = 'accepted' | 'rejected' | null

interface CookieConsentProps {
  onOpenPrivacy: () => void
}

const CookieConsent = ({ onOpenPrivacy }: CookieConsentProps) => {
  const [visible, setVisible] = useState(false)
  const { setCanPersist } = useTheme()

  useEffect(() => {
    const stored = readStorage(CONSENT_KEY) as ConsentValue
    if (stored === 'accepted') {
      setCanPersist(true)
      return
    }
    if (stored === 'rejected') {
      setCanPersist(false)
      return
    }
    setVisible(true)
  }, [setCanPersist])

  const handleAccept = () => {
    writeStorage(CONSENT_KEY, 'accepted')
    setCanPersist(true)
    setVisible(false)
  }

  const handleReject = () => {
    writeStorage(CONSENT_KEY, 'rejected')
    setCanPersist(false)
    removeStorage('theme')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6 safe-x"
          style={{ paddingBottom: 'max(1rem, var(--safe-bottom))' }}
          role="dialog"
          aria-label="Cookie consent"
        >
          <div
            className="max-w-3xl mx-auto card card-pad shadow-2xl"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <h3 className="font-semibold mb-2">Privacy & Cookies</h3>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              This site uses local storage only to remember your theme preference. No analytics or
              tracking cookies are used. See our{' '}
              <button type="button" onClick={onOpenPrivacy} className="btn-ghost !p-0 !inline underline">
                Privacy Policy
              </button>{' '}
              for details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={handleReject} className="btn-secondary flex-1">
                Reject
              </button>
              <button type="button" onClick={handleAccept} className="btn-primary flex-1">
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function reopenCookieConsent() {
  removeStorage(CONSENT_KEY)
  window.location.reload()
}

export default CookieConsent
