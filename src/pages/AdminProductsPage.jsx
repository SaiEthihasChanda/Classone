import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { uploadImage } from '../lib/storage'
import { useTaxonomy, categoriesForGroupIn, groupForCategoryIn } from '../lib/taxonomy'
import { UNPUBLISHED } from '../lib/catalog'
import { RichTextEditor } from '../components/common/RichTextEditor'
import { TagInput } from '../components/common/TagInput'
import { ComboBox } from '../components/common/ComboBox'
import { AdjustableImage, RatioField } from '../components/common/AdjustableImage'
import { findAdjust, upsertAdjust, pruneAdjust } from '../lib/imageAdjust'
import { generateTags } from '../lib/tags'
import { buildAttrIndex, valuesForKey, attrsToRows, rowsToAttrs } from '../lib/attributes'
import { archiveRemovedImages } from '../lib/archive'
import { AdminTopbar } from '../components/layout/AdminTopbar'
import { Grid, Box, LogOut, ArrowRight, X, ImageIcon, Plus, Search, Trash, EyeOff, MoveTo, CheckSquare, ChevronDown } from '../components/ui/Icons'

/** Field set written when (re)creating a product doc during a move. Mirrors the
 *  shape the editor saves, so a moved/bulk-moved product keeps all its data. */
function productData(p) {
  return p.external
    ? { title: p.title, href: p.href || '', image: p.image || p.images?.[0] || '', external: true, tags: p.tags || [], imageAdjust: p.imageAdjust || [], imageRatio: p.imageRatio || '1:1', attributes: p.attributes || {} }
    : { title: p.title, external: false, productType: p.productType || '', shortHtml: p.shortHtml || '', descHtml: p.descHtml || '', images: p.images || [], displayImages: p.displayImages || [], tags: p.tags || [], imageAdjust: p.imageAdjust || [], imageRatio: p.imageRatio || '1:1', attributes: p.attributes || {} }
}
/** Next free order index in a destination category. */
const maxOrderIn = (products, group, category) =>
  (products || []).filter(p => p.group === group && p.category === category)
    .reduce((m, x) => Math.max(m, (x.order ?? 0) + 1), 0)
/** Build bulk-move descriptors for a set of products into one destination. */
const buildMoves = (items, products, group, category) => {
  const base = maxOrderIn(products, group, category)
  return items.map((p, i) => ({ oldPath: p.path, group, category, slug: p.slug, data: { ...productData(p), order: base + i } }))
}

/** Editable list of product attribute (key → value) rows, with comboboxes that
 *  pull from previously-used keys/values or accept brand-new entries. */
