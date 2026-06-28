import { useState } from 'react'
import { useSettings } from '../lib/store'
import { MediaFrame } from '../components/ui/MediaFrame'
import { PageBanner } from '../components/common/PageBanner'
import { api } from '../lib/api'

export function EnquiryPage() {
  const settings = useSettings()
  const page = settings.routePages?.enquiry || {}

  const [fields, setFields]   = useState({})
  const [checks, setChecks]   = useState({})
  const [status, setStatus]   = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const setField    = (label, value) => setFields(f => ({ ...f, [label]: value }))
  const toggleCheck = (item)         => setChecks(c => ({ ...c, [item]: !c[item] }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const selectedItems = Object.entries(checks)
      .filter(([, v]) => v)
      .map(([k]) => k)

    try {
      // Save to Firestore — the Cloud Function picks this up and sends the email
      await api.submitEnquiry({
        ...fields,
        selections: selectedItems,
      })
      setStatus('success')
      setFields({})
      setChecks({})
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Submission failed. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <>
        <PageBanner eyebrow="Enquiry" title={page.title} summary={page.summary} />
        <section className="section">
          <div className="container enquiry-success">
            <div className="enquiry-success__icon" aria-hidden="true">✓</div>
            <h2 className="enquiry-success__title">Thank you for your enquiry!</h2>
            <p className="enquiry-success__body">
              We've received your message and will get back to you shortly.
            </p>
            <button className="btn btn--ghost btn--md" onClick={() => setStatus('idle')}>
              Submit another enquiry
            </button>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageBanner eyebrow="Enquiry" title={page.title} summary={page.summary} />

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

          <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
            <div className="enquiry-form__fields">
              {(page.textFields || []).map(field => (
                <label className="enquiry-form__field" key={field.label}>
                  <span className="enquiry-form__label">{field.label}</span>
                  {field.textarea ? (
                    <textarea
                      className="enquiry-form__control"
                      rows={4}
                      value={fields[field.label] || ''}
                      onChange={ev => setField(field.label, ev.target.value)}
                    />
                  ) : (
                    <input
                      className="enquiry-form__control"
                      type={field.type || 'text'}
                      value={fields[field.label] || ''}
                      onChange={ev => setField(field.label, ev.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>

            {(page.sections || []).map(sec => (
              <div className="enquiry-section" key={sec.title}>
                <h3 className="enquiry-section__title">{sec.title}</h3>
                {(sec.groups || []).map(group => (
                  <div className="enquiry-group" key={group.title}>
                    <h4 className="enquiry-group__title">{group.title}</h4>
                    <div className="enquiry-group__items">
                      {group.items.map(item => (
                        <label className="enquiry-checkbox" key={item}>
                          <input
                            type="checkbox"
                            checked={!!checks[item]}
                            onChange={() => toggleCheck(item)}
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {status === 'error' && (
              <p className="enquiry-form__error">{errorMsg || 'Something went wrong. Please try again.'}</p>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--md enquiry-form__submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending…' : (page.submitLabel || 'SUBMIT')}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
