import { motion } from 'framer-motion'
import {
  Github,
  Linkedin,
  ArrowRight,
  MapPin,
  Cpu,
  Layers,
  CircuitBoard,
  Gauge,
  Smartphone,
} from 'lucide-react'
import MeshBackground from './MeshBackground'
import { openContactEmail, LOCATION } from '../utils/contact'

const architectureAreas = [
  {
    icon: Cpu,
    title: 'Throughput Processors',
    description: 'SIMT-style cores, parallel pipelines, memory hierarchy, workload-driven microarchitecture.',
  },
  {
    icon: Layers,
    title: 'GPU Architecture',
    description: 'Shader/compute organization, TBDR, multi-pass scheduling, mobile GPU silicon.',
  },
  {
    icon: CircuitBoard,
    title: 'Accelerator Co-Design',
    description: 'Datapath and memory for throughput workloads; hardware–software pipeline integration.',
  },
  {
    icon: Gauge,
    title: 'PPA and Architecture Exploration',
    description: 'GEM5 and industrial simulators, RTL correlation, benchmark-driven power-performance tradeoffs.',
  },
  {
    icon: Smartphone,
    title: 'Mobile and Immersive Graphics',
    description: 'AR/VR compositor pipelines, neural rendering, latency-sensitive device graphics.',
  },
]

const companies = ['Qualcomm', 'Apple', 'Meta', 'Samsung', 'NVIDIA']

const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="top" className="relative overflow-hidden scroll-mt-0">
      <MeshBackground />

      <div className="relative z-10 section-inner w-full pt-8 pb-10 md:pt-10 md:pb-12 lg:pt-12 lg:pb-14">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <span className="hero-badge">Principal Computer Architect</span>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.05]"
                style={{ letterSpacing: '-0.03em' }}
              >
                <span className="block" style={{ color: 'var(--text)' }}>Nilanjan Goswami</span>
                <span className="block mt-2 text-[0.72em] font-normal leading-[1.15]" style={{ color: 'var(--text-muted)' }}>
                  Throughput Processors &amp; Accelerator Architecture
                </span>
              </h1>
            </div>

            <p className="text-base md:text-lg leading-relaxed max-w-lg" style={{ color: 'var(--text-muted)' }}>
              Throughput processor design, GPU microarchitecture, and accelerator co-design across
              production programs at{' '}
              {companies.map((co, i) => (
                <span key={co}>
                  {i > 0 && (i === companies.length - 1 ? ', and ' : ', ')}
                  <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{co}</strong>
                </span>
              ))}.
            </p>

            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <MapPin className="w-4 h-4 shrink-0" />
              {LOCATION}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button type="button" onClick={() => scrollTo('experience')} className="btn-primary">
                Experience <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => scrollTo('publications')} className="btn-secondary">
                Publications
              </button>
              <button type="button" onClick={() => openContactEmail()} className="btn-secondary">
                Contact
              </button>
              {[
                { icon: Github, href: 'https://github.com/nilanjan', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com/in/nilanjan-goswami', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-btn">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-3"
          >
            <p className="eyebrow">Architecture Focus</p>
            <div className="space-y-2">
              {architectureAreas.map((area, index) => (
                <motion.button
                  key={area.title}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  onClick={() => scrollTo('architecture')}
                  className="research-card w-full text-left group"
                >
                  <div className="flex gap-3 items-start">
                    <div className="research-icon shrink-0">
                      <area.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-0.5 group-hover:opacity-80 transition-opacity">
                        {area.title}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {area.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
