import { useCollection } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { MediaFrame } from '../components/ui/MediaFrame'

export function ResourcesPage({ onNavigate }) {
  const { data: resourceCards } = useCollection('resources')
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="page-banner__eyebrow">Knowledge Base</p>
          <h1 className="page-banner__title">Resources</h1>
          <p className="page-banner__summary">Application notes, user guides and tutorials crafted to help researchers get the most from their instruments.</p>
        </div>
      </section>

      <section className="section">
        <div className="container resources-intro">
          <div>
            <p className="sh__eyebrow">Get Started</p>
            <h2 className="sh__title">Learning and Training</h2>
          </div>
          <p className="resources-intro__text">
            Access a comprehensive suite of resources — including application notes, user guides, and tutorials —
            crafted to support researchers, engineers, and innovators in maximizing the performance and value of
            their scientific instruments.
          </p>
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
