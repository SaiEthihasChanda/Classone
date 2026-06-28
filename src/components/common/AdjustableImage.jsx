import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_ADJUST, ZOOM_MIN, ZOOM_MAX, clampZoom, clampPan, normAdjust, adjustStyle,
} from '../../lib/imageAdjust'
import { ZoomIn, ZoomOut, RotateCcw, Move, ImageIcon } from '../ui/Icons'

/**
 * Segmented control to pick the gallery aspect ratio for a post / product.
 * The choice applies to every image, so the gallery box keeps one shape.
 */
export function RatioField({ value = '1:1', onChange, noun = 'gallery' }) {
  return (
    <div className="admin-field">
      <span>Image aspect ratio <em>(applies to every image in this {noun} — mismatched shapes may show white bars or be cropped)</em></span>
      <div className="admin-segment" role="group" aria-label="Image aspect ratio">
        <button type="button" className={value === '1:1' ? 'is-active' : ''} onClick={() => onChange('1:1')}>Square 1:1</button>
        <button type="button" className={value === '16:9' ? 'is-active' : ''} onClick={() => onChange('16:9')}>Wide 16:9</button>
      </div>
    </div>
  )
}

/**
 * Interactive image framing control. Shows the image inside a preview shaped
 * like its real destination (a product card, a news card, or the home hero
 * panel) and lets the admin drag to reposition and zoom — the exact transform
 * is what the public site renders, so the preview is WYSIWYG.
 *
 * Props:
 *   url      image URL (empty → placeholder)
 *   value    { zoom, x, y } | null  (null = default / unadjusted)
 *   onChange (next) => void
 *   frame    'product' | 'news' | 'carousel'   — preview chrome + aspect
 *   caption  optional title shown in the mock card body
 */
export function AdjustableImage({ url, value, onChange, frame = 'product', caption = '', ratio }) {
  const v = normAdjust(value)
  // Crop-window shape: product / news follow the chosen gallery ratio; the
  // carousel keeps its own fixed hero panel shape (set in CSS).
  // The product/news stage is a ~3/2 box; size the window by whichever axis is
  // limiting so it keeps the EXACT chosen ratio. (Plain width:100% squashed a
  // 1:1 window down to the stage's height and rendered it as a wide rectangle.)
  let winStyle
  if (frame !== 'carousel') {
    const [rw, rh] = (ratio || '1:1').split(':').map(Number)
    const css = `${rw} / ${rh}`
    winStyle = (rw / rh) >= 1.5
      ? { aspectRatio: css, width: '100%', height: 'auto' }   // wider than the stage → fit width
      : { aspectRatio: css, height: '100%', width: 'auto' }   // squarer/taller → fit height
  }
  const frameRef = useRef(null)
  const winRef = useRef(null)
  const drag = useRef(null)
  const [dragging, setDragging] = useState(false)

  // Wheel-to-zoom (attached natively so we can preventDefault the page scroll).
  useEffect(() => {
    const el = frameRef.current
    if (!el || !url) return
    const onWheel = (e) => {
      e.preventDefault()
      const step = e.deltaY < 0 ? 0.12 : -0.12
      onChange({ ...normAdjust(value), zoom: clampZoom(normAdjust(value).zoom + step) })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [url, value, onChange])

  function onPointerDown(e) {
    if (!url) return
    e.preventDefault()
    const rect = (winRef.current || frameRef.current).getBoundingClientRect()
    drag.current = { sx: e.clientX, sy: e.clientY, ox: v.x, oy: v.y, w: rect.width, h: rect.height }
    frameRef.current.setPointerCapture?.(e.pointerId)
    setDragging(true)
  }
  function onPointerMove(e) {
    const d = drag.current
    if (!d) return
    const dxp = ((e.clientX - d.sx) / d.w) * 100
    const dyp = ((e.clientY - d.sy) / d.h) * 100
    onChange({ zoom: v.zoom, x: clampPan(d.ox + dxp), y: clampPan(d.oy + dyp) })
  }
  function onPointerUp(e) {
    drag.current = null
    setDragging(false)
    try { frameRef.current?.releasePointerCapture?.(e.pointerId) } catch { /* noop */ }
  }

  const setZoom = (z) => onChange({ ...v, zoom: clampZoom(z) })
  const reset = () => onChange({ ...DEFAULT_ADJUST })
  const adjusted = v.zoom !== 1 || v.x !== 0 || v.y !== 0

  const Frame = (
    <div
      ref={frameRef}
      className={`imgadj__frame ${dragging ? 'is-dragging' : ''} ${url ? '' : 'is-empty'}`.trim()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="application"
      aria-label="Drag to reposition image"
    >
      {url ? (
        /* The "window" is the exact crop region shown on the live site. The image
           can overflow it; the mask dims everything outside so the admin sees what
           gets cropped when zoomed / repositioned. */
        <div className="imgadj__win" ref={winRef} style={winStyle}>
          <img className="imgadj__img" src={url} alt="" draggable={false} style={adjustStyle(v)} />
          <span className="imgadj__mask" aria-hidden="true" />
        </div>
      ) : (
        <span className="imgadj__placeholder"><ImageIcon /></span>
      )}
    </div>
  )

  return (
    <div className={`imgadj imgadj--${frame}`}>
      {frame === 'carousel' ? (
        <div className="imgadj__stage">
          <div className="imgadj__stagecopy" aria-hidden="true">
            <span className="imgadj__stageline imgadj__stageline--eyebrow" />
            <span className="imgadj__stageline imgadj__stageline--title" />
            <span className="imgadj__stageline imgadj__stageline--text" />
            <span className="imgadj__stagebtn" />
          </div>
          {Frame}
        </div>
      ) : (
        <div className="imgadj__card">
          {Frame}
          <div className="imgadj__cardbody">
            {frame === 'news' && <span className="imgadj__cardmeta" aria-hidden="true" />}
            <span className="imgadj__cardtitle">{caption || (frame === 'news' ? 'News headline' : 'Product name')}</span>
            {frame === 'news' && <span className="imgadj__carddesc" aria-hidden="true" />}
          </div>
        </div>
      )}

      <div className="imgadj__controls">
        <button type="button" className="imgadj__btn" onClick={() => setZoom(v.zoom - 0.25)}
          disabled={!url || v.zoom <= ZOOM_MIN} aria-label="Zoom out"><ZoomOut /></button>
        <input
          className="imgadj__range" type="range" min={ZOOM_MIN} max={ZOOM_MAX} step={0.01}
          value={v.zoom} disabled={!url}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          aria-label="Zoom level"
        />
        <button type="button" className="imgadj__btn" onClick={() => setZoom(v.zoom + 0.25)}
          disabled={!url || v.zoom >= ZOOM_MAX} aria-label="Zoom in"><ZoomIn /></button>
        <button type="button" className="imgadj__btn imgadj__btn--reset" onClick={reset}
          disabled={!url || !adjusted} aria-label="Reset framing"><RotateCcw /> Reset</button>
      </div>

      <p className="imgadj__tip"><Move /> Drag to reposition · scroll or slider to zoom · the dimmed area is cropped off</p>
    </div>
  )
}
