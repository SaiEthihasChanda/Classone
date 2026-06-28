/**
 * Firebase Storage helpers — used by admin editors to upload images.
 *
 * Every image is resized client-side (max 1600 px, 82 % JPEG quality) before
 * upload. This keeps Storage usage low and page loads fast without any changes
 * needed in the pages that call uploadImage().
 *
 * SVG and GIF files are passed through as-is (animation / vector preserved).
 */
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Resize + re-encode an image File to JPEG, capped at maxDim × maxDim px.
 * Strips EXIF (canvas redraw), typically reduces file size 60-80 %.
 * Returns the original file unchanged for SVG / GIF / anything canvas can't handle.
 */
function resizeImage(file, maxDim = 1600, quality = 0.82) {
  // Pass vector/animated formats through unchanged
  if (/^image\/(svg|gif)/.test(file.type)) return Promise.resolve(file)

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }  // canvas failure → use original
          const name = file.name.replace(/\.[^.]+$/, '.jpg')
          resolve(new File([blob], name, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        quality,
      )
    }

    // If loading fails, upload the original rather than blocking the user
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file) }
    img.src = objectUrl
  })
}

/**
 * Resize, then upload an image file and return its public download URL.
 * @param {File|Blob} file  the file (e.g. from an <input type="file">)
 * @param {string} folder   logical folder, e.g. 'products' or 'slides'
 * @returns {Promise<{url:string, path:string}>}
 */
export async function uploadImage(file, folder = 'uploads') {
  const processed = await resizeImage(file)
  const safe = (processed.name || 'image').replace(/[^a-zA-Z0-9.]+/g, '-').toLowerCase()
  const path = `${folder}/${Date.now()}-${safe}`
  const r = ref(storage, path)
  await uploadBytes(r, processed, { contentType: processed.type || 'image/jpeg' })
  const url = await getDownloadURL(r)
  return { url, path }
}

/** Delete a previously uploaded image by its storage path. */
export async function deleteImage(path) {
  await deleteObject(ref(storage, path))
}
