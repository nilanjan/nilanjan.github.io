import { motion } from 'framer-motion'
import { Cpu, Brain, Microscope, Layers } from 'lucide-react'
import SectionHeader from './SectionHeader'

const cards = [
  {
    icon: Cpu,
    title: 'Throughput Compute',
    tier: 'primary' as const,
    span: 'md:col-span-2',
    bullets: [
      'Shader/SIMT-style cores, barriers, and parallel pipelines',
      'Multi-pass scheduling — architectural primitives shared with AI tensor engines',
      'Massive parallelism and execution unit organization',
    ],
  },
  {
    icon: Brain,
    title: 'Accelerator Co-Design',
    tier: 'primary' as const,
    span: '',
    bullets: [
      'Datapath and memory hierarchy for throughput workloads',
      'Super-resolution and disocclusion in hardware pipelines',
      'Optical and neural engine integration with graphics',
    ],
  },
  {
    icon: Microscope,
    title: 'Architecture Exploration',
    tier: 'primary' as const,
    span: '',
    bullets: [
      'Workload trace capture and benchmark-driven PPA',
      'GEM5, Sparta MAP, and industrial simulators',
      'RTL correlation and full-system triage',
    ],
  },
  {
    icon: Layers,
    title: 'Mobile and Immersive Graphics',
    tier: 'supplementary' as const,
    span: 'md:col-span-2',
    bullets: [
      'Mobile GPU architecture (TBDR, power-constrained SoCs)',
      'AR/VR compositor and occlusion pipelines',
      'Neural rendering (3D splatting) on device — where architecture meets real silicon',
    ],
  },
]

const ArchitectureFocusSection = () => (
  <section id="architecture" className="section">
    <div className="section-inner">
      <SectionHeader
        eyebrow="Architecture Focus"
        title="Building Accelerators"
        description="Throughput processor design, accelerator co-design, and architecture exploration — with product experience in mobile GPU and AR/VR rendering."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className={`card card-pad ${card.span}`}
            style={
              card.tier === 'supplementary'
                ? { borderStyle: 'dashed' }
                : undefined
            }
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--accent-subtle)' }}
              >
                <card.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                {card.tier === 'supplementary' && (
                  <span className="eyebrow text-[10px]">Application Domains</span>
                )}
                <h3 className="font-semibold">{card.title}</h3>
              </div>
            </div>
            <ul className="space-y-2">
              {card.bullets.map((b) => (
                <li key={b} className="text-sm flex gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>·</span>
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default ArchitectureFocusSection
