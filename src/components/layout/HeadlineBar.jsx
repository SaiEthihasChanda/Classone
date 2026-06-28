import { useEffect, useState } from 'react'

/** Respects the user's reduced-motion preference. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduced
}

/**
 * Rotating announcement ribbon. Each headline slides the full width of the
 * screen (right → left); when it exits, the next one follows. With reduced
 * motion the text simply cross-fades on a timer instead of scrolling.
 *
 * `texts` may be an array of strings or of `{ text }` records (sorted upstream).
 */
export function HeadlineBar({ texts = [] }) {
  const clean = (texts || []).map(t => (typeof t === 'string' ? t : t?.text)).map(s => (s || '').trim()).filter(Boolean)
  const [cycle, setCycle] = useState(0)
  const reduced = useReducedMotion()
  const count = clean.length

  // Reduced motion: advance on a timer (no animationend to drive it).
  useEffect(() => {
    if (!reduced || count < 2) return
    const t = setInterval(() => setCycle(c => c + 1), 5000)
    return () => clearInterval(t)
  }, [reduced, count])

  if (!count) return null

  const idx = ((cycle % count) + count) % count
  const text = clean[idx]
  // Duration ∝ travel distance (viewport + approx text width) → ~constant speed.
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const dur = Math.max(7, Math.min(28, (vw + text.length * 11) / 150))

  return (
    <div className="headline-bar" role="complementary" aria-label="Announcements">
      <div className="headline-bar__viewport">
        {reduced ? (
          <span key={cycle} className="headline-bar__text is-static">{text}</span>
        ) : (
          <span
            key={cycle}
            className="headline-bar__text"
            style={{ animationDuration: `${dur}s` }}
            onAnimationEnd={() => setCycle(c => c + 1)}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  )
}
