/**
 * Admin authentication (Firebase Auth, email + password).
 *
 * Authorisation is driven by the Firestore /admins allow-list (managed by the
 * super admin from the dashboard) — NOT a hard-coded list or custom claim:
 *  - There is no public sign-up. The super admin provisions accounts.
 *  - A signed-in account is admitted only if its lowercased email has a doc in
 *    /admins. The matching security rules enforce the same boundary for writes.
 *  - Exactly one super admin (SUPER_ADMIN_EMAIL) can manage admins, recover
 *    soft-deleted data and permanently purge. Regular admins never see any of
 *    that — to them, deletes look permanent.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

/** The single super admin. Mirrors the value hard-coded in the security rules. */
export const SUPER_ADMIN_EMAIL = 'saiethihaschanda@gmail.com'

const norm = (email) => (email || '').trim().toLowerCase()

/** Friendly name from the email local part, used when no preferred name is set. */
export function nameFromEmail(email) {
  const local = (email || '').split('@')[0] || 'there'
  const out = local.split(/[._\-+]+/).filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
  return out || 'there'
}

/** Load an account's allow-list entry (role + profile). Returns null if absent. */
async function fetchProfile(email) {
  const e = norm(email)
  if (!e) return null
  try {
    const snap = await getDoc(doc(db, 'admins', e))
    if (!snap.exists()) return null
    const d = snap.data()
    return { role: d.role || 'admin', displayName: d.displayName || '', photoURL: d.photoURL || '' }
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null) // { role, displayName, photoURL } | null
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null)
      setProfile(u ? await fetchProfile(u.email) : null)
      setLoading(false)
    })
    return unsub
  }, [])

  /**
   * Sign in with email + password. Rejects (and signs back out) if the
   * account is not on the admin allow-list.
   */
  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, norm(email), password)
    const p = await fetchProfile(cred.user.email)
    if (!p) {
      await fbSignOut(auth)
      const err = new Error('This account is not authorised to access the admin area.')
      err.code = 'auth/not-allowed'
      throw err
    }
    setProfile(p)
    return cred.user
  }

  function logout() {
    return fbSignOut(auth)
  }

  /** Change the signed-in account's password (re-auth with the current one). */
  async function changePassword(currentPassword, newPassword) {
    const u = auth.currentUser
    if (!u) { const e = new Error('Not signed in.'); e.code = 'auth/no-user'; throw e }
    const credential = EmailAuthProvider.credential(u.email, currentPassword)
    await reauthenticateWithCredential(u, credential)
    await updatePassword(u, newPassword)
  }

  /** Save the signed-in account's profile fields (preferred name / photo). */
  async function updateProfile(fields) {
    const e = norm(user?.email)
    if (!e) { const err = new Error('Not signed in.'); err.code = 'auth/no-user'; throw err }
    await setDoc(doc(db, 'admins', e), fields, { merge: true })
    setProfile(p => ({ ...(p || { role: 'admin' }), ...fields }))
  }

  /** Re-read the profile from Firestore (e.g. after an external change). */
  async function refreshProfile() {
    if (user) setProfile(await fetchProfile(user.email))
  }

  const role = profile?.role || null
  const isAdmin = role === 'super' || role === 'admin'
  const isSuper = role === 'super' && norm(user?.email) === SUPER_ADMIN_EMAIL
  const displayName = profile?.displayName || ''
  const photoURL = profile?.photoURL || ''
  // The label shown everywhere: preferred name if set, else inferred from email.
  const accountName = displayName || nameFromEmail(user?.email)

  return (
    <AuthContext.Provider value={{
      user, role, loading, isAdmin, isSuper,
      displayName, photoURL, accountName,
      login, logout, changePassword, updateProfile, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext) || {
    user: null, role: null, loading: true, isAdmin: false, isSuper: false,
    displayName: '', photoURL: '', accountName: 'there',
  }
}

/** Human-readable message for a Firebase auth error code. */
export function authErrorMessage(err) {
  const code = err?.code || ''
  switch (code) {
    case 'auth/not-allowed':
      return err.message
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/requires-recent-login':
      return 'Please sign in again before changing your password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled for this project yet.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    default:
      return err?.message || 'Something went wrong. Please try again.'
  }
}
