import { motion } from 'framer-motion'
import {
  ArrowRight,
  MapPin,
  Brain,
  Binary,
  Cpu,
  Sparkles,
  Gauge,
} from 'lucide-react'
import MeshBackground from './MeshBackground'
import { LOCATION } from '../utils/contact'
import patentsData from '../data/patents.json'
import publicationsData from '../data/publications.json'
import type { PatentsData, PublicationsData } from '../data/types'

const { granted, pending, published } = patentsData as PatentsData
const patentCount = granted.length + pending.length + published.length
const citations = (publicationsData as PublicationsData).scholarStats.citations

const focusAreas = [
  {
    icon: Brain,
    title: 'AI Workload → Architecture',
    description: 'Transformer inference decomposed by phase — prefill vs. decode, attention vs. FFN, KV-cache residency — into compute, memory and bandwidth requirements.',
  },
  {
    icon: Binary,
    title: 'Numerics & Quantization',
    description: 'INT8/INT4, FP8 and MXFP microscaling; PTQ/QAT; accumulator width, rounding and the datapath cost of each scaling scheme.',
  },
  {
    icon: Cpu,
    title: 'Compute & Memory Architecture',
    description: 'SIMT/SIMD cores, matrix/dot-product datapaths, local-memory sizing, compression and bandwidth-per-TOP.',
  },
  {
    icon: Sparkles,
    title: 'On-Device Vision Inference',
    description: 'ViT super-resolution and neural disocclusion as on-device AI workloads on GPU compute, sharing silicon with graphics.',
  },
  {
    icon: Gauge,
    title: 'Performance & PPA Modeling',
    description: 'GPU performance analysis and profiling; roofline and analytical models, cycle-level simulation, design-space sweeps and model-vs-RTL correlation.',
  },
]

const companies = ['Qualcomm', 'Meta', 'Samsung', 'Apple']

const stats = [
  { value: '13+', label: 'Years defining silicon' },
  { value: String(patentCount), label: `U.S. patent filings · ${granted.length} granted` },
  { value: `${citations}+`, label: 'Citations' },
]

const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="top" className="relative overflow-hidden scroll-mt-0">
      <MeshBackground />

      <div className="relative z-10 section-inner w-full pt-8 pb-10 md:pt-10 md:pb-12 lg:pt-12 lg:pb-14">
        <div className="grid md:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8 xl:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <span className="hero-badge">Principal Computer Architect · Ph.D.</span>
              <h1
                className="text-[1.75rem] leading-[1.08] xs:text-3xl sm:text-4xl md:text-5xl xl:text-[3.25rem] font-semibold tracking-tight"
                style={{ letterSpacing: '-0.03em' }}
              >
                <span className="block" style={{ color: 'var(--text)' }}>Nilanjan Goswami</span>
                <span className="block mt-2 text-[0.72em] font-normal leading-[1.15]" style={{ color: 'var(--text-muted)' }}>
                  Algorithm–Architecture Co-Design for Accelerators and GPU Compute
                </span>
              </h1>
            </div>

            <p className="text-base md:text-lg leading-relaxed max-w-lg" style={{ color: 'var(--text-muted)' }}>
              Translating AI algorithms and numerics into compute-architecture definitions. 13+ years
              defining GPU and throughput-compute silicon at{' '}
              {companies.map((co, i) => (
                <span key={co}>
                  {i > 0 && (i === companies.length - 1 ? ', and ' : ', ')}
                  <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{co}</strong>
                </span>
              ))}
              , built on a Ph.D. in CUDA/GPGPU kernel–hardware co-optimization.
            </p>

            <dl className="grid grid-cols-3 gap-3 max-w-md">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border px-3 py-2.5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-xl font-semibold font-mono" style={{ color: 'var(--text)' }}>{s.value}</dd>
                  <dd className="text-[11px] leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <MapPin className="w-4 h-4 shrink-0" />
              {LOCATION}
            </div>

            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 pt-1">
              <button type="button" onClick={() => scrollTo('architecture')} className="btn-primary w-full xs:w-auto">
                AI Focus <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => scrollTo('experience')} className="btn-secondary w-full xs:w-auto">
                Experience
              </button>
              <button type="button" onClick={() => scrollTo('contact')} className="btn-secondary w-full xs:w-auto">
                Contact
              </button>
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
              {focusAreas.map((area, index) => (
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
