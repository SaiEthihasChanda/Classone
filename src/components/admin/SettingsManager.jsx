import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useSettings } from '../../lib/store'
import { ChevronDown, ChevronUp, Trash } from '../ui/Icons'

const DEFAULT_EMAIL = 'saiethihaschanda@gmail.com'

// ── Notification email settings ──────────────────────────────────────────────

function EmailSettings() {
  const settings = useSettings()
  const [email, setEmail] = useState('')
  const [busy,  setBusy]  = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setEmail(settings.enquiryEmail || DEFAULT_EMAIL)
  }, [settings.enquiryEmail])

  async function handleSave(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setBusy(true); setError(''); setSaved(false)
    try {
      await api.update('settings', 'site', { enquiryEmail: trimmed })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err?.message || 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: 480 }}>
      <div className="admin-field">
        <label htmlFor="eq-email">Notification email</label>
        <input
          id="eq-email" type="email" className="admin-input"
          value={email} placeholder={DEFAULT_EMAIL} disabled={busy}
          onChange={e => { setEmail(e.target.value); setSaved(false) }}
        />
        <p className="admin-field__hint">
          Enquiry notifications are sent here via Gmail. Changing this takes effect immediately for all future submissions.
        </p>
      </div>
      {error && <p className="admin-field__error">{error}</p>}
      {saved && <p className="admin-field__ok">Saved.</p>}
      <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
        {busy ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}

// ── Submissions viewer ────────────────────────────────────────────────────────

const SKIP = new Set(['enquiryEmail', 'submittedAt', 'selections'])
const SUMMARY_KEYS = ['Name of the Customer', 'Name', 'Email ID', 'Email', 'Contact Number', 'Phone']

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function EnquiryRow({ item, onDelete }) {
  const [open,    setOpen]    = useState(false)
  const [deleting, setDeleting] = useState(false)
  const name     = item['Name of the Customer'] || item['Name'] || '—'
  const email    = item['Email ID'] || item['Email'] || ''
  const phone    = item['Contact Number'] || item['Phone'] || ''
  const detailFields = Object.entries(item).filter(([k]) => !SKIP.has(k) && !SUMMARY_KEYS.includes(k) && k !== 'id')
  const selections = Array.isArray(item.selections) ? item.selections : []

  async function handleDelete(e) {
    e.stopPropagation()
    if (!window.confirm(`Delete enquiry from "${name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await api.deleteEnquiry(item.id)
      onDelete(item.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={`eq-row ${open ? 'is-open' : ''}`.trim()}>
      <button className="eq-row__head" onClick={() => setOpen(v => !v)}>
        <span className="eq-row__name">{name}</span>
        <span className="eq-row__meta">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
        </span>
        <span className="eq-row__date">{formatDate(item.submittedAt)}</span>
        <span className="eq-row__toggle">{open ? <ChevronUp /> : <ChevronDown />}</span>
      </button>

      {open && (
        <div className="eq-row__body">
          <table className="eq-detail-table">
            <tbody>
              {SUMMARY_KEYS.filter(k => item[k]).map(k => (
                <tr key={k}><th>{k}</th><td>{item[k]}</td></tr>
              ))}
              {detailFields.map(([k, v]) => (
                <tr key={k}><th>{k}</th><td>{String(v)}</td></tr>
              ))}
              {selections.length > 0 && (
                <tr><th>Selections</th><td>{selections.join(', ')}</td></tr>
              )}
              <tr><th>Submitted</th><td>{formatDate(item.submittedAt)}</td></tr>
            </tbody>
          </table>
          <div className="eq-row__actions">
            <button
              className="btn-icon eq-row__delete"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete submission"
            >
              <Trash /> {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SubmissionsViewer() {
  const [items,   setItems]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.listEnquiries()
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => { setItems([]); setLoading(false) })
  }, [])

  if (loading) return <p className="sm-section__desc">Loading submissions…</p>
  if (!items.length) return <p className="sm-section__desc">No submissions yet.</p>

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <div className="eq-list">
      {items.map(item => <EnquiryRow key={item.id} item={item} onDelete={remove} />)}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SettingsManager() {
  return (
    <div className="sm-settings">
      <div className="sm-section">
        <h3 className="sm-section__title">Notification email</h3>
        <p className="sm-section__desc">
          Where enquiry form submissions are sent. All submissions are also stored below regardless of email delivery.
        </p>
        <EmailSettings />
      </div>

      <div className="sm-section sm-section--divider">
        <h3 className="sm-section__title">Submissions</h3>
        <p className="sm-section__desc">All enquiries received from the website, newest first.</p>
        <SubmissionsViewer />
      </div>
    </div>
  )
}
