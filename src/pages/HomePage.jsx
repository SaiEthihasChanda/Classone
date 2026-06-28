import { useEffect, useRef, useState } from 'react'
import { useSite, useSettings, useContent } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { SectionHeading } from '../components/common/SectionHeading'
import { MediaFrame } from '../components/ui/MediaFrame'
import { HeroCarousel } from '../components/ui/HeroCarousel'
import { primaryHires } from '../lib/hires'
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
  const count = testimonials.length
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (count < 2) return
    const t = setInterval(() => setIdx(i => (i + 1) % count), 7000)
    return () => clearInterval(t)
  }, [count])

  if (!count) return null

  return (
    <div className="tslider">
      <div className="tslider__viewport">
        <div className="tslider__track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {testimonials.map(item => (
            <div className="tslider__page" key={item.name}>
              <article className="tcard">
                <div className="tcard__photo">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="tcard__content">
                  <span className="tcard__mark" aria-hidden="true">&ldquo;</span>
                  <p className="tcard__quote">{item.quote}</p>
                  <Stars count={item.rating || 5} />
                  <strong className="tcard__name">{item.name}</strong>
                  <span className="tcard__role">{item.role}</span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
      <div className="tslider__controls">
        <button className="tslider__arrow" onClick={() => setIdx(i => (i - 1 + count) % count)} aria-label="Previous"><ChevronLeft /></button>
        <div className="tslider__dots">
          {testimonials.map((_, i) => (
            <button key={i} className={i === idx ? 'is-active' : ''} onClick={() => setIdx(i)} aria-label={`Testimonial ${i + 1}`} />
          ))}
        </div>
        <button className="tslider__arrow" onClick={() => setIdx(i => (i + 1) % count)} aria-label="Next"><ChevronRight /></button>
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
  const c = useContent().home || {}
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
            <p className="sh__kicker"><span className="sh__eyebrow">{c.intro?.eyebrow}</span></p>
            <h2 className="sh__title">{c.intro?.title}</h2>
            <p>{c.intro?.body}</p>
            <AppLink href={c.intro?.cta?.href || '/about'} onNavigate={onNavigate} className="btn btn--primary btn--md" style={{ marginTop: '1.5rem' }}>
              {c.intro?.cta?.label} <ArrowRight />
            </AppLink>
          </div>
        </div>
      </section>

      {/* ── Application areas ── */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading index="01" eyebrow={c.areas?.eyebrow} title={c.areas?.title} />
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
          <SectionHeading index="02" title={c.featured?.title} summary={c.featured?.summary} />
          <div className="product-grid product-grid--5">
            {biosensorProducts.map((item, i) => (
              <AppLink href={item.href} onNavigate={onNavigate} className="pcard" key={item.title} data-reveal style={{ '--reveal-delay': `${(i % 5) * 60}ms` }}>
                <MediaFrame src={primaryHires(item.href, item.image)} alt={item.title} aspect="square" className="pcard__media" />
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
          <SectionHeading index="03" title={c.segments?.title} summary={c.segments?.summary} />
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
          <SectionHeading index="04" eyebrow={c.newest?.eyebrow} title={c.newest?.title} />
          <div className="product-grid product-grid--4">
            {newestInnovations.map(item => (
              <AppLink href={item.href} onNavigate={onNavigate} className="pcard" key={item.title}>
                <MediaFrame src={primaryHires(item.href, item.image)} alt={item.title} aspect="square" className="pcard__media" />
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
          <SectionHeading index="05" title={c.testimonials?.title} align="center" />
          <TestimonialsSection testimonials={testimonials} />
        </div>
      </section>

      {/* ── Certificates ── */}
      <section className="section">
        <div className="container">
          <SectionHeading index="06" title={c.certificates?.title} align="center" />
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
          <SectionHeading index="07" eyebrow={c.clients?.eyebrow} title={c.clients?.title} align="center" />
          <LogoRail clients={clientBadges} />
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="section cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <p className="cta-banner__eyebrow">{c.cta?.eyebrow}</p>
            <h2 className="cta-banner__title">{c.cta?.title}</h2>
          </div>
          <AppLink href={c.cta?.button?.href || '/contact'} onNavigate={onNavigate} className="btn btn--primary btn--lg">
            {c.cta?.button?.label} <ArrowRight />
          </AppLink>
        </div>
      </section>

      {/* ── HQ map ── */}
      <section className="section">
        <div className="container hq-section">
          <div className="hq-section__copy">
            <h2>{c.hq?.title}</h2>
            <p>{c.hq?.body}</p>
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
