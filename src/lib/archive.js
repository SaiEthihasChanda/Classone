/**
 * Image archival + recovery (super-admin recoverable).
 *
 * When an admin removes a SINGLE image from a product/news gallery or a carousel
 * slide, we don't lose it: the bytes are moved to `archive/<originalPath>` in
 * Storage and a record is written to the `archivedImages` collection capturing
 * where it came from. The super admin can later restore it (move back + re-attach
 * to its source) or purge it for good.
 *
 * Whole-item deletes (a product/news post deleted entirely) are SOFT deletes and
 * do NOT archive images — restoring the item brings its images back untouched.
 */
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage'
import {
  collection, doc, addDoc, getDoc, getDocs, deleteDoc, updateDoc,
  serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { storage, db, auth } from './firebase'

/** Extract the Storage object path from a Firebase download URL (else null). */
export function storagePathFromUrl(url) {
  if (typeof url !== 'string') return null
  const m = /\/o\/([^?]+)/.exec(url)
  if (!m) return null            // not a firebasestorage URL (e.g. a local /img asset)
  try { return decodeURIComponent(m[1]) } catch { return null }
}

async function copyObject(fromPath, toPath) {
  const url = await getDownloadURL(ref(storage, fromPath))
  const blob = await (await fetch(url)).blob()
  await uploadBytes(ref(storage, toPath), blob, { contentType: blob.type || 'image/jpeg' })
  return getDownloadURL(ref(storage, toPath))
}

/**
 * Archive one removed image. No-op (returns null) for non-Storage URLs.
 * @param {string} url   the image URL being removed
 * @param {object} meta  { sourceType:'product'|'news'|'slide', sourceId, sourceTitle, field }
 */
export async function archiveImage(url, meta = {}) {
  const originalPath = storagePathFromUrl(url)
  if (!originalPath) return null
  const archivePath = `archive/${originalPath}`

  let archiveUrl = ''
  try {
    archiveUrl = await copyObject(originalPath, archivePath)
    await deleteObject(ref(storage, originalPath)).catch(() => {})
  } catch {
    // If the source object is already gone, still log what we know.
    archiveUrl = ''
  }

  await addDoc(collection(db, 'archivedImages'), {
    originalUrl: url,
    originalPath,
    archivePath,
    archiveUrl,
    sourceType: meta.sourceType || 'unknown',
    sourceId: meta.sourceId || '',
    sourceTitle: meta.sourceTitle || '',
    field: meta.field || 'images',
    removedAt: serverTimestamp(),
    removedBy: auth.currentUser?.email || 'unknown',
  })
  return archivePath
}

/** Archive every removed image between two arrays (old − new). Best-effort. */
export async function archiveRemovedImages(oldList = [], newList = [], meta = {}) {
  const kept = new Set(newList || [])
  const removed = (oldList || []).filter(u => !kept.has(u))
  for (const url of removed) {
    try { await archiveImage(url, meta) } catch { /* don't block the save */ }
  }
}

// ── Super-admin recovery ───────────────────────────────────────

/** All archived-image records, newest first. */
export async function listArchivedImages() {
  let snap
  try {
    snap = await getDocs(query(collection(db, 'archivedImages'), orderBy('removedAt', 'desc')))
  } catch {
    snap = await getDocs(collection(db, 'archivedImages'))
  }
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Restore an archived image: move the bytes back to their original path and
 * re-attach the URL to the source document (best-effort), then drop the record.
 */
export async function restoreArchivedImage(record) {
  const { id, originalPath, archivePath, sourceType, sourceId, field } = record
  let restoredUrl = record.originalUrl || ''
  try {
    restoredUrl = await copyObject(archivePath, originalPath)
    await deleteObject(ref(storage, archivePath)).catch(() => {})
  } catch { /* archive bytes missing — fall through to cleanup */ }

  // Re-attach to the source document if it still exists.
  try {
    if (restoredUrl && sourceId) {
      const sref =
        sourceType === 'product' ? doc(db, ...sourceId.split('/'))
        : sourceType === 'news'  ? doc(db, 'newsposts', sourceId)
        : sourceType === 'slide' ? doc(db, 'slides', sourceId)
        : null
      if (sref) {
        const sdoc = await getDoc(sref)
        if (sdoc.exists()) {
          const data = sdoc.data()
          if (field === 'image') {
            await updateDoc(sref, { image: restoredUrl })
          } else {
            const arr = Array.isArray(data[field]) ? data[field] : []
            if (!arr.includes(restoredUrl)) await updateDoc(sref, { [field]: [...arr, restoredUrl] })
          }
        }
      }
    }
  } catch { /* leave it detached if the source is gone */ }

  await deleteDoc(doc(db, 'archivedImages', id))
  return restoredUrl
}

/** Permanently delete an archived image (bytes + record). */
export async function purgeArchivedImage(record) {
  try { await deleteObject(ref(storage, record.archivePath)) } catch { /* already gone */ }
  await deleteDoc(doc(db, 'archivedImages', record.id))
}
