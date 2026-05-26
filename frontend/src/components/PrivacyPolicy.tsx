import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { LOCATION } from '../utils/contact'

interface PrivacyPolicyProps {
  onClose: () => void
}

const PrivacyPolicy = ({ onClose }: PrivacyPolicyProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 md:p-8"
    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    onClick={onClose}
  >
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-3xl w-full p-8 my-8 relative"
      onClick={(e) => e.stopPropagation()}
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg"
        aria-label="Close privacy policy"
        style={{ color: 'var(--text-muted)' }}
      >
        <X className="w-5 h-5" />
      </button>

      <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Last updated: May 25, 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>1. Data Controller</h2>
          <p>
            Nilanjan Goswami, {LOCATION}. Contact via the &quot;Send Email&quot; link on this website.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>2. What Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Human verification session</strong> — a short-lived browser session flag after you confirm manual access (session storage; cleared when the tab closes).</li>
            <li><strong>Theme preference</strong> — stored in local storage if you accept cookies (optional).</li>
            <li><strong>Contact form</strong> — name, email, and message are sent via your email client; no data is stored on a server.</li>
            <li><strong>Server logs</strong> — GitHub Pages may log IP addresses and request metadata (see GitHub&apos;s privacy policy).</li>
          </ul>
          <p className="mt-2">We do not use analytics, advertising, or tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>3. Legal Basis (GDPR)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Legitimate interest</strong> — displaying this portfolio website.</li>
            <li><strong>Consent</strong> — storing theme preference in local storage; processing contact form data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>4. Cookies & Local Storage</h2>
          <p>
            If you accept, we store your theme choice (light/dark/system) in browser local storage.
            If you reject, your theme applies for the current session only. You can change your choice
            via &quot;Cookie Settings&quot; in the footer.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>5. Third-Party Links</h2>
          <p>
            Links to GitHub, LinkedIn, Google Scholar, and publication DOIs may set their own cookies
            when visited. We are not responsible for third-party privacy practices.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>6. Your Rights</h2>
          <p>
            Under GDPR you have the right to access, rectify, erase, restrict, port, and object to
            processing of your personal data. To exercise these rights, use the Send Email link on
            this site. You may also lodge a complaint with your local supervisory authority.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>7. Data Retention</h2>
          <p>
            Contact form data is not retained on our servers. Theme preference persists in your browser
            until you clear it or reject cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>8. Changes</h2>
          <p>We may update this policy. The &quot;Last updated&quot; date will reflect any changes.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>9. Automated Access</h2>
          <p>
            This website is intended for manual human browsing only. Automated crawlers, scrapers,
            AI training agents, and similar bots are not authorized to collect or reproduce personal
            or professional information from this site. Technical measures include human verification,
            bot detection, crawler blocking (robots.txt), and no-AI-training directives.
          </p>
        </section>
      </div>
    </motion.article>
  </motion.div>
)

export default PrivacyPolicy
