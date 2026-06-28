/**
 * Data API — backed by Cloud Firestore.
 *
 * The frontend hooks (store.jsx) and pages are unchanged; this is the single
 * place that knows the backend. Each registry entity maps to a Firestore
 * collection of the same name:
 *   - slug entities  → document id is the slug      → getOne(entity, slug)
 *   - ordered lists  → docs carry an `order` field  → list() sorts by it
 *   - singletons     → one fixed doc (settings/site, content/pages)
 *
 * Reads are public (see firestore.rules); writes require an admin (added later).
 */
import { db, auth } from './firebase'
import { UNPUBLISHED, UNPUBLISHED_LABEL } from './catalog'
import {
  collection, collectionGroup, doc, getDoc, getDocs, query, orderBy, where,
  addDoc, setDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, deleteField, onSnapshot,
} from 'firebase/firestore'

// Soft delete: mark a doc deleted instead of removing it, so the super admin can
// recover it. Reads everywhere filter these out, so to admins it looks deleted.
const softDeletePatch = () => ({
  deleted: true,
  deletedAt: serverTimestamp(),
  deletedBy: auth.currentUser?.email || 'unknown',
})
const undeletePatch = () => ({
  deleted: deleteField(),
  deletedAt: deleteField(),
  deletedBy: deleteField(),
})

// Menu groups, in display order. Products live at
//   catalog/<group>/categories/<category>/products/<slug>
// Each product doc carries { slug, group, category, order, external }.
export const PRODUCT_GROUPS = [
  { slug: 'sensing',         label: 'Sensing' },
  { slug: 'energy',          label: 'Energy' },
  { slug: 'nano-technology', label: 'Nano Technology' },
  { slug: 'accessories',     label: 'Accessories' },
]
const GROUP_ORDER = Object.fromEntries(PRODUCT_GROUPS.map((g, i) => [g.slug, i]))

const productPath = (group, category, slug) =>
  ['catalog', group, 'categories', category, 'products', slug]

// Map a catalog/products snapshot doc → plain object incl. its full path.
const fromProductDoc = (d) => ({ id: d.id, path: d.ref.path, ...d.data() })

// Sort helper: group order → category → in-category order.
const byMenuOrder = (a, b) =>
  (GROUP_ORDER[a.group] ?? 99) - (GROUP_ORDER[b.group] ?? 99) ||
  String(a.category).localeCompare(String(b.category)) ||
  (a.order ?? 0) - (b.order ?? 0)

// Singleton entities → their fixed document id.
const SINGLETONS = { settings: 'site', content: 'pages' }

// Collections the chrome + home page need on first paint.
const BOOTSTRAP_COLLECTIONS = [
  'slides', 'areas', 'homeProducts', 'newProducts', 'segments',
  'testimonials', 'certificates', 'clients', 'contactMethods', 'categories',
  'headlines', 'team',
]

