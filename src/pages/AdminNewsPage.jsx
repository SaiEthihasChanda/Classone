import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { uploadImage } from '../lib/storage'
import { RichTextEditor } from '../components/common/RichTextEditor'
import { TagInput } from '../components/common/TagInput'
import { AdjustableImage, RatioField } from '../components/common/AdjustableImage'
import { findAdjust, upsertAdjust, pruneAdjust } from '../lib/imageAdjust'
import { generateTags } from '../lib/tags'
import { archiveRemovedImages } from '../lib/archive'
import { AdminTopbar } from '../components/layout/AdminTopbar'
import { Grid, Newspaper, LogOut, Plus, Trash, ImageIcon, X, ArrowRight, Calendar, MapPin, Tag } from '../components/ui/Icons'

function toSlug(title, date) {
  const base = (title || '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
  const datePart = (date || new Date().toISOString().slice(0, 10)).replace(/-/g, '')
  return `${datePart}-${base}`
}

const EMPTY_FORM = {
  title: '', shortDesc: '', longDesc: '',
  images: [], imageAdjust: [], imageRatio: '1:1', date: '', location: '', tags: [], published: true,
}

export function AdminNewsPage({ onNavigate }) {
  const { isAdmin, loading, logout } = useAuth()
  const [posts, setPosts] = useState(null)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (!loading && !isAdmin) onNavigate?.('/login') }, [loading, isAdmin, onNavigate])
  useEffect(() => { if (isAdmin) reload() }, [isAdmin])

  async function reload() {
    const list = await api.listNewsPosts()
    setPosts(list)
  }

  async function handleSignOut() { await logout(); onNavigate?.('/') }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setBusy(true)
    try { await api.deleteNewsPost(post.id); await reload() }
    finally { setBusy(false) }
  }

  if (loading) return <section className="section admin-section"><div className="container"><p>Checking access…</p></div></section>
  if (!isAdmin) return null

  return (
    <section className="admin-section">
      <AdminTopbar
        icon={Newspaper}
        title="News & Announcements"
        subtitle={posts ? `${posts.length} post${posts.length !== 1 ? 's' : ''}` : 'Loading…'}
        onNavigate={onNavigate}
        actions={<>
          <button className="btn btn--ghost btn--sm" onClick={() => onNavigate?.('/admin')}><Grid /> Dashboard</button>
          <button className="btn btn--ghost btn--sm" onClick={() => onNavigate?.('/news')}><Newspaper /> View feed</button>
          <button className="btn btn--primary btn--sm" onClick={handleSignOut}><LogOut /> Sign out</button>
        </>}
      />

      <div className="admin-products">
        <div className="admin-products__bar">
          <h2 className="admin-panel__heading" style={{ margin: 0 }}>All posts — newest first</h2>
          <button className="btn btn--primary btn--sm" onClick={() => setEditing({ __new: true })}><Plus /> New post</button>
        </div>

        {posts === null ? (
          <p className="admin-note">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="admin-note">No news posts yet. Click "New post" to publish your first update.</p>
        ) : (
          <div className="admin-newslist">
            {posts.map(p => (
              <div key={p.id} className="admin-newsrow">
                <div className="admin-newsrow__thumb">
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt="" loading="lazy" />
                    : <Newspaper />}
                </div>
                <div className="admin-newsrow__body">
                  <div className="admin-newsrow__meta">
                    <span className="admin-newsrow__date"><Calendar />{p.date}</span>
                    {p.location && <span className="admin-newsrow__loc"><MapPin />{p.location}</span>}
                    {p.tags?.length > 0 && <span className="admin-newsrow__tags"><Tag />{p.tags.join(', ')}</span>}
                  </div>
                  <span className="admin-newsrow__title">{p.title}</span>
                  {p.shortDesc && <span className="admin-newsrow__desc">{p.shortDesc}</span>}
                  {!p.published && <span className="admin-newsrow__draft">Draft</span>}
                </div>
                <div className="admin-newsrow__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => setEditing(p)} disabled={busy}>Edit</button>
                  <button className="btn btn--ghost btn--sm admin-del" onClick={() => handleDelete(p)} disabled={busy}><Trash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <PostEditor
          post={editing.__new ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await reload() }}
        />
      )}
    </section>
  )
}

