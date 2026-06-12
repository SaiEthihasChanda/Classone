import { useEffect, useState } from 'react'
import { useCollection } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { MediaFrame } from '../components/ui/MediaFrame'
import { SectionHeading } from '../components/common/SectionHeading'
import { Zap } from '../components/ui/Icons'

function BatteryHero({ slides: batteryHeroSlides, onNavigate }) {
  const count = batteryHeroSlides.length || 1
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % count), 6000)
    return () => clearInterval(t)
  }, [count])

  const slide = batteryHeroSlides[idx]
  if (!slide) return null

  return (
    <section className="battery-hero">
      <div className="container battery-hero__inner">
        <div className="battery-hero__card">
          <div className="battery-hero__copy">
            <h1 className="battery-hero__title">{slide.title}</h1>
            <p className="battery-hero__desc">{slide.description}</p>
            <AppLink
              href={slide.href}
              onNavigate={onNavigate}
              external={slide.external}
              target={slide.external ? '_blank' : undefined}
              rel={slide.external ? 'noreferrer' : undefined}
              className="btn btn--primary btn--md"
            >
              {slide.cta}
            </AppLink>
          </div>
          <div className="battery-hero__media">
            <img src={slide.image} alt={slide.title} loading="eager" />
          </div>
        </div>
        <div className="battery-hero__dots" role="tablist" aria-label="Slides">
          {batteryHeroSlides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={i === idx ? 'is-active' : ''}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function BatteriesPage({ onNavigate }) {
  const { data: batteryHeroSlides } = useCollection('batterySlides')
  const { data: batteryTabs } = useCollection('batteryTabs')
  const { data: batteryApplicationAreas } = useCollection('batteryAreas')
  const { data: batteryInstruments } = useCollection('batteryInstruments')
  const [activeTab, setActiveTab] = useState(0)
  const tab = batteryTabs[activeTab] ?? batteryTabs[0]

  return (
    <>
      <BatteryHero slides={batteryHeroSlides} onNavigate={onNavigate} />

      {/* Product tabs */}
      <section className="section">
        <div className="container">
          <div className="battery-tablist" role="tablist" aria-label="Battery brands">
            {batteryTabs.map((item, i) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={i === activeTab}
                className={`battery-tab ${i === activeTab ? 'is-active' : ''}`.trim()}
                onClick={() => setActiveTab(i)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className={`battery-products ${(tab?.products?.length || 0) <= 3 ? 'battery-products--few' : 'battery-products--many'}`.trim()}>
            {(tab?.products || []).map(item => (
              <AppLink
                href={item.href}
                onNavigate={onNavigate}
                external={item.external}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className="pcard"
                key={item.title}
              >
                <MediaFrame src={item.image} alt={item.title} aspect="square" className="pcard__media" />
                <div className="pcard__body">
                  <h3 className="pcard__title">{item.title}</h3>
                  {item.description && <p className="pcard__desc">{item.description}</p>}
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions CTA */}
      <section className="section section--alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <SectionHeading
            align="center"
            eyebrow="Empowering Advanced Electrochemical Research"
            title="Battery Testing Solutions"
            summary="Battery research demands robust and precise electrochemical workstations for evaluating battery materials, cycling performance, and degradation mechanisms. ClassOne Systems offers a curated selection of instruments from Corrtest, TOBE, and other reputed brands — tailored for academic, industrial, and R&D applications."
          />
          <AppLink href="/about" onNavigate={onNavigate} className="btn btn--primary btn--md" style={{ marginTop: '1.5rem' }}>
            Know More
          </AppLink>
        </div>
      </section>

      {/* Application areas */}
      <section className="section">
        <div className="container">
          <SectionHeading align="center" title="Application Areas" />
          <div className="area-grid">
            {batteryApplicationAreas.map(item => (
              <article className="area-card" key={item.title}>
                <div className="area-card__icon"><Zap /></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Instruments */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Reliable, Scalable, and Ready for R&D Excellence"
            title="Advanced Battery Testing Instruments"
          />
          <div className="product-grid product-grid--2">
            {batteryInstruments.map(item => (
              <AppLink
                href={item.href}
                onNavigate={onNavigate}
                external={item.external}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className="pcard"
                key={item.title}
              >
                <MediaFrame src={item.image} alt={item.title} aspect="wide" className="pcard__media" />
                <div className="pcard__body">
                  <h3 className="pcard__title">{item.title}</h3>
                  {item.description && <p className="pcard__desc">{item.description}</p>}
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="section cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <p className="sh__eyebrow">Subscribe</p>
            <h2 className="cta-banner__title">Join the ClassOne Systems Community</h2>
          </div>
          <AppLink href="/contact" onNavigate={onNavigate} className="btn btn--primary btn--lg">
            Contact Us
          </AppLink>
        </div>
      </section>
    </>
  )
}
