/**
 * Seed the store from the legacy content sources (src/data.js + productDetails.json).
 *
 * This is the migration: it reads the existing hand-written content ONCE and
 * loads it into the database, so there is zero content loss and nothing is
 * hand-copied. After this runs, the frontend reads from the API and the
 * 1600-line monolith is no longer the source of truth.
 *
 *   node src/seed.js
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { connect, disconnect } from './db.js'
import { repository as repo } from './repository.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Legacy hand-written content lives here only as the one-time seed source.
const SEED_SRC = path.resolve(__dirname, '..', 'seed-data')

const data = await import(pathToFileURL(path.join(SEED_SRC, 'data.js')).href)
const productDetails = JSON.parse(fs.readFileSync(path.join(SEED_SRC, 'productDetails.json'), 'utf8'))

const slugFromPath = (p) => p.replace(/^\/product\//, '').replace(/^\//, '').replace(/\/$/, '')

async function run() {
  await connect()

  // ── Products: rich scraped detail + catalog metadata ──────────
  const catalogBySlug = {}
  for (const item of data.productCatalog) {
    for (const a of item.aliases || []) catalogBySlug[slugFromPath(a)] = item
    catalogBySlug[item.key] = item
  }
  const products = Object.entries(productDetails).map(([key, d]) => {
    const slug = slugFromPath(key)
    const cat = catalogBySlug[slug] || {}
    return {
      slug,
      title: d.title || cat.title || slug,
      category: cat.category || '',
      summary: cat.summary || '',
      features: cat.features || [],
      accent: cat.accent || '',
      images: d.images?.length ? d.images : (cat.image ? [cat.image] : []),
      shortHtml: d.shortHtml || '',
      descHtml: d.descHtml || '',
      displayImages: d.displayImages || [],
    }
  })
  await repo.replaceAll('products', products)

  // ── Software: listing card + rich detail ──────────────────────
  const software = data.softwareCards.map((card) => {
    const slug = slugFromPath(card.href || card.title.toLowerCase().replace(/\s+/g, '-'))
    const detail = data.softwareDetails[slug] || null
    return { slug, ...card, detail }
  })
  await repo.replaceAll('software', software)

  // ── Product categories ────────────────────────────────────────
  const categories = Object.entries(data.productCategories).map(([slug, c]) => ({ slug, ...c }))
  await repo.replaceAll('categories', categories)

  // ── Applications (the overview-page tabs) ─────────────────────
  const applications = data.applicationCards.map((c) => ({
    slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    ...c,
  }))
  await repo.replaceAll('applications', applications)

  // ── Editorial ─────────────────────────────────────────────────
  await repo.replaceAll('resources', data.resourceCards.map((r) => ({
    slug: (r.href || r.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    ...r,
  })))

  const ev = data.routePages.event || {}
  await repo.replaceAll('events', [{
    slug: 'classone-at-research-expo',
    title: ev.title || 'Events',
    subtitle: ev.subtitle || '',
    sections: ev.sections || [],
    gallery: ev.gallery || [],
    flyers: ev.flyers || [],
  }])

  await repo.replaceAll('posts', [{
    slug: 'welcome-to-wordpress',
    eyebrow: 'Hello world!',
    title: 'Welcome to WordPress',
    body: 'Welcome to WordPress. This is your first post. Edit or delete it, then start writing!',
    date: '2025-07-01',
  }])

  // ── Social proof ──────────────────────────────────────────────
  await repo.replaceAll('testimonials', data.testimonials)
  await repo.replaceAll('certificates', data.certificateSlides)
  await repo.replaceAll('clients', data.clientBadges.map((image) => ({ image })))

  // ── Contact / locations ───────────────────────────────────────
  await repo.replaceAll('offices', data.contactOffices)
  const c = data.contact
  await repo.replaceAll('contactMethods', [
    { kind: 'whatsapp', label: 'Chat via WhatsApp', value: 'Chat directly, or leave a message', href: c.whatsappHref },
    { kind: 'email', label: c.email, value: 'Usually respond within a business day', href: `mailto:${c.email}` },
    { kind: 'phone', label: c.phoneDisplay, value: 'Call us during business hours', href: `tel:${c.phone}` },
  ])

  // ── Home modules ──────────────────────────────────────────────
  await repo.replaceAll('slides', data.homeSlides)
  await repo.replaceAll('areas', data.biosensorAreas)
  await repo.replaceAll('segments', data.businessSegments)
  await repo.replaceAll('homeProducts', data.biosensorProducts)
  await repo.replaceAll('newProducts', data.newestInnovations)

  // ── Batteries / energy ────────────────────────────────────────
  await repo.replaceAll('batterySlides', data.batteryHeroSlides)
  await repo.replaceAll('batteryTabs', data.batteryTabs)
  await repo.replaceAll('batteryAreas', data.batteryApplicationAreas)
  await repo.replaceAll('batteryInstruments', data.batteryInstruments)

  // ── Site-wide settings (singleton) ────────────────────────────
  const { event, ...routePagesRest } = data.routePages
  await repo.replaceAll('settings', [{
    key: 'site',
    contact: data.contact,
    nav: { main: data.mainNavLinks, top: data.topStripLinks },
    assets: data.imageAssets,
    about: {
      message: data.aboutMessage,
      mission: data.missionText,
      vision: data.visionText,
      expertise: data.expertisePoints,
      team: data.aboutTeam,
    },
    search: data.searchIndex,
    routePages: routePagesRest, // spectro / edu / corrosion / enquiry
  }])

  // Report
  const counts = {}
  for (const name of ['products', 'software', 'categories', 'applications', 'resources',
    'events', 'posts', 'testimonials', 'certificates', 'clients', 'offices', 'contactMethods',
    'slides', 'areas', 'segments', 'homeProducts', 'newProducts',
    'batterySlides', 'batteryTabs', 'batteryAreas', 'batteryInstruments', 'settings']) {
    counts[name] = (await repo.list(name)).length
  }
  console.log('[seed] done:', counts)
  await disconnect()
}

run().catch((err) => { console.error('[seed] failed:', err); process.exit(1) })
