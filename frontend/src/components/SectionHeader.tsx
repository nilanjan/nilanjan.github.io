import { motion } from 'framer-motion'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  className?: string
  align?: 'center' | 'left'
}

const SectionHeader = ({
  eyebrow,
  title,
  highlight,
  description,
  className = '',
  align = 'center',
}: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    viewport={{ once: true, margin: '-10%' }}
    className={`mb-6 md:mb-8 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
  >
    {eyebrow && (
      <p className={`section-marker ${align === 'center' ? 'justify-center' : ''}`}>{eyebrow}</p>
    )}
    <h2
      className="text-3xl sm:text-4xl md:text-[2.75rem] font-semibold tracking-tight leading-[1.08] mb-3"
      style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}
    >
      {title}
      {highlight && (
        <>
          <br className="hidden sm:block" />
          <span style={{ color: 'var(--text-muted)' }}>{highlight}</span>
        </>
      )}
    </h2>
    {description && (
      <p
        className={`text-base md:text-lg leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}
        style={{ color: 'var(--text-muted)' }}
      >
        {description}
      </p>
    )}
  </motion.div>
)

export default SectionHeader
