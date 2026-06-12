import { useCollection } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { MediaFrame } from '../components/ui/MediaFrame'

export function SoftwarePage({ onNavigate }) {
  const { data: softwareCards } = useCollection('software')
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="page-banner__eyebrow">Software</p>
          <h1 className="page-banner__title">Software Overview</h1>
          <p className="page-banner__summary">Control your potentiostat with your PC, phone, or tablet — one ecosystem across every instrument.</p>
        </div>
      </section>

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
