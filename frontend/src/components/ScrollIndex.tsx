interface ScrollIndexProps {
  items: { id: string; label: string; index: string }[]
  activeId: string
  onSelect: (id: string) => void
}

/** Desktop-only scroll index — primary wayfinding on large screens. */
const ScrollIndex = ({ items, activeId, onSelect }: ScrollIndexProps) => (
  <nav
    className="hidden lg:block fixed right-6 xl:right-10 top-1/2 -translate-y-1/2 z-40"
    style={{ width: 'var(--index-width)' }}
    aria-label="Page sections"
  >
    <ol className="space-y-1">
      {items.map(({ id, label, index }) => {
        const active = activeId === id
        return (
          <li key={id}>
            <button
              type="button"
              onClick={() => onSelect(id)}
              aria-current={active ? 'true' : undefined}
              className="scroll-index-item w-full"
              data-active={active}
            >
              <span className="scroll-index-num">{index}</span>
              <span className="scroll-index-label">{label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  </nav>
)

export default ScrollIndex
