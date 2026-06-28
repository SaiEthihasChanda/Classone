import { useState } from 'react'
import { useCollection, useContent } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { MediaFrame } from '../components/ui/MediaFrame'
import { SectionHeading } from '../components/common/SectionHeading'
import { HeroCarousel } from '../components/ui/HeroCarousel'
import { Zap } from '../components/ui/Icons'

export function BatteriesPage({ onNavigate }) {
  const { data: batteryHeroSlides } = useCollection('batterySlides')
  const { data: batteryTabs } = useCollection('batteryTabs')
  const { data: batteryApplicationAreas } = useCollection('batteryAreas')
  const { data: batteryInstruments } = useCollection('batteryInstruments')
  const c = useContent().batteries || {}
  const [activeTab, setActiveTab] = useState(0)
  const tab = batteryTabs[activeTab] ?? batteryTabs[0]

  return (
    <>
      <HeroCarousel slides={batteryHeroSlides} onNavigate={onNavigate} ariaLabel="Battery solutions" />

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
          <SectionHeading align="center" eyebrow={c.solutionsEyebrow} title={c.solutionsTitle} summary={c.solutionsSummary} />
          <AppLink href={c.solutionsCta?.href || '/about'} onNavigate={onNavigate} className="btn btn--primary btn--md" style={{ marginTop: '1.5rem' }}>
            {c.solutionsCta?.label || 'Know More'}
          </AppLink>
        </div>
      </section>

      {/* Application areas */}
      <section className="section">
        <div className="container">
          <SectionHeading align="center" title={c.areasTitle} />
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
          <SectionHeading align="center" eyebrow={c.instrumentsEyebrow} title={c.instrumentsTitle} />
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
            <p className="cta-banner__eyebrow">{c.cta?.eyebrow}</p>
            <h2 className="cta-banner__title">{c.cta?.title}</h2>
          </div>
          <AppLink href={c.cta?.button?.href || '/contact'} onNavigate={onNavigate} className="btn btn--primary btn--lg">
            {c.cta?.button?.label || 'Contact Us'}
          </AppLink>
        </div>
      </section>
    </>
  )
}
