import { useSite, useCollection, useContent } from '../lib/store'
import { SectionHeading } from '../components/common/SectionHeading'
import { PageBanner } from '../components/common/PageBanner'
import { Mail, Phone, Whatsapp } from '../components/ui/Icons'

const methodIcon = { whatsapp: <Whatsapp />, email: <Mail />, phone: <Phone /> }
const methodTone = { whatsapp: 'green', email: 'blue', phone: 'teal' }

export function ContactPage() {
  const contactMethods = useSite().contactMethods || []
  const { data: contactOffices } = useCollection('offices')
  const c = useContent().contact || {}
  return (
    <>
      <PageBanner eyebrow={c.eyebrow} title={c.title} summary={c.summary} />

      {/* Quick contact — driven by the contactMethods entity */}
      <section className="section">
        <div className="container contact-quick">
          {contactMethods.map(m => (
            <a className="contact-quick-card" key={m.id || m.kind} href={m.href}
              target={m.kind === 'whatsapp' ? '_blank' : undefined}
              rel={m.kind === 'whatsapp' ? 'noreferrer noopener' : undefined}>
              <span className={`contact-quick-card__icon contact-quick-card__icon--${methodTone[m.kind] || 'blue'}`}>
                {methodIcon[m.kind] || <Mail />}
              </span>
              <div>
                <strong>{m.label}</strong>
                <span>{m.value}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Offices */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow={c.officesEyebrow} title={c.officesTitle} />
          <div className="office-grid">
            {contactOffices.map((office, i) => (
              <article className="office-card" key={office.title} data-reveal style={{ '--reveal-delay': `${(i % 3) * 60}ms` }}>
                {office.mapSrc && (
                  <div className="office-card__map">
                    <iframe
                      title={office.mapTitle}
                      src={office.mapSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                )}
                <div className="office-card__body">
                  <h3 className="office-card__title">{office.title}</h3>
                  <div className="office-card__lines">
                    {office.lines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
