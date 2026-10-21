import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, FileText, ExternalLink } from 'lucide-react'
import SectionHeader from './SectionHeader'
import patentsData from '../data/patents.json'
import type { PatentsData } from '../data/types'

const { granted, pending, published, focusAreas } = patentsData as PatentsData

type Filter = 'all' | 'granted' | 'pending' | 'published'

interface Entry {
  id: string
  title: string
  number: string
  /** Public publication to link to; unpublished filings have none. */
  linkNumber?: string
  dateLabel: string
  date: string
  inventors: string[]
}

const googlePatentsUrl = (number: string) =>
  `https://patents.google.com/patent/${number.replace(/[^0-9A-Z]/g, '')}/en`

const groups: {
  id: Exclude<Filter, 'all'>
  label: string
  tab: string
  icon: typeof CheckCircle
  border: string
  text: string
  iconColor: string
  entries: Entry[]
}[] = [
  {
    id: 'granted',
    label: 'Granted',
    tab: 'Granted',
    icon: CheckCircle,
    border: 'border-l-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconColor: 'text-emerald-500',
    entries: granted.map((p) => ({
      id: p.id, title: p.title, number: p.patentNumber, linkNumber: p.patentNumber,
      dateLabel: 'Granted', date: p.grantDate, inventors: p.inventors,
    })),
  },
  {
    id: 'pending',
    label: 'Pending',
    tab: 'Pending',
    icon: Clock,
    border: 'border-l-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    iconColor: 'text-amber-500',
    entries: pending.map((p) => ({
      id: p.id, title: p.title, number: p.applicationNumber, linkNumber: p.publicationNumber,
      dateLabel: 'Filed', date: p.filingDate, inventors: p.inventors,
    })),
  },
  {
    id: 'published',
    label: 'Published Applications',
    tab: 'Published',
    icon: FileText,
    border: 'border-l-slate-400',
    text: 'text-slate-600 dark:text-slate-300',
    iconColor: 'text-slate-400',
    entries: published.map((p) => ({
      id: p.id, title: p.title, number: p.publicationNumber, linkNumber: p.publicationNumber,
      dateLabel: 'Filed', date: p.filingDate, inventors: p.inventors,
    })),
  },
]

// Dates are calendar days; format in UTC so US time zones don't shift them back a month.
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

const PatentsSection = () => {
  const [filter, setFilter] = useState<Filter>('all')

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: groups.reduce((n, g) => n + g.entries.length, 0) },
    ...groups.map((g) => ({ id: g.id, label: g.tab, count: g.entries.length })),
  ]

  return (
    <section id="patents" className="section">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Patents"
          title="Patent Portfolio"
          description="Granted, pending and published U.S. patent filings in GPU compute, memory-bandwidth compression, power-efficient accelerator pipelines, and power delivery."
        />

        <div className="filter-scroll">
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

        {groups
          .filter((g) => filter === 'all' || filter === g.id)
          .map((g) => (
            <div key={g.id} className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <g.icon className={`w-5 h-5 ${g.iconColor}`} />
                <h3 className="text-xl font-semibold">{g.label} ({g.entries.length})</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {g.entries.map((patent, index) => (
                  <motion.div
                    key={patent.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -2 }}
                    className={`card card-pad border-l-2 ${g.border}`}
                  >
                    <h4 className="font-medium mb-2 leading-snug">{patent.title}</h4>
                    <p className={`font-mono text-xs mb-3 ${g.text}`}>
                      {patent.linkNumber ? (
                        <a
                          href={googlePatentsUrl(patent.linkNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          {patent.number}
                          {patent.linkNumber !== patent.number && ` · ${patent.linkNumber}`}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        patent.number
                      )}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {patent.dateLabel} {formatDate(patent.date)}
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                      {patent.inventors.join(', ')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card card-pad"
        >
          <h3 className="text-lg font-semibold mb-6 text-center">Innovation Focus Areas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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
