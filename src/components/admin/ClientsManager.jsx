import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { uploadImage } from '../../lib/storage'
import { ImageIcon, ArrowRight, X, Trash, Plus, Menu } from '../ui/Icons'

/**
 * Clients manager (the `clients` collection) — the logos in the home "Esteemed
 * Clients" rail. Add / edit / delete and drag-reorder. A logo-badge preview
 * mirrors how the logo appears on the site.
 */
export function ClientsManager() {
  const [items, setItems] = useState(null)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  async function reload() {
    const list = await api.list('clients')
    setItems([...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
  }
  useEffect(() => { reload() }, [])

  async function handleDelete(c) {
    if (!window.confirm(`Remove this client logo${c.name ? ` (${c.name})` : ''}?`)) return
    setBusy(true)
    try { await api.remove('clients', c.id); await reload() }
    finally { setBusy(false) }
  }

  async function onDrop(i) {
    const from = dragIdx
    setDragIdx(null); setOverIdx(null)
    if (from === null || from === i) return
    const arr = [...items]
    const [moved] = arr.splice(from, 1)
    arr.splice(i, 0, moved)
    setItems(arr)
    setBusy(true)
    try {
      await Promise.all(arr.map((c, idx) => (c.order !== idx ? api.update('clients', c.id, { order: idx }) : null)).filter(Boolean))
      await reload()
    } finally { setBusy(false) }
  }

  return (
    <div className="admin-products">
      <div className="admin-products__bar">
        <h2 className="admin-panel__heading" style={{ margin: 0 }}>Drag to reorder — left to right in the rail</h2>
        <button className="btn btn--primary btn--sm" onClick={() => setEditing({ __new: true })}><Plus /> Add client</button>
      </div>

      {items === null ? (
        <p className="admin-note">Loading…</p>
      ) : items.length === 0 ? (
        <p className="admin-note">No client logos yet. Add one to populate the rail.</p>
      ) : (
        <div className="admin-clientgrid">
          {items.map((c, i) => (
            <div key={c.id}
              className={`admin-clienttile ${overIdx === i && dragIdx !== null ? 'is-dragover' : ''} ${dragIdx === i ? 'is-dragging' : ''}`.trim()}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragEnter={() => setOverIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
            >
              <span className="admin-clienttile__handle" title="Drag to reorder"><Menu /></span>
              <div className="client-badge client-badge--prev">
                {c.image ? <img src={c.image} alt={c.name || 'Client logo'} loading="lazy" /> : <ImageIcon />}
              </div>
              {c.name && <span className="admin-clienttile__name">{c.name}</span>}
              <div className="admin-clienttile__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => setEditing(c)} disabled={busy}>Edit</button>
                <button className="btn btn--ghost btn--sm admin-del" onClick={() => handleDelete(c)} disabled={busy}><Trash /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ClientEditor
          item={editing.__new ? null : editing}
          count={items?.length || 0}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await reload() }}
        />
      )}
    </div>
  )
}

function ClientEditor({ item, count, onClose, onSaved }) {
  const isNew = !item
  const [form, setForm] = useState({
    name: item?.name || '',
    image: item?.image || '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function onUpload(files) {
    if (!files?.length) return
    setUploading(true); setError('')
    try { const { url } = await uploadImage(files[0], 'clients'); set('image', url) }
    catch (e) { setError('Image upload failed: ' + (e?.message || e)) }
    finally { setUploading(false) }
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!form.image) return setError('A logo image is required.')
    setSaving(true)
    try {
      const data = { name: form.name.trim(), image: form.image }
      if (isNew) await api.create('clients', { ...data, order: count })
      else await api.update('clients', item.id, data)
      await onSaved()
    } catch (e2) { setError('Save failed: ' + (e2?.message || e2)); setSaving(false) }
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__panel">
        <div className="admin-modal__head">
          <h2>{isNew ? 'Add client' : 'Edit client'}</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <form className="admin-form" onSubmit={handleSave}>
          {/* Logo + badge preview at the top */}
          <div className="admin-field">
            <span>Logo <em>(shown in the esteemed-clients rail)</em></span>
            <div className="media-editor">
              <div className="media-editor__preview">
                <div className="client-badge client-badge--prev">
                  {form.image ? <img src={form.image} alt="" /> : <span className="tprev__empty"><ImageIcon /></span>}
                </div>
                <span className="media-editor__hint">Preview</span>
              </div>
              <div className="admin-imggrid">
                {form.image && (
                  <div className="admin-imgtile">
                    <img src={form.image} alt="" />
                    <button type="button" className="admin-imgtile__del" onClick={() => set('image', '')}><X /></button>
                  </div>
                )}
                <label className="admin-imgadd">
                  <input type="file" accept="image/*" hidden onChange={e => { onUpload([...e.target.files]); e.target.value = '' }} disabled={uploading} />
                  <ImageIcon />
                  <span>{uploading ? 'Uploading…' : (form.image ? 'Replace' : 'Add logo')}</span>
                </label>
              </div>
            </div>
          </div>

          <label className="admin-field">
            <span>Name <em>(optional — for your reference &amp; alt text)</em></span>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Indian Institute of Science" />
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline btn--md" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md" disabled={saving || uploading}>
              {saving ? 'Saving…' : (isNew ? 'Add client' : 'Save changes')} <ArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
