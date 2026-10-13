import { motion } from 'framer-motion'
import { Brain, Cpu, Microscope, Code, Wrench, Settings } from 'lucide-react'
import SectionHeader from './SectionHeader'

const skillCategories = [
  {
    name: 'AI Workloads and Numerics',
    icon: Brain,
    skills: ['Transformer Inference (Prefill/Decode)', 'KV-Cache Analysis', 'Attention / FFN / MoE', 'INT8/INT4', 'FP8', 'MXFP8/MXFP4', 'PTQ: GPTQ, AWQ, SmoothQuant', 'QAT', 'Operator Fusion'],
  },
  {
    name: 'Compute Architecture',
    icon: Cpu,
    skills: ['Matrix/Dot-Product Datapaths', 'SIMT/SIMD Cores', 'VLIW and Vector Pipelines', 'ISA Tradeoffs', 'Memory Hierarchy', 'On-Chip Interconnect', 'Power Delivery'],
  },
  {
    name: 'Performance and PPA Modeling',
    icon: Microscope,
    skills: ['Roofline Analysis', 'Analytical Models', 'Cycle-Level Simulation', 'GEM5', 'Sparta MAP', 'CACTI', 'RTL Correlation'],
  },
  {
    name: 'ML and Parallel Software',
    icon: Code,
    skills: ['PyTorch', 'llama.cpp', 'CUDA', 'OpenMP', 'Pthreads'],
  },
  {
    name: 'Programming',
    icon: Wrench,
    skills: ['C++', 'C', 'Python', 'Rust', 'SystemC', 'Git'],
  },
  {
    name: 'Silicon Delivery',
    icon: Settings,
    skills: ['Architecture Specifications', 'Verification Reviews', 'Bring-up and Silicon Debug', 'HW/SW/Research Alignment', 'Patent Portfolio'],
  },
]

const SkillsSection = () => (
  <section id="skills" className="section">
    <div className="section-inner">
      <SectionHeader
        eyebrow="Capabilities"
        title="Technical Skills"
        description="AI workload analysis, numerics, compute architecture and performance modeling — carried through to silicon."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {skillCategories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="card card-pad"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-subtle)' }}>
                <cat.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="font-semibold text-sm leading-snug">{cat.name}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs"
                  style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-muted)' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default SkillsSection
