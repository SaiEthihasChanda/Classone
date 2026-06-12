import { useState, useEffect } from 'react'
import { useSettings } from '../lib/store'
import { AutoGallery } from '../components/common/ImageGallery'
import { Download } from '../components/ui/Icons'

function AppForm({ form }) {
  if (!form) return null
  return (
    <form className="app-form" onSubmit={e => e.preventDefault()}>
      {(form.selects || []).map(field => (
        <label className="app-form__field" key={field.label}>
          <span className="app-form__label">{field.label}</span>
          <select className="app-form__control" defaultValue="">
            <option value="" disabled>Choose an option</option>
          </select>
        </label>
      ))}
      {(form.inputs || []).map(field => (
        <label className="app-form__field" key={field.label}>
          <span className="app-form__label">{field.label}</span>
          <input className="app-form__control" type="text" />
        </label>
      ))}
      {(form.contact || []).map(field => (
        <label className="app-form__field" key={field.label}>
          <span className="app-form__label">{field.label}{field.required ? ' *' : ''}</span>
          <input className="app-form__control" type={field.type || 'text'} required={field.required} />
        </label>
      ))}
      {form.message && (
        <label className="app-form__field">
          <span className="app-form__label">{form.message.label}{form.message.required ? ' *' : ''}</span>
          <textarea className="app-form__control" rows={5} required={form.message.required} />
        </label>
      )}
      <button type="submit" className="app-form__submit">{form.submit || 'SEND REQUEST'}</button>
    </form>
  )
}

function SpecAccordion({ groups }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="spec-accordion">
      {groups.map((group, i) => {
        const isOpen = open === i
        return (
          <div key={group.title} className={`spec-accordion__item ${isOpen ? 'is-open' : ''}`.trim()}>
            <button
              type="button"
              className="spec-accordion__head"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{group.title}</span>
              <span className="spec-accordion__sign">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <ul className="spec-accordion__body">
                {group.rows.map(row => <li key={row}>{row}</li>)}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

function BodyBlock({ block }) {
  if (block.type === 'contents') return (
    <section className="app-block" id={block.id}>
      <h2 className="app-section-title">{block.title}</h2>
      {block.intro && <p className="app-block__lead">{block.intro}</p>}
      {block.items && <ul className="app-list">{block.items.map(i => <li key={i}>{i}</li>)}</ul>}
      {block.subIntro && <p className="app-block__lead">{block.subIntro}</p>}
      {block.subItems && <ul className="app-list app-list--sub">{block.subItems.map(i => <li key={i}>{i}</li>)}</ul>}
      {block.footer && <p className="app-block__footer">{block.footer}</p>}
    </section>
  )

  if (block.type === 'columns') return (
    <section className="app-block" id={block.id}>
      <h2 className="app-section-title">{block.title}</h2>
      <div className="tech-grid">
        {block.groups.map(g => (
          <div className="tech-group" key={g.title}>
            <h3 className="tech-group__title">{g.title}</h3>
            <ul className="app-list">{g.items.map(i => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
      {block.callouts && (
        <div className="tech-callouts">
          {block.callouts.map(c => (
            <div className="app-callout" key={c.title}>
              <h4>{c.title}</h4>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )

  if (block.type === 'specs') return (
    <section className="app-block" id={block.id}>
      <h2 className="app-section-title">{block.title}</h2>
      <SpecAccordion groups={block.groups} />
    </section>
  )

  if (block.type === 'photoCell') return (
    <section className="app-block app-block--media" id={block.id}>
      <div className="app-block__media-text">
        <h2 className="app-section-title">{block.title}</h2>
        {block.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="app-block__media-img">
        <img src={block.image} alt={block.imageAlt || block.title} loading="lazy" />
      </div>
    </section>
  )

  if (block.type === 'text') return (
    <section className="app-block" id={block.id}>
      <h2 className="app-section-title">{block.title}</h2>
      {block.paragraphs.map((p, i) => <p key={i} className="app-block__para">{p}</p>)}
    </section>
  )

  if (block.type === 'downloads') return (
    <section className="app-block" id={block.id}>
      <h2 className="app-section-title">{block.title}</h2>
      <div className="download-list">
        {block.items.map(item => (
          <a className="download-card" href={item.href} target="_blank" rel="noreferrer" key={item.href}>
            <Download className="download-card__icon" />
            <span className="download-card__body">
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )

  return null
}

export function ApplicationDetailPage({ pageKey }) {
  const routePages = useSettings().routePages || {}
  const page = routePages?.[pageKey]

  if (!page) {
    return (
      <section className="section">
        <div className="container"><h1>Page not found</h1></div>
      </section>
    )
  }

  const description = page.description || {}

  const handleTabClick = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className="app-hero">
        <div className="container app-hero__inner">
          <div className="app-hero__left">
            {page.gallery && <AutoGallery images={page.gallery} />}

            <div className="app-desc">
              <h2 className="app-section-title">Description</h2>
              {(description.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
              {(description.sections || []).map(sec => (
                <div className="app-desc__section" key={sec.title}>
                  <h3>{sec.title}</h3>
                  {sec.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              ))}
              {description.callout && (
                <div className="app-callout app-callout--inline">
                  <h4>{description.callout.title}</h4>
                  <p>{description.callout.text}</p>
                </div>
              )}
              {description.list && (
                <div className="app-desc__list">
                  <h3 className="app-desc__list-title">{description.list.title}</h3>
                  <ul className="app-list">
                    {description.list.items.map(i => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="app-hero__right">
            <h1 className="app-hero__title">{page.title}</h1>
            <p className="app-hero__subtitle">{page.summary}</p>
            {page.bullets && (
              <ul className="app-hero__bullets">
                {page.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            )}
            <div className="app-form-box">
              <AppForm form={page.form} />
            </div>
          </div>
        </div>
      </section>

      {page.tabs && (
        <div className="app-tabbar">
          <div className="container app-tabbar__inner">
            {page.tabs.map(tab => (
              <a
                className="app-tabbar__link"
                href={`#${tab.id}`}
                key={tab.id}
                onClick={e => handleTabClick(e, tab.id)}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {page.body && (
        <section className="section app-body">
          <div className="container">
            {page.body.map(block => <BodyBlock key={block.id} block={block} />)}
          </div>
        </section>
      )}
    </>
  )
}
