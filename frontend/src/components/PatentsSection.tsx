import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, Users } from 'lucide-react'

const PatentsSection = () => {
  const grantedPatents = [
    {
      id: "patent-1",
      title: "Efficient redundant coverage discard mechanism to reduce pixel shader work in a tile-based graphics rendering pipeline",
      patentNumber: "US 11,010,954 B2",
      filingDate: "2021-05-01",
      grantDate: "2021-05-01",
      inventors: ["Nilanjan GOSWAMI", "Derek LENTZ", "Adithya Hrudhayan KRISHNAMURTHY", "David C. TANNENBAUM"],
      description: "Efficient redundant coverage discard mechanism to reduce pixel shader work in a tile-based graphics rendering pipeline."
    },
    {
      id: "patent-2", 
      title: "Enhanced early coverage discard using opportunistic bypassing and dynamic queue resizing",
      patentNumber: "US 11,321,806",
      filingDate: "2022-05-01",
      grantDate: "2022-05-01",
      inventors: ["Sushant KONDGULI", "Nilanjan GOSWAMI"],
      description: "Enhanced early coverage discard using opportunistic bypassing and dynamic queue resizing."
    },
    {
      id: "patent-3",
      title: "Display peak power management for artificial reality systems",
      patentNumber: "US 11,881,143",
      filingDate: "2024-01-01",
      grantDate: "2024-01-01",
      inventors: ["Nilanjan GOSWAMI", "Eugene GORBATOV", "Steve CLOHSET", "Mike YEE"],
      description: "Display peak power management for artificial reality systems."
    },
    {
      id: "patent-4",
      title: "Low-power high throughput hardware decoder with random block access",
      patentNumber: "US 11,882,295",
      filingDate: "2024-01-01",
      grantDate: "2024-01-01",
      inventors: ["Nilanjan GOSWAMI", "Sonal PINTO"],
      description: "Low-power high throughput hardware decoder with random block access."
    },
    {
      id: "patent-5",
      title: "Partial rendering and tearing avoidance",
      patentNumber: "US 12,067,959",
      filingDate: "2024-08-01",
      grantDate: "2024-08-01",
      inventors: ["Nilanjan GOSWAMI", "Hideo TAMAMA", "Chris GOODMAN", "Steve CLOHSET", "Shanmathi NATARAJAN"],
      description: "Partial rendering and tearing avoidance."
    }
  ]

  const pendingPatents = [
    {
      id: "pending-1",
      title: "Efficient fast random access enabled geometry Attribute compression mechanism",
      applicationNumber: "US 63/011,283",
      filingDate: "2022-04-01",
      inventors: ["Nilanjan GOSWAMI", "Swati ATRISH"],
      description: "Efficient fast random access enabled geometry Attribute compression mechanism."
    },
    {
      id: "pending-2",
      title: "Re-reference aware tile walk order for primitive binner",
      applicationNumber: "US 63/028,553", 
      filingDate: "2020-11-01",
      inventors: ["Sushant KONDGULI", "Nilanjan GOSWAMI"],
      description: "Re-reference aware tile walk order for primitive binner."
    },
    {
      id: "pending-3",
      title: "Viewport visual effect correction",
      applicationNumber: "US 63/233,968",
      filingDate: "2021-08-01",
      inventors: ["Nilanjan GOSWAMI", "Mike YEE", "Morgyn TAYLOR", "Patrick MCCLEARY", "Naveen MAKINENI", "Aaron YOUNG", "Zhi ZHOU", "Richard Lawrence GREENE", "Richard WEBB", "Cheng CHANG"],
      description: "Viewport visual effect correction."
    },
    {
      id: "pending-4",
      title: "Display system optimization",
      applicationNumber: "US 63/174,455",
      filingDate: "2021-04-01",
      inventors: ["Nilanjan GOSWAMI", "Morgyn TAYLOR", "Zahid HOSSAIN", "Larry SEILER", "Michael YEE"],
      description: "Display system optimization."
    },
    {
      id: "pending-5",
      title: "Hardware encoder for color data in a 2D rendering pipeline",
      applicationNumber: "US 17/721,660",
      filingDate: "2021-08-01",
      inventors: ["Nilanjan GOSWAMI", "Sonal PINTO"],
      description: "Hardware encoder for color data in a 2D rendering pipeline."
    },
    {
      id: "pending-6",
      title: "Block-based random access capable lossless graphics asset compression",
      applicationNumber: "US 17/721,700",
      filingDate: "2022-04-01",
      inventors: ["Nilanjan GOSWAMI", "Kyle DURFEE", "Sonal PINTO"],
      description: "Block-based random access capable lossless graphics asset compression."
    },
    {
      id: "pending-7",
      title: "2D rendering hardware architecture based on analytic anti-aliasing",
      applicationNumber: "US 17/721,635",
      filingDate: "2022-04-01",
      inventors: ["Nilanjan GOSWAMI", "Chris GOODMAN", "Steve CLOHSET"],
      description: "2D rendering hardware architecture based on analytic anti-aliasing."
    },
    {
      id: "pending-8",
      title: "Rasterization optimization for analytic anti-aliasing",
      applicationNumber: "US 17/721,653",
      filingDate: "2021-08-01",
      inventors: ["Nilanjan GOSWAMI", "Chris GOODMAN", "Siddharth KAVILAPATI", "Kyle DURFEE"],
      description: "Rasterization optimization for analytic anti-aliasing."
    },
    {
      id: "pending-9",
      title: "Destination update for blending modes in a graphics pipeline",
      applicationNumber: "US 17/721,671",
      filingDate: "2022-04-01",
      inventors: ["Nilanjan GOSWAMI", "Chris GOODMAN", "Steve CLOHSET", "Piyush AGARWAL", "Kyle DURFEE"],
      description: "Destination update for blending modes in a graphics pipeline."
    },
    {
      id: "pending-10",
      title: "Hardware support for planar output generation in GPUs",
      applicationNumber: "Under preparation",
      filingDate: "2024-12-01",
      inventors: ["Nilanjan GOSWAMI", "Dam BACKER", "Brian ELLIS", "Tao WANG"],
      description: "Hardware support for planar output generation in GPUs."
    },
    {
      id: "pending-11",
      title: "Improving augmented reality rendering pipeline using super-resolution technique",
      applicationNumber: "Under preparation",
      filingDate: "2024-12-01",
      inventors: ["Nilanjan GOSWAMI", "Dam BACKER", "Pravin RAO"],
      description: "Improving augmented reality rendering pipeline using super-resolution technique."
    }
  ]

  return (
    <section id="patents" className="py-20 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Patent <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-gray-300 max-w-3xl mx-auto">
            Innovative contributions to graphics architecture and mobile GPU technology through awarded and pending patents
          </p>
        </motion.div>

        {/* Granted Patents */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center mb-8">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-3xl font-bold text-dark-900 dark:text-white">
              Granted Patents ({grantedPatents.length})
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {grantedPatents.map((patent, index) => (
              <motion.div
                key={patent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 border-l-4 border-green-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-dark-900 dark:text-white mb-2 leading-tight">
                      {patent.title}
                    </h4>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {patent.patentNumber}
                    </div>
                  </div>
                </div>

                <p className="text-dark-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {patent.description}
                </p>

                <div className="space-y-2 text-xs text-dark-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Filed:</span>
                    <span>{new Date(patent.filingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Granted:</span>
                    <span>{new Date(patent.grantDate).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center mb-1">
                      <Users className="w-3 h-3 mr-1" />
                      <span className="font-medium">Inventors:</span>
                    </div>
                    <span>{patent.inventors.join(', ')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pending Patents */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-8">
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mr-3" />
            <h3 className="text-3xl font-bold text-dark-900 dark:text-white">
              Pending Patents ({pendingPatents.length})
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pendingPatents.map((patent, index) => (
              <motion.div
                key={patent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 border-l-4 border-yellow-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-dark-900 dark:text-white mb-2 leading-tight">
                      {patent.title}
                    </h4>
                    <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      {patent.applicationNumber}
                    </div>
                  </div>
                </div>

                <p className="text-dark-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {patent.description}
                </p>

                <div className="space-y-2 text-xs text-dark-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Filed:</span>
                    <span>{new Date(patent.filingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center mb-1">
                      <Users className="w-3 h-3 mr-1" />
                      <span className="font-medium">Inventors:</span>
                    </div>
                    <span>{patent.inventors.join(', ')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Patent Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-dark-900 dark:text-white">
              Innovation Focus Areas
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-dark-700 dark:text-gray-300">Mobile GPU Optimization</div>
              </div>
              <div className="text-center">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-dark-700 dark:text-gray-300">AR/VR Rendering</div>
              </div>
              <div className="text-center">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-dark-700 dark:text-gray-300">Ray Tracing Acceleration</div>
              </div>
              <div className="text-center">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-dark-700 dark:text-gray-300">AI-Enhanced Graphics</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PatentsSection
