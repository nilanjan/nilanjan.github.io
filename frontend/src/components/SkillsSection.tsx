import { motion } from 'framer-motion'
import { Cpu, Microscope, Code, Wrench, Layers, Settings } from 'lucide-react'
import SectionHeader from './SectionHeader'

const skillCategories = [
  {
    name: 'Computer Architecture and Accelerators',
    icon: Cpu,
    skills: ['GPU/Compute Microarchitecture', 'Accelerator Datapath and Memory', 'Throughput Cores', 'Processor-Accelerator Interfaces', 'PPA Optimization'],
  },
  {
    name: 'Architecture Modeling and Simulation',
    icon: Microscope,
    skills: ['GEM5', 'Sparta MAP', 'CACTI', 'In-House Simulators', 'RTL Correlation', 'Workload Characterization'],
  },
  {
    name: 'Parallel Compute and Workloads',
    icon: Code,
    skills: ['PyTorch', 'CUDA', 'OpenMP', 'Parallel DSP Pipelines', 'Neural Rendering'],
  },
  {
    name: 'Programming',
    icon: Wrench,
    skills: ['C++', 'C', 'Rust', 'Python', 'SystemC', 'Perl'],
  },
  {
    name: 'Architecture Delivery',
    icon: Settings,
    skills: ['Specification Writing', 'Verification', 'Cross-Functional Leadership', 'Patent Portfolio'],
  },
  {
    name: 'Mobile Graphics and XR',
    icon: Layers,
    supplementary: true,
    skills: ['TBDR', 'Mobile GPU Architecture', 'AR/VR Rendering', 'Hardware-Accelerated Composition', 'Vulkan/Metal'],
  },
]

const learningTags = [
  'AI Computer Architecture',
  'Memory-Compute Disaggregation',
  'Inference/Training Throughput Processors',
  'Heterogeneous SoC Integration',
  'Mobile and Immersive Compute',
]

const SkillsSection = () => (
  <section id="skills" className="section section-alt">
    <div className="section-inner">
      <SectionHeader
        eyebrow="Capabilities"
        title="Technical Skills"
        description="Architecture, modeling, and delivery skills across throughput processors — with supplementary depth in mobile graphics and XR."
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
            className="card p-5"
            style={cat.supplementary ? { borderStyle: 'dashed' } : undefined}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card p-8 text-center"
      >
        <h3 className="font-semibold mb-3">Always Learning</h3>
        <p className="text-sm mb-5 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Applying architecture principles to next-generation AI compute — scaling, memory bandwidth,
          and heterogeneous SoC integration across mobile and immersive platforms.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {learningTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
)

export default SkillsSection
