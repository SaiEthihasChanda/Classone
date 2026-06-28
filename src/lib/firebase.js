/**
 * Firebase initialisation. The web config below is a public identifier, not a
 * secret — it's safe to ship in the client bundle. Access is enforced by the
 * Firestore security rules (firestore.rules), not by hiding these values.
 */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'

// Exported so a short-lived secondary app (admin account creation) can reuse it
// without disturbing the primary app's signed-in session.
export const firebaseConfig = {
  apiKey: 'AIzaSyC3x4jHzPlaFtFwn35EJE0fAMrosBFoe6k',
  authDomain: 'classone-systems.firebaseapp.com',
  projectId: 'classone-systems',
  storageBucket: 'classone-systems.firebasestorage.app',
  messagingSenderId: '137356592909',
  appId: '1:137356592909:web:bba3b11e7729561a1d5244',
  measurementId: 'G-FB903HE2E3',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

// Persistent (cross-tab) auth — the admin stays signed in across new tabs and
// browser restarts until they explicitly sign out ("remember me"). All tabs on
// this origin share the one session via IndexedDB.
setPersistence(auth, browserLocalPersistence).catch(() => {})
