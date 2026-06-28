import { useState } from 'react'
import { ChevronDown, X } from '../ui/Icons'

/** Manage the faceted-filter selection: { keyLc: Set<value> }. */
export function useFilters() {
  const [selected, setSelected] = useState({})
  const toggle = (keyLc, value) => setSelected(s => {
    const set = new Set(s[keyLc] || [])
    if (set.has(value)) set.delete(value); else set.add(value)
    const next = { ...s, [keyLc]: set }
    if (!set.size) delete next[keyLc]
    return next
  })
  const clear = () => setSelected({})
  return { selected, toggle, clear }
}

function FilterSection({ facet, selected, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const sel = selected[facet.keyLc] || new Set()
  return (
    <div className={`filter-sec ${open ? 'is-open' : ''}`.trim()}>
      <button type="button" className="filter-sec__head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="filter-sec__name">{facet.key}{sel.size > 0 && <span className="filter-sec__badge">{sel.size}</span>}</span>
        <ChevronDown className="filter-sec__caret" />
      </button>
      <div className="filter-sec__body" hidden={!open}>
        {facet.values.map(v => {
          const checked = sel.has(v.value)
          return (
            <label className={`filter-opt ${checked ? 'is-checked' : ''}`.trim()} key={v.value}>
              <input type="checkbox" checked={checked} onChange={() => onToggle(facet.keyLc, v.value)} />
              <span className="filter-opt__box" aria-hidden="true" />
              <span className="filter-opt__label">{v.value}</span>
              <span className="filter-opt__count">{v.count}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Faceted product filter sidebar. `facets` come from the products currently in
 * view; `selected`/`onToggle`/`onClear` drive the selection (see useFilters).
 */
export function FilterSidebar({ facets, selected, onToggle, onClear, activeCount, open, onClose }) {
  if (!facets.length) return null
  return (
    <aside className={`filter-sidebar ${open ? 'is-open' : ''}`.trim()}>
      <div className="filter-sidebar__head">
        <h3 className="filter-sidebar__title">Filters</h3>
        <div className="filter-sidebar__head-actions">
          {activeCount > 0 && (
            <button type="button" className="filter-clear" onClick={onClear}>Clear ({activeCount})</button>
          )}
          <button type="button" className="filter-sidebar__close" onClick={onClose} aria-label="Close filters"><X /></button>
        </div>
      </div>
      <div className="filter-sidebar__body">
        {facets.map((f, i) => (
          <FilterSection key={f.keyLc} facet={f} selected={selected} onToggle={onToggle} defaultOpen={i < 5} />
        ))}
      </div>
    </aside>
  )
}
