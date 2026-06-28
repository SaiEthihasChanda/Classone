import { useEffect, useMemo, useState } from 'react'
import { useCatalog, useContent } from '../lib/store'
import { useTaxonomy } from '../lib/taxonomy'
import { AppLink } from '../components/common/AppLink'
import { PageBanner } from '../components/common/PageBanner'
import { FilterSidebar, useFilters } from '../components/common/FilterSidebar'
import { buildFacets, applyFilters, countActive } from '../lib/attributes'
import { adjustStyle, findAdjust } from '../lib/imageAdjust'
import { Search, Filter } from '../components/ui/Icons'

/** A single square product tile. */
function ProductTile({ item, onNavigate, i }) {
  const href = item.external ? item.href : `/product/${item.slug}`
  return (
    <AppLink
      href={href} onNavigate={onNavigate}
      external={item.external}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      className="ptile" data-reveal style={{ '--reveal-delay': `${(i % 4) * 45}ms` }}
    >
      <span className="ptile__media">
        {item.images?.[0] || item.image
          ? <img src={item.images?.[0] || item.image} alt={item.title} loading="lazy"
              style={adjustStyle(findAdjust(item.imageAdjust, item.images?.[0] || item.image))} />
          : <span className="ptile__placeholder" aria-hidden="true" />}
      </span>
      <span className="ptile__body">
        {item.productType && <span className="ptile__cat">{item.productType}</span>}
        <span className="ptile__title">{item.title}</span>
      </span>
    </AppLink>
  )
}

/**
 * Product catalog: tabbed by menu group, with a live search bar and a faceted
 * attribute-filter sidebar that reflects the products currently in view.
 */
export function ProductsPage({ onNavigate }) {
  const { data: items, loading } = useCatalog()
  // The Unpublished group is hidden from the public catalog tabs.
  const { groups: allGroups } = useTaxonomy()
  const CATALOG = allGroups.filter(g => g.slug !== 'unpublished')
  const c = useContent().products || {}
  const [activeGroup, setActiveGroup] = useState(CATALOG[0]?.slug)
  const [search, setSearch] = useState('')
  const q = search.trim().toLowerCase()

  const { selected, toggle, clear } = useFilters()
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (CATALOG.length && !CATALOG.some(g => g.slug === activeGroup)) setActiveGroup(CATALOG[0].slug)
  }, [CATALOG, activeGroup])

  // Reset facet selections when switching group tabs (facets change per group).
  useEffect(() => { clear() /* eslint-disable-next-line */ }, [activeGroup])

  const byGroup = useMemo(() => {
    const map = {}
    for (const it of items) ((map[it.group] ||= {})[it.category] ||= []).push(it)
    return map
  }, [items])

  const groupsWithCounts = CATALOG.map(g => ({
    ...g,
    count: g.categories.reduce((n, cat) => n + (byGroup[g.slug]?.[cat.slug]?.length || 0), 0),
  }))
  const active = CATALOG.find(g => g.slug === activeGroup) || CATALOG[0] || { categories: [] }

  const searchResults = useMemo(() => {
    if (!q) return null
    return items.filter(it => `${it.title} ${it.productType || ''} ${it.category} ${(it.tags || []).join(' ')}`.toLowerCase().includes(q))
  }, [items, q])

  // The products currently in scope (search results, or the active group).
  const base = useMemo(() => {
    if (searchResults) return searchResults
    return Object.values(byGroup[active.slug] || {}).flat()
  }, [searchResults, byGroup, active.slug])

  const facets = useMemo(() => buildFacets(base), [base])
  const shownPaths = useMemo(() => new Set(applyFilters(base, selected).map(p => p.path)), [base, selected])
  const activeCount = countActive(selected)
  const inShown = (it) => shownPaths.has(it.path)
  const hasFilters = facets.length > 0

  // Wraps results in the filter layout (sidebar + grid) ONLY when there are
  // facets; otherwise renders the results full-width (no empty sidebar column).
  // A plain function (not a component) so the sidebar isn't remounted on every
  // filter toggle.
  const shell = (children) => (
    hasFilters ? (
      <div className={`filter-layout ${filtersOpen ? 'is-open' : ''}`.trim()}>
        <div className="filter-bar">
          <button type="button" className="filter-toggle" onClick={() => setFiltersOpen(true)}>
            <Filter /> Filters{activeCount > 0 && <span className="filter-toggle__badge">{activeCount}</span>}
          </button>
          <span className="filter-count">{shownPaths.size} product{shownPaths.size !== 1 ? 's' : ''}</span>
        </div>
        <button className="filter-scrim" aria-hidden="true" tabIndex={-1} onClick={() => setFiltersOpen(false)} />
        <FilterSidebar facets={facets} selected={selected} onToggle={toggle} onClear={clear}
          activeCount={activeCount} open={filtersOpen} onClose={() => setFiltersOpen(false)} />
        <div className="filter-results">{children}</div>
      </div>
    ) : children
  )

  return (
    <>
      <PageBanner eyebrow={c.eyebrow} title={c.title} summary={c.summary} />

      <section className="section">
        <div className="container">
          <div className="catalog-search">
            <Search className="catalog-search__icon" />
            <input
              type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products…" aria-label="Search products"
            />
          </div>

          {loading ? (
            <div className="grid-skeleton product-grid product-grid--4" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => <div className="skeleton-card" key={i} />)}
            </div>
          ) : searchResults ? (
            shell(
              shownPaths.size ? (
                <>
                  <p className="catalog-results-count">{shownPaths.size} result{shownPaths.size === 1 ? '' : 's'} for “{search}”</p>
                  <div className="ptile-grid">
                    {searchResults.filter(inShown).map((item, i) => <ProductTile key={item.path} item={item} onNavigate={onNavigate} i={i} />)}
                  </div>
                </>
              ) : (
                <p className="category-empty">No products match “{search}”{activeCount ? ' with these filters' : ''}.</p>
              )
            )
          ) : (
            <>
              <div className="catalog-tabs" role="tablist" aria-label="Product groups">
                {groupsWithCounts.map(g => (
                  <button key={g.slug} role="tab" aria-selected={g.slug === activeGroup}
                    className={`catalog-tab ${g.slug === activeGroup ? 'is-active' : ''}`.trim()}
                    onClick={() => setActiveGroup(g.slug)}>
                    {g.label}<span className="catalog-tab__count">{g.count}</span>
                  </button>
                ))}
              </div>

              {shell(
                <div className="catalog-panel">
                  {active.categories.map(cat => {
                    const list = (byGroup[active.slug]?.[cat.slug] || []).filter(inShown)
                    if (!list.length) return null
                    return (
                      <div key={cat.slug} className="catalog-section">
                        <h2 className="catalog-section__title">{cat.label}</h2>
                        <div className="ptile-grid">
                          {list.map((item, i) => <ProductTile key={item.path} item={item} onNavigate={onNavigate} i={i} />)}
                        </div>
                      </div>
                    )
                  })}
                  {!shownPaths.size && (
                    <p className="category-empty">
                      {activeCount ? 'No products match these filters.' : 'No products in this group yet.'}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
