/**
 * Entity registry — the single source of truth for what content types exist.
 *
 * Every entry becomes:
 *   • a MongoDB collection
 *   • a generic REST resource at /api/<name> (list/get/create/update/delete)
 *   • a future admin-UI form (the `fields` hints describe the shape)
 *
 * To add a brand-new content type (say "webinars" or "careers"), add ONE entry
 * here and the API + admin tooling pick it up automatically. Documents are
 * schemaless, so the future UI can add fields without a migration.
 *
 * idField:
 *   'slug'  → public, human-readable id used in URLs (products, software…)
 *   '_id'   → ordinary list items addressed by Mongo id (testimonials, slides…)
 * ordered: keep insertion order via an `order` field (carousels, grids).
 * singleton: exactly one document (site settings, navigation).
 */

export const entities = [
  // ── Catalog ────────────────────────────────────────────────
  { name: 'products',     label: 'Products',        idField: 'slug', fields: ['slug', 'title', 'category', 'summary', 'image', 'shortHtml', 'descHtml', 'images', 'displayImages', 'features', 'accent'] },
  { name: 'software',     label: 'Software',        idField: 'slug', fields: ['slug', 'title', 'eyebrow', 'description', 'heroImage', 'button', 'cards', 'features', 'techniques', 'sections', 'external', 'href', 'image'] },
  { name: 'categories',   label: 'Product Categories', idField: 'slug', fields: ['slug', 'title', 'summary', 'products'] },
  { name: 'applications', label: 'Applications',    idField: 'slug', fields: ['slug', 'title', 'panelTitle', 'panelParagraphs', 'youtubeId', 'detail'] },

  // ── Editorial / knowledge ──────────────────────────────────
  { name: 'resources',    label: 'Resources',       idField: 'slug', ordered: true, fields: ['slug', 'title', 'description', 'image', 'href'] },
  { name: 'events',       label: 'Events',          idField: 'slug', ordered: true, fields: ['slug', 'title', 'subtitle', 'sections', 'gallery', 'flyers'] },
  { name: 'posts',        label: 'Blog Posts',      idField: 'slug', ordered: true, fields: ['slug', 'eyebrow', 'title', 'body', 'date'] },

  // ── Social proof ───────────────────────────────────────────
  { name: 'testimonials', label: 'Testimonials',    idField: '_id', ordered: true, fields: ['name', 'role', 'quote', 'image', 'rating'] },
  { name: 'certificates', label: 'Certificates',    idField: '_id', ordered: true, fields: ['key', 'image'] },
  { name: 'clients',      label: 'Client Logos',    idField: '_id', ordered: true, fields: ['image'] },

  // ── Contact / locations ────────────────────────────────────
  { name: 'offices',      label: 'Offices',         idField: '_id', ordered: true, fields: ['title', 'lines', 'mapSrc', 'mapTitle'] },
  { name: 'contactMethods', label: 'Contact Methods', idField: '_id', ordered: true, fields: ['kind', 'label', 'value', 'href', 'hint'] },

  // ── Home page modules ──────────────────────────────────────
  { name: 'slides',       label: 'Hero Slides',     idField: '_id', ordered: true, fields: ['eyebrow', 'title', 'description', 'cta', 'href', 'image'] },
  { name: 'areas',        label: 'Application Areas', idField: '_id', ordered: true, fields: ['icon', 'title', 'description'] },
  { name: 'segments',     label: 'Business Segments', idField: '_id', ordered: true, fields: ['title', 'image'] },
  { name: 'homeProducts', label: 'Featured Products', idField: '_id', ordered: true, fields: ['title', 'href', 'image'] },
  { name: 'newProducts',  label: 'New Innovations', idField: '_id', ordered: true, fields: ['title', 'href', 'image'] },

  // ── Energy / batteries ─────────────────────────────────────
  { name: 'batterySlides',    label: 'Battery Hero Slides', idField: '_id', ordered: true },
  { name: 'batteryTabs',      label: 'Battery Tabs',        idField: '_id', ordered: true },
  { name: 'batteryAreas',     label: 'Battery Application Areas', idField: '_id', ordered: true },
  { name: 'batteryInstruments', label: 'Battery Instruments', idField: '_id', ordered: true },

  // ── Site-wide config ───────────────────────────────────────
  { name: 'settings',     label: 'Site Settings',   singleton: true },
]

export const entityByName = Object.fromEntries(entities.map((e) => [e.name, e]))

export function getEntity(name) {
  return entityByName[name] || null
}
