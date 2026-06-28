/**
 * The product menu taxonomy: groups → categories. This is the single source of
 * truth for the menu structure that products are organised under, and mirrors
 * the Firestore path catalog/<group>/categories/<category>/products/<slug>.
 *
 * Used by the admin product editor (group/category dropdowns) and to resolve a
 * category's group + human label.
 */
// The system "Unpublished" group — a holding area whose products are hidden from
// the entire public site (nav, catalog, search, product pages). It's never part
// of the public taxonomy; the admin manager shows it as a distinct tab so hidden
// products can be reorganised or restored.
export const UNPUBLISHED = 'unpublished'
export const UNPUBLISHED_LABEL = 'Unpublished'

export const CATALOG = [
  {
    slug: 'sensing', label: 'Sensing', categories: [
      { slug: 'single-channel-electrochemical', label: 'Single Channel EC' },
      { slug: 'multi-channel-electrochemical', label: 'Multi Channel EC' },
      { slug: 'electrochemical-development-kit', label: 'EC Development Kit' },
      { slug: 'application-kits', label: 'Application Kits' },
    ],
  },
  {
    slug: 'energy', label: 'Energy', categories: [
      { slug: 'corrtest', label: 'Corrtest' },
      { slug: 'tob', label: 'Tob' },
    ],
  },
  {
    slug: 'nano-technology', label: 'Nano Technology', categories: [
      { slug: 'nano-technology', label: 'Nano Technology' },
    ],
  },
  {
    slug: 'accessories', label: 'Accessories', categories: [
      { slug: 'electrodes', label: 'Electrodes' },
      { slug: 'glass-cell', label: 'Glass Cell' },
    ],
  },
]

/** group slug → { label, categories[] } */
export const groupBySlug = Object.fromEntries(CATALOG.map((g) => [g.slug, g]))

/** category slug → { label, group } */
export const categoryIndex = Object.fromEntries(
  CATALOG.flatMap((g) => g.categories.map((c) => [c.slug, { ...c, group: g.slug }])),
)

export function categoriesForGroup(groupSlug) {
  return groupBySlug[groupSlug]?.categories || []
}

export function groupForCategory(categorySlug) {
  return categoryIndex[categorySlug]?.group || null
}
