import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, BookOpen } from 'lucide-react'
import { LOCATION, openContactEmail } from '../utils/contact'

interface FooterProps {
  onOpenPrivacy: () => void
  onOpenCookieSettings: () => void
}

const Footer = ({ onOpenPrivacy, onOpenCookieSettings }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/nilanjan' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/nilanjan-goswami' },
    { name: 'Google Scholar', icon: BookOpen, href: 'https://scholar.google.com/citations?user=-ZvEn44AAAAJ&hl=en' },
  ]

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Experience', href: '#experience' },
    { name: 'Patents', href: '#patents' },
    { name: 'Publications', href: '#publications' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="section-inner py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <h3 className="text-lg font-semibold tracking-tight mb-3" style={{ color: 'var(--text)' }}>Nilanjan Goswami</h3>
            <p className="text-sm leading-relaxed mb-5 max-w-md" style={{ color: 'var(--text-muted)' }}>
              Principal Computer Architect — throughput processors, GPU design, and accelerator
              co-design across mobile and XR programs at Apple, Meta, Samsung, and Qualcomm.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2.5 rounded-xl card hover:scale-105 transition-transform"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
              <button
                type="button"
                onClick={() => openContactEmail()}
                aria-label="Send Email"
                className="p-2.5 rounded-xl card hover:scale-105 transition-transform"
                style={{ color: 'var(--text-muted)' }}
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="font-semibold mb-4 text-sm">Contact</h4>
            <div className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>{LOCATION}</p>
              <button type="button" onClick={() => openContactEmail()} className="btn-ghost !px-0">
                Send Email
              </button>
            </div>
            <div className="mt-6 space-y-2">
              <button type="button" onClick={onOpenPrivacy} className="block text-xs hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                Privacy Policy
              </button>
              <button type="button" onClick={onOpenCookieSettings} className="block text-xs hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                Cookie Settings
              </button>
            </div>
          </motion.div>
        </div>

        <div className="border-t mt-10 pt-6 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <span>© {currentYear} Nilanjan Goswami. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
