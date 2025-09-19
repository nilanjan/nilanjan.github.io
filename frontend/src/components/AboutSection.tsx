import { motion } from 'framer-motion'
import { Award, GraduationCap, Briefcase } from 'lucide-react'

const AboutSection = () => {
  const stats = [
    { label: 'Years Experience', value: '20+' },
    { label: 'Research Papers', value: '20+' },
    { label: 'Patents', value: '16+' },
    { label: 'Companies', value: '4' },
  ]

  const expertise = [
    'AR/VR Graphics Pipeline',
    'XR Graphics HW Architecture',
    'Neural Rendering & 3D Gaussian Splatting',
    'Hardware-Accelerated Composition',
    'System-on-Chip GPU Optimization',
    'Tile-based Graphics Rendering',
    'Mobile GPU Architecture',
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A Principal Graphics Architect specializing in XR graphics, neural rendering, and system-level GPU optimization
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                I'm a <strong>Principal Graphics Architect</strong> at <strong>Qualcomm Technologies Inc.</strong>, 
                based in Santa Clara, CA, where I specialize in designing and optimizing graphics architectures for 
                cutting-edge extended reality (XR) applications. My work focuses on hardware-accelerated XR composition—covering 
                real-time layer blending, distortion correction, and latency-sensitive rendering for immersive virtual 
                and augmented reality experiences.
              </p>
              
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                I actively explore neural rendering techniques, including <strong>3D Gaussian Splatting–based neural composition</strong>, 
                to push the boundaries of scene reconstruction and dynamic view synthesis on mobile platforms. These innovations 
                enable high-fidelity visuals while meeting strict power and performance constraints.
              </p>

              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                My expertise also extends to <strong>system-level GPU optimization</strong> within system-on-chip (SoC) environments. 
                Through architectural co-design and cross-subsystem tuning, I've contributed to significant performance-per-watt 
                improvements across CPU, memory, and display pipelines—driving scalable, energy-efficient graphics solutions 
                for next-generation devices.
              </p>

              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                I hold a <strong>Ph.D. in Computer Architecture</strong> from the University of Florida, where my 
                research focused on deep learning, immersive computing, and real-time graphics systems. My work has been 
                published in leading conferences and journals, reflecting a commitment to advancing the intersection of 
                graphics, machine learning, and systems design.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Current Role */}
            <div className="card p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Principal Graphics Architect</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">Qualcomm Technologies Inc.</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Santa Clara, CA • 2023 - Present</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="card p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Ph.D. Computer Architecture</h3>
                  <p className="text-green-600 dark:text-green-400 font-medium">University of Florida</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Department of Electrical and Computer Engineering</p>
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="card p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Areas of Expertise</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {expertise.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection 