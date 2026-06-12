import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Generic infinite carousel hook.
 * @param {number} count  - number of real slides
 * @param {number} [interval=5000] - auto-play interval ms (0 = off)
 */
export function useCarousel(count, interval = 5000) {
  // Extended with clones: [last, ...real, first]
  const total = count + 2
  const [pos, setPos] = useState(1)          // real index 0 → pos 1
  const [animated, setAnimated] = useState(true)

  const realIndex = ((pos - 1) % count + count) % count

  // Auto-play
  useEffect(() => {
    if (!interval || count < 2) return
    const t = setInterval(() => setPos(p => p + 1), interval)
    return () => clearInterval(t)
  }, [count, interval])

  // Handle clone-jump after CSS transition ends
  const onTransitionEnd = useCallback(() => {
    if (pos === 0) {
      setAnimated(false)
      setPos(count)
      requestAnimationFrame(() => setAnimated(true))
    } else if (pos === count + 1) {
      setAnimated(false)
      setPos(1)
      requestAnimationFrame(() => setAnimated(true))
    }
  }, [pos, count])

  const prev = useCallback(() => { setAnimated(true); setPos(p => p - 1) }, [])
  const next = useCallback(() => { setAnimated(true); setPos(p => p + 1) }, [])
  const goTo = useCallback((i) => { setAnimated(true); setPos(i + 1) }, [])

  return { pos, total, realIndex, animated, prev, next, goTo, onTransitionEnd }
}

/**
 * Simple non-infinite slider (for testimonials, galleries).
 */
export function useSlider(count, perView = 1, interval = 0) {
  const pages = Math.ceil(count / perView)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!interval || pages < 2) return
    const t = setInterval(() => setPage(p => (p + 1) % pages), interval)
    return () => clearInterval(t)
  }, [pages, interval])

  const prev = useCallback(() => setPage(p => (p - 1 + pages) % pages), [pages])
  const next = useCallback(() => setPage(p => (p + 1) % pages), [pages])
  const goTo = useCallback((i) => setPage(i), [])

  return { page, pages, prev, next, goTo }
}
