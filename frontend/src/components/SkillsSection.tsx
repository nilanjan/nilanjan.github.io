import { motion } from 'framer-motion'
import { Code, Cpu, Smartphone, Cloud, Database, Settings } from 'lucide-react'

const SkillsSection = () => {
  const skillCategories = [
    {
      name: 'Graphics & Rendering',
      icon: Cpu,
      skills: [
        { name: 'OpenGL/Vulkan', proficiency: 95 },
        { name: 'DirectX', proficiency: 90 },
        { name: 'Metal', proficiency: 85 },
        { name: 'WebGL', proficiency: 80 },
        { name: 'Ray Tracing', proficiency: 85 },
        { name: 'Shader Programming', proficiency: 90 },
      ]
    },
    {
      name: 'Mobile Graphics',
      icon: Smartphone,
      skills: [
        { name: 'Tile-Based Rendering', proficiency: 95 },
        { name: 'Power Optimization', proficiency: 90 },
        { name: 'Mobile GPU Architecture', proficiency: 95 },
        { name: 'AR/VR Graphics', proficiency: 90 },
        { name: 'Performance Profiling', proficiency: 85 },
        { name: 'Memory Management', proficiency: 88 },
      ]
    },
    {
      name: 'Programming Languages',
      icon: Code,
      skills: [
        { name: 'C++', proficiency: 95 },
        { name: 'Rust', proficiency: 85 },
        { name: 'Python', proficiency: 80 },
        { name: 'CUDA', proficiency: 85 },
        { name: 'Assembly', proficiency: 75 },
        { name: 'JavaScript/TypeScript', proficiency: 70 },
      ]
    },
    {
      name: 'Tools & Frameworks',
      icon: Settings,
      skills: [
        { name: 'Git', proficiency: 90 },
        { name: 'CMake', proficiency: 85 },
        { name: 'Docker', proficiency: 75 },
        { name: 'Jenkins', proficiency: 70 },
        { name: 'Perforce', proficiency: 80 },
        { name: 'JIRA', proficiency: 75 },
      ]
    },
    {
      name: 'Research & Analysis',
      icon: Database,
      skills: [
        { name: 'Performance Analysis', proficiency: 90 },
        { name: 'Benchmarking', proficiency: 85 },
        { name: 'Statistical Analysis', proficiency: 80 },
        { name: 'Research Writing', proficiency: 85 },
        { name: 'Patent Writing', proficiency: 75 },
        { name: 'Technical Documentation', proficiency: 90 },
      ]
    },
    {
      name: 'Cloud & Infrastructure',
      icon: Cloud,
      skills: [
        { name: 'AWS', proficiency: 70 },
        { name: 'CI/CD Pipelines', proficiency: 75 },
        { name: 'Microservices', proficiency: 70 },
        { name: 'Kubernetes', proficiency: 65 },
        { name: 'Monitoring & Logging', proficiency: 70 },
        { name: 'Security Best Practices', proficiency: 75 },
      ]
    }
  ]

  return (
    <section id="skills" className="py-20 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expertise across graphics architecture, mobile development, and cutting-edge technologies
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              {/* Category Header */}
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-4">
                  <category.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-dark-900 dark:text-white">
                  {category.name}
                </h3>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-dark-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                        {skill.proficiency}%
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) + 0.2 }}
                        viewport={{ once: true }}
                        className="h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-dark-900 dark:text-white">
              Always Learning
            </h3>
            <p className="text-lg text-dark-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm constantly exploring new technologies and methodologies to stay at the forefront 
              of graphics architecture and mobile development. Currently focused on AI-powered 
              rendering techniques and next-generation AR/VR experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-white dark:bg-dark-800 rounded-full text-sm font-medium text-dark-700 dark:text-gray-300 shadow-sm">
                AI/ML Integration
              </span>
              <span className="px-4 py-2 bg-white dark:bg-dark-800 rounded-full text-sm font-medium text-dark-700 dark:text-gray-300 shadow-sm">
                Real-time Ray Tracing
              </span>
              <span className="px-4 py-2 bg-white dark:bg-dark-800 rounded-full text-sm font-medium text-dark-700 dark:text-gray-300 shadow-sm">
                Neural Rendering
              </span>
              <span className="px-4 py-2 bg-white dark:bg-dark-800 rounded-full text-sm font-medium text-dark-700 dark:text-gray-300 shadow-sm">
                Quantum Computing
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection 