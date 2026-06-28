import { useEffect, useState } from 'react'
import { useAuth, SUPER_ADMIN_EMAIL } from '../lib/auth'
import { listAdmins, createAdmin, removeAdmin } from '../lib/admins'
import { AdminTopbar } from '../components/layout/AdminTopbar'
import {
  Grid, LogOut, UserPlus, Trash, ShieldCheck, User, X, ArrowRight, Mail, Lock,
} from '../components/ui/Icons'

export function AdminAdminsPage({ onNavigate }) {
  const { user, isAdmin, isSuper, loading, logout } = useAuth()
  const [admins, setAdmins] = useState(null)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!isAdmin) onNavigate?.('/login')
    else if (!isSuper) onNavigate?.('/admin')
  }, [loading, isAdmin, isSuper, onNavigate])

  async function reload() { setAdmins(await listAdmins()) }
  useEffect(() => { if (isSuper) reload() }, [isSuper])

  async function handleSignOut() { await logout(); onNavigate?.('/') }

  async function handleRemove(a) {
    if (!window.confirm(`Remove ${a.email} as an admin? They will lose all dashboard access.`)) return
    setBusy(true)
    try { await removeAdmin(a.email); await reload() } finally { setBusy(false) }
  }

  if (loading) return <section className="section admin-section"><div className="container"><p>Checking access…</p></div></section>
  if (!isSuper) return null

  return (
    <section className="admin-section">
      <AdminTopbar
        icon={ShieldCheck}
        title="Admins"
        subtitle="Manage who can access the dashboard"
        onNavigate={onNavigate}
        actions={<>
          <button className="btn btn--ghost btn--sm" onClick={() => onNavigate?.('/admin')}><Grid /> Dashboard</button>
          <button className="btn btn--primary btn--sm" onClick={handleSignOut}><LogOut /> Sign out</button>
        </>}
      />

      <div className="admin-products">
        <div className="admin-products__bar">
          <h2 className="admin-panel__heading" style={{ margin: 0 }}>Authorised accounts</h2>
          <button className="btn btn--primary btn--sm" onClick={() => setAdding(true)}><UserPlus /> Add admin</button>
        </div>

        {admins === null ? (
          <p className="admin-note">Loading…</p>
        ) : (
          <div className="admin-adminlist">
            {admins.map((a, i) => {
              const isSelf = a.email === (user?.email || '').toLowerCase()
              const isTheSuper = a.role === 'super' || a.email === SUPER_ADMIN_EMAIL
              return (
                <div className="admin-adminrow" key={a.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <span className={`admin-adminrow__avatar ${isTheSuper ? 'is-super' : ''}`.trim()}>
                    {isTheSuper ? <ShieldCheck /> : <User />}
                  </span>
                  <div className="admin-adminrow__body">
                    <span className="admin-adminrow__email">
                      {a.email}{isSelf && <span className="admin-adminrow__you">you</span>}
                    </span>
                    <span className={`admin-adminrow__role ${isTheSuper ? 'is-super' : ''}`.trim()}>
                      {isTheSuper ? 'Super admin' : 'Admin'}
                    </span>
                  </div>
                  {isTheSuper ? (
                    <span className="admin-adminrow__locked">Cannot be removed</span>
                  ) : (
                    <button className="btn btn--ghost btn--sm admin-del" onClick={() => handleRemove(a)} disabled={busy}>
                      <Trash /> Remove
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {adding && (
        <AddAdmin
          createdBy={user?.email}
          onClose={() => setAdding(false)}
          onSaved={async () => { setAdding(false); await reload() }}
        />
      )}
    </section>
  )
}

function AddAdmin({ createdBy, onClose, onSaved }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Email is required.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setSaving(true)
    try {
      await createAdmin({ email, password, createdBy })
      await onSaved()
    } catch (e2) {
      setError(e2?.message || 'Could not add admin.')
      setSaving(false)
    }
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__panel admin-modal__panel--sm">
        <div className="admin-modal__head">
          <h2>Add admin</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <form className="admin-form" onSubmit={handleSave}>
          <p className="admin-note" style={{ marginTop: 0 }}>
            Creates a new login and grants dashboard access. Share these credentials with the
            person — they can change their password from <strong>Account</strong> after signing in.
          </p>
          <label className="admin-field">
            <span>Email</span>
            <div className="admin-input-icon">
              <Mail />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required autoFocus />
            </div>
          </label>
          <div className="admin-form__row">
            <label className="admin-field">
              <span>Password</span>
              <div className="admin-input-icon">
                <Lock />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required />
              </div>
            </label>
            <label className="admin-field">
              <span>Confirm password</span>
              <div className="admin-input-icon">
                <Lock />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>
            </label>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="admin-form__actions">
            <button type="button" className="btn btn--outline btn--md" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md" disabled={saving}>
              {saving ? 'Creating…' : 'Create admin'} <ArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
