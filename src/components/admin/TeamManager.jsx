import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { uploadImage } from '../../lib/storage'
import { ImageIcon, ArrowRight, X, Trash, Plus, Menu, User } from '../ui/Icons'

export function TeamManager() {
  const [items,   setItems]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [busy,    setBusy]    = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  async function reload() {
    const list = await api.list('team')
    setItems([...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    return list
  }

  // One-time migration: if the team collection is empty, seed it from the
  // legacy settings.about.team array that used to hold member data.
  useEffect(() => {
    reload().then(async (list) => {
      if (list.length > 0) return
      const settings = await api.list('settings')
      const legacy = settings.about?.team || []
      if (!legacy.length) return
      await Promise.all(
        legacy.map((m, idx) =>
          api.create('team', { name: m.name || '', role: m.role || '', image: m.image || '', order: idx })
        )
      )
      await reload()
    })
  }, [])

  async function handleDelete(t) {
    if (!window.confirm(`Remove "${t.name}" from the team?`)) return
    setBusy(true)
    try { await api.remove('team', t.id); await reload() }
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
      await Promise.all(
        arr.map((t, idx) => t.order !== idx ? api.update('team', t.id, { order: idx }) : null).filter(Boolean)
      )
      await reload()
    } finally { setBusy(false) }
  }

  return (
    <div className="admin-products">
      <div className="admin-products__bar">
        <h2 className="admin-panel__heading" style={{ margin: 0 }}>Drag to reorder — left to right on the site</h2>
        <button className="btn btn--primary btn--sm" onClick={() => setEditing({ __new: true })}><Plus /> Add member</button>
      </div>

      {items === null ? (
        <p className="admin-note">Loading…</p>
      ) : items.length === 0 ? (
        <p className="admin-note">No team members yet. Add one to populate the Meet the Team section.</p>
      ) : (
        <ul className="admin-slidelist">
          {items.map((t, i) => (
            <li key={t.id}
              className={`admin-sliderow ${overIdx === i && dragIdx !== null ? 'is-dragover' : ''} ${dragIdx === i ? 'is-dragging' : ''}`.trim()}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragEnter={() => setOverIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
            >
              <span className="admin-sliderow__handle" title="Drag to reorder"><Menu /></span>
              <span className="admin-sliderow__thumb admin-sliderow__thumb--round">
                {t.image ? <img src={t.image} alt="" loading="lazy" /> : <User />}
              </span>
              <span className="admin-sliderow__body">
                <span className="admin-sliderow__title">{t.name}</span>
                {t.role && <span className="admin-sliderow__eyebrow">{t.role}</span>}
              </span>
              <span className="admin-prodrow__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => setEditing(t)} disabled={busy}>Edit</button>
                <button className="btn btn--ghost btn--sm admin-del" onClick={() => handleDelete(t)} disabled={busy}><Trash /></button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <TeamMemberEditor
          item={editing.__new ? null : editing}
          count={items?.length || 0}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await reload() }}
        />
      )}
    </div>
  )
}

function TeamMemberEditor({ item, count, onClose, onSaved }) {
  const isNew = !item
  const [form, setForm] = useState({
    name:  item?.name  || '',
    role:  item?.role  || '',
    image: item?.image || '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function onUpload(files) {
    if (!files?.length) return
    setUploading(true); setError('')
    try { const { url } = await uploadImage(files[0], 'team'); set('image', url) }
    catch (e) { setError('Image upload failed: ' + (e?.message || e)) }
    finally { setUploading(false) }
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Name is required.')
    setSaving(true)
    try {
      const data = {
        name:  form.name.trim(),
        role:  form.role.trim(),
        image: form.image,
      }
      if (isNew) await api.create('team', { ...data, order: count })
      else       await api.update('team', item.id, data)
      await onSaved()
    } catch (e2) { setError('Save failed: ' + (e2?.message || e2)); setSaving(false) }
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__panel">
        <div className="admin-modal__head">
          <h2>{isNew ? 'Add team member' : 'Edit team member'}</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-field">
            <span>Photo <em>(shown as a circle on the site)</em></span>
            <div className="media-editor">
              <div className="media-editor__preview">
                <div className="tprev">
                  {form.image ? <img src={form.image} alt="" /> : <span className="tprev__empty"><User /></span>}
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
                  <span>{uploading ? 'Uploading…' : (form.image ? 'Replace' : 'Add photo')}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="admin-form__row">
            <label className="admin-field">
              <span>Name</span>
              <input value={form.name} onChange={e => set('name', e.target.value)} required autoFocus placeholder="e.g. Dr. Anita Rao" />
            </label>
            <label className="admin-field">
              <span>Role / Title</span>
              <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Managing Director" />
            </label>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline btn--md" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md" disabled={saving || uploading}>
              {saving ? 'Saving…' : (isNew ? 'Add member' : 'Save changes')} <ArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
