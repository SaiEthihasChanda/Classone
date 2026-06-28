import { useEffect, useRef, useState } from 'react'
import { AppLink } from '../common/AppLink'
import { Waveform } from './Waveform'
import { ChevronLeft, ChevronRight, ArrowRight } from './Icons'
import { primaryHires } from '../../lib/hires'
import { adjustStyle } from '../../lib/imageAdjust'

/* ─── Hero carousel ───────────────────────────────────────────
   Copy (left column) slides in/out from the LEFT.
   Image (right column) slides in/out from the RIGHT.
   Exit finishes before enter begins (tiny gap between slides). */
const EXIT_MS  = 480  // how long before the exiting slide is removed
const LOCK_MS  = 1280 // EXIT_MS + enter delay(480) + enter duration(720) + buffer

export function HeroCarousel({ slides, onNavigate, waveVariant = 'cv', ariaLabel = 'Featured products' }) {
  const count = slides.length
  const [cur, setCur] = useState(0)
  const [exitIdx, setExitIdx] = useState(null)
  const lockRef = useRef(false)
  const curRef  = useRef(0)
  // Counts how many transitions have fired — used to skip animation on initial render.
  const txCount = useRef(0)

  const go = (nextIdx) => {
    if (lockRef.current) return
    lockRef.current = true
    txCount.current++
    setExitIdx(curRef.current)
    setCur(nextIdx)
    curRef.current = nextIdx
    // Remove the exiting slide once its animation finishes (right as enter begins)
    setTimeout(() => setExitIdx(null), EXIT_MS)
    // Release the lock only after the entering animation fully completes
    setTimeout(() => { lockRef.current = false }, LOCK_MS)
  }

  const goNext = () => go((curRef.current + 1) % count)
  const goPrev = () => go(((curRef.current - 1) % count + count) % count)
  const goTo   = (i) => { if (i !== curRef.current) go(i) }

  // Auto-advance — paused when the tab is hidden.
  useEffect(() => {
    if (count < 2) return
    let t = null
    const start = () => { t = setInterval(goNext, 5500) }
    const stop  = () => { clearInterval(t) }
    const onVis = () => (document.hidden ? stop() : start())
    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVis)
    return () => { stop(); document.removeEventListener('visibilitychange', onVis) }
  }, [count])

  if (!count) return null

  return (
    <section className="hero-section" aria-label={ariaLabel}>
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-bg__grid" />
      </div>
      <div className="hero-wave" aria-hidden="true">
        <Waveform variant={waveVariant} animated />
      </div>

      <div className="container hero-inner">
        <div className="hero-carousel" aria-live="polite">
          {slides.map((slide, i) => {
            const isActive  = i === cur
            const isExiting = i === exitIdx
            if (!isActive && !isExiting) return null

            // First ever render: show without entry animation so page doesn't
            // flash on load. Every transition after that gets the full animation.
            const animClass = isActive
              ? (txCount.current > 0 ? 'is-active' : 'is-initial')
              : 'is-exiting'

            return (
              <div key={slide.title} className={`hero-slide ${animClass}`} aria-hidden={!isActive}>
                <div className="hero-slide__split">
                  <div className="hero-slide__copy">
                    {slide.eyebrow && <span className="hero-eyebrow">{slide.eyebrow}</span>}
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-desc">{slide.description}</p>
                    {slide.cta && (
                      <AppLink
                        href={slide.href}
                        onNavigate={onNavigate}
                        external={slide.external}
                        target={slide.external ? '_blank' : undefined}
                        rel={slide.external ? 'noreferrer' : undefined}
                        className="btn btn--primary btn--lg"
                      >
                        {slide.cta} <ArrowRight />
                      </AppLink>
                    )}
                  </div>
                  <div className="hero-slide__media">
                    <div className="hero-panel__frame">
                      <img
                        className="hero-panel__img"
                        src={slide.image || primaryHires(slide.href)}
                        alt={slide.title}
                        loading="eager"
                        decoding="async"
                        style={adjustStyle(slide.imageAdjust)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="hero-controls">
          <button className="hero-arrow" onClick={goPrev} aria-label="Previous slide"><ChevronLeft /></button>
          <div className="hero-dots" role="tablist">
            {slides.map((s, i) => (
              <button
                key={s.title} role="tab" aria-selected={i === cur}
                className={i === cur ? 'is-active' : ''} onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button className="hero-arrow" onClick={goNext} aria-label="Next slide"><ChevronRight /></button>
        </div>
      </div>
    </section>
  )
}
