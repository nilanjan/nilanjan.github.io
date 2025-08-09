import { motion } from 'framer-motion'
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react'

const HeroSection = () => {
  const scrollToAbout = () => {
    const element = document.getElementById('about')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium"
          >
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
            Principal Graphics Architect
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-balance"
          >
            <span className="gradient-text">Graphics Architect</span>
            <br />
            <span className="text-dark-900 dark:text-white">System/Hardware</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-dark-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Principal Graphics Architect at Qualcomm Technologies Inc. specializing in 2D/3D graphics pipeline optimization, 
            AR/VR rendering, and mobile graphics architecture.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center items-center"
          >
            <button 
              onClick={scrollToAbout}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Learn More</span>
            </button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex justify-center space-x-6 pt-8"
          >
            <a
              href="https://github.com/nilanjan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-dark-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-dark-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/nilanjan-goswami"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-dark-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-dark-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:nilanjan.goswami@gmail.com"
              className="p-3 rounded-full bg-white dark:bg-dark-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-dark-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Mail className="w-6 h-6" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.button
          onClick={scrollToAbout}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2 rounded-full bg-white/20 dark:bg-dark-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-dark-800/30 transition-colors duration-300"
        >
          <ChevronDown className="w-6 h-6 text-dark-700 dark:text-gray-300" />
        </motion.button>
      </motion.div>
    </section>
  )
}

export default HeroSection 