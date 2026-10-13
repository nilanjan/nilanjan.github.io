import { motion } from 'framer-motion'
import { GraduationCap, Award, Brain, FlaskConical, Cpu } from 'lucide-react'
import SectionHeader from './SectionHeader'

const pillars = [
  {
    icon: Brain,
    label: 'Algorithm–Architecture Co-Design',
    detail: 'AI algorithms and numerics translated into ISA, compute, memory and interconnect requirements',
  },
  {
    icon: FlaskConical,
    label: 'First-Principles Modeling',
    detail: 'Latency, throughput, utilization and scaling reasoned analytically, then validated cycle-level',
  },
  {
    icon: Cpu,
    label: 'Production Silicon',
    detail: 'Specification through RTL correlation, verification review and silicon debug at four silicon companies',
  },
]

const education = [
  {
    degree: 'Ph.D., Electrical & Computer Engineering (Computer Architecture)',
    school: 'University of Florida',
    year: '2013',
    focus: 'Thesis: Power-Performance Co-Optimization of Throughput Architecture Using Emerging Technologies',
  },
  {
    degree: 'M.S., Electrical & Computer Engineering (Computer Architecture)',
    school: 'University of Florida',
    year: '2010',
    focus: '',
  },
  {
    degree: 'B.Tech., Electronics & Computer Engineering',
    school: 'University of Kalyani, India',
    year: '2004',
    focus: 'Project at Indian Statistical Institute: self-organizing neural network for the Minimum Spanning Circle problem (shape skeletonization, digit OCR)',
  },
]

const primaryExpertise = [
  'Transformer Inference Workload Analysis',
  'Low-Precision Numerics and Quantization',
  'Matrix and SIMT/SIMD Compute Datapaths',
  'Memory Hierarchy and Bandwidth Reduction',
  'Analytical and Cycle-Level PPA Modeling',
  'Architecture Specification to Silicon',
]

const supplementaryExpertise = [
  'LLM Inference',
  'Neural Rendering',
  'GPU Compute',
  'Low-Power SoCs',
  'VLIW/SIMD DSP Kernels',
]

const AboutSection = () => (
  <section id="about" className="section">
    <div className="section-inner">
      <SectionHeader
        eyebrow="About"
        title="AI Chip Architect — Algorithm to Silicon"
        description="Translating AI algorithms and numerics into compute-architecture definitions, with every tradeoff backed by models."
        className="!mb-7"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="about-panel rounded-2xl overflow-hidden"
      >
        <div className="grid md:grid-cols-12">
          <div
            className="md:col-span-8 p-4 sm:p-6 md:p-8 md:border-r"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="about-lead mb-6">
              Algorithm-to-silicon architect: 13+ years defining GPU and throughput-compute silicon at Apple,
              Samsung, Meta and Qualcomm — now focused on what AI inference demands of the next generation of
              hardware.
            </p>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm leading-[1.75]" style={{ color: 'var(--text-muted)' }}>
              <p>
                At Qualcomm, the work is translating transformer workloads — LLM inference and ViT
                super-resolution — into GPU compute and matrix-path requirements: roofline by model phase,
                KV-cache and dequantization analysis on llama.cpp, and PPA sweeps over matrix-unit shape,
                datatypes, accumulator precision and local memory.
              </p>
              <p>
                The foundation is kernel-level. Early career hand-tuning VLIW/SIMD DSP kernels, an OpenMP
                compiler front-end for TI&apos;s multi-core C6000 DSP, and a Ph.D. in CUDA kernel
                characterization and GPU hardware co-optimization — followed by architecture carried from
                specification through RTL correlation and silicon debug.
              </p>
            </div>

            <p className="mt-5 pt-5 text-sm leading-[1.75] border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              Fluent in low-precision numerics (INT8/INT4, FP8, MXFP microscaling) and PTQ/QAT. 18 U.S. patents
              (granted and filed); publications at HPCA, PACT, SIGMETRICS, CGO (Best Paper Nominee), IISWC
              and IEEE Transactions on Computers.
            </p>
          </div>

          <div className="md:col-span-4 p-4 sm:p-6 md:p-8 space-y-7 border-t md:border-t-0" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <h3 className="text-sm font-semibold">Education</h3>
              </div>
              <div className="space-y-4">
                {education.map(({ degree, school, year, focus }) => (
                  <div key={degree} className="relative pl-4 border-l-2" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
                      {degree}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {school}{year ? ` · ${year}` : ''}
                    </p>
                    {focus && (
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{focus}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <h3 className="text-sm font-semibold">Core Expertise</h3>
              </div>
              <ul className="space-y-2 mb-4">
                {primaryExpertise.map((skill) => (
                  <li key={skill} className="text-xs flex gap-2 leading-snug" style={{ color: 'var(--text-muted)' }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--border)' }} />
                    {skill}
                  </li>
                ))}
              </ul>
              <p className="eyebrow mb-2">Domain Depth</p>
              <div className="flex flex-wrap gap-1.5">
                {supplementaryExpertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--surface)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          {pillars.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="about-pillar">
              <div
                className="shrink-0 p-2.5 rounded-lg h-fit"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">{label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
)

export default AboutSection
