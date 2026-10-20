import { motion } from 'framer-motion'
import { Building, MapPin, Calendar } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { LOCATION } from '../utils/contact'

const experiences = [
  {
    id: 'qualcomm',
    company: 'Qualcomm Technologies, Inc.',
    position: 'Principal Engineer, AI & GPU Compute Architecture',
    location: `${LOCATION} · Remote`,
    duration: 'February 2023 – Present',
    achievements: [
      'Define next-generation Adreno GPU compute and matrix-path requirements from transformer workloads (LLM inference, ViT super-resolution): roofline by model phase, KV-cache and dequantization analysis on llama.cpp.',
      'Ran PPA sweeps over matrix-unit shape, datatypes, accumulator precision and local-memory sizing to inform architecture decisions.',
      'Invented a neural-rendering method for disocclusion in reprojected frames, treating graphics reconstruction as an AI inference workload on GPU compute (U.S. patent application, 2026).',
      'Built GPUXR-Sim, a cross-layer GPU/system performance-power framework now foundational to Adreno architecture research.',
      'Ultra-low-power GPU compute and memory-system architecture: shader core, LLC interaction, hybrid power delivery. 4 patents filed.',
    ],
    tags: ['LLM Inference', 'ViT Super-Resolution', 'Neural Disocclusion', 'Quantization', 'Matrix Datapaths', 'PPA Modeling', 'GPUXR-Sim'],
  },
  {
    id: 'meta',
    company: 'Meta Platforms, Inc.',
    position: 'GPU Architect',
    location: `${LOCATION} · Remote`,
    duration: 'May 2020 – January 2023',
    achievements: [
      'Processor and accelerator architecture for custom low-power silicon, from algorithm through HW/SW interface.',
      'Defined accelerator architecture for novel 2D/3D processing pipelines, with end-to-end hardware architecture models used for PPA decisions on custom SoCs.',
      'Low-power, high-throughput hardware codec with block-based random access and lossless compression to cut memory bandwidth (3 patents, 1 granted).',
      'Algorithm–hardware co-design: optimized BVH traversal and occlusion processing; algorithm development, modeling and architecture exploration.',
      'Defined software API and driver–hardware interface for custom silicon. 10 patents filed, 4 granted.',
    ],
    tags: ['Accelerator Architecture', 'HW/SW Interface', 'Bandwidth Compression', 'Custom Silicon', 'PPA Modeling'],
  },
  {
    id: 'samsung',
    company: 'Samsung Advanced Computing Lab',
    position: 'GPU Architect',
    location: 'San Jose, CA',
    duration: 'March 2018 – May 2020',
    achievements: [
      'Shader-core and barrier design; multi-pass GPU architecture and hidden-surface removal to eliminate redundant shader work.',
      'Cache-traffic reduction for tile-based deferred rendering: binning, color/depth cache, vertex/varying compression, re-reference-aware tile walk order.',
      'PPA models and benchmark analysis via trace capture to drive architectural feature selection. 4 patents, all granted.',
    ],
    tags: ['Shader Core', 'Cache Traffic', 'PPA Modeling', 'GPU Microarchitecture'],
  },
  {
    id: 'apple',
    company: 'Apple Inc.',
    position: 'GPU Architecture Engineer',
    location: 'Orlando, FL',
    duration: 'September 2013 – January 2018',
    achievements: [
      'Performance analysis and modeling of the A11 Bionic GPU and successors; fragment-shader and rasterization/binning analysis.',
      'Shader-core mutual-exclusion architecture; functional/performance model vs. RTL correlation.',
      'Full-system debug across iOS, driver and SoC; architectural feature exploration for performance and power.',
    ],
    tags: ['Apple Silicon', 'A11 Bionic', 'Performance Modeling', 'RTL Correlation'],
  },
  {
    id: 'uf',
    company: 'University of Florida',
    position: 'Doctoral Researcher, GPGPU & Throughput Architecture',
    location: 'Gainesville, FL',
    duration: 'August 2008 – 2013',
    achievements: [
      'CUDA kernel characterization: microarchitecture-independent methodology (divergence, coalescing, shared-memory and register pressure, occupancy) — IISWC 2010, 2011.',
      'Throughput-core power/performance co-optimization with resistive memory (HPCA 2013) and nanophotonic interconnect for core-to-memory bandwidth (PACT 2012).',
      'Concurrent GPU kernel characterization for resource partitioning (IISWC 2015); GPU software transactional memory (CGO 2014, Best Paper Nominee).',
      'Faster cycle-level GPGPU simulation via representative kernel sampling (SIGMETRICS 2013, IEEE TC 2014).',
    ],
    tags: ['CUDA', 'GPGPU', 'Workload Characterization', 'Simulation Methodology'],
  },
  {
    id: 'nvidia',
    company: 'NVIDIA',
    position: 'Graduate Intern, GPU Architecture',
    location: 'Santa Clara, CA',
    duration: 'May 2012 – August 2012',
    achievements: [
      'Pipeline and throughput analysis of the pre-rasterizer under many-thread parallel execution; soft barrier synchronizing parallel primitive and fragment pipelines.',
      'On-chip network latency and bandwidth modeling for a multi-block parallel SoC.',
    ],
    tags: ['GPU Architecture', 'Parallel Execution', 'NoC Modeling'],
  },
  {
    id: 'ti',
    company: 'Texas Instruments',
    position: 'Graduate Intern, Compilers & DSP',
    location: 'Houston, TX · Germantown, MD',
    duration: 'Summers 2009, 2010',
    achievements: [
      'Built the OpenMP compiler front-end for the multi-core, SIMD-capable C6000 VLIW DSP and integrated it with the runtime.',
      'High-throughput H.264 CABAC decoder on the Tomahawk DSP, tuned for VLIW issue and SIMD execution.',
    ],
    tags: ['OpenMP', 'Compilers', 'VLIW/SIMD'],
  },
  {
    id: 'dsp',
    company: 'Interra Systems · Tata Elxsi',
    position: 'Signal Processing / DSP Engineer',
    location: 'Kolkata · Bangalore, India',
    duration: 'November 2004 – July 2008',
    achievements: [
      'Hand-optimized compute kernels on TI VLIW DSPs: H.264 encoder motion-estimation and transform kernels, de-blocking filter, AAC/SBR decoder paths.',
      'Data-level parallelism, cache-friendly memory layout and multi-threaded frame/slice partitioning.',
    ],
    tags: ['DSP Kernels', 'Data Parallelism', 'Codecs'],
  },
]

const ExperienceSection = () => (
  <section id="experience" className="section">
    <div className="section-inner">
      <SectionHeader
        eyebrow="Career"
        title="Professional Experience"
        description="From hand-tuned DSP kernels to CUDA research to GPU and AI-compute silicon at Apple, Samsung, Meta, and Qualcomm."
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
