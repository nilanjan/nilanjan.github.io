import { motion } from 'framer-motion'
import { Building, MapPin, Calendar } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { LOCATION } from '../utils/contact'

const experiences = [
  {
    id: 'qualcomm',
    company: 'Qualcomm Technologies, Inc.',
    position: 'Principal GPU Architect',
    location: `${LOCATION} · Remote`,
    duration: 'February 2023 – Present',
    achievements: [
      'GPU/compute architecture; accelerator co-design; PPA exploration for Adreno GPUs.',
      'Ultra-low-power GPU and system architecture: shader core, foveation, compositor; XR system–GPU interaction (LLC, power, display).',
      'Super-resolution and neural disocclusion in rendering/composition pipeline; hybrid GPU power delivery for AR SoCs.',
      'Research framework (GPUXR-Sim) for cross-layer XR use case study; graphics XR architecture for Adreno.',
      'Ultra-low-power GPU architecture and PPA exploration for multi-level memory SoCs.',
    ],
    tags: ['Adreno GPU', 'Accelerator Co-Design', 'AR/VR Pipeline', 'PPA Modeling', 'GPUXR-Sim'],
  },
  {
    id: 'meta',
    company: 'Meta Platforms, Inc.',
    position: 'GPU Architect',
    location: `${LOCATION} · Remote`,
    duration: 'May 2020 – January 2023',
    achievements: [
      'AR/VR processor and accelerator architecture; novel 2D/3D pipelines (Meta Orion).',
      'End-to-end hardware architecture model for ultra-low-power graphics compositor pipeline.',
      'Static and dynamic occlusion with dedicated 2D, 3D, and content pipelines; block-based random access compression.',
      'Optimized BVH traversal for distorted-space 3D pipeline; algorithm development, modeling, and exploration.',
      'Display driver silicon architecture; software API and driver–hardware interface definition.',
      'Multiple patents granted from compositor and display work (blending, partial rendering, display power).',
    ],
    tags: ['Meta Orion', 'AR/VR Pipeline', 'Memory Bandwidth', '2D/3D Hardware Pipelines', 'PPA Modeling'],
  },
  {
    id: 'samsung',
    company: 'Samsung Advanced Computing Lab',
    position: 'GPU Architect',
    location: 'San Jose, CA',
    duration: 'March 2018 – May 2020',
    achievements: [
      'Mobile GPU microarchitecture; PPA modeling and RTL correlation (2 patents granted).',
      'Shader core and barrier design; hidden surface removal and multi-pass GPU architecture.',
      'Tile-based deferred rendering: binning, color/depth cache traffic reduction, vertex/varying compression.',
      'Vertex processing pipeline PPA optimization; graphics workload exploration and benchmark analysis.',
      'Microarchitectural and architectural functional and performance feature exploration.',
    ],
    tags: ['Mobile GPU', 'TBDR', 'PPA Modeling', 'Compute Microarchitecture'],
  },
  {
    id: 'apple',
    company: 'Apple Inc.',
    position: 'GPU Architecture Engineer',
    location: 'Orlando, FL',
    duration: 'September 2013 – January 2018',
    achievements: [
      'Mobile GPU architecture modeling and specification for Apple Silicon.',
      'Performance analysis and modeling of A11 Bionic GPU and beyond; fragment shader and rasterization/binning analysis.',
      'Shader core mutual exclusion architecture; functional/performance model vs. RTL correlation.',
      'Full-system (iOS, driver, SoC) debug and triage; microarchitectural feature exploration for performance and power.',
    ],
    tags: ['Apple Silicon', 'A11 Bionic', 'GPU Modeling', 'Mobile GPU'],
  },
  {
    id: 'nvidia',
    company: 'NVIDIA',
    position: 'Graduate Intern — Graphics Hardware Architecture',
    location: 'Santa Clara, CA',
    duration: 'May 2012 – August 2012',
    achievements: [
      'Graphics hardware architecture modeling and exploration.',
      'Performance optimization of pre-rasterizer block; pipeline and throughput analysis for parallel execution.',
      'Soft barrier design in rasterizer for synchronization across parallel primitive and fragment pipelines.',
      'On-chip network latency and bandwidth modeling for multi-block, highly parallel SoC.',
    ],
    tags: ['GPU Architecture', 'Parallel Compute', 'Performance Modeling'],
  },
]

const ExperienceSection = () => (
  <section id="experience" className="section">
    <div className="section-inner">
      <SectionHeader
        eyebrow="Career"
        title="Professional Experience"
        description="GPU and accelerator architecture across Apple, Meta, Samsung, and Qualcomm — throughput processors, mobile graphics, and XR systems."
      />

      <div className="relative">
        <div
          className="absolute left-4 md:left-8 top-0 bottom-0 w-px hidden sm:block"
          style={{ backgroundColor: 'var(--border)' }}
        />

        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="relative sm:pl-16"
            >
              <div
                className="absolute left-2.5 md:left-6 top-6 w-3 h-3 rounded-full hidden sm:block border-4"
                style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--bg)' }}
              />

              <div className="card card-pad">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex gap-3">
                    <div className="p-2.5 rounded-xl h-fit" style={{ backgroundColor: 'var(--accent-subtle)' }}>
                      <Building className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="font-medium" style={{ color: 'var(--accent)' }}>{exp.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{exp.duration}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{exp.location}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {exp.achievements.map((a) => (
                    <li key={a} className="text-sm flex gap-2" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--accent)' }}>·</span>{a}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono"
                      style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-muted)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default ExperienceSection
