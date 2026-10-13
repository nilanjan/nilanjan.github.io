import { motion } from 'framer-motion'
import { Brain, Binary, Cpu, Sparkles, Gauge } from 'lucide-react'
import SectionHeader from './SectionHeader'

const cards = [
  {
    icon: Brain,
    title: 'LLM Inference Architecture',
    span: 'md:col-span-2',
    bullets: [
      'Roofline by model phase: compute-bound prefill vs. bandwidth-bound decode',
      'KV-cache footprint, residency and dequantization cost — analyzed on llama.cpp',
      'Attention vs. FFN decomposition; MoE gather/scatter traffic',
      'Deriving matrix-unit shape, local-memory capacity and bandwidth-per-TOP from use cases',
    ],
  },
  {
    icon: Binary,
    title: 'Numerics & Quantization',
    span: '',
    bullets: [
      'INT8/INT4, FP16/BF16, FP8, OCP MXFP8/MXFP4 (E2M1 elements, shared E8M0 scale)',
      'Per-tensor/channel/group scaling and its datapath cost',
      'PTQ and QAT: accuracy vs. datapath-cost tradeoffs',
    ],
  },
  {
    icon: Cpu,
    title: 'Compute Datapaths',
    span: '',
    bullets: [
      'PPA sweeps over matrix-unit shape, datatypes and accumulator precision',
      'SIMT/SIMD organization, issue, scheduling, barriers',
      'ISA and instruction-shape tradeoffs: programmability vs. efficiency',
    ],
  },
  {
    icon: Sparkles,
    title: 'Neural Rendering as AI Workload',
    span: 'md:col-span-2',
    bullets: [
      'ViT-based super-resolution mapped to GPU compute and matrix-path requirements',
      'Super-resolution and neural disocclusion inside the rendering/composition pipeline',
      'Graphics and AI inference sharing the same shader cores, LLC and power budget',
    ],
  },
  {
    icon: Gauge,
    title: 'Modeling, Memory & PPA',
    span: 'md:col-span-2',
    bullets: [
      'First-principles analytical models backed by cycle-level simulation (GEM5, Sparta MAP, in-house)',
      'Multi-level memory hierarchy, SRAM sizing, random-access compression for bandwidth reduction',
      'GPUXR-Sim: cross-layer GPU/system performance-power framework built at Qualcomm',
    ],
  },
]

const ArchitectureFocusSection = () => (
  <section id="architecture" className="section">
    <div className="section-inner">
      <SectionHeader
        eyebrow="AI Systems Focus"
        title="From AI Workload to Silicon Definition"
        description="Deriving instruction-set, compute, memory and interconnect requirements from AI workloads — and backing every PPA tradeoff with analytical and cycle-level models."
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
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: 'var(--accent-subtle)' }}>
                <card.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="font-semibold">{card.title}</h3>
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
