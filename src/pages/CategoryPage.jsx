import { useMemo, useState } from 'react'
import { useEntity, useContent, useProductsByCategory } from '../lib/store'
import { useTaxonomy } from '../lib/taxonomy'
import { AppLink } from '../components/common/AppLink'
import { PageBanner } from '../components/common/PageBanner'
import { FilterSidebar, useFilters } from '../components/common/FilterSidebar'
import { buildFacets, applyFilters, countActive } from '../lib/attributes'
import { adjustStyle, findAdjust } from '../lib/imageAdjust'
import { Search, X, Filter } from '../components/ui/Icons'

function ProductCard({ item, i, onNavigate }) {
  const href = item.external ? item.href : (item.href || `/product/${item.slug}`)
  const image = item.external ? item.image : (item.images?.[0] || item.image)
  return (
    <AppLink
      href={href} onNavigate={onNavigate}
      external={item.external}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      className="catalog-card"
      data-reveal style={{ '--reveal-delay': `${(i % 4) * 55}ms` }}
    >
      <span className="catalog-card__media">
        {image ? <img src={image} alt={item.title} loading="lazy"
                   style={adjustStyle(findAdjust(item.imageAdjust, image))} />
               : <span className="catalog-card__media-placeholder" aria-hidden="true" />}
      </span>
      <span className="catalog-card__body">
        <span className="catalog-card__title">{item.title}</span>
        {item.description && <span className="catalog-card__desc">{item.description}</span>}
      </span>
    </AppLink>
  )
}

export function CategoryPage({ categoryKey, onNavigate }) {
  const { data: category } = useEntity('categories', categoryKey)
  const { groups } = useTaxonomy()
  const { data: products, loading } = useProductsByCategory(categoryKey)
  const eyebrow = useContent().products?.eyebrow || 'Products'
  const taxLabel = groups.flatMap(g => g.categories).find(c => c.slug === categoryKey)?.label
  const title = taxLabel || category?.title || 'Products'

  // Search (name + tags) — narrows the base set the facets are built from.
  const [query, setQuery] = useState('')
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const base = tokens.length
    ? products.filter(p => {
        const hay = [p.title, p.productType, p.description, ...(p.tags || [])].filter(Boolean).join(' ').toLowerCase()
        return tokens.every(t => hay.includes(t))
      })
    : products

  // Faceted attribute filters
  const { selected, toggle, clear } = useFilters()
  const facets = useMemo(() => buildFacets(base), [base])
  const shown = useMemo(() => applyFilters(base, selected), [base, selected])
  const activeCount = countActive(selected)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const searching = tokens.length > 0

  const Toolbar = (
    <>
      {!loading && products.length > 0 && (
        <div className="cat-search">
          <span className="cat-search__icon"><Search /></span>
          <input
            className="cat-search__input" type="search" value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${title} by name or tag…`} aria-label={`Search ${title}`}
          />
          {query && <button className="cat-search__clear" onClick={() => setQuery('')} aria-label="Clear search"><X /></button>}
        </div>
      )}
    </>
  )

  const Grid = (
    loading ? (
      <div className="grid-skeleton category-grid" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => <div className="skeleton-card" key={i} />)}
      </div>
    ) : shown.length ? (
      <div className="category-grid">
        {shown.map((item, i) => <ProductCard key={item.slug || item.title} item={item} i={i} onNavigate={onNavigate} />)}
      </div>
    ) : (
      <p className="category-empty">
        {searching || activeCount ? 'No products match your search and filters.' : 'No products found in this collection.'}
      </p>
    )
  )

  return (
    <>
      <PageBanner eyebrow={eyebrow} title={title} summary={category?.summary} />

      <section className="section">
        <div className="container">
          {Toolbar}

          {facets.length > 0 ? (
            <div className={`filter-layout ${filtersOpen ? 'is-open' : ''}`.trim()}>
              <div className="filter-bar">
                <button type="button" className="filter-toggle" onClick={() => setFiltersOpen(true)}>
                  <Filter /> Filters{activeCount > 0 && <span className="filter-toggle__badge">{activeCount}</span>}
                </button>
                <span className="filter-count">{shown.length} product{shown.length !== 1 ? 's' : ''}</span>
              </div>

              <button className="filter-scrim" aria-hidden="true" tabIndex={-1} onClick={() => setFiltersOpen(false)} />
              <FilterSidebar
                facets={facets} selected={selected} onToggle={toggle} onClear={clear}
                activeCount={activeCount} open={filtersOpen} onClose={() => setFiltersOpen(false)}
              />
              <div className="filter-results">{Grid}</div>
            </div>
          ) : (
            <>
              {searching && !loading && (
                <p className="cat-search__count">{shown.length} result{shown.length !== 1 ? 's' : ''} for &ldquo;{query.trim()}&rdquo;</p>
              )}
              {Grid}
            </>
          )}
        </div>
      </section>
    </>
  )
}
