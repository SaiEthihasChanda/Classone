/**
 * Helpers over the generated high-res image map (hiresImages.js).
 * hiresFor(slug)            → ordered image list for the product gallery.
 * primaryHires(href, alt)   → the lead high-res photo for a product card,
 *                             derived from its /product/<slug> href.
 */
import { HIRES_IMAGES } from './hiresImages'

export function hiresFor(slug) {
  return HIRES_IMAGES[slug] || null
}

export function primaryHires(href, fallback) {
  const slug = (href || '').replace(/^\/product\//, '').replace(/\/$/, '')
  const set = HIRES_IMAGES[slug]
  return (set && set[0]) || fallback
}
