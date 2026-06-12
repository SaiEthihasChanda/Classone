/** Trim trailing slashes and collapse double slashes, always return at least '/' */
export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  const cleaned = pathname.replace(/\/+$/, '').replace(/\/+/g, '/')
  return cleaned || '/'
}

/** 'my-slug-here' → 'My Slug Here' */
export function capitalizeSlug(slug) {
  return slug.split('-').filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

/** 'Jane Doe' → 'JD' */
export function createAvatar(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map(p => p.charAt(0)).join('').toUpperCase()
}

/** Returns true for absolute / mail / tel hrefs */
export function isExternal(href) {
  return /^(https?:|mailto:|tel:)/.test(href)
}

/** Find an item by one of its aliases */
export function findByAlias(items, path) {
  return items.find(item => item.aliases?.includes(path)) ?? null
}

/** clamp(value, min, max) */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/** Debounce a function */
export function debounce(fn, ms = 200) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}
