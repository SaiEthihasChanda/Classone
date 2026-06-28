import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { uploadImage } from '../../lib/storage'
import { archiveImage } from '../../lib/archive'
import { ProductPicker } from '../common/ProductPicker'
import { AdjustableImage } from '../common/AdjustableImage'
import { ImageIcon, ArrowRight, X, Trash, Plus, Menu } from '../ui/Icons'

/**
 * Home hero carousel manager (the `slides` collection). Add, edit, reorder
 * (drag & drop) and remove slides. Embedded as a tab in the Site Manager.
 */
export function CarouselManager() {
  const [slides, setSlides] = useState(null)
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  async function reload() {
    const [list, cat] = await Promise.all([api.list('slides'), api.listCatalog()])
    setSlides([...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    setProducts(cat)
  }
  useEffect(() => { reload() }, [])

  async function handleDelete(s) {
    if (!window.confirm(`Remove the "${s.title}" slide from the carousel?`)) return
    setBusy(true)
    try { await api.remove('slides', s.id); await reload() }
    finally { setBusy(false) }
  }

  async function onDrop(i) {
    const from = dragIdx
    setDragIdx(null); setOverIdx(null)
    if (from === null || from === i) return
    const arr = [...slides]
    const [moved] = arr.splice(from, 1)
    arr.splice(i, 0, moved)
    setSlides(arr) // optimistic
    setBusy(true)
    try {
      await Promise.all(arr.map((s, idx) => (s.order !== idx ? api.update('slides', s.id, { order: idx }) : null)).filter(Boolean))
      await reload()
    } finally { setBusy(false) }
  }

  return (
    <div className="admin-products">
      <div className="admin-products__bar">
        <h2 className="admin-panel__heading" style={{ margin: 0 }}>Drag to reorder — top to bottom = display order</h2>
        <button className="btn btn--primary btn--sm" onClick={() => setEditing({ __new: true })}><Plus /> Add slide</button>
      </div>

      {slides === null ? (
        <p className="admin-note">Loading…</p>
      ) : slides.length === 0 ? (
        <p className="admin-note">No slides yet. Add one to start the carousel.</p>
      ) : (
        <ul className="admin-slidelist">
          {slides.map((s, i) => (
            <li key={s.id}
              className={`admin-sliderow ${overIdx === i && dragIdx !== null ? 'is-dragover' : ''} ${dragIdx === i ? 'is-dragging' : ''}`.trim()}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragEnter={() => setOverIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
            >
              <span className="admin-sliderow__handle" title="Drag to reorder"><Menu /></span>
              <span className="admin-sliderow__thumb">
                {s.image ? <img src={s.image} alt="" loading="lazy" /> : <ImageIcon />}
              </span>
              <span className="admin-sliderow__body">
                {s.eyebrow && <span className="admin-sliderow__eyebrow">{s.eyebrow}</span>}
                <span className="admin-sliderow__title">{s.title}</span>
                {s.description && <span className="admin-sliderow__desc">{s.description}</span>}
              </span>
              <span className="admin-prodrow__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => setEditing(s)} disabled={busy}>Edit</button>
                <button className="btn btn--ghost btn--sm admin-del" onClick={() => handleDelete(s)} disabled={busy}><Trash /></button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <SlideEditor
          slide={editing.__new ? null : editing}
          products={products}
          count={slides?.length || 0}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await reload() }}
        />
      )}
    </div>
  )
}

function SlideEditor({ slide, products, count, onClose, onSaved }) {
  const isNew = !slide
  const [form, setForm] = useState({
    eyebrow: slide?.eyebrow || '',
    title: slide?.title || '',
    description: slide?.description || '',
    href: slide?.href || '',
    image: slide?.image || '',
    imageAdjust: slide?.imageAdjust || null,
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function onUpload(files) {
    if (!files?.length) return
    setUploading(true); setError('')
    try { const { url } = await uploadImage(files[0], 'slides'); setForm(f => ({ ...f, image: url, imageAdjust: null })) }
    catch (e) { setError('Image upload failed: ' + (e?.message || e)) }
    finally { setUploading(false) }
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) return setError('Title is required.')
    setSaving(true)
    try {
      const data = {
        eyebrow: form.eyebrow.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        href: form.href,
        image: form.image,
        imageAdjust: form.image ? form.imageAdjust : null,
        cta: slide?.cta || 'View Details',
      }
      if (isNew) await api.create('slides', { ...data, order: count })
      else {
        await api.update('slides', slide.id, data)
        if (slide?.image && slide.image !== form.image) {
          await archiveImage(slide.image, {
            sourceType: 'slide', sourceId: slide.id, sourceTitle: data.title, field: 'image',
          })
        }
      }
      await onSaved()
    } catch (e2) { setError('Save failed: ' + (e2?.message || e2)); setSaving(false) }
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__panel">
        <div className="admin-modal__head">
          <h2>{isNew ? 'Add slide' : 'Edit slide'}</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-field">
            <span>Slide image <em>(drag &amp; zoom to frame it as it appears on the home hero)</em></span>
            <div className="admin-imggrid">
              {form.image && (
                <div className="admin-imgtile">
                  <img src={form.image} alt="" />
                  <button type="button" className="admin-imgtile__del" onClick={() => setForm(f => ({ ...f, image: '', imageAdjust: null }))}><X /></button>
                </div>
              )}
              <label className="admin-imgadd">
                <input type="file" accept="image/*" hidden onChange={e => { onUpload([...e.target.files]); e.target.value = '' }} disabled={uploading} />
                <ImageIcon />
                <span>{uploading ? 'Uploading…' : (form.image ? 'Replace' : 'Add image')}</span>
              </label>
            </div>
            {form.image && (
              <AdjustableImage
                url={form.image}
                value={form.imageAdjust}
                onChange={v => set('imageAdjust', v)}
                frame="carousel"
                caption={form.title}
              />
            )}
          </div>

          <div className="admin-form__row">
            <label className="admin-field">
              <span>Eyebrow <em>(small label above title)</em></span>
              <input value={form.eyebrow} onChange={e => set('eyebrow', e.target.value)} placeholder="e.g. Modular Potentiostat Platform" />
            </label>
            <label className="admin-field">
              <span>Title</span>
              <input value={form.title} onChange={e => set('title', e.target.value)} required autoFocus />
            </label>
          </div>

          <label className="admin-field">
            <span>Description</span>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
          </label>

          <div className="admin-field">
            <span>Button links to <em>(pick a product)</em></span>
            <ProductPicker products={products} value={form.href} onChange={(href) => set('href', href)} />
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline btn--md" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md" disabled={saving || uploading}>
              {saving ? 'Saving…' : (isNew ? 'Add slide' : 'Save changes')} <ArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
