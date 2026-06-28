/**
 * Per-image position / zoom adjustments.
 *
 * Every uploaded image can carry a small transform — `{ zoom, x, y }` — letting
 * an admin frame it exactly how it should appear on the public site (instead of
 * the old "fit / show-as-is" toggle). The transform is resolution-independent:
 *
 *   • zoom  — scale multiplier (1 = whole image visible, the historic default)
 *   • x, y  — pan offset as a PERCENT of the frame (normalised, so the same
 *             value reproduces identically at any container size)
 *
 * Rendering rule (shared by the editor preview and the public pages): the image
 * sits `object-fit: contain` inside a fixed frame, then
 *   transform: translate(x%, y%) scale(zoom)
 * is applied. With the default (zoom 1, x 0, y 0) this is a no-op, so images
 * with no adjustment render exactly as they did before — no migration needed.
 *
 * Adjustments are stored per entity as a compact list: `imageAdjust: [{ url,
 * zoom, x, y }]` (only non-default images are kept). A plain array — rather than
 * a URL-keyed map — avoids Firestore map-key character restrictions and survives
 * gallery reordering, because each entry is matched by its image URL.
 */

export const DEFAULT_ADJUST = { zoom: 1, x: 0, y: 0 }

/**
 * Gallery container aspect ratios. A single ratio applies to every image of a
 * post / product, so the gallery box never changes shape between images (images
 * of a different native shape letterbox or crop, as chosen by the framing).
 */
export const RATIOS = { '1:1': '1', '16:9': '16 / 9' }
export const DEFAULT_RATIO = '1:1'
export const ratioValue = (r) => RATIOS[r] || RATIOS[DEFAULT_RATIO]
/** Inline style applying a chosen ratio as `aspect-ratio`. */
export const aspectStyle = (r) => ({ aspectRatio: ratioValue(r) })

export const ZOOM_MIN = 1
export const ZOOM_MAX = 4
export const PAN_LIMIT = 120 // max |x|,|y| in percent

export const clampZoom = (z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(z) || 1))
export const clampPan = (v) => Math.min(PAN_LIMIT, Math.max(-PAN_LIMIT, Number(v) || 0))

/** Coerce any partial/loose value into a clean { zoom, x, y }. */
export function normAdjust(a) {
  if (!a) return { ...DEFAULT_ADJUST }
  return { zoom: clampZoom(a.zoom), x: clampPan(a.x), y: clampPan(a.y) }
}

/** True when an adjustment is the identity transform (nothing to store/apply). */
export function isDefaultAdjust(a) {
  const n = normAdjust(a)
  return n.zoom === 1 && n.x === 0 && n.y === 0
}

/**
 * Inline style for an `<img>` given an adjustment. Returns `undefined` for the
 * default transform so unadjusted images keep their plain (CSS-driven) render.
 */
export function adjustStyle(a) {
  if (!a || isDefaultAdjust(a)) return undefined
  const n = normAdjust(a)
  return {
    transform: `translate(${n.x}%, ${n.y}%) scale(${n.zoom})`,
    transformOrigin: 'center',
  }
}

/** Find the adjustment for a given image URL within a stored list. */
export function findAdjust(list, url) {
  if (!Array.isArray(list) || !url) return null
  const hit = list.find((e) => e && e.url === url)
  return hit ? normAdjust(hit) : null
}

/**
 * Return a new list with `url`'s adjustment set to `value`. Default transforms
 * are dropped (so the list only ever holds images that were actually framed).
 */
export function upsertAdjust(list, url, value) {
  const arr = Array.isArray(list) ? list.filter((e) => e && e.url !== url) : []
  if (url && value && !isDefaultAdjust(value)) {
    const n = normAdjust(value)
    arr.push({ url, zoom: n.zoom, x: n.x, y: n.y })
  }
  return arr
}

/** Drop entries whose image no longer exists (call on save with current URLs). */
export function pruneAdjust(list, urls) {
  if (!Array.isArray(list)) return []
  const keep = new Set((urls || []).filter(Boolean))
  return list.filter((e) => e && keep.has(e.url))
}
