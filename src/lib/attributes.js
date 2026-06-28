/**
 * Product attributes + faceted filtering helpers.
 *
 * A product's `attributes` is a plain map of { key: value }. Values are stored
 * UPPERCASE (case-insensitive); keys keep their display casing but are matched
 * case-insensitively so "Material" and "material" never split into two facets.
 */

export const normKey   = (k) => String(k || '').trim()
export const normKeyLc = (k) => normKey(k).toLowerCase()
export const normVal   = (v) => String(v || '').trim().toUpperCase()

/** Convert a product's attributes map → lowercased-key → value map. */
function productAttrMap(p) {
  const out = {}
  for (const [k, v] of Object.entries(p?.attributes || {})) {
    const lc = normKeyLc(k), val = normVal(v)
    if (lc && val) out[lc] = val
  }
  return out
}

/**
 * Build filter facets from a product list.
 * @returns {{ key:string, keyLc:string, values:{value:string,count:number}[] }[]}
 */
export function buildFacets(products = []) {
  const map = new Map() // keyLc -> { label, values: Map(value -> count) }
  for (const p of products) {
    for (const [k, v] of Object.entries(p?.attributes || {})) {
      const lc = normKeyLc(k), val = normVal(v)
      if (!lc || !val) continue
      if (!map.has(lc)) map.set(lc, { label: normKey(k), values: new Map() })
      const e = map.get(lc)
      e.values.set(val, (e.values.get(val) || 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([keyLc, e]) => ({
      key: e.label,
      keyLc,
      values: [...e.values.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true })),
    }))
    .sort((a, b) => a.key.localeCompare(b.key))
}

/**
 * Filter products by a selection map { keyLc: Set<value> }.
 * Standard faceted logic: a product must match EVERY active key (AND), and for
 * a key it matches if its value is one of the selected values (OR within key).
 */
export function applyFilters(products = [], selected = {}) {
  const active = Object.entries(selected).filter(([, set]) => set && set.size)
  if (!active.length) return products
  return products.filter((p) => {
    const pm = productAttrMap(p)
    return active.every(([keyLc, set]) => set.has(pm[keyLc]))
  })
}

export function countActive(selected = {}) {
  return Object.values(selected).reduce((n, set) => n + (set?.size || 0), 0)
}

/**
 * Aggregate keys + values across products for the admin editor comboboxes.
 * @returns {{ keys: string[], valuesByKey: Map<string, string[]> }}
 */
export function buildAttrIndex(products = []) {
  const keys = new Map()        // keyLc -> display label
  const valuesByKey = new Map() // keyLc -> Set(values)
  for (const p of products) {
    for (const [k, v] of Object.entries(p?.attributes || {})) {
      const lc = normKeyLc(k)
      if (!lc) continue
      if (!keys.has(lc)) keys.set(lc, normKey(k))
      const val = normVal(v)
      if (!val) continue
      if (!valuesByKey.has(lc)) valuesByKey.set(lc, new Set())
      valuesByKey.get(lc).add(val)
    }
  }
  return {
    keys: [...keys.values()].sort((a, b) => a.localeCompare(b)),
    valuesByKey,
  }
}

/** Values previously used for a given key (case-insensitive), sorted. */
export function valuesForKey(valuesByKey, key) {
  const set = valuesByKey.get(normKeyLc(key))
  return set ? [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) : []
}

/** Convert an attributes map → editable rows [{key, value}]. */
export function attrsToRows(attributes) {
  return Object.entries(attributes || {}).map(([key, value]) => ({ key, value: normVal(value) }))
}

/** Convert editable rows → a clean attributes map (last write wins, blanks dropped). */
export function rowsToAttrs(rows = []) {
  const out = {}
  for (const r of rows) {
    const k = normKey(r.key), v = normVal(r.value)
    if (k && v) out[k] = v
  }
  return out
}
