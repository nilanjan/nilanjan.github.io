import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, Calendar, Users, Award } from 'lucide-react'

const PublicationsSection = () => {
  const publications = [
    {
      id: "pub-1",
      title: "Exploring GPGPU workloads: Characterization methodology, analysis and microarchitecture evaluation implications",
      authors: ["Nilanjan Goswami", "Ramkumar Shankar", "Mrinmoy Joshi", "Tao Li"],
      venue: "IEEE International Symposium on Workload Characterization (IISWC'10)",
      year: 2010,
      type: "Conference",
      impact: "High Impact",
      doi: "10.1109/IISWC.2010.5650274",
      url: "https://doi.org/10.1109/IISWC.2010.5650274",
      abstract: "Comprehensive methodology for GPGPU workload characterization and microarchitecture evaluation implications.",
      citations: 116,
      keywords: ["GPGPU", "Workload Characterization", "Microarchitecture", "Performance Analysis"]
    },
    {
      id: "pub-2",
      title: "Power-performance co-optimization of throughput core architecture using resistive memory",
      authors: ["Nilanjan Goswami", "Bing Cao", "Tao Li"],
      venue: "2013 IEEE 19th International Symposium on High Performance Computer Architecture",
      year: 2013,
      type: "Conference",
      impact: "Top Venue",
      doi: "10.1109/HPCA.2013.6522354",
      url: "https://doi.org/10.1109/HPCA.2013.6522354",
      abstract: "Novel approach to power-performance co-optimization using emerging resistive memory technologies.",
      citations: 106,
      keywords: ["Power Optimization", "Resistive Memory", "Throughput Architecture", "Performance"]
    },
    {
      id: "pub-3",
      title: "Analyzing soft-error vulnerability on GPGPU microarchitecture",
      authors: ["Jingfei Tan", "Nilanjan Goswami", "Tao Li", "Xinran Fu"],
      venue: "2011 IEEE International Symposium on Workload Characterization (IISWC)",
      year: 2011,
      type: "Conference",
      impact: "Conference",
      doi: "10.1109/IISWC.2011.6114174",
      url: "https://doi.org/10.1109/IISWC.2011.6114174",
      abstract: "Comprehensive analysis of soft-error vulnerability in GPGPU microarchitectures.",
      citations: 105,
      keywords: ["Soft Errors", "Reliability", "GPGPU", "Microarchitecture"]
    },
    {
      id: "pub-4",
      title: "Software Transactional Memory for GPU Architectures",
      authors: ["Yunlong Xu", "Rui Wang", "Nilanjan Goswami", "Tao Li", "Depei Qian"],
      venue: "Computer Architecture Letters",
      year: 2013,
      type: "Journal",
      impact: "High Impact",
      doi: "10.1109/LCA.2013.7",
      url: "https://doi.org/10.1109/LCA.2013.7",
      abstract: "Novel software transactional memory implementation for GPU architectures.",
      citations: 78,
      keywords: ["Transactional Memory", "GPU", "Parallel Computing", "Concurrency"]
    },
    {
      id: "pub-5",
      title: "GPGPU-MiniBench: Accelerating GPGPU Micro-Architecture Simulation",
      authors: ["Zhibin Yu", "Lieven Eeckhout", "Nilanjan Goswami", "Tao Li", "Lizy K. John", "Hai Jin", "Chengzhong Xu"],
      venue: "IEEE Transactions on Computers",
      year: 2014,
      type: "Journal",
      impact: "High Impact",
      doi: "10.1109/TC.2014.2308183",
      url: "https://doi.org/10.1109/TC.2014.2308183",
      abstract: "Accelerated GPGPU micro-architecture simulation framework for performance evaluation.",
      citations: 34,
      keywords: ["GPGPU", "Benchmarking", "Simulation", "Micro-Architecture"]
    },
    {
      id: "pub-6",
      title: "Chameleon: Adapting Throughput Server to Time-Varying Green Power Budget Using Online Learning",
      authors: ["Chao Li", "Rui Wang", "Nilanjan Goswami", "Xiaodong Li", "Tao Li", "Depei Qian"],
      venue: "International Conference on Parallel Processing",
      year: 2013,
      type: "Conference",
      impact: "Conference",
      doi: "10.1109/ICPP.2013.26",
      url: "https://doi.org/10.1109/ICPP.2013.26",
      abstract: "Adaptive throughput server optimization for time-varying green power budgets using online learning.",
      citations: 20,
      keywords: ["Green Computing", "Power Management", "Online Learning", "Throughput"]
    },
    {
      id: "pub-7",
      title: "Accelerating GPGPU architecture simulation",
      authors: ["Zhibin Yu", "Lieven Eeckhout", "Nilanjan Goswami", "Tao Li", "Lizy John", "Hai Jin", "Chengzhong Xu"],
      venue: "Proceedings of the ACM SIGMETRICS/international conference on Measurement and modeling of computer systems",
      year: 2013,
      type: "Conference",
      impact: "Top Venue",
      doi: "10.1145/2465529.2465533",
      url: "https://doi.org/10.1145/2465529.2465533",
      abstract: "Accelerated simulation framework for GPGPU architecture evaluation.",
      citations: 16,
      keywords: ["GPGPU", "Architecture Simulation", "Performance Modeling", "Acceleration"]
    },
    {
      id: "pub-8",
      title: "On Characterization of Performance and Energy Efficiency in Heterogeneous HPC Cloud Data Centers",
      authors: ["Amer Qouneh", "Nilanjan Goswami", "Ruijin Zhou", "Tao Li"],
      venue: "International Symposium on Modeling, Analysis and Simulation of Computer and Telecommunication Systems",
      year: 2014,
      type: "Conference",
      impact: "Conference",
      doi: "10.1109/MASCOTS.2014.14",
      url: "https://doi.org/10.1109/MASCOTS.2014.14",
      abstract: "Performance and energy efficiency characterization in heterogeneous HPC cloud data centers.",
      citations: 8,
      keywords: ["HPC", "Cloud Computing", "Energy Efficiency", "Heterogeneous Systems"]
    },
    {
      id: "pub-9",
      title: "Exploring Silicon Nanophotonics in Throughput Architecture",
      authors: ["Nilanjan Goswami", "Zhongqi Li", "Ramkumar Shankar", "Tao Li"],
      venue: "IEEE Design & Test Magazine",
      year: 2014,
      type: "Journal",
      impact: "High Impact",
      doi: "10.1109/MDAT.2014.2331233",
      url: "https://doi.org/10.1109/MDAT.2014.2331233",
      abstract: "Exploration of silicon nanophotonics integration in throughput computer architectures.",
      citations: 7,
      keywords: ["Silicon Photonics", "Throughput Architecture", "Nanophotonics", "Computer Architecture"]
    },
    {
      id: "pub-10",
      title: "Integrating nanophotonics in gpu microarchitecture",
      authors: ["Nilanjan Goswami", "Zhongqi Li", "Ankush Verma", "Ramkumar Shankar", "Tao Li"],
      venue: "Proceedings of the 21st international conference on Parallel architectures and compilation techniques",
      year: 2012,
      type: "Conference",
      impact: "Conference",
      doi: "10.1145/2370816.2370855",
      url: "https://doi.org/10.1145/2370816.2370855",
      abstract: "Novel integration of nanophotonics technology in GPU microarchitecture design.",
      citations: 6,
      keywords: ["Nanophotonics", "GPU Architecture", "Optical Computing", "Microarchitecture"]
    },
    {
      id: "pub-11",
      title: "iConn: A Communication Infrastructure for Heterogeneous Computing Architectures",
      authors: ["Zhongqi Li", "Nilanjan Goswami", "Tao Li"],
      venue: "ACM Journal on Emerging Technologies in Computing Systems",
      year: 2015,
      type: "Journal",
      impact: "High Impact",
      doi: "10.1145/2700234",
      url: "https://doi.org/10.1145/2700234",
      abstract: "Novel communication infrastructure design for heterogeneous computing architectures.",
      citations: 5,
      keywords: ["Heterogeneous Computing", "Communication Infrastructure", "Network-on-Chip", "Architecture"]
    },
    {
      id: "pub-12",
      title: "An Empirical-cum-Statistical Approach to Power-Performance Characterization of Concurrent GPU Kernels",
      authors: ["Nilanjan Goswami", "Amer Qouneh", "Chao Li", "Tao Li"],
      venue: "arXiv preprint arXiv:2011.02368",
      year: 2020,
      type: "Preprint",
      impact: "Preprint",
      doi: "10.48550/arXiv.2011.02368",
      url: "https://arxiv.org/abs/2011.02368",
      abstract: "Empirical and statistical methodology for power-performance characterization of concurrent GPU kernels.",
      citations: 1,
      keywords: ["GPGPU", "Power Analysis", "Performance Characterization", "Concurrent Kernels"]
    }
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High Impact":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
      case "Top Venue":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
      case "Conference":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30"
      case "Preprint":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30"
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30"
    }
  }

  return (
    <section id="publications" className="py-20 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Research <span className="gradient-text">Publications</span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-gray-300 max-w-3xl mx-auto">
            Peer-reviewed contributions to computer graphics, mobile GPU architecture, and rendering optimization research
          </p>
        </motion.div>

        <div className="space-y-6">
          {publications.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex-1 lg:mr-6">
                  <div className="flex items-start mb-3">
                    <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-dark-900 dark:text-white leading-tight mb-2">
                        {pub.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                        <div className="flex items-center text-dark-600 dark:text-gray-300">
                          <Users className="w-4 h-4 mr-1" />
                          {pub.authors.join(', ')}
                        </div>
                        <div className="flex items-center text-dark-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4 mr-1" />
                          {pub.year}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(pub.impact)}`}>
                          {pub.impact}
                        </span>
                      </div>

                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                        {pub.venue}
                      </p>
                    </div>
                  </div>

                  <p className="text-dark-600 dark:text-gray-300 leading-relaxed mb-4">
                    {pub.abstract}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pub.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-dark-600 dark:text-gray-300 text-xs rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:text-right space-y-3">
                  <div className="flex lg:flex-col gap-4 lg:gap-2 items-center lg:items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {pub.citations}
                      </div>
                      <div className="text-xs text-dark-500 dark:text-gray-400">Citations</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm text-dark-600 dark:text-gray-300">
                        {pub.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Paper
                    </a>
                    <div className="text-xs text-dark-500 dark:text-gray-400">
                      DOI: {pub.doi}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Research Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-dark-900 dark:text-white">
              Research Impact (Google Scholar)
            </h3>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">514</div>
                <div className="text-sm text-dark-600 dark:text-gray-300">Total Citations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">8</div>
                <div className="text-sm text-dark-600 dark:text-gray-300">h-index</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">7</div>
                <div className="text-sm text-dark-600 dark:text-gray-300">i10-index</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">{publications.length}</div>
                <div className="text-sm text-dark-600 dark:text-gray-300">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">
                  {publications.filter(p => p.impact === "High Impact" || p.impact === "Top Venue").length}
                </div>
                <div className="text-sm text-dark-600 dark:text-gray-300">High-Impact Venues</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PublicationsSection
