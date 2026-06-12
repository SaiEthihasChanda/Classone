import { useState } from 'react'
import { useCollection } from '../lib/store'

export function ApplicationsPage() {
  const { data: applicationCards } = useCollection('applications')
  const [active, setActive] = useState(0)
  const tab = applicationCards[active] ?? applicationCards[0]

  if (!tab) return <section className="page-banner"><div className="container"><h1 className="page-banner__title">Applications</h1></div></section>

  const paras = tab.panelParagraphs || []
  const desc = paras[0]
  const recLabel = paras[1]
  const recItems = paras.slice(2)

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="page-banner__eyebrow">What We Enable</p>
          <h1 className="page-banner__title">Applications</h1>
          <p className="page-banner__summary">Real-world electrochemical workflows our instruments power — from corrosion and battery testing to biosensing and education.</p>
        </div>
      </section>

      <section className="section applications-page">
        <div className="container applications-page__inner">
          <div className="applications-tablist" role="tablist" aria-label="Application tabs">
            {applicationCards.map((item, i) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`applications-tab ${i === active ? 'is-active' : ''}`.trim()}
                onClick={() => setActive(i)}
              >
                {item.title}
              </button>
            ))}
          </div>

          <article className="applications-panel">
            <h2 className="applications-panel__title">{tab.panelTitle}</h2>
            <p className="applications-panel__lead">{desc}</p>
            {recLabel && <p className="applications-panel__label">{recLabel}</p>}
            {recItems.length > 0 && (
              <ul className="applications-panel__list">
                {recItems.map(item => <li key={item}>{item}</li>)}
              </ul>
            )}
            {tab.panelFooter && <p className="applications-panel__label">{tab.panelFooter}</p>}
            {tab.youtubeId && (
              <div className="applications-panel__video">
                <iframe
                  src={`https://www.youtube.com/embed/${tab.youtubeId}`}
                  title={`${tab.panelTitle} video`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  )
}
