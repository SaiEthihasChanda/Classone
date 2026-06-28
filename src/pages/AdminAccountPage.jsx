import { useEffect, useRef, useState } from 'react'
import { useAuth, authErrorMessage, nameFromEmail } from '../lib/auth'
import { uploadImage } from '../lib/storage'
import { AdminTopbar } from '../components/layout/AdminTopbar'
import { Grid, LogOut, Key, Lock, ArrowRight, CheckCircle, ShieldCheck, User, ImageIcon, X } from '../components/ui/Icons'

export function AdminAccountPage({ onNavigate }) {
  const { user, isAdmin, isSuper, loading, logout, changePassword, displayName, photoURL, updateProfile } = useAuth()

  // Profile form
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [uploading, setUploading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')
  const seeded = useRef(false)

  // Password form
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [savingPw, setSavingPw] = useState(false)
  const [pwErr, setPwErr] = useState('')
  const [pwDone, setPwDone] = useState(false)

  useEffect(() => { if (!loading && !isAdmin) onNavigate?.('/login') }, [loading, isAdmin, onNavigate])

  // Seed the profile form once the auth profile is available.
  useEffect(() => {
    if (!seeded.current && user) { setName(displayName || ''); setPhoto(photoURL || ''); seeded.current = true }
  }, [user, displayName, photoURL])

  if (loading) return <section className="section admin-section"><div className="container"><p>Checking access…</p></div></section>
  if (!isAdmin) return null

  async function handleSignOut() { await logout(); onNavigate?.('/') }

  async function onUploadPhoto(file) {
    if (!file) return
    setUploading(true); setProfileErr('')
    try { const { url } = await uploadImage(file, 'avatars'); setPhoto(url) }
    catch (e) { setProfileErr('Upload failed: ' + (e?.message || e)) }
    finally { setUploading(false) }
  }

  async function saveProfile(e) {
    e.preventDefault()
    setProfileErr(''); setProfileMsg('')
    setSavingProfile(true)
    try {
      await updateProfile({ displayName: name.trim(), photoURL: photo })
      setProfileMsg('Profile saved.')
    } catch (e2) {
      setProfileErr('Could not save: ' + (e2?.message || e2))
    } finally { setSavingProfile(false) }
  }

  async function savePassword(e) {
    e.preventDefault()
    setPwErr(''); setPwDone(false)
    if (next.length < 6) return setPwErr('New password must be at least 6 characters.')
    if (next !== confirm) return setPwErr('New passwords do not match.')
    setSavingPw(true)
    try {
      await changePassword(current, next)
      setPwDone(true); setCurrent(''); setNext(''); setConfirm('')
    } catch (e2) { setPwErr(authErrorMessage(e2)) } finally { setSavingPw(false) }
  }

  const previewName = name.trim() || nameFromEmail(user?.email)
  const initial = (previewName[0] || '?').toUpperCase()

  return (
    <section className="admin-section">
      <AdminTopbar
        icon={User}
        title="Account"
        subtitle={user?.email}
        onNavigate={onNavigate}
        actions={<>
          <button className="btn btn--ghost btn--sm" onClick={() => onNavigate?.('/admin')}><Grid /> Dashboard</button>
          <button className="btn btn--primary btn--sm" onClick={handleSignOut}><LogOut /> Sign out</button>
        </>}
      />

      <div className="admin-account">
        {/* Profile */}
        <div className="admin-panel admin-account__card">
          <div className="admin-account__head">
            <span className="admin-account__icon"><User /></span>
            <h2 className="admin-account__title">Your profile</h2>
            <p className="admin-account__sub">
              How you appear across the dashboard
              {isSuper && <span className="admin-account__rolechip"><ShieldCheck /> Super admin</span>}
            </p>
          </div>

          <form className="admin-account__form" onSubmit={saveProfile}>
            <div className="admin-avatar">
              <div className={`admin-avatar__ring ${isSuper ? 'is-super' : ''}`.trim()}>
                {photo ? <img src={photo} alt="" /> : <span className="admin-avatar__initial">{initial}</span>}
              </div>
              <div className="admin-avatar__controls">
                <label className="btn btn--outline btn--sm">
                  <input type="file" accept="image/*" hidden disabled={uploading}
                    onChange={e => { onUploadPhoto(e.target.files?.[0]); e.target.value = '' }} />
                  <ImageIcon /> {uploading ? 'Uploading…' : (photo ? 'Change photo' : 'Upload photo')}
                </label>
                {photo && (
                  <button type="button" className="btn btn--ghost btn--sm admin-del" onClick={() => setPhoto('')}>
                    <X /> Remove
                  </button>
                )}
              </div>
            </div>

            <label className="admin-field admin-account__field">
              <span>Preferred name <em>(optional)</em></span>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={nameFromEmail(user?.email)} maxLength={40} />
            </label>
            <p className="admin-account__hint">
              Shown on your dashboard. If left blank, we’ll use <strong>{nameFromEmail(user?.email)}</strong> (from your email).
            </p>

            {profileErr && <p className="login-error" role="alert">{profileErr}</p>}
            {profileMsg && <p className="admin-success" role="status"><CheckCircle /> {profileMsg}</p>}

            <button type="submit" className="btn btn--primary btn--md admin-account__submit" disabled={savingProfile || uploading}>
              {savingProfile ? 'Saving…' : 'Save profile'} <ArrowRight />
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="admin-panel admin-account__card">
          <div className="admin-account__head">
            <span className="admin-account__icon"><Key /></span>
            <h2 className="admin-account__title">Change password</h2>
            <p className="admin-account__sub">Signed in as <strong>{user?.email}</strong></p>
          </div>

          <form className="admin-account__form" onSubmit={savePassword}>
            <label className="admin-field admin-account__field">
              <span>Current password</span>
              <div className="admin-input-icon">
                <Lock />
                <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required />
              </div>
            </label>
            <label className="admin-field admin-account__field">
              <span>New password</span>
              <div className="admin-input-icon">
                <Lock />
                <input type="password" value={next} onChange={e => setNext(e.target.value)} placeholder="At least 6 characters" required />
              </div>
            </label>
            <label className="admin-field admin-account__field">
              <span>Confirm new password</span>
              <div className="admin-input-icon">
                <Lock />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>
            </label>

            {pwErr && <p className="login-error" role="alert">{pwErr}</p>}
            {pwDone && <p className="admin-success" role="status"><CheckCircle /> Password changed successfully.</p>}

            <button type="submit" className="btn btn--primary btn--md admin-account__submit" disabled={savingPw}>
              {savingPw ? 'Saving…' : 'Update password'} <ArrowRight />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
