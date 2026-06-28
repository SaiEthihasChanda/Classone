import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { HeadlineBar } from '../layout/HeadlineBar'
import { X, Trash, Plus, Menu } from '../ui/Icons'

/**
 * Headline-bar manager (the `headlines` collection). Edit the rotating ribbon
 * shown under the top strip on every public page. Text is edited inline; rows
 * drag to reorder. A live preview shows the ribbon exactly as visitors see it.
 */
export function HeadlineManager() {
  const [items, setItems] = useState(null)
  const [busy, setBusy] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  async function reload() {
    const list = await api.list('headlines')
    setItems([...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
  }
  useEffect(() => { reload() }, [])

  // Local text edits without a round-trip per keystroke; persisted on blur.
  const setText = (id, text) => setItems(arr => arr.map(h => (h.id === id ? { ...h, text } : h)))
  async function saveText(h) {
    setBusy(true)
    try { await api.update('headlines', h.id, { text: (h.text || '').trim() }) }
    finally { setBusy(false) }
  }

  async function add() {
    setBusy(true)
    try {
      await api.create('headlines', { text: '', order: items?.length || 0 })
      await reload()
    } finally { setBusy(false) }
  }

  async function remove(h) {
    if (!window.confirm('Remove this headline?')) return
    setBusy(true)
    try { await api.remove('headlines', h.id); await reload() }
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
      await Promise.all(arr.map((h, idx) => (h.order !== idx ? api.update('headlines', h.id, { order: idx }) : null)).filter(Boolean))
      await reload()
    } finally { setBusy(false) }
  }

  const previewTexts = (items || []).map(h => h.text).filter(t => t && t.trim())

  return (
    <div className="admin-products">
      {/* Live preview */}
      <div className="admin-field" style={{ marginBottom: 'var(--sp-6)' }}>
        <span>Live preview <em>(exactly as it appears under the top strip)</em></span>
        <div className="headline-preview">
          {previewTexts.length
            ? <HeadlineBar texts={previewTexts} />
            : <p className="admin-note" style={{ margin: 0, padding: 'var(--sp-3)' }}>Add a headline to see the ribbon.</p>}
        </div>
      </div>

      <div className="admin-products__bar">
        <h2 className="admin-panel__heading" style={{ margin: 0 }}>Drag to reorder — top to bottom = rotation order</h2>
        <button className="btn btn--primary btn--sm" onClick={add} disabled={busy}><Plus /> Add headline</button>
      </div>

      {items === null ? (
        <p className="admin-note">Loading…</p>
      ) : items.length === 0 ? (
        <p className="admin-note">No headlines yet. Add one to show the rotating ribbon.</p>
      ) : (
        <ul className="admin-headlist">
          {items.map((h, i) => (
            <li key={h.id}
              className={`admin-headrow ${overIdx === i && dragIdx !== null ? 'is-dragover' : ''} ${dragIdx === i ? 'is-dragging' : ''}`.trim()}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragEnter={() => setOverIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
            >
              <span className="admin-headrow__handle" title="Drag to reorder"><Menu /></span>
              <span className="admin-headrow__num">{i + 1}</span>
              <input
                className="admin-headrow__input"
                value={h.text || ''}
                onChange={e => setText(h.id, e.target.value)}
                onBlur={() => saveText(h)}
                placeholder="Type a headline…"
                aria-label={`Headline ${i + 1}`}
              />
              <button type="button" className="btn btn--ghost btn--sm admin-del" onClick={() => remove(h)} disabled={busy} aria-label="Remove"><Trash /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
