import { useCollection, useContent } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { MediaFrame } from '../components/ui/MediaFrame'
import { PageBanner } from '../components/common/PageBanner'

export function ResourcesPage({ onNavigate }) {
  const { data: resourceCards } = useCollection('resources')
  const c = useContent().resources || {}
  return (
    <>
      <PageBanner eyebrow={c.eyebrow} title={c.title} summary={c.summary} />

      <section className="section">
        <div className="container resources-intro">
          <div>
            <p className="sh__kicker"><span className="sh__eyebrow">{c.introEyebrow}</span></p>
            <h2 className="sh__title">{c.introTitle}</h2>
          </div>
          <p className="resources-intro__text">{c.introBody}</p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="resource-grid">
            {resourceCards.map((item, i) => (
              <article className="resource-card" key={item.title} data-reveal style={{ '--reveal-delay': `${(i % 4) * 55}ms` }}>
                <MediaFrame src={item.image} alt={item.title} aspect="wide" className="resource-card__media" />
                <div className="resource-card__body">
                  <h3 className="resource-card__title">{item.title}</h3>
                  <p className="resource-card__desc">{item.description}</p>
                  <AppLink href={item.href} onNavigate={onNavigate} className="resource-card__link">
                    View Profile →
                  </AppLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
