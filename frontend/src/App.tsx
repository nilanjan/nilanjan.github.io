import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ArchitectureFocusSection from './components/ArchitectureFocusSection'
import ExperienceSection from './components/ExperienceSection'
import PatentsSection from './components/PatentsSection'
import PublicationsSection from './components/PublicationsSection'
import SkillsSection from './components/SkillsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import ScrollProgress from './components/ScrollProgress'
import ScrollIndex from './components/ScrollIndex'
import CookieConsent from './components/CookieConsent'
import PrivacyPolicy from './components/PrivacyPolicy'
import { reopenCookieConsent } from './components/CookieConsent'
import { useHumanAccess } from './context/HumanAccessContext'
import { applyProtectedSeoMeta, removeProtectedSeoMeta } from './utils/seo'

const navItems = [
  { id: 'top', label: 'Home', index: '00' },
  { id: 'about', label: 'About', index: '01' },
  { id: 'architecture', label: 'Architecture', index: '02' },
  { id: 'experience', label: 'Experience', index: '03' },
  { id: 'patents', label: 'Patents', index: '04' },
  { id: 'publications', label: 'Publications', index: '05' },
  { id: 'skills', label: 'Skills', index: '06' },
  { id: 'contact', label: 'Contact', index: '07' },
]

const indexItems = navItems

function App() {
  const { verified } = useHumanAccess()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (verified) {
      applyProtectedSeoMeta()
      return
    }
    removeProtectedSeoMeta()
  }, [verified])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <ScrollProgress />

      <header className={`site-header transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="header-inner">
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="header-brand"
          >
            Nilanjan Goswami
          </button>

          <div className="header-actions">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="header-icon-btn lg:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.75} /> : <Menu className="w-5 h-5" strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="mobile-nav-sheet overflow-hidden"
            >
              <nav aria-label="Sections">
                {navItems.map(({ id, label, index }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className="mobile-nav-item"
                    data-active={activeSection === id}
                  >
                    <span className="mobile-nav-num">{index}</span>
                    {label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ScrollIndex items={indexItems} activeId={activeSection} onSelect={scrollToSection} />

      <main className="page-content pt-[var(--nav-height)]">
        <HeroSection />
        <AboutSection />
        <ArchitectureFocusSection />
        <ExperienceSection />
        <PatentsSection />
        <PublicationsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <Footer
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenCookieSettings={reopenCookieConsent}
      />

      <CookieConsent onOpenPrivacy={() => setShowPrivacy(true)} />

      <AnimatePresence>
        {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>
    </div>
  )
}

export default App
