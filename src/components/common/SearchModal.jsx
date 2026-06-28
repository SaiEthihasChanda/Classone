import { useEffect, useMemo, useState } from 'react'
import { Search, X } from '../ui/Icons'
import { useSettings, useCatalog } from '../../lib/store'

export function SearchModal({ open, onClose, onNavigate }) {
  const baseIndex = useSettings().search || []
  const { data: catalog } = useCatalog()
  const [query, setQuery] = useState('')

  // Build a live search index: the catalog products (always current) plus any
  // extra entries the site config provides (software, applications, pages…).
  // Each entry carries a precomputed lowercase `haystack` (title + description +
  // tags + category) so token matching stays cheap.
  const searchIndex = useMemo(() => {
    const products = (catalog || []).map(p => {
      const tags = [...(p.tags || []), p.category || ''].filter(Boolean)
      return {
        title: p.title,
        description: p.productType || '',
        tags,
        group: 'Products',
        href: p.external ? p.href : `/product/${p.slug}`,
        external: !!p.external,
        haystack: [p.title, p.productType, ...tags].filter(Boolean).join(' ').toLowerCase(),
      }
    })
    const seen = new Set(products.map(p => p.href))
    const extras = baseIndex
      .filter(e => !seen.has(e.href))
      .map(e => ({ ...e, haystack: [e.title, e.description, e.group].filter(Boolean).join(' ').toLowerCase() }))
    return [...products, ...extras]
  }, [catalog, baseIndex])

  useEffect(() => { if (!open) setQuery('') }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const needle = query.trim().toLowerCase()
  const tokens = needle.split(/\s+/).filter(Boolean)
  // Every token must appear somewhere in the entry — so multi-word queries like
  // "portable potentiostat" or "emstat sensor" match regardless of word order.
  const allResults = tokens.length
    ? searchIndex.filter(item => tokens.every(t => item.haystack.includes(t)))
    : []
  const results = allResults.slice(0, 40)
  const hasQuery = needle.length > 0

  const goToFirst = (e) => {
    e.preventDefault()
    const first = results[0]
    if (!first) return
    if (first.external) window.open(first.href, '_blank', 'noopener')
    else onNavigate(first.href)
    onClose()
  }

  return (
    <div className="search-modal" role="dialog" aria-modal="true" aria-label="Search">
      <button className="search-modal__backdrop" onClick={onClose} aria-label="Close search" tabIndex={-1} />
      <div className="search-modal__panel">
        <button className="search-modal__close" onClick={onClose} aria-label="Close">
          <X />
        </button>
        <form className="search-modal__group" role="search" onSubmit={goToFirst}>
          <input
            className="search-modal__input"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search"
            autoFocus
          />
          <button type="submit" className="search-modal__submit" aria-label="Search">
            <Search />
          </button>
        </form>

        {hasQuery && (
          <div className="search-modal__results" role="listbox">
            {results.length ? (
              <>
                <p className="search-modal__count">
                  {allResults.length} result{allResults.length !== 1 ? 's' : ''}
                  {allResults.length > results.length ? ` — showing first ${results.length}` : ''}
                </p>
                {results.map(item => (
                  <button
                    key={`${item.group}-${item.href}`}
                    className="search-result"
                    role="option"
                    onClick={() => {
                      if (item.external) window.open(item.href, '_blank', 'noopener')
                      else onNavigate(item.href)
                      onClose()
                    }}
                  >
                    <span className="search-result__group">{item.group}</span>
                    <span className="search-result__title">{item.title}</span>
                    {item.description && <span className="search-result__desc">{item.description}</span>}
                  </button>
                ))}
              </>
            ) : (
              <p className="search-modal__empty">No results found for "{query}"</p>
            )}
          </div>
        )}

        {!hasQuery && (
          <div className="search-modal__hint">
            <p>Try searching for a product, software, or application area.</p>
          </div>
        )}
      </div>
    </div>
  )
}