function AttributeEditor({ rows, onChange, index }) {
  const setRow = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const add = () => onChange([...rows, { key: '', value: '' }])
  const remove = (i) => onChange(rows.filter((_, j) => j !== i))
  return (
    <div className="attr-editor">
      {rows.length > 0 && (
        <div className="attr-rows">
          {rows.map((r, i) => (
            <div className="attr-row" key={i}>
              <ComboBox value={r.key} onChange={v => setRow(i, { key: v })}
                options={index.keys} placeholder="Attribute (e.g. Material)" />
              <ComboBox value={r.value} onChange={v => setRow(i, { value: v })}
                options={valuesForKey(index.valuesByKey, r.key)} placeholder="Value (e.g. PLATINUM)" upper />
              <button type="button" className="attr-row__del" onClick={() => remove(i)} aria-label="Remove attribute"><X /></button>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="attr-add" onClick={add}><Plus /> Add attribute</button>
    </div>
  )
}

const slugify = (s) => (s || '').toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** A single product tile — editable, draggable, and (in select mode) selectable. */
function ProductCard({ p, catLabel, selectMode, isSelected, isDragging, onToggle, onEdit, onDelete, busy, drag }) {
  const img = p.images?.[0] || p.image
  return (
    <div
      className={`admin-prodcard${isDragging ? ' is-dragging' : ''}${selectMode ? ' is-selectable' : ''}${isSelected ? ' is-selected' : ''}`}
      draggable={!selectMode && !!drag}
      onDragStart={!selectMode ? drag?.onDragStart : undefined}
      onDragEnd={!selectMode ? drag?.onDragEnd : undefined}
      onClick={selectMode ? () => onToggle(p) : undefined}
      role={selectMode ? 'checkbox' : undefined}
      aria-checked={selectMode ? isSelected : undefined}
      tabIndex={selectMode ? 0 : undefined}
      onKeyDown={selectMode ? (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(p) } } : undefined}
    >
      {selectMode && <span className={`admin-prodcard__check${isSelected ? ' is-on' : ''}`} aria-hidden="true"><CheckSquare /></span>}
      <div className="admin-prodcard__media">
        {img ? <img src={img} alt="" loading="lazy" /> : <ImageIcon />}
        {p.external && <span className="admin-prodcard__ext">External</span>}
      </div>
      <div className="admin-prodcard__body">
        <span className="admin-prodcard__title">{p.title}</span>
        {catLabel && <span className="admin-prodcard__cat">{catLabel}</span>}
      </div>
      {!selectMode && (
        <div className="admin-prodcard__actions">
          <button className="btn btn--ghost btn--sm" onClick={() => onEdit(p)} disabled={busy}>Edit</button>
          <button className="btn btn--ghost btn--sm admin-del" onClick={() => onDelete(p)} disabled={busy}>Delete</button>
        </div>
      )}
    </div>
  )
}

/**
 * Admin product manager. Lists every catalog product grouped by menu, and
 * adds/edits/deletes them. Saving writes straight to the nested catalog in
 * Firestore, so the public site reflects changes immediately. Products can be
 * dragged between menus, bulk-selected to move/hide/delete, and parked in the
 * hidden "Unpublished" group (which never appears on the public site).
 */
export function AdminProductsPage({ onNavigate }) {
  const { isAdmin, loading, logout } = useAuth()
  const { groups: CATALOG, reload: reloadTaxonomy } = useTaxonomy()
  const [products, setProducts] = useState(null)
  const [editing, setEditing] = useState(null) // product object, or {__new:true}, or null
  const [menusOpen, setMenusOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [activeGroup, setActiveGroup] = useState(CATALOG[0]?.slug)
  const [dragProduct, setDragProduct] = useState(null)
  const [dragOverCat, setDragOverCat] = useState(null)
  const [search, setSearch] = useState('')
  // ── multiselect ──
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState(() => new Set())
  const [actionsOpen, setActionsOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const actionsRef = useRef(null)

  useEffect(() => { if (!loading && !isAdmin) onNavigate?.('/login') }, [loading, isAdmin, onNavigate])
  useEffect(() => {
    if (CATALOG.length && !CATALOG.some(g => g.slug === activeGroup)) setActiveGroup(CATALOG[0].slug)
  }, [CATALOG, activeGroup])

  async function reload() {
    const list = await api.listCatalogAdmin() // includes external links + the Unpublished group
    setProducts(list)
  }
  // On first load, make sure the hidden Unpublished group exists, then load.
  useEffect(() => {
    if (!isAdmin) return
    let alive = true
    ;(async () => {
      try { await api.ensureUnpublished(); await reloadTaxonomy() } catch { /* keep going */ }
      if (alive) await reload()
    })()
    return () => { alive = false }
  }, [isAdmin]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close the Actions menu on an outside click.
  useEffect(() => {
    if (!actionsOpen) return
    const onDoc = (e) => { if (actionsRef.current && !actionsRef.current.contains(e.target)) setActionsOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [actionsOpen])

  async function handleSignOut() { await logout(); onNavigate?.('/') }

  async function handleCategoryMove(targetCat) {
    if (!dragProduct || dragProduct.category === targetCat.slug) { setDragProduct(null); setDragOverCat(null); return }
    setBusy(true)
    try {
      const p = dragProduct
      const order = maxOrderIn(products, activeGroup, targetCat.slug)
      await api.moveProduct(p.path, activeGroup, targetCat.slug, p.slug, { ...productData(p), order })
      await reload()
    } finally { setBusy(false); setDragProduct(null); setDragOverCat(null) }
  }

  async function handleDelete(p) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    setBusy(true)
    try { await api.deleteProductAt(p.path); await reload() }
    finally { setBusy(false) }
  }

  // ── selection ──
  const selectedList = useMemo(() => (products || []).filter(p => selected.has(p.path)), [products, selected])
  const toggleSelect = (p) => setSelected(s => { const n = new Set(s); n.has(p.path) ? n.delete(p.path) : n.add(p.path); return n })
  const clearSel = () => setSelected(new Set())
  const exitSelect = () => { setSelectMode(false); setSelected(new Set()); setActionsOpen(false) }

  async function bulkMoveTo(group, category) {
    if (!selectedList.length) return
    setBusy(true)
    try {
      await api.bulkMoveProducts(buildMoves(selectedList, products, group, category))
      await reload(); clearSel(); setActionsOpen(false); setMoveOpen(false)
    } finally { setBusy(false) }
  }
  async function bulkDelete() {
    const n = selected.size
    if (!n || !window.confirm(`Delete ${n} product${n > 1 ? 's' : ''}? This cannot be undone.`)) return
    setBusy(true)
    try { await api.bulkDeleteProducts([...selected]); await reload(); clearSel(); setActionsOpen(false) }
    finally { setBusy(false) }
  }

  // ── menu / group deletion (products are parked in Unpublished, never lost) ──
  async function handleDeleteCategory(g, c) {
    const n = c.items?.length || 0
    if (!window.confirm(`Delete the "${c.label}" menu?${n ? ` Its ${n} product${n > 1 ? 's' : ''} will be moved to Unpublished.` : ''}`)) return
    setBusy(true)
    try {
      if (n) await api.bulkMoveProducts(buildMoves(c.items, products, UNPUBLISHED, UNPUBLISHED))
      await api.deleteCategoryDoc(g.slug, c.slug)
      await reload(); await reloadTaxonomy()
    } finally { setBusy(false) }
  }
  async function handleDeleteGroup(g) {
    const items = g.categories.flatMap(c => c.items || [])
    const n = items.length
    if (!window.confirm(`Delete the "${g.label}" group and its menus?${n ? ` Its ${n} product${n > 1 ? 's' : ''} will be moved to Unpublished.` : ''}`)) return
    setBusy(true)
    try {
      if (n) await api.bulkMoveProducts(buildMoves(items, products, UNPUBLISHED, UNPUBLISHED))
      await api.deleteGroupDoc(g.slug, g.categories.map(c => c.slug))
      await reload(); await reloadTaxonomy()
      if (activeGroup === g.slug) setActiveGroup(CATALOG.find(x => x.slug !== g.slug)?.slug)
    } finally { setBusy(false) }
  }

  // Group products by menu group → category for display.
  const grouped = useMemo(() => {
    const byCat = {}
    for (const p of products || []) (byCat[p.category] ||= []).push(p)
    return CATALOG.map(g => ({
      ...g,
      categories: g.categories.map(c => ({ ...c, items: byCat[c.slug] || [] })),
    }))
  }, [products, CATALOG])

  // Category slug → human label, for searching by category name.
  const catLabels = useMemo(() => {
    const m = {}
    for (const g of CATALOG) for (const c of g.categories) m[c.slug] = c.label
    return m
  }, [CATALOG])

  // Flat, token-matched search across every group/category (incl. Unpublished).
  const searchActive = search.trim().length > 0
  const searchResults = useMemo(() => {
    if (!searchActive) return []
    const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return (products || []).filter(p => {
      const hay = [p.title, p.productType, catLabels[p.category], ...(p.tags || [])]
        .filter(Boolean).join(' ').toLowerCase()
      return tokens.every(t => hay.includes(t))
    })
  }, [searchActive, search, products, catLabels])

  if (loading) return <section className="section admin-section"><div className="container"><p>Checking access…</p></div></section>
  if (!isAdmin) return null

  const activeGrp = grouped.find(g => g.slug === activeGroup) || grouped[0]
  const isUnpubTab = activeGrp?.slug === UNPUBLISHED
  const moveGroups = grouped.filter(g => g.slug !== UNPUBLISHED) // "move to menu" targets

  return (
    <section className="admin-section">
      <AdminTopbar
        icon={Box}
        title="Manage Products"
        subtitle={products ? `${products.length} products` : 'Loading…'}
        onNavigate={onNavigate}
        actions={<>
          <button className="btn btn--ghost btn--sm" onClick={() => onNavigate?.('/admin')}><Grid /> Dashboard</button>
          <button className="btn btn--primary btn--sm" onClick={handleSignOut}><LogOut /> Sign out</button>
        </>}
      />

      <div className={`admin-products${selectMode ? ' is-selecting' : ''}`}>
        <div className="admin-products__bar">
          <div className="catalog-tabs" role="tablist" aria-label="Product groups">
            {grouped.map(g => {
              const count = g.categories.reduce((n, c) => n + c.items.length, 0)
              const unpub = g.slug === UNPUBLISHED
              return (
                <button key={g.slug} role="tab" aria-selected={g.slug === activeGroup}
                  className={`catalog-tab ${g.slug === activeGroup ? 'is-active' : ''} ${unpub ? 'catalog-tab--unpub' : ''}`.trim()}
                  disabled={searchActive}
                  onClick={() => setActiveGroup(g.slug)}>
                  {unpub && <EyeOff />}{g.label}<span className="catalog-tab__count">{count}</span>
                </button>
              )
            })}
          </div>
          <div className="admin-products__btns">
            <button className={`btn btn--sm ${selectMode ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => selectMode ? exitSelect() : setSelectMode(true)}>
              <CheckSquare /> {selectMode ? 'Selecting' : 'Select'}
            </button>
            <button className="btn btn--outline btn--sm" onClick={() => setMenusOpen(true)} disabled={selectMode}>
              <Grid /> Edit menus
            </button>
            <button className="btn btn--primary btn--sm" onClick={() => setEditing({ __new: true })} disabled={selectMode}>
              <Plus /> Add product
            </button>
          </div>
        </div>

        {/* Catalog search — filters across every group by title, type, category or tag */}
        <div className="admin-catalog-search">
          <span className="admin-catalog-search__icon"><Search /></span>
          <input
            className="admin-catalog-search__input"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all products by name, type, category or tag…"
            aria-label="Search products"
          />
          {search && (
            <button className="admin-catalog-search__clear" onClick={() => setSearch('')} aria-label="Clear search"><X /></button>
          )}
        </div>

        {!searchActive && isUnpubTab && (
          <p className="admin-unpub-note"><EyeOff /> These products are hidden from the public site. Use <strong>Select</strong> → <strong>Actions</strong> (or drag in a menu) to move them back into a menu and publish them.</p>
        )}

        {products === null ? (
          <p className="admin-note">Loading products…</p>
        ) : searchActive ? (
          <div className="admin-prodcat">
            <div className="admin-prodcat__head">
              <span className="admin-prodcat__name">Search results</span>
              <span className="admin-prodcat__count">{searchResults.length}</span>
            </div>
            {searchResults.length ? (
              <div className="admin-prodgrid">
                {searchResults.map(p => (
                  <ProductCard key={p.path} p={p} catLabel={catLabels[p.category] || p.category}
                    selectMode={selectMode} isSelected={selected.has(p.path)}
                    onToggle={toggleSelect} onEdit={setEditing} onDelete={handleDelete} busy={busy} />
                ))}
              </div>
            ) : (
              <p className="admin-prodcat__empty">No products match &ldquo;{search}&rdquo;.</p>
            )}
          </div>
        ) : (
          (activeGrp || grouped[0]).categories.map(c => {
            const isDragOver = dragOverCat === c.slug && dragProduct?.category !== c.slug
            return (
              <div key={c.slug}
                className={`admin-prodcat${isDragOver ? ' is-dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); if (dragProduct) setDragOverCat(c.slug) }}
                onDragLeave={() => setDragOverCat(null)}
                onDrop={(e) => { e.preventDefault(); handleCategoryMove(c) }}
              >
                <div className="admin-prodcat__head">
                  <span className="admin-prodcat__name">{c.label}</span>
                  <span className="admin-prodcat__count">{c.items.length}</span>
                  {dragProduct && dragProduct.category !== c.slug && (
                    <span className="admin-prodcat__droptip">Drop to move here</span>
                  )}
                </div>
                {c.items.length ? (
                  <div className="admin-prodgrid">
                    {c.items.map(p => (
                      <ProductCard key={p.path} p={p}
                        selectMode={selectMode} isSelected={selected.has(p.path)} isDragging={dragProduct?.path === p.path}
                        onToggle={toggleSelect} onEdit={setEditing} onDelete={handleDelete} busy={busy}
                        drag={{ onDragStart: () => setDragProduct(p), onDragEnd: () => { setDragProduct(null); setDragOverCat(null) } }} />
                    ))}
                  </div>
                ) : (
                  <p className="admin-prodcat__empty">{isUnpubTab ? 'Nothing unpublished.' : 'No products in this menu.'}</p>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Bulk-action bar — slides up while selecting */}
      {selectMode && (
        <div className="admin-actionbar" role="toolbar" aria-label="Bulk actions">
          <span className="admin-actionbar__count">{selected.size} selected</span>
          <button className="btn btn--ghost btn--sm" onClick={clearSel} disabled={!selected.size || busy}>Clear</button>
          <div className="admin-actionbar__menuwrap" ref={actionsRef}>
            <button className="btn btn--primary btn--sm" disabled={!selected.size || busy} onClick={() => setActionsOpen(o => !o)} aria-haspopup="menu" aria-expanded={actionsOpen}>
              Actions <ChevronDown />
            </button>
            {actionsOpen && (
              <div className="admin-actionmenu" role="menu">
                <button type="button" role="menuitem" onClick={() => { setActionsOpen(false); setMoveOpen(true) }}><MoveTo /> Move to menu…</button>
                <button type="button" role="menuitem" onClick={() => bulkMoveTo(UNPUBLISHED, UNPUBLISHED)} disabled={selectedList.every(p => p.group === UNPUBLISHED)}><EyeOff /> Move to Unpublished</button>
                <button type="button" role="menuitem" className="admin-actionmenu__del" onClick={bulkDelete}><Trash /> Delete</button>
              </div>
            )}
          </div>
          <button className="btn btn--outline btn--sm admin-actionbar__done" onClick={exitSelect} disabled={busy}>Done</button>
        </div>
      )}

      {editing && (
        <ProductEditor
          product={editing.__new ? null : editing}
          allProducts={products || []}
          groups={CATALOG}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await reload() }}
        />
      )}

      {menusOpen && (
        <TaxonomyEditor
          groups={grouped}
          busy={busy}
          onClose={() => setMenusOpen(false)}
          onDeleteGroup={handleDeleteGroup}
          onDeleteCategory={handleDeleteCategory}
          onChanged={async () => { await reloadTaxonomy(); await reload() }}
        />
      )}

      {moveOpen && (
        <MoveModal
          groups={moveGroups}
          count={selected.size}
          busy={busy}
          onClose={() => setMoveOpen(false)}
          onMove={(g, c) => bulkMoveTo(g, c)}
        />
      )}
    </section>
  )
}

/** Pick a destination menu (group → category) for the selected products. */
function MoveModal({ groups, count, busy, onClose, onMove }) {
  const [group, setGroup] = useState(groups[0]?.slug || '')
  const cats = (groups.find(g => g.slug === group)?.categories) || []
  const [cat, setCat] = useState(cats[0]?.slug || '')
  useEffect(() => {
    const cs = (groups.find(g => g.slug === group)?.categories) || []
    setCat(cs.some(c => c.slug === cat) ? cat : (cs[0]?.slug || ''))
  }, [group]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__panel admin-modal__panel--sm">
        <div className="admin-modal__head">
          <h2>Move {count} product{count > 1 ? 's' : ''}</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="admin-form">
          <p className="admin-note" style={{ marginTop: 0 }}>Choose the menu these products should move into.</p>
          <div className="admin-form__row">
            <label className="admin-field">
              <span>Menu group</span>
              <select value={group} onChange={e => setGroup(e.target.value)} disabled={busy}>
                {groups.map(g => <option key={g.slug} value={g.slug}>{g.label}</option>)}
              </select>
            </label>
            <label className="admin-field">
              <span>Menu category</span>
              <select value={cat} onChange={e => setCat(e.target.value)} disabled={busy || !cats.length}>
                {cats.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                {!cats.length && <option value="">No categories</option>}
              </select>
            </label>
          </div>
          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline btn--md" onClick={onClose} disabled={busy}>Cancel</button>
            <button type="button" className="btn btn--primary btn--md" disabled={busy || !group || !cat} onClick={() => onMove(group, cat)}>
              Move here <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Add / edit form, shown as a modal over the manager. */
function ProductEditor({ product, allProducts, groups, onClose, onSaved }) {
  const isNew = !product
  const initialGroup = product?.group || groupForCategoryIn(groups, product?.category) || groups[0]?.slug
  const [form, setForm] = useState({
    title: product?.title || '',
    group: initialGroup,
    category: product?.category || categoriesForGroupIn(groups, initialGroup)[0]?.slug || '',
    external: product?.external || false,
    productType: product?.productType || '',
    href: product?.href || '',
    shortHtml: product?.shortHtml || '',
    descHtml: product?.descHtml || '',
    images: product?.images || (product?.image ? [product.image] : []),
    displayImages: product?.displayImages || [],
    tags: product?.tags || [],
    imageAdjust: product?.imageAdjust || [],
    imageRatio: product?.imageRatio || '1:1',
    attrRows: attrsToRows(product?.attributes),
  })
  // Existing keys/values across the whole catalog, for the attribute comboboxes.
  const attrIndex = useMemo(() => buildAttrIndex(allProducts), [allProducts])
  const isExternal = form.external
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Auto-generate search tags from the product's own details: title + type as
  // whole phrases, plus the most frequent keywords mined from the category,
  // short description and full description/spec.
  function autoTags() {
    const catLabel = categoriesForGroupIn(groups, form.group).find(c => c.slug === form.category)?.label || ''
    const groupLabel = groups.find(g => g.slug === form.group)?.label || ''
    return generateTags({
      phrases: [form.title, form.productType],
      texts: [form.title, form.productType, catLabel, groupLabel, form.shortHtml, form.descHtml],
    })
  }

  // A URL slug is derived from the title automatically (no manual slug input).
  // On edit the existing slug is preserved so product URLs stay stable.
  function uniqueSlug(base) {
    const taken = new Set(allProducts.filter(p => p.path !== product?.path).map(p => p.slug))
    let s = base || 'product', n = 2
    while (taken.has(s)) s = `${base}-${n++}`
    return s
  }
  function onGroup(v) {
    const cats = categoriesForGroupIn(groups, v)
    setForm(f => ({ ...f, group: v, category: cats.some(c => c.slug === f.category) ? f.category : (cats[0]?.slug || '') }))
  }

  async function onUpload(field, files) {
    if (!files?.length) return
    setUploading(true); setError('')
    try {
      const slug = product?.slug || slugify(form.title) || 'product'
      const uploaded = []
      for (const file of files) {
        const { url } = await uploadImage(file, `products/${slug}`)
        uploaded.push(url)
      }
      setForm(f => ({ ...f, [field]: [...f[field], ...uploaded] }))
    } catch (e) {
      setError('Image upload failed: ' + (e?.message || e))
    } finally { setUploading(false) }
  }

  const removeImage = (field, i) => setForm(f => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }))
  const makeThumb = (i) => setForm(f => {
    const imgs = [...f.images]; const [pick] = imgs.splice(i, 1); imgs.unshift(pick); return { ...f, images: imgs }
  })
  const reorderImage = (field, from, to) => setForm(f => {
    if (from === to || from == null) return f
    const arr = [...f[field]]; const [m] = arr.splice(from, 1); arr.splice(to, 0, m)
    return { ...f, [field]: arr }
  })

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    const title = form.title.trim()
    if (!title) return setError('Title is required.')
    if (!form.group || !form.category) return setError('Pick a menu group and category.')
    // New products get a fresh unique slug from the title; edits keep theirs.
    const slug = isNew ? uniqueSlug(slugify(title)) : product.slug

    setSaving(true)
    try {
      const attributes = rowsToAttrs(form.attrRows)
      const data = isExternal
        ? { title, href: form.href.trim(), image: form.images[0] || '', external: true, tags: form.tags, imageAdjust: pruneAdjust(form.imageAdjust, form.images), imageRatio: form.imageRatio, attributes }
        : {
            title,
            external: false,
            productType: form.productType.trim(),
            shortHtml: form.shortHtml,
            descHtml: form.descHtml,
            images: form.images,
            displayImages: form.displayImages,
            tags: form.tags,
            imageAdjust: pruneAdjust(form.imageAdjust, [...form.images, ...form.displayImages]),
            imageRatio: form.imageRatio,
            attributes,
          }
      const moved = !isNew && (product.group !== form.group || product.category !== form.category)
      let savedPath = product?.path
      if (isNew || moved) {
        // Append to the end of the target category.
        const inCat = allProducts.filter(p => p.category === form.category && p.path !== product?.path)
        const order = inCat.reduce((m, p) => Math.max(m, (p.order ?? 0) + 1), 0)
        if (isNew) { const r = await api.createProduct(form.group, form.category, slug, { ...data, order }); savedPath = r.path }
        else { const r = await api.moveProduct(product.path, form.group, form.category, slug, { ...data, order }); savedPath = r.path }
      } else {
        const r = await api.updateProductAt(product.path, data); savedPath = r.path || product.path
      }
      // Archive any individual gallery images the admin removed (existing
      // internal products only) so they can be recovered.
      if (!isNew && !isExternal) {
        const meta = { sourceType: 'product', sourceId: savedPath, sourceTitle: title }
        await archiveRemovedImages(product.images || [], form.images, { ...meta, field: 'images' })
        await archiveRemovedImages(product.displayImages || [], form.displayImages, { ...meta, field: 'displayImages' })
      }
      await onSaved()
    } catch (e2) {
      setError('Save failed: ' + (e2?.message || e2))
      setSaving(false)
    }
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__panel">
        <div className="admin-modal__head">
          <h2>{isNew ? 'Add product' : `Edit: ${product.title}`}</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close"><X /></button>
        </div>

        <form className="admin-form" onSubmit={handleSave}>
          {/* Images first: aspect ratio, then each image's live preview (above
              its thumbnail set). Click a thumbnail to frame it — drag to
              reposition, scroll/slider to zoom. The preview shows exactly how it
              will sit in the product gallery on the site. */}
          {!isExternal && <RatioField value={form.imageRatio} onChange={v => set('imageRatio', v)} noun="product" />}

          {isExternal ? (
            <ImageField
              label="Image" images={form.images} field="images"
              onUpload={onUpload} onRemove={removeImage} onReorder={reorderImage} uploading={uploading}
              adjust={form.imageAdjust} onAdjust={v => set('imageAdjust', v)} frame="product" caption={form.title} ratio={form.imageRatio}
            />
          ) : (
            <>
              <ImageField
                label="Gallery images (first = thumbnail)"
                images={form.images} field="images"
                onUpload={onUpload} onRemove={removeImage} onMakeThumb={makeThumb} onReorder={reorderImage} uploading={uploading}
                adjust={form.imageAdjust} onAdjust={v => set('imageAdjust', v)} frame="product" caption={form.title} ratio={form.imageRatio}
              />
              <ImageField
                label="Display images (extra showcase row)"
                images={form.displayImages} field="displayImages"
                onUpload={onUpload} onRemove={removeImage} onReorder={reorderImage} uploading={uploading}
                adjust={form.imageAdjust} onAdjust={v => set('imageAdjust', v)} frame="product" caption={form.title} ratio={form.imageRatio}
              />
            </>
          )}

          <label className="admin-field admin-field--toggle">
            <span>External link product</span>
            <span className="admin-toggle">
              <input type="checkbox" checked={form.external} onChange={e => set('external', e.target.checked)} />
              <span className="admin-toggle__track" />
            </span>
            <span className="admin-toggle__hint">{form.external ? 'Links to an external website — no on-site product page' : 'Standard product with on-site page, descriptions and gallery'}</span>
          </label>

          <label className="admin-field">
            <span>Title</span>
            <input value={form.title} onChange={e => set('title', e.target.value)} required autoFocus />
          </label>

          <div className="admin-form__row">
            <label className="admin-field">
              <span>Menu group</span>
              <select value={form.group} onChange={e => onGroup(e.target.value)}>
                {groups.map(g => <option key={g.slug} value={g.slug}>{g.label}</option>)}
              </select>
            </label>
            <label className="admin-field">
              <span>Menu category</span>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                {categoriesForGroupIn(groups, form.group).map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </label>
            {!isExternal && (
              <label className="admin-field">
                <span>Type label <em>(optional)</em></span>
                <input value={form.productType} onChange={e => set('productType', e.target.value)} placeholder="e.g. Portable Instrument" />
              </label>
            )}
          </div>

          <div className="admin-field">
            <span>Search tags <em>(help this product surface in search)</em></span>
            <TagInput tags={form.tags} onChange={v => set('tags', v)} autoGenerate={autoTags}
              placeholder="e.g. potentiostat, portable, biosensor" />
          </div>

          {/* Attributes — power the product filters. Pick an existing key/value
              or type a new one; values are stored uppercase. */}
          <div className="admin-field">
            <span>Attributes <em>(used for product filters — e.g. Material → PLATINUM)</em></span>
            <AttributeEditor rows={form.attrRows} onChange={v => set('attrRows', v)} index={attrIndex} />
          </div>

          {isExternal ? (
            <>
              <label className="admin-field">
                <span>Link URL <em>(opens in a new tab)</em></span>
                <input value={form.href} onChange={e => set('href', e.target.value)} placeholder="https://…" />
              </label>
              <p className="admin-note" style={{ marginTop: 0 }}>
                This is an external catalog link — it opens another website, so it has no
                on-site product page, description or gallery.
              </p>
            </>
          ) : (
            <>
              <div className="admin-field">
                <span>Short description</span>
                <RichTextEditor value={form.shortHtml} onChange={v => set('shortHtml', v)} placeholder="A short summary or key specs…" minHeight={110} />
              </div>

              <div className="admin-field">
                <span>Full description &amp; specification</span>
                <RichTextEditor value={form.descHtml} onChange={v => set('descHtml', v)} placeholder="Full description, specifications, tables…" minHeight={200} />
              </div>
            </>
          )}

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline btn--md" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md" disabled={saving || uploading}>
              {saving ? 'Saving…' : (isNew ? 'Create product' : 'Save changes')} <ArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * Menu structure editor. Shows the current group → category organisation as a
 * diagram (with product counts) and lets the admin rename, add or delete any
 * group/category. Deleting moves any products it holds to Unpublished (never
 * lost). The hidden Unpublished group itself isn't part of the editable menus.
 */
function TaxonomyEditor({ groups, busy, onClose, onChanged, onDeleteGroup, onDeleteCategory }) {
  const [working, setWorking] = useState(false)
  const slugify = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const run = async (fn) => { setWorking(true); try { await fn(); await onChanged() } finally { setWorking(false) } }
  const disabled = busy || working

  const editable = groups.filter(g => g.slug !== UNPUBLISHED)
  const renameGroup = (g, label) => { const v = label.trim(); if (v && v !== g.label) run(() => api.updateGroup(g.slug, { label: v })) }
  const renameCat = (g, c, title) => { const v = title.trim(); if (v && v !== c.label) run(() => api.updateCategory(g.slug, c.slug, { title: v })) }
  const addGroup = () => {
    const name = window.prompt('New menu group name (e.g. "Spectroscopy")')
    if (name?.trim()) run(() => api.createGroup(slugify(name), name.trim(), editable.length))
  }
  const addCat = (g) => {
    const name = window.prompt(`New category under "${g.label}"`)
    if (name?.trim()) run(() => api.createCategory(g.slug, slugify(name), name.trim(), g.categories.length))
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__panel">
        <div className="admin-modal__head">
          <h2>Menu structure</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="admin-form">
          <p className="admin-note" style={{ marginTop: 0 }}>
            This is how your products are organised. Rename a group or category, add new
            ones, or delete one. Deleting a group or menu moves any products it holds to
            <strong> Unpublished</strong> — they&rsquo;re never lost.
          </p>

          <div className="taxtree">
            {editable.map(g => {
              const total = g.categories.reduce((n, c) => n + (c.items?.length || 0), 0)
              return (
                <div key={g.slug} className="taxgroup">
                  <div className="taxgroup__head">
                    <span className="taxgroup__dot" />
                    <input className="taxgroup__name" defaultValue={g.label} disabled={disabled}
                      onBlur={e => renameGroup(g, e.target.value)} aria-label={`Group name: ${g.label}`} />
                    <span className="taxcount">{total}</span>
                    <button type="button" className="btn btn--ghost btn--sm" disabled={disabled} onClick={() => addCat(g)}>
                      <Plus /> Category
                    </button>
                    <button type="button" className="taxdel" disabled={disabled} onClick={() => onDeleteGroup(g)}
                      aria-label={`Delete group ${g.label}`} title="Delete group"><Trash /></button>
                  </div>
                  <ul className="taxcats">
                    {g.categories.map(c => (
                      <li key={c.slug} className="taxcat">
                        <span className="taxcat__line" />
                        <input className="taxcat__name" defaultValue={c.label} disabled={disabled}
                          onBlur={e => renameCat(g, c, e.target.value)} aria-label={`Category name: ${c.label}`} />
                        <span className="taxcount">{c.items?.length || 0}</span>
                        <button type="button" className="taxdel" disabled={disabled} onClick={() => onDeleteCategory(g, c)}
                          aria-label={`Delete menu ${c.label}`} title="Delete menu"><Trash /></button>
                      </li>
                    ))}
                    {!g.categories.length && <li className="taxcat__empty">No categories yet.</li>}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline btn--md" disabled={disabled} onClick={addGroup}>
              <Plus /> Add menu group
            </button>
            <button type="button" className="btn btn--primary btn--md" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageField({ label, images, field, onUpload, onRemove, onMakeThumb, onReorder, uploading, adjust, onAdjust, frame = 'product', caption = '', ratio }) {
  const [drag, setDrag] = useState(null)
  const [over, setOver] = useState(null)
  const [selected, setSelected] = useState(0)
  const sel = Math.min(selected, Math.max(0, images.length - 1))
  const selUrl = images[sel]
  const canAdjust = !!onAdjust
  return (
    <div className="admin-field">
      <span>{label}{canAdjust && images.length > 0 && <em> — click an image to frame it{onReorder && images.length > 1 ? ', drag to reorder' : ''}</em>}{!canAdjust && onReorder && images.length > 1 && <em> — drag to reorder</em>}</span>
      {/* Live preview sits above the image set */}
      {canAdjust && selUrl && (
        <AdjustableImage
          url={selUrl}
          value={findAdjust(adjust, selUrl)}
          onChange={v => onAdjust(upsertAdjust(adjust, selUrl, v))}
          frame={frame}
          caption={caption}
          ratio={ratio}
        />
      )}
      <div className="admin-imggrid">
        {images.map((src, i) => (
          <div key={src + i}
            className={`admin-imgtile ${over === i && drag !== null ? 'is-dragover' : ''} ${canAdjust && sel === i ? 'is-selected' : ''}`.trim()}
            draggable={!!onReorder}
            onClick={canAdjust ? () => setSelected(i) : undefined}
            onDragStart={() => setDrag(i)}
            onDragEnter={() => setOver(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { onReorder?.(field, drag, i); setDrag(null); setOver(null) }}
            onDragEnd={() => { setDrag(null); setOver(null) }}
          >
            <img src={src} alt="" />
            {onMakeThumb && i !== 0 && (
              <button type="button" className="admin-imgtile__thumb" title="Set as thumbnail" onClick={e => { e.stopPropagation(); onMakeThumb(i) }}>★</button>
            )}
            {onMakeThumb && i === 0 && <span className="admin-imgtile__badge">Thumbnail</span>}
            {canAdjust && sel === i && <span className="admin-imgtile__pick">Framing</span>}
            <button type="button" className="admin-imgtile__del" title="Remove" onClick={e => { e.stopPropagation(); onRemove(field, i) }}><X /></button>
          </div>
        ))}
        <label className="admin-imgadd">
          <input type="file" accept="image/*" multiple hidden
            onChange={e => { onUpload(field, [...e.target.files]); e.target.value = '' }} disabled={uploading} />
          <ImageIcon />
          <span>{uploading ? 'Uploading…' : 'Add images'}</span>
        </label>
      </div>
    </div>
  )
}
