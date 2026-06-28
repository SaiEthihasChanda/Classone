import { Waveform } from '../ui/Waveform'

/**
 * PageBanner — the standard page header. One component so every page header is
 * consistent; copy comes from the content layer (props), not hardcoded.
 */
export function PageBanner({ eyebrow, title, summary, children }) {
  return (
    <section className="page-banner">
      <div className="page-banner__wave" aria-hidden="true">
        <Waveform variant="trace" animated />
      </div>
      <div className="container">
        {eyebrow && <p className="page-banner__eyebrow">{eyebrow}</p>}
        <h1 className="page-banner__title">{title}</h1>
        {summary && <p className="page-banner__summary">{summary}</p>}
        {children}
      </div>
    </section>
  )
}
