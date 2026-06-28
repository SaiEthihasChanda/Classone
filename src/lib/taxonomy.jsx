import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from './api'
import { CATALOG, UNPUBLISHED } from './catalog'
import { registerCategorySlugs } from '../router'

/**
 * Live menu taxonomy (groups → categories), loaded from Firestore so admins can
 * create/rename groups and categories without a code change. Falls back to the
 * built-in CATALOG until the live data loads (or if it's empty). Also registers
 * category slugs with the router so new category pages resolve.
 */
const TaxonomyContext = createContext(null)

export function TaxonomyProvider({ children }) {
  const [groups, setGroups] = useState(CATALOG)

  const reload = useCallback(async () => {
    try {
      const live = await api.loadTaxonomy()
      if (live && live.length) {
        setGroups(live)
        // Only register routes for public categories — the Unpublished group has
        // no public pages.
        registerCategorySlugs(live.filter(g => g.slug !== UNPUBLISHED).flatMap(g => g.categories.map(c => c.slug)))
      }
    } catch { /* keep the built-in fallback */ }
  }, [])

  useEffect(() => { reload() }, [reload])

  return <TaxonomyContext.Provider value={{ groups, reload }}>{children}</TaxonomyContext.Provider>
}

export function useTaxonomy() {
  return useContext(TaxonomyContext) || { groups: CATALOG, reload: () => {} }
}

/** Categories for a group slug, from the live taxonomy. */
export function categoriesForGroupIn(groups, groupSlug) {
  return groups.find(g => g.slug === groupSlug)?.categories || []
}
export function groupForCategoryIn(groups, categorySlug) {
  return groups.find(g => g.categories.some(c => c.slug === categorySlug))?.slug || null
}
