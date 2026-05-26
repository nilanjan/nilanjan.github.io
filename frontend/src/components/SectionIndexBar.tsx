import { useEffect, useRef } from 'react'

interface SectionIndexBarProps {
  items: { id: string; label: string; index: string }[]
  activeId: string
  onSelect: (id: string) => void
}

/** Horizontal section index for phone and tablet (below header). */
const SectionIndexBar = ({ items, activeId, onSelect }: SectionIndexBarProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeId])

  return (
    <nav
      className="section-index-bar lg:hidden"
      aria-label="Page sections"
    >
      <div ref={scrollerRef} className="section-index-scroll">
        {items.map(({ id, label, index }) => {
          const active = activeId === id
          return (
            <button
              key={id}
              ref={active ? activeRef : undefined}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={active ? 'true' : undefined}
              className="section-index-chip"
              data-active={active}
            >
              <span className="section-index-chip-num">{index}</span>
              <span className="section-index-chip-label">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default SectionIndexBar