function PostEditor({ post, onClose, onSaved }) {
  const isNew = !post
  const [form, setForm] = useState(isNew ? EMPTY_FORM : {
    title: post.title || '',
    shortDesc: post.shortDesc || '',
    longDesc: post.longDesc || '',
    images: post.images || [],
    imageAdjust: post.imageAdjust || [],
    imageRatio: post.imageRatio || '1:1',
    date: post.date || '',
    location: post.location || '',
    tags: post.tags || [],
    published: post.published !== false,
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(null)
  const [selected, setSelected] = useState(0) // which image is being framed

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Tags mined from title + location (phrases) and both descriptions (keywords).
  function autoTags() {
    return generateTags({
      phrases: [form.title, form.location],
      texts: [form.title, form.shortDesc, form.longDesc, form.location],
    })
  }

  async function onUpload(files) {
    if (!files?.length) return
    setUploading(true); setError('')
    try {
      const uploaded = await Promise.all([...files].slice(0, 10).map(f => uploadImage(f, 'news')))
      set('images', [...form.images, ...uploaded.map(u => u.url)])
    } catch (e) { setError('Upload failed: ' + (e?.message || e)) }
    finally { setUploading(false) }
  }

  function removeImage(i) {
    const images = form.images.filter((_, idx) => idx !== i)
    setForm(f => ({ ...f, images, imageAdjust: pruneAdjust(f.imageAdjust, images) }))
    setSelected(s => Math.max(0, Math.min(s, images.length - 1)))
  }

  function onDrop(from, to) {
    if (from === to) return
    const arr = [...form.images]
    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    set('images', arr)
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) return setError('Title is required.')
    if (!form.date) return setError('Date is required.')
    setSaving(true)
    try {
      const data = {
        title: form.title.trim(),
        shortDesc: form.shortDesc.trim(),
        longDesc: form.longDesc,
        images: form.images,
        imageAdjust: pruneAdjust(form.imageAdjust, form.images),
        imageRatio: form.imageRatio,
        date: form.date,
        location: form.location.trim(),
        tags: form.tags,
        published: form.published,
        slug: isNew ? toSlug(form.title, form.date) : post.slug,
      }
      if (isNew) await api.createNewsPost(data)
      else {
        await api.updateNewsPost(post.id, data)
        // Archive any gallery images the admin removed so they're recoverable.
        await archiveRemovedImages(post.images || [], form.images, {
          sourceType: 'news', sourceId: post.id, sourceTitle: data.title, field: 'images',
        })
      }
      await onSaved()
    } catch (e2) { setError('Save failed: ' + (e2?.message || e2)); setSaving(false) }
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__panel">
        <div className="admin-modal__head">
          <h2>{isNew ? 'New post' : 'Edit post'}</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close"><X /></button>
        </div>

        <form className="admin-form" onSubmit={handleSave}>
          {/* Images — controls live at the top of the editor. Aspect ratio, then
              the live preview, then the image set. */}
          <RatioField value={form.imageRatio} onChange={v => set('imageRatio', v)} noun="post" />

          <div className="admin-field">
            <span>Images <em>(click a thumbnail to frame it · drag to reorder · first is the cover)</em></span>
            {form.images[selected] && (
              <AdjustableImage
                url={form.images[selected]}
                value={findAdjust(form.imageAdjust, form.images[selected])}
                onChange={v => set('imageAdjust', upsertAdjust(form.imageAdjust, form.images[selected], v))}
                frame="news"
                ratio={form.imageRatio}
                caption={form.title}
              />
            )}
            <div className="admin-imggrid">
              {form.images.map((url, i) => (
                <div
                  key={url + i}
                  className={`admin-imgtile ${dragOver === i ? 'is-dragover' : ''} ${selected === i ? 'is-selected' : ''}`.trim()}
                  draggable
                  onClick={() => setSelected(i)}
                  onDragStart={e => e.dataTransfer.setData('text/plain', i)}
                  onDragOver={e => { e.preventDefault(); setDragOver(i) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => { e.preventDefault(); setDragOver(null); onDrop(+e.dataTransfer.getData('text/plain'), i) }}
                  onDragEnd={() => setDragOver(null)}
                >
                  <img src={url} alt="" />
                  {i === 0 && <span className="admin-imgtile__badge">Cover</span>}
                  {selected === i && <span className="admin-imgtile__pick">Framing</span>}
                  <button type="button" className="admin-imgtile__del" onClick={e => { e.stopPropagation(); removeImage(i) }}><X /></button>
                </div>
              ))}
              <label className="admin-imgadd">
                <input type="file" accept="image/*" multiple hidden
                  onChange={e => { onUpload([...e.target.files]); e.target.value = '' }}
                  disabled={uploading} />
                <ImageIcon />
                <span>{uploading ? 'Uploading…' : 'Add images'}</span>
              </label>
            </div>
          </div>

          {/* Title + Date */}
          <div className="admin-form__row">
            <label className="admin-field">
              <span>Title <em>(required)</em></span>
              <input value={form.title} onChange={e => set('title', e.target.value)} required autoFocus />
            </label>
            <label className="admin-field">
              <span>Date <em>(required)</em></span>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
            </label>
          </div>

          {/* Location */}
          <label className="admin-field">
            <span>Location <em>(optional)</em></span>
            <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Chennai, India" />
          </label>

          {/* Short description */}
          <label className="admin-field">
            <span>Short description <em>(shown on feed cards, also used for search)</em></span>
            <textarea rows={2} value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} placeholder="Brief summary of the post…" />
          </label>

          {/* Long description */}
          <div className="admin-field">
            <span>Full content <em>(rich text — shown on the post detail page)</em></span>
            <RichTextEditor
              value={form.longDesc}
              onChange={v => set('longDesc', v)}
              placeholder="Write the full story here…"
              minHeight={180}
            />
          </div>

          {/* Tags */}
          <div className="admin-field">
            <span>Search tags <em>(help this post surface in search)</em></span>
            <TagInput tags={form.tags} onChange={v => set('tags', v)} autoGenerate={autoTags}
              placeholder="e.g. research, sensor, event" />
          </div>

          {/* Published toggle */}
          <div className="admin-field admin-field--toggle">
            <span>Visibility</span>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
              <span className="admin-toggle__track" />
            </label>
            <span className="admin-toggle__hint">{form.published ? 'Published — visible on the public feed' : 'Draft — hidden from public feed'}</span>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline btn--md" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md" disabled={saving || uploading}>
              {saving ? 'Saving…' : (isNew ? 'Publish post' : 'Save changes')} <ArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
