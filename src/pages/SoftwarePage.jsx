import { useCollection, useContent } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { MediaFrame } from '../components/ui/MediaFrame'
import { PageBanner } from '../components/common/PageBanner'

export function SoftwarePage({ onNavigate }) {
  const { data: softwareCards } = useCollection('software')
  const c = useContent().software || {}
  return (
    <>
      <PageBanner eyebrow={c.eyebrow} title={c.title} summary={c.summary} />

      <section className="section">
        <div className="container">
          <div className="software-grid">
            {softwareCards.map((item, i) => (
              <AppLink
                href={item.href}
                onNavigate={onNavigate}
                external={item.external}
                className="software-card"
                key={item.title}
                data-reveal style={{ '--reveal-delay': `${(i % 3) * 60}ms` }}
              >
                <MediaFrame src={item.image} alt={item.title} aspect="wide" className="software-card__media" />
                <div className="software-card__body">
                  <h3 className="software-card__title">{item.title}</h3>
                  <p className="software-card__desc">{item.description}</p>
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
