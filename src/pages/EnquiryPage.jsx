import { useSettings } from '../lib/store'
import { MediaFrame } from '../components/ui/MediaFrame'

export function EnquiryPage() {
  const page = useSettings().routePages?.enquiry || {}

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1 className="page-banner__title">{page.title}</h1>
          <p className="page-banner__summary">{page.summary}</p>
        </div>
      </section>

      <section className="section">
        <div className="container enquiry-layout">
          <div className="enquiry-layout__media">
            <MediaFrame src={page.mediaSrc} alt={page.mediaAlt} aspect="wide" />
          </div>
          <div className="enquiry-layout__copy">
            <p>{page.intro}</p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h2 className="enquiry-form-title">{page.formTitle}</h2>

          <form className="enquiry-form" onSubmit={e => e.preventDefault()}>
            <div className="enquiry-form__fields">
              {page.textFields.map(field => (
                <label className="enquiry-form__field" key={field.label}>
                  <span className="enquiry-form__label">{field.label}</span>
                  {field.textarea ? (
                    <textarea className="enquiry-form__control" rows={4} />
                  ) : (
                    <input className="enquiry-form__control" type={field.type || 'text'} />
                  )}
                </label>
              ))}
            </div>

            {page.sections && page.sections.map(sec => (
              <div className="enquiry-section" key={sec.title}>
                <h3 className="enquiry-section__title">{sec.title}</h3>
                {sec.groups.map(group => (
                  <div className="enquiry-group" key={group.title}>
                    <h4 className="enquiry-group__title">{group.title}</h4>
                    <div className="enquiry-group__items">
                      {group.items.map(item => (
                        <label className="enquiry-checkbox" key={item}>
                          <input type="checkbox" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button type="submit" className="btn btn--primary btn--md enquiry-form__submit">
              {page.submitLabel || 'SUBMIT'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
