import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, FileText } from 'lucide-react'
import SectionHeader from './SectionHeader'
import patentsData from '../data/patents.json'
import type { PatentsData } from '../data/types'

const { granted, pending, focusAreas } = patentsData as PatentsData

type Filter = 'all' | 'granted' | 'pending'

const PatentsSection = () => {
  const [filter, setFilter] = useState<Filter>('all')

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: granted.length + pending.length },
    { id: 'granted', label: 'Granted', count: granted.length },
    { id: 'pending', label: 'Pending', count: pending.length },
  ]

  return (
    <section id="patents" className="section section-alt">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Patents"
          title="Patent Portfolio"
          description="Granted and pending U.S. patents in throughput processors, GPU architecture, AR/VR pipelines, and power-efficient accelerator systems."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`filter-tab ${filter === f.id ? 'filter-tab-active' : ''}`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {(filter === 'all' || filter === 'granted') && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl font-semibold">Granted ({granted.length})</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {granted.map((patent, index) => (
                <motion.div
                  key={patent.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                  className="card p-5 border-l-2 border-l-emerald-500"
                >
                  <h4 className="font-medium mb-2 leading-snug">{patent.title}</h4>
                  <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400 mb-3">
                    {patent.patentNumber}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Granted {new Date(patent.grantDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    {patent.inventors.join(', ')}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {(filter === 'all' || filter === 'pending') && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-semibold">Pending ({pending.length})</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {pending.map((patent, index) => (
                <motion.div
                  key={patent.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                  className="card p-5 border-l-2 border-l-amber-500"
                >
                  <h4 className="font-medium mb-2 leading-snug">{patent.title}</h4>
                  <p className="font-mono text-xs text-amber-600 dark:text-amber-400 mb-3">
                    {patent.applicationNumber}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Filed {new Date(patent.filingDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    {patent.inventors.join(', ')}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-8"
        >
          <h3 className="text-lg font-semibold mb-6 text-center">Innovation Focus Areas</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {focusAreas.map((area) => (
              <div key={area} className="text-center">
                <FileText className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{area}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PatentsSection
