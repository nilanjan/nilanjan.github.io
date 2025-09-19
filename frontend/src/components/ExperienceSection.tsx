import { motion } from 'framer-motion'
import { Building, Calendar, MapPin, Award } from 'lucide-react'

const ExperienceSection = () => {
  const experiences = [
    {
      id: "qualcomm",
      company: "Qualcomm Technologies Inc.",
      position: "Principal Graphics Architect",
      location: "Santa Clara, CA",
      duration: "February 2023 - Present",
      description: "Leading graphics XR research team for Adreno GPUs with focus on cross-layer XR-specific architecture.",
      achievements: [
        "Research framework for cross-layer XR-specific use-case study",
        "Architecting foveation, shader core, etc. architecture for Adreno GPUs",
        "XR system and GPU interaction research for LLC optimization, display support, power optimization",
        "Compositor system optimization (HW/SW) for various product lines for different customers",
        "Architecting Augmented Reality GPU architecture evaluation framework (composition and beyond)"
      ],
      technologies: ["C++", "Vulkan", "OpenGL", "XR Architecture", "Adreno GPU", "Hardware Design"]
    },
    {
      id: "meta",
      company: "Meta Platforms Inc.",
      position: "Graphics Architect",
      location: "Sunnyvale, CA",
      duration: "May 2020 - January 2023",
      description: "Lead graphics hardware IP research/development team for Meta Orion AR/VR architecture.",
      achievements: [
        "Architecting static and dynamic occlusion in AR/VR graphics system with dedicated pipelines for 2D, 3D, and other content",
        "Novel 2D rendering hardware architecture for natively distorted space rendering for low-power use cases",
        "Novel compression (fast block-based random access) algorithm for 2D graphics assets",
        "Display driver silicon architecture of several AR/VR devices",
        "Optimized Bounding Volume Hierarchy traversal for distorted space 3D AR/VR graphics hardware pipeline",
        "End-to-end hardware architecture model for ultra-low-power graphics compositor pipeline architecture"
      ],
      technologies: ["AR/VR Architecture", "2D/3D Rendering", "Hardware IP", "BVH Traversal", "Graphics Compression"]
    },
    {
      id: "samsung",
      company: "Samsung Advanced Computing Lab",
      position: "Graphics Architect",
      location: "San Jose, CA",
      duration: "March 2018 - May 2020",
      description: "Mobile GPU architecture exploration and specification for next-generation mobile graphics.",
      achievements: [
        "Reducing off-chip traffic for color/depth caches using optimized rendering order of binned primitives",
        "Hidden surface removal algorithm optimization for latency-sensitive graphics pipeline for multi-pass architecture",
        "Next-generation tiling engine architecture optimization",
        "Vertex Attribute and Varying compression for tile-based deferred rendering architecture",
        "Performance optimization of the interpolator and vertex processing pipeline",
        "Graphics workload exploration using Game Engines and GPU architecture PPA modeling"
      ],
      technologies: ["Mobile GPU", "Tiling Architecture", "HSR Algorithms", "Vertex Processing", "OpenGL ES", "Vulkan"]
    },
    {
      id: "apple",
      company: "Apple Inc.",
      position: "Graphics Architecture Engineer",
      location: "Orlando, FL",
      duration: "September 2013 - January 2018",
      description: "Mobile GPU architecture modeling, exploration, and specification for Apple Silicon GPUs.",
      achievements: [
        "Performance analysis and modeling of A11 Bionic GPU and beyond",
        "Micro-architectural/architectural functional/performance feature exploration",
        "Functional/Performance model versus RTL design correlation analysis",
        "Graphics fragment shader performance analysis",
        "GPU architectural and workload issue debug at full-system (iOS, driver, SOC model) level",
        "Shader Core Level Mutual Exclusion Architecture, Rasterization, and Binning optimization"
      ],
      technologies: ["Apple Silicon", "iOS Graphics", "GPU Modeling", "Fragment Shaders", "Performance Analysis"]
    }
  ]

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A journey through leading technology companies, advancing graphics architecture and mobile GPU development
          </p>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Company Info */}
                <div className="lg:col-span-1">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Building className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {exp.company}
                      </h3>
                      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {exp.position}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {exp.duration}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {exp.location}
                    </div>
                  </div>
                </div>

                {/* Description and Achievements */}
                <div className="lg:col-span-2">
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: (index * 0.1) + (idx * 0.05) }}
                          viewport={{ once: true }}
                          className="flex items-start text-gray-600 dark:text-gray-300"
                        >
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {achievement}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Technologies & Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Career Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Career Impact
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">20+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">16+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Patents</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">20+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Publications</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ExperienceSection
