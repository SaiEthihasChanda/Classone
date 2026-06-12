import { useEffect, useRef, useState } from 'react'
import { useSite, useSettings } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { SectionHeading } from '../components/common/SectionHeading'
import { MediaFrame } from '../components/ui/MediaFrame'
import {
  ChevronLeft, ChevronRight, ArrowRight,
  Droplet, Activity, Shield, Wave, Dna, FlaskIcon,
} from '../components/ui/Icons'

/* Line icons mapped to each application area (replaces tiny photo thumbnails) */
const areaIcons = [Droplet, Activity, Shield, Wave, Dna, FlaskIcon]

/* Trust / credibility stats */
const stats = [
  { num: '12+',  label: 'Years of Expertise' },
  { num: '500+', label: 'Research Institutions' },
  { num: '7',    label: 'Regional Offices' },
  { num: '70+',  label: 'Instruments & Systems' },
]

/* ─── Hero carousel ─────────────────────────────────────────── */
function HeroCarousel({ slides, onNavigate }) {
  const count  = slides.length
  const extended = [slides[count - 1], ...slides, slides[0]]
  const [pos, setPos] = useState(1)
  const [anim, setAnim] = useState(true)
  const realIdx = ((pos - 1) % count + count) % count

  useEffect(() => {
    const t = setInterval(() => setPos(p => p + 1), 5500)
    return () => clearInterval(t)
  }, [])

  const onEnd = () => {
    if (pos === 0) { setAnim(false); setPos(count); requestAnimationFrame(() => setAnim(true)) }
    else if (pos === count + 1) { setAnim(false); setPos(1); requestAnimationFrame(() => setAnim(true)) }
  }
  const prev = () => { setAnim(true); setPos(p => p - 1) }
  const next = () => { setAnim(true); setPos(p => p + 1) }

  const step = 100 / extended.length

  return (
    <section className="hero-section" aria-label="Featured products">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-bg__grid" />
      </div>

      <div className="container hero-inner">
        {/* Carousel track */}
        <div className="hero-carousel" aria-live="polite">
          <div
            className="hero-track"
            onTransitionEnd={onEnd}
            style={{
              width: `${extended.length * 100}%`,
              transform: `translateX(-${pos * step}%)`,
              transition: anim ? 'transform 600ms cubic-bezier(.16,1,.3,1)' : 'none',
            }}
          >
            {extended.map((slide, i) => (
              <div
                key={`${slide.title}-${i}`}
                className="hero-slide"
                style={{ flex: `0 0 ${100 / extended.length}%`, width: `${100 / extended.length}%` }}
              >
                <div className="hero-slide__split">
                  <div className="hero-slide__copy">
                    {slide.eyebrow && <span className="hero-eyebrow">{slide.eyebrow}</span>}
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-desc">{slide.description}</p>
                    <AppLink href={slide.href} onNavigate={onNavigate} className="btn btn--primary btn--lg">
                      {slide.cta} <ArrowRight />
                    </AppLink>
                  </div>
                  <div className="hero-slide__media">
                    <div className="hero-slide__pedestal" />
                    <div className="hero-stage">
                      <img src={slide.image} alt={slide.title} loading="eager" decoding="async" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="hero-controls">
          <button className="hero-arrow" onClick={prev} aria-label="Previous slide"><ChevronLeft /></button>
          <div className="hero-dots" role="tablist">
            {slides.map((s, i) => (
              <button key={s.title} role="tab" aria-selected={i === realIdx}
                className={i === realIdx ? 'is-active' : ''} onClick={() => { setAnim(true); setPos(i + 1) }}
                aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
          <button className="hero-arrow" onClick={next} aria-label="Next slide"><ChevronRight /></button>
        </div>
      </div>
    </section>
  )
}

/* ─── Stars ──────────────────────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div className="stars" aria-label={`${count} out of 5`}>
      {[0,1,2,3,4].map(i => <span key={i} className={`stars__star ${i < count ? 'is-lit' : ''}`.trim()} aria-hidden="true">★</span>)}
    </div>
  )
}

/* ─── Testimonials ───────────────────────────────────────────── */
function TestimonialsSection({ testimonials }) {
  const perView = 3
  const pages   = Math.ceil(testimonials.length / perView)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPage(p => (p + 1) % pages), 6000)
    return () => clearInterval(t)
  }, [pages])

  return (
    <div className="tslider">
      <div className="tslider__viewport">
        <div className="tslider__track" style={{ transform: `translateX(-${page * 100}%)` }}>
          {Array.from({ length: pages }).map((_, pi) => (
            <div className="tslider__page" key={pi}>
              {testimonials.slice(pi * perView, pi * perView + perView).map(item => (
                <article className="tcard" key={item.name}>
                  <div className="tcard__avatar">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <Stars count={item.rating || 5} />
                  <p className="tcard__quote">"{item.quote}"</p>
                  <strong className="tcard__name">{item.name}</strong>
                  <span className="tcard__role">{item.role}</span>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="tslider__controls">
        <button className="tslider__arrow" onClick={() => setPage(p => (p - 1 + pages) % pages)} aria-label="Previous"><ChevronLeft /></button>
        <div className="tslider__dots">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} className={i === page ? 'is-active' : ''} onClick={() => setPage(i)} aria-label={`Page ${i + 1}`} />
          ))}
        </div>
        <button className="tslider__arrow" onClick={() => setPage(p => (p + 1) % pages)} aria-label="Next"><ChevronRight /></button>
      </div>
    </div>
  )
}

/* ─── Scrollable rail for logos ──────────────────────────────── */
function LogoRail({ clients }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.75), behavior: 'smooth' })

  return (
    <div className="logo-rail-shell">
      <button className="logo-rail-shell__btn logo-rail-shell__btn--left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
      <div className="logo-rail" ref={ref}>
        {clients.map((c, i) => (
          <div className="client-badge" key={i}>
            <img src={c.image} alt="Client logo" loading="lazy" />
          </div>
        ))}
      </div>
      <button className="logo-rail-shell__btn logo-rail-shell__btn--right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────── */
export function HomePage({ onNavigate }) {
  const site = useSite()
  const settings = useSettings()
  const slides = site.slides || []
  const biosensorAreas = site.areas || []
  const biosensorProducts = site.homeProducts || []
  const businessSegments = site.segments || []
  const newestInnovations = site.newProducts || []
  const testimonials = site.testimonials || []
  const certificateSlides = site.certificates || []
  const clientBadges = site.clients || []
  const imageAssets = settings.assets || {}
  const contact = settings.contact || {}

  return (
    <>
      <HeroCarousel slides={slides} onNavigate={onNavigate} />

      {/* ── Trust / stats band ── */}
      <section className="section section--sm stats-band">
        <div className="container">
          <div className="stats-band__grid">
            {stats.map((s, i) => (
              <div className="stat" key={s.label} data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
                <div className="stat__num">{s.num}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Biosensor intro ── */}
      <section className="section">
        <div className="container intro-split">
          <div className="intro-split__media">
            <MediaFrame src={imageAssets.hero} alt="Biosensor innovation equipment" aspect="wide" eager />
          </div>
          <div className="intro-split__copy">
            <p className="sh__eyebrow">Compact. Sensitive. Real-Time.</p>
            <h2 className="sh__title">Biosensor Innovation</h2>
            <p>
              Biosensors require highly sensitive and compact potentiostats for real-time electrochemical detection in
              medical, environmental, and wearable applications. We offer a full range of instruments from PalmSens
              tailored for biosensor development and integration.
            </p>
            <AppLink href="/about" onNavigate={onNavigate} className="btn btn--primary btn--md" style={{ marginTop: '1.5rem' }}>
              Know More
            </AppLink>
          </div>
        </div>
      </section>

      {/* ── Application areas ── */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Biosensor Deployment Zones" title="Application Areas" />
          <div className="area-grid">
            {biosensorAreas.map((item, i) => {
              const Icon = areaIcons[i % areaIcons.length]
              return (
                <article className="area-card" key={item.title} data-reveal style={{ '--reveal-delay': `${i * 70}ms` }}>
                  <div className="area-card__icon"><Icon /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Featured instruments ── */}
      <section className="section">
        <div className="container">
          <SectionHeading title="Proven Solutions for Biosensor Research" summary="Precision instruments from PalmSens — trusted by researchers worldwide." />
          <div className="product-grid product-grid--5">
            {biosensorProducts.map((item, i) => (
              <AppLink href={item.href} onNavigate={onNavigate} className="pcard" key={item.title} data-reveal style={{ '--reveal-delay': `${(i % 5) * 60}ms` }}>
                <MediaFrame src={item.image} alt={item.title} aspect="square" className="pcard__media" />
                <div className="pcard__body">
                  <h3 className="pcard__title">{item.title}</h3>
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business segments ── */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading title="Business Segments" summary="Serving standard or customised equipment, devices, components, accessories & consumables across sectors." />
          <div className="segment-grid">
            {businessSegments.map((item, i) => (
              <article className="segment-card" key={i} data-reveal style={{ '--reveal-delay': `${(i % 4) * 60}ms` }}>
                <div className="segment-card__img">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newest innovations ── */}
      <section className="section">
        <div className="container">
          <SectionHeading title="Newest Innovations" eyebrow="Just Arrived" />
          <div className="product-grid product-grid--4">
            {newestInnovations.map(item => (
              <AppLink href={item.href} onNavigate={onNavigate} className="pcard" key={item.title}>
                <MediaFrame src={item.image} alt={item.title} aspect="square" className="pcard__media" />
                <div className="pcard__body">
                  <h3 className="pcard__title">{item.title}</h3>
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading title="What Researchers Say" align="center" />
          <TestimonialsSection testimonials={testimonials} />
        </div>
      </section>

      {/* ── Certificates ── */}
      <section className="section">
        <div className="container">
          <SectionHeading title="Licenses & Certificates" align="center" />
          <div className="cert-grid">
            {certificateSlides.map(item => (
              <article className="cert-card" key={item.key}>
                <img src={item.image} alt={item.key} loading="lazy" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clients ── */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Trusted Across Research Sectors" title="Our Esteemed Clients" align="center" />
          <LogoRail clients={clientBadges} />
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="section cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <p className="sh__eyebrow">Get in touch</p>
            <h2 className="cta-banner__title">Ready to advance your research?</h2>
          </div>
          <AppLink href="/contact" onNavigate={onNavigate} className="btn btn--primary btn--lg">
            Contact Us <ArrowRight />
          </AppLink>
        </div>
      </section>

      {/* ── HQ map ── */}
      <section className="section">
        <div className="container hq-section">
          <div className="hq-section__copy">
            <h2>Visit Our Corporate Headquarters</h2>
            <p>Our head office is here to support your research and instrumentation needs.</p>
            <p className="hq-address">{contact.address}</p>
          </div>
          <div className="hq-map">
            <iframe
              title="Class One Systems headquarters map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.172%2C28.500%2C77.240%2C28.562&layer=mapnik&marker=28.5245%2C77.2061"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  )
}
