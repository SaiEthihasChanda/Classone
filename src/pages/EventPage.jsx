import { useCollection } from '../lib/store'
import { SectionHeading } from '../components/common/SectionHeading'

export function EventPage() {
  const { data: events } = useCollection('events')
  const page = events[0] || {}

  return (
    <>
      {/* Hero */}
      <section className="page-banner">
        <div className="container">
          <p className="page-banner__eyebrow">Highlights</p>
          <h1 className="page-banner__title">{page.title || 'Events'}</h1>
          {page.subtitle && <p className="page-banner__summary">{page.subtitle}</p>}
        </div>
      </section>

      {/* Sections */}
      {page.sections && page.sections.map((sec, i) => (
        <section className="section" key={i}>
          <div className="container">
            <h2 className="event-section-title">{sec.title}</h2>
            {sec.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
          </div>
        </section>
      ))}

      {/* Gallery */}
      {page.gallery && page.gallery.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <SectionHeading title="Gallery" align="center" />
            <div className="event-gallery">
              {page.gallery.map(item => (
                <div className="event-gallery__item" key={item.src}>
                  <img src={item.src} alt={item.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Flyers */}
      {page.flyers && page.flyers.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading title={page.flyersTitle || 'Flyers & Announcements'} align="center" />
            <div className="event-gallery event-gallery--flyers">
              {page.flyers.map(item => (
                <div className="event-gallery__item" key={item.src}>
                  <img src={item.src} alt={item.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
