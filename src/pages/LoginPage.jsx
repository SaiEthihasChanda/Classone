import { useEffect, useState } from 'react'
import { useAuth, authErrorMessage } from '../lib/auth'
import { Lock, Mail, User } from '../components/ui/Icons'

/**
 * Admin sign-in. Email + password only — there is no sign-up. Only allow-listed
 * admin emails (see src/lib/auth.js) can get through. On success the admin is
 * taken to the dashboard at /admin.
 */
export function LoginPage({ onNavigate }) {
  const { login, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Already signed in as an admin? Skip the form, go straight to the dashboard.
  useEffect(() => {
    if (!loading && isAdmin) onNavigate?.('/admin')
  }, [loading, isAdmin, onNavigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      // Cue the dashboard's one-time welcome animation for this fresh sign-in.
      try { sessionStorage.setItem('co_welcome', '1') } catch { /* ignore */ }
      // This same tab becomes the admin interface — no extra windows.
      onNavigate?.('/admin')
    } catch (err) {
      setError(authErrorMessage(err))
      setBusy(false)
    }
  }

  return (
    <section className="section login-section">
      <div className="login-card">
        <div className="login-card__head">
          <span className="login-card__badge"><Lock /></span>
          <h1 className="login-card__title">Admin Sign In</h1>
          <p className="login-card__sub">Restricted area — authorised accounts only.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="login-field">
            <span className="login-field__label">Email</span>
            <span className="login-field__control">
              <Mail className="login-field__icon" />
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </span>
          </label>

          <label className="login-field">
            <span className="login-field__label">Password</span>
            <span className="login-field__control">
              <Lock className="login-field__icon" />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </span>
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn--primary btn--md login-submit" disabled={busy}>
            {busy ? 'Signing in…' : (<><User /> Sign In</>)}
          </button>
        </form>

        <p className="login-note">
          Access is limited to approved administrators. There is no public sign-up.
        </p>
        <a href="/" className="login-back" onClick={(e) => { e.preventDefault(); onNavigate?.('/') }}>← Back to site</a>
      </div>
    </section>
  )
}
