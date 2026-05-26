import { motion } from 'framer-motion'
import { GraduationCap, Award, Users, FlaskConical, Cpu } from 'lucide-react'
import SectionHeader from './SectionHeader'

const pillars = [
  {
    icon: Users,
    label: 'Architecture Leadership',
    detail: 'Cross-functional programs spanning architects, design, verification, and software',
  },
  {
    icon: FlaskConical,
    label: 'Architecture Exploration',
    detail: 'PPA modeling, workload characterization, and pathfinding for throughput systems',
  },
  {
    icon: Cpu,
    label: 'Production Silicon',
    detail: 'Specification through RTL correlation at Apple, Samsung, Meta, and Qualcomm',
  },
]

const education = [
  {
    degree: 'Ph.D., Computer Architecture',
    school: 'University of Florida',
    year: '2013',
    focus: 'Power-Performance Co-Optimization of Throughput Architectures',
  },
  {
    degree: 'M.S., Computer Architecture',
    school: 'University of Florida',
    year: '',
    focus: '',
  },
  {
    degree: 'B.Tech, Electronics & Computer Engineering',
    school: 'University of Kalyani, India',
    year: '',
    focus: '',
  },
]

const primaryExpertise = [
  'Accelerator Datapath and Memory',
  'GPU/Throughput Microarchitecture',
  'PPA Modeling and Simulation',
  'Processor-Accelerator Co-Design',
  'Architecture Specification and Verification',
  'Cross-Functional Technical Leadership',
]

const supplementaryExpertise = [
  'Mobile GPU Architecture',
  'AR/VR and XR Composition',
  'Neural Rendering Pipelines',
]

const AboutSection = () => (
  <section id="about" className="section">
    <div className="section-inner">
      <SectionHeader
        eyebrow="About"
        title="Computer Architect and Technical Leader"
        description="Throughput processors, accelerators, and GPU architecture — from exploration through production silicon."
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
              Architecture and technical leadership across GPU and accelerator programs for more than two
              decades — spanning microarchitecture, PPA exploration, and delivery of production silicon at
              Apple, Samsung, Meta, and Qualcomm.
            </p>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm leading-[1.75]" style={{ color: 'var(--text-muted)' }}>
              <p>
                Technical direction is set across architecture teams with continued hands-on work in
                specification, simulation, and correlation to RTL. Programs have moved from early
                exploration into shipped products across mobile SoCs, XR platforms, and graphics IP.
              </p>
              <p>
                Scope includes accelerator datapath and memory hierarchy, throughput processor organization,
                and workload-driven design validated through GEM5, industrial simulators, and silicon
                measurement. Work has covered super-resolution and disocclusion, hybrid GPU power delivery,
                compositor architecture, and system-level optimization under mobile and XR power budgets.
              </p>
            </div>

            <p className="mt-5 pt-5 text-sm leading-[1.75] border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              Doctoral work at the University of Florida established PPA methods still applied in GPU and
              accelerator design. That foundation sits alongside peer-reviewed publications and granted U.S.
              patents — part of a long arc of architecture work, not the headline.
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
