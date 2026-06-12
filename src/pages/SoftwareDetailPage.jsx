import { useEntity } from '../lib/store'
import { MediaFrame } from '../components/ui/MediaFrame'
import { Download } from '../components/ui/Icons'

export function SoftwareDetailPage({ slug }) {
  const { data: software, status } = useEntity('software', slug)
  const data = software?.detail

  if (status === 'loading') {
    return <section className="section"><div className="container"><div className="skeleton-card" style={{ minHeight: 320 }} /></div></section>
  }

  if (!data) {
    return (
      <section className="section">
        <div className="container">
          <h1>Software not found</h1>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="sw-hero">
        <div className="container sw-hero__inner">
          <div className="sw-hero__copy">
            <p className="sh__eyebrow">{data.eyebrow}</p>
            <h1 className="sw-hero__title">{data.title}</h1>
            <p className="sw-hero__desc">{data.description}</p>
            <a href="#" className="btn btn--primary btn--md" onClick={e => e.preventDefault()}>
              <Download /> {data.button || 'Download'}
            </a>
          </div>
          {data.heroImage && (
            <div className="sw-hero__media">
              <img src={data.heroImage} alt={data.title} loading="eager" />
            </div>
          )}
        </div>
      </section>

      {/* Feature cards */}
      {data.cards && (
        <section className="section section--alt">
          <div className="container">
            <div className="sw-cards">
              {data.cards.map(card => (
                <article className="sw-card" key={card.title}>
                  <h3 className="sw-card__title">{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features block (PStouch) */}
      {data.features && (
        <section className="section">
          <div className="container sw-features">
            <div className="sw-features__copy">
              <p className="sh__eyebrow">{data.features.eyebrow}</p>
              <h2 className="sh__title">{data.features.title}</h2>
              <ul className="sw-feature-list">
                {data.features.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {data.features.note && <p className="sw-features__note">{data.features.note}</p>}
            </div>
            {data.features.image && (
              <div className="sw-features__media">
                <img src={data.features.image} alt={data.features.title} loading="lazy" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Techniques block (PStouch) */}
      {data.techniques && (
        <section className="section section--alt">
          <div className="container">
            <p className="sh__eyebrow">{data.techniques.eyebrow}</p>
            <h2 className="sh__title">{data.techniques.title}</h2>
            <div className="sw-techniques">
              {data.techniques.groups.map(group => (
                <div className="sw-technique-group" key={group.heading}>
                  <h3 className="sw-technique-group__heading">{group.heading}</h3>
                  <ul>
                    {group.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detailed sections */}
      {data.sections && data.sections.map((section, i) => (
        <section className={`section ${i % 2 === 0 ? '' : 'section--alt'}`.trim()} key={section.title}>
          <div className="container sw-section">
            <div className="sw-section__copy">
              <h2 className="sw-section__title">{section.title}</h2>
              {section.paragraphs.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
            {section.image && (
              <div className="sw-section__media">
                <img src={section.image} alt={section.title} loading="lazy" />
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  )
}
