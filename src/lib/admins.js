/**
 * Super-admin tools for managing the /admins allow-list.
 *
 * Creating an account's password-based login from the browser would normally
 * sign the new user into the current tab. To avoid disturbing the super admin's
 * session we spin up a short-lived SECONDARY Firebase app, create the user
 * there, sign it out, and tear the app down. Authorisation (the /admins doc) is
 * then written from the primary session, which the security rules gate to the
 * super admin.
 */
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { firebaseConfig, db } from './firebase'
import { SUPER_ADMIN_EMAIL } from './auth'

const norm = (email) => (email || '').trim().toLowerCase()

/** All admins, super first then by creation. */
export async function listAdmins() {
  let snap
  try {
    snap = await getDocs(query(collection(db, 'admins'), orderBy('createdAt', 'asc')))
  } catch {
    snap = await getDocs(collection(db, 'admins'))
  }
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.role === 'super' ? -1 : b.role === 'super' ? 1 : 0))
}

/**
 * Create a new admin: provisions the Firebase Auth login (secondary app) and
 * adds the allow-list entry. If the login already exists we keep going and just
 * grant access (covers re-adding a previously removed admin).
 */
export async function createAdmin({ email, password, createdBy }) {
  const e = norm(email)
  if (!e) throw new Error('Email is required.')
  if (e === SUPER_ADMIN_EMAIL) throw new Error('That email is already the super admin.')

  const existing = await getDoc(doc(db, 'admins', e))
  if (existing.exists()) throw new Error('This email is already an admin.')

  const secondary = initializeApp(firebaseConfig, `admin-creator-${Date.now()}`)
  try {
    const secAuth = getAuth(secondary)
    try {
      await createUserWithEmailAndPassword(secAuth, e, password)
    } catch (err) {
      // An account may already exist (e.g. previously removed). That's fine —
      // we still want to authorise it. Re-throw anything else.
      if (err?.code !== 'auth/email-already-in-use') throw err
    } finally {
      await signOut(secAuth).catch(() => {})
    }
  } finally {
    await deleteApp(secondary).catch(() => {})
  }

  await setDoc(doc(db, 'admins', e), {
    email: e,
    role: 'admin',
    createdAt: serverTimestamp(),
    createdBy: createdBy || 'super',
  })
  return { id: e, email: e, role: 'admin' }
}

/** Revoke an admin's access (removes the allow-list entry). Super cannot be removed. */
export async function removeAdmin(email) {
  const e = norm(email)
  if (e === SUPER_ADMIN_EMAIL) throw new Error('The super admin cannot be removed.')
  await deleteDoc(doc(db, 'admins', e))
}
