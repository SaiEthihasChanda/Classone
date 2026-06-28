import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { listArchivedImages, restoreArchivedImage, purgeArchivedImage } from '../lib/archive'
import { AdminTopbar } from '../components/layout/AdminTopbar'
import {
  Grid, LogOut, RotateCcw, Trash, ShieldCheck, AlertTriangle, ArchiveBox,
  Box, Newspaper, ImageIcon,
} from '../components/ui/Icons'

const KIND_META = {
  product: { label: 'Product', icon: Box },
  news:    { label: 'News post', icon: Newspaper },
  slide:   { label: 'Carousel slide', icon: ImageIcon },
}

function fmtDate(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null)
    if (!d) return ''
    return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

export function AdminRecoveryPage({ onNavigate }) {
  const { isAdmin, isSuper, loading, logout } = useAuth()
  const [tab, setTab] = useState('items') // 'items' | 'images'
  const [items, setItems] = useState(null)
  const [images, setImages] = useState(null)
  const [busy, setBusy] = useState(false)

  // Super-admin only. Anyone else is bounced to the dashboard.
  useEffect(() => {
    if (loading) return
    if (!isAdmin) onNavigate?.('/login')
    else if (!isSuper) onNavigate?.('/admin')
  }, [loading, isAdmin, isSuper, onNavigate])

  async function reload() {
    const [it, im] = await Promise.all([api.listDeleted(), listArchivedImages()])
    setItems(it.sort((a, b) => (b.deletedAt?.seconds || 0) - (a.deletedAt?.seconds || 0)))
    setImages(im)
  }
  useEffect(() => { if (isSuper) reload() }, [isSuper])

  async function handleSignOut() { await logout(); onNavigate?.('/') }

  async function restoreItem(item) {
    setBusy(true)
    try { await api.restoreDeleted(item); await reload() } finally { setBusy(false) }
  }
  async function purgeItem(item) {
    if (!window.confirm(`Permanently delete "${item.title}"? This cannot be undone.`)) return
    setBusy(true)
    try { await api.purgeDeleted(item); await reload() } finally { setBusy(false) }
  }
  async function restoreImg(rec) {
    setBusy(true)
    try { await restoreArchivedImage(rec); await reload() } finally { setBusy(false) }
  }
  async function purgeImg(rec) {
    if (!window.confirm('Permanently delete this archived image? This cannot be undone.')) return
    setBusy(true)
    try { await purgeArchivedImage(rec); await reload() } finally { setBusy(false) }
  }

  if (loading) return <section className="section admin-section"><div className="container"><p>Checking access…</p></div></section>
  if (!isSuper) return null

  return (
    <section className="admin-section">
      <AdminTopbar
        icon={ShieldCheck}
        title="Recovery"
        subtitle="Restore deleted content & archived images"
        onNavigate={onNavigate}
        actions={<>
          <button className="btn btn--ghost btn--sm" onClick={() => onNavigate?.('/admin')}><Grid /> Dashboard</button>
          <button className="btn btn--primary btn--sm" onClick={handleSignOut}><LogOut /> Sign out</button>
        </>}
      />

      <div className="admin-products">
        <div className="recovery-note">
          <AlertTriangle />
          <p>
            <strong>How recovery works.</strong> Deleting a whole product, news post or slide
            <em> soft-deletes</em> it — its images stay in place and come back intact when you restore it.
            Removing a single image from a gallery or thumbnail moves just that image to the Storage
            <code>archive/</code> folder; find those under <strong>Archived images</strong>.
          </p>
        </div>

        <div className="admin-products__bar">
          <div className="catalog-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'items'}
              className={`catalog-tab ${tab === 'items' ? 'is-active' : ''}`.trim()}
              onClick={() => setTab('items')}>
              Deleted items<span className="catalog-tab__count">{items?.length ?? '–'}</span>
            </button>
            <button role="tab" aria-selected={tab === 'images'}
              className={`catalog-tab ${tab === 'images' ? 'is-active' : ''}`.trim()}
              onClick={() => setTab('images')}>
              Archived images<span className="catalog-tab__count">{images?.length ?? '–'}</span>
            </button>
          </div>
        </div>

        {/* ── Deleted items ── */}
        {tab === 'items' && (
          items === null ? <p className="admin-note">Loading…</p>
          : items.length === 0 ? <EmptyRecovery icon={ArchiveBox} text="Nothing deleted. All your content is live." />
          : (
            <div className="recovery-list">
              {items.map((item, i) => {
                const meta = KIND_META[item.kind] || { label: item.kind, icon: Box }
                const Icon = meta.icon
                const thumb = item.images?.[0] || item.image
                return (
                  <div className="recovery-row" key={`${item.kind}-${item.id}`} style={{ animationDelay: `${i * 40}ms` }}>
                    <span className="recovery-row__thumb">
                      {thumb ? <img src={thumb} alt="" loading="lazy" /> : <Icon />}
                    </span>
                    <div className="recovery-row__body">
                      <span className="recovery-row__kind"><Icon /> {meta.label}</span>
                      <span className="recovery-row__title">{item.title || '(untitled)'}</span>
                      <span className="recovery-row__meta">
                        Deleted {fmtDate(item.deletedAt)}{item.deletedBy ? ` by ${item.deletedBy}` : ''}
                      </span>
                    </div>
                    <div className="recovery-row__actions">
                      <button className="btn btn--primary btn--sm" onClick={() => restoreItem(item)} disabled={busy}>
                        <RotateCcw /> Restore
                      </button>
                      <button className="btn btn--ghost btn--sm admin-del" onClick={() => purgeItem(item)} disabled={busy}>
                        <Trash /> Delete forever
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* ── Archived images ── */}
        {tab === 'images' && (
          images === null ? <p className="admin-note">Loading…</p>
          : images.length === 0 ? <EmptyRecovery icon={ImageIcon} text="No archived images. Images removed from galleries will appear here." />
          : (
            <div className="recovery-grid">
              {images.map((rec, i) => (
                <div className="archive-card" key={rec.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="archive-card__media">
                    {rec.archiveUrl ? <img src={rec.archiveUrl} alt="" loading="lazy" /> : <ImageIcon />}
                  </div>
                  <div className="archive-card__body">
                    <span className="archive-card__source">
                      {(KIND_META[rec.sourceType]?.label || rec.sourceType)} · {rec.field}
                    </span>
                    <span className="archive-card__title">{rec.sourceTitle || rec.originalPath?.split('/').pop()}</span>
                    <span className="archive-card__meta">
                      Removed {fmtDate(rec.removedAt)}{rec.removedBy ? ` by ${rec.removedBy}` : ''}
                    </span>
                  </div>
                  <div className="archive-card__actions">
                    <button className="btn btn--primary btn--sm" onClick={() => restoreImg(rec)} disabled={busy}>
                      <RotateCcw /> Restore
                    </button>
                    <button className="btn btn--ghost btn--sm admin-del" onClick={() => purgeImg(rec)} disabled={busy}>
                      <Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  )
}

function EmptyRecovery({ icon: Icon, text }) {
  return (
    <div className="recovery-empty">
      <span className="recovery-empty__icon"><Icon /></span>
      <p>{text}</p>
    </div>
  )
}
