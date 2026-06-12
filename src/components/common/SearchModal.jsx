import { useEffect, useState } from 'react'
import { Search, X } from '../ui/Icons'
import { useSettings } from '../../lib/store'

export function SearchModal({ open, onClose, onNavigate }) {
  const searchIndex = useSettings().search || []
  const [query, setQuery] = useState('')

  useEffect(() => { if (!open) setQuery('') }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const needle = query.trim().toLowerCase()
  const results = searchIndex.filter(item =>
    !needle || [item.title, item.description, item.group, item.href].join(' ').toLowerCase().includes(needle)
  )
  const hasQuery = needle.length > 0

  return (
    <div className="search-modal" role="dialog" aria-modal="true" aria-label="Search">
      <button className="search-modal__backdrop" onClick={onClose} aria-label="Close search" tabIndex={-1} />
      <div className="search-modal__panel">
        <div className="search-modal__header">
          <span className="search-modal__icon"><Search /></span>
          <input
            className="search-modal__input"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, pages, resources…"
            aria-label="Search"
            autoFocus
          />
          <button className="search-modal__close" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>

        {hasQuery && (
          <div className="search-modal__results" role="listbox">
            {results.length ? results.map(item => (
              <button
                key={`${item.group}-${item.href}`}
                className="search-result"
                role="option"
                onClick={() => { onNavigate(item.href); onClose() }}
              >
                <span className="search-result__group">{item.group}</span>
                <span className="search-result__title">{item.title}</span>
                {item.description && <span className="search-result__desc">{item.description}</span>}
              </button>
            )) : (
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
