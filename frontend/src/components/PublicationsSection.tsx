import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Award } from 'lucide-react'
import SectionHeader from './SectionHeader'
import publicationsData from '../data/publications.json'
import type { PublicationsData } from '../data/types'

const { publications, communityLeadership, scholarStats } = publicationsData as PublicationsData

type Filter = 'all' | 'conference' | 'journal' | 'featured'

const impactColors: Record<string, string> = {
  'High Impact': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'Top Venue': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'Conference': 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
  'Preprint': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

const PublicationsSection = () => {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    const sorted = [...publications].sort((a, b) => b.year - a.year)
    switch (filter) {
      case 'conference':
        return sorted.filter((p) => p.type === 'Conference')
      case 'journal':
        return sorted.filter((p) => p.type === 'Journal' || p.type === 'Preprint')
      case 'featured':
        return sorted.filter((p) => p.featured)
      default:
        return sorted
    }
  }, [filter, publications])

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: `All (${publications.length})` },
    { id: 'featured', label: 'Featured' },
    { id: 'conference', label: 'Conference' },
    { id: 'journal', label: 'Journal / Preprint' },
  ]

  return (
    <section id="publications" className="section">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Publications"
          title="Selected Papers"
          description="Peer-reviewed work in GPGPU microarchitecture, throughput processors, and power-performance co-optimization."
        />

        <div className="filter-scroll">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`filter-tab ${filter === f.id ? 'filter-tab-active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-16">
          {filtered.map((pub, index) => (
            <motion.article
              key={pub.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
              className="card card-pad"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{pub.year}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${impactColors[pub.impact] ?? ''}`}>
                      {pub.impact}
                    </span>
                    {pub.featured && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
                        <Award className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2 leading-snug">{pub.title}</h3>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{pub.authors.join(', ')}</p>
                  <p className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>{pub.venue}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pub.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded text-xs font-mono"
                        style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-muted)' }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2.5 !px-4 text-sm shrink-0 w-full sm:w-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Paper
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card card-pad mb-8"
        >
          <h3 className="text-sm font-semibold mb-6 text-center" style={{ color: 'var(--text-muted)' }}>Citation Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Citations', value: scholarStats.citations },
              { label: 'h-index', value: scholarStats.hIndex },
              { label: 'i10-index', value: scholarStats.i10Index },
              { label: 'Publications', value: publications.length },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-semibold font-mono" style={{ color: 'var(--text)' }}>{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card card-pad"
        >
          <h3 className="text-lg font-semibold mb-4">Community Leadership</h3>
          <ul className="space-y-2">
            {communityLeadership.map((item) => (
              <li key={item} className="text-sm flex gap-2" style={{ color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--accent)' }}>·</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export default PublicationsSection
