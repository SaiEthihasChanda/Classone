import { useMemo, useState } from 'react'
import { Search, X } from '../ui/Icons'

/**
 * Searchable product selector. The admin types to filter the catalog and picks
 * a product; the chosen product's href is stored (so the link is managed
 * internally, not typed by hand). `products` is the catalog list; `value` is the
 * currently-selected href; `onChange(href, product)` fires on selection.
 */
export function ProductPicker({ products, value, onChange, placeholder = 'Search products…' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const hrefOf = (p) => (p.external ? p.href : `/product/${p.slug}`)
  const selected = useMemo(() => products.find(p => hrefOf(p) === value), [products, value])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter(p => !q || p.title.toLowerCase().includes(q))
      .slice(0, 10)
  }, [products, query])

  // Select on mouseDown (fires before the input's blur) and preventDefault so
  // the input keeps focus and the list isn't torn down before the pick lands.
  const pick = (e, p) => {
    e.preventDefault()
    onChange(hrefOf(p), p)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="ppick">
      {selected ? (
        <div className="ppick__selected">
          {selected.images?.[0] || selected.image
            ? <img src={selected.images?.[0] || selected.image} alt="" />
            : <span className="ppick__noimg" />}
          <span className="ppick__seltitle">{selected.title}</span>
          <button type="button" className="ppick__clear" title="Change" onClick={() => onChange('', null)}><X /></button>
        </div>
      ) : (
        <div className="ppick__control">
          <Search className="ppick__icon" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            placeholder={placeholder}
          />
        </div>
      )}

      {open && !selected && (
        <ul className="ppick__list">
          {matches.length ? matches.map(p => (
            <li key={p.path}>
              <button type="button" className="ppick__item" onMouseDown={(e) => pick(e, p)}>
                {p.images?.[0] || p.image
                  ? <img src={p.images?.[0] || p.image} alt="" />
                  : <span className="ppick__noimg" />}
                <span className="ppick__itemtitle">{p.title}</span>
                <span className="ppick__itemcat">{p.category}</span>
              </button>
            </li>
          )) : <li className="ppick__empty">No products match “{query}”.</li>}
        </ul>
      )}
    </div>
  )
}