async function readList(name) {
  const snap = await getDocs(query(collection(db, name), orderBy('order')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((x) => !x.deleted)
}

async function readSingleton(name) {
  const snap = await getDoc(doc(db, name, SINGLETONS[name]))
  return snap.exists() ? snap.data() : {}
}

export const api = {
  // list() returns the object for singletons, otherwise the ordered array.
  list: (entity) => (SINGLETONS[entity] ? readSingleton(entity) : readList(entity)),

  getOne: async (entity, id) => {
    const snap = await getDoc(doc(db, entity, id))
    if (!snap.exists() || snap.data().deleted) {
      const err = new Error(`${entity}/${id} not found`)
      err.status = 404
      throw err
    }
    return { id: snap.id, ...snap.data() }
  },

  bootstrap: async () => {
    const lists = await Promise.all(BOOTSTRAP_COLLECTIONS.map(readList))
    const out = {}
    BOOTSTRAP_COLLECTIONS.forEach((n, i) => { out[n] = lists[i] })
    out.settings = await readSingleton('settings')
    out.content = await readSingleton('content')
    return out
  },

  // ── Enquiry submission (public — no auth required) ────────────
  submitEnquiry: async (data) => {
    return addDoc(collection(db, 'enquiries'), {
      ...data,
      submittedAt: serverTimestamp(),
    })
  },

  // Admin: list all submitted enquiries, newest first.
  listEnquiries: async () => {
    const snap = await getDocs(query(collection(db, 'enquiries'), orderBy('submittedAt', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  // Admin: permanently delete one enquiry.
  deleteEnquiry: async (id) => {
    await deleteDoc(doc(db, 'enquiries', id))
  },

  // ── Writes (admin only — gated by security rules) ──────────────
  create: async (entity, body) => {
    if (SINGLETONS[entity]) {
      await setDoc(doc(db, entity, SINGLETONS[entity]), body, { merge: true })
      return { id: SINGLETONS[entity], ...body }
    }
    const ref = await addDoc(collection(db, entity), body)
    return { id: ref.id, ...body }
  },

  update: async (entity, id, body) => {
    const ref = SINGLETONS[entity] ? doc(db, entity, SINGLETONS[entity]) : doc(db, entity, id)
    await updateDoc(ref, body)
    const snap = await getDoc(ref)
    return { id: snap.id, ...snap.data() }
  },

  // Soft delete — recoverable from the super-admin Recovery view.
  remove: async (entity, id) => {
    await updateDoc(doc(db, entity, id), softDeletePatch())
    return null
  },

  // ── Nested product catalog ─────────────────────────────────────
  // All "real" products (excludes external catalog links and the hidden
  // Unpublished group, which never appears anywhere on the public site).
  listProducts: async () => {
    const snap = await getDocs(collectionGroup(db, 'products'))
    return snap.docs.map(fromProductDoc)
      .filter((p) => p.group && p.group !== UNPUBLISHED && !p.external && !p.deleted)
      .sort(byMenuOrder)
  },

  // Every public catalog entry across all menus, including external links — used
  // by the tabbed public catalog, search and the menu preview. Hidden
  // (Unpublished) products are excluded.
  listCatalog: async () => {
    const snap = await getDocs(collectionGroup(db, 'products'))
    return snap.docs.map(fromProductDoc)
      .filter((p) => p.group && p.group !== UNPUBLISHED && !p.deleted)
      .sort(byMenuOrder)
  },

  // Like listCatalog but INCLUDES the Unpublished group — for the admin manager
  // only, so admins can see and reorganise hidden products.
  listCatalogAdmin: async () => {
    const snap = await getDocs(collectionGroup(db, 'products'))
    return snap.docs.map(fromProductDoc).filter((p) => p.group && !p.deleted).sort(byMenuOrder)
  },

  // Every catalog entry in one menu category (includes external links; excludes
  // the hidden Unpublished bucket).
  listProductsByCategory: async (category) => {
    const snap = await getDocs(query(collectionGroup(db, 'products'), where('category', '==', category)))
    return snap.docs.map(fromProductDoc)
      .filter((p) => !p.deleted && p.group !== UNPUBLISHED)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  },

  // One product by slug, regardless of which menu it lives in. Unpublished
  // products are treated as not found on the public site.
  getProductBySlug: async (slug) => {
    const snap = await getDocs(query(collectionGroup(db, 'products'), where('slug', '==', slug)))
    const hit = snap.docs.map(fromProductDoc).find((p) => p.group && p.group !== UNPUBLISHED && !p.deleted)
    if (!hit) { const e = new Error(`product ${slug} not found`); e.status = 404; throw e }
    return hit
  },

  // ── Admin product writes (gated by security rules) ─────────────
  createProduct: async (group, category, slug, data) => {
    const ref = doc(db, ...productPath(group, category, slug))
    const body = { external: false, ...data, slug, group, category }
    await setDoc(ref, body)
    return { id: slug, path: ref.path, ...body }
  },

  // Update in place when the menu is unchanged.
  updateProductAt: async (path, data) => {
    const ref = doc(db, ...path.split('/'))
    await updateDoc(ref, data)
    const snap = await getDoc(ref)
    return fromProductDoc(snap)
  },

  // Move a product to a different menu: atomically write the new doc and delete
  // the old one (single batch → no data loss, no residual document).
  moveProduct: async (oldPath, group, category, slug, data) => {
    const newRef = doc(db, ...productPath(group, category, slug))
    const body = { external: false, ...data, slug, group, category }
    const batch = writeBatch(db)
    batch.set(newRef, body)
    if (oldPath !== newRef.path) batch.delete(doc(db, ...oldPath.split('/')))
    await batch.commit()
    return { id: slug, path: newRef.path, ...body }
  },

  // Bulk-move many products to one (or several) destination menus in chunked
  // batches. Each move is { oldPath, group, category, slug, data } where `data`
  // already carries the per-item `order`. New doc written + old doc removed.
  bulkMoveProducts: async (moves) => {
    const CHUNK = 200 // ≤2 ops/move → well under Firestore's 500/batch limit
    for (let i = 0; i < moves.length; i += CHUNK) {
      const batch = writeBatch(db)
      for (const m of moves.slice(i, i + CHUNK)) {
        const newRef = doc(db, ...productPath(m.group, m.category, m.slug))
        batch.set(newRef, { external: false, ...m.data, slug: m.slug, group: m.group, category: m.category })
        if (m.oldPath !== newRef.path) batch.delete(doc(db, ...m.oldPath.split('/')))
      }
      await batch.commit()
    }
  },

  // Soft delete — recoverable from the Recovery view.
  deleteProductAt: async (path) => {
    await updateDoc(doc(db, ...path.split('/')), softDeletePatch())
    return null
  },

  // Bulk soft-delete many products (chunked batches).
  bulkDeleteProducts: async (paths) => {
    const CHUNK = 400
    for (let i = 0; i < paths.length; i += CHUNK) {
      const batch = writeBatch(db)
      for (const path of paths.slice(i, i + CHUNK)) batch.update(doc(db, ...path.split('/')), softDeletePatch())
      await batch.commit()
    }
  },

  // ── Menu taxonomy (groups → categories) ────────────────────────
  // Stored as catalog/<group> docs and catalog/<group>/categories/<cat> docs.
  loadTaxonomy: async () => {
    const gSnap = await getDocs(query(collection(db, 'catalog'), orderBy('order')))
    const groups = []
    for (const g of gSnap.docs) {
      const cSnap = await getDocs(query(collection(db, 'catalog', g.id, 'categories'), orderBy('order')))
      groups.push({
        slug: g.id,
        label: g.data().label || g.id,
        order: g.data().order ?? 0,
        categories: cSnap.docs.map(c => ({ slug: c.id, label: c.data().title || c.id, order: c.data().order ?? 0 })),
      })
    }
    return groups
  },
  createGroup: (slug, label, order) => setDoc(doc(db, 'catalog', slug), { slug, label, order }),
  updateGroup: (slug, data) => updateDoc(doc(db, 'catalog', slug), data),
  createCategory: (group, slug, title, order) =>
    setDoc(doc(db, 'catalog', group, 'categories', slug), { slug, title, group, order }),
  updateCategory: (group, slug, data) => updateDoc(doc(db, 'catalog', group, 'categories', slug), data),

  // Make sure the hidden "Unpublished" group + its single bucket category exist
  // (idempotent — only writes if missing) so it always shows in the admin manager
  // and products can be parked there.
  ensureUnpublished: async () => {
    const gRef = doc(db, 'catalog', UNPUBLISHED)
    if (!(await getDoc(gRef)).exists()) await setDoc(gRef, { slug: UNPUBLISHED, label: UNPUBLISHED_LABEL, order: 999 })
    const cRef = doc(db, 'catalog', UNPUBLISHED, 'categories', UNPUBLISHED)
    if (!(await getDoc(cRef)).exists()) await setDoc(cRef, { slug: UNPUBLISHED, title: UNPUBLISHED_LABEL, group: UNPUBLISHED, order: 0 })
  },

  // Remove a category's taxonomy doc (its products must be moved out first).
  deleteCategoryDoc: (group, slug) => deleteDoc(doc(db, 'catalog', group, 'categories', slug)),

  // Remove a whole group: delete each of its category docs then the group doc
  // (products must be moved out first). The Unpublished group cannot be removed.
  deleteGroupDoc: async (group, catSlugs) => {
    if (group === UNPUBLISHED) throw new Error('The Unpublished group cannot be deleted.')
    const batch = writeBatch(db)
    for (const c of catSlugs) batch.delete(doc(db, 'catalog', group, 'categories', c))
    batch.delete(doc(db, 'catalog', group))
    await batch.commit()
  },

  // ── News posts ─────────────────────────────────────────────────
  // Stored in the `newsposts` collection. Each doc has:
  //   slug, title, shortDesc, longDesc (HTML), images (URL[]),
  //   date (ISO string YYYY-MM-DD), location?, tags (string[]), published (bool)
  listNewsPosts: async () => {
    const snap = await getDocs(query(collection(db, 'newsposts'), orderBy('date', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => !p.deleted)
  },

  getNewsPostBySlug: async (slug) => {
    const snap = await getDocs(query(collection(db, 'newsposts'), where('slug', '==', slug)))
    const hit = snap.docs.map(d => ({ id: d.id, ...d.data() })).find(p => !p.deleted)
    if (!hit) { const e = new Error(`newspost ${slug} not found`); e.status = 404; throw e }
    return hit
  },

  createNewsPost: async (data) => {
    const ref = await addDoc(collection(db, 'newsposts'), data)
    return { id: ref.id, ...data }
  },

  updateNewsPost: async (id, data) => {
    await updateDoc(doc(db, 'newsposts', id), data)
    const snap = await getDoc(doc(db, 'newsposts', id))
    return { id: snap.id, ...snap.data() }
  },

  // Soft delete — recoverable from the super-admin Recovery view.
  deleteNewsPost: async (id) => {
    await updateDoc(doc(db, 'newsposts', id), softDeletePatch())
    return null
  },

  // ── Live counts (real-time dashboard stats) ────────────────────
  // Returns an unsubscribe fn. The product count matches the catalog manager
  // (every non-deleted catalog entry incl. external links), so the two agree.
  watchProductsCount: (cb) => onSnapshot(
    collectionGroup(db, 'products'),
    (snap) => cb(snap.docs.map(fromProductDoc).filter((p) => p.group && p.group !== UNPUBLISHED && !p.deleted).length),
    () => cb(null),
  ),
  watchNewsCount: (cb) => onSnapshot(
    collection(db, 'newsposts'),
    (snap) => cb(snap.docs.filter((d) => !d.data().deleted).length),
    () => cb(null),
  ),
  // Live count for any simple top-level collection (excludes soft-deleted docs).
  watchCollectionCount: (name, cb) => onSnapshot(
    collection(db, name),
    (snap) => cb(snap.docs.filter((d) => !d.data().deleted).length),
    () => cb(null),
  ),

  // ── Recovery (super admin only) ────────────────────────────────
  // Gather every soft-deleted item across the deletable collections.
  listDeleted: async () => {
    const out = []
    const [prods, news, slides] = await Promise.all([
      getDocs(query(collectionGroup(db, 'products'), where('deleted', '==', true))),
      getDocs(query(collection(db, 'newsposts'), where('deleted', '==', true))),
      getDocs(query(collection(db, 'slides'), where('deleted', '==', true))),
    ])
    for (const d of prods.docs)  out.push({ kind: 'product', id: d.id, path: d.ref.path, ...d.data() })
    for (const d of news.docs)   out.push({ kind: 'news',   id: d.id, ...d.data() })
    for (const d of slides.docs) out.push({ kind: 'slide',  id: d.id, ...d.data() })
    return out
  },

  _deletedRef: (item) =>
    item.kind === 'product' ? doc(db, ...item.path.split('/'))
    : item.kind === 'news'  ? doc(db, 'newsposts', item.id)
    : doc(db, 'slides', item.id),

  // Un-delete: clear the soft-delete markers so it returns to normal lists.
  restoreDeleted: async (item) => {
    await updateDoc(api._deletedRef(item), undeletePatch())
    return null
  },

  // Permanent purge (hard delete the document).
  purgeDeleted: async (item) => {
    await deleteDoc(api._deletedRef(item))
    return null
  },
}
