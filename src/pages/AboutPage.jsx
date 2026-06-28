import { useSettings, useContent, useSite } from '../lib/store'
import { MediaFrame } from '../components/ui/MediaFrame'
import { SectionHeading } from '../components/common/SectionHeading'
import { PageBanner } from '../components/common/PageBanner'

export function AboutPage() {
  const settings = useSettings()
  const site = useSite()
  const c = useContent().about || {}
  const imageAssets = settings.assets || {}
  const about = settings.about || {}
  const { mission: missionText, vision: visionText, expertise: expertisePoints = [], message: aboutMessage } = about
  const aboutTeam = site.team || []
  return (
    <>
      <PageBanner eyebrow={c.eyebrow} title={c.title} summary={c.summary} />

      {/* Director message */}
      <section className="section">
        <div className="container about-director">
          <div className="about-director__media">
            <MediaFrame src={imageAssets.aboutDirector} alt="Managing Director" aspect="portrait" />
          </div>
          <div className="about-director__copy">
            <p className="sh__kicker"><span className="sh__eyebrow">{c.directorEyebrow}</span></p>
            <h2 className="sh__title">{c.directorTitle}</h2>
            <p>{aboutMessage}</p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section section--alt">
        <div className="container about-mv">
          <article className="about-mv__card">
            <SectionHeading eyebrow={c.missionEyebrow} title={c.missionTitle} summary={missionText} />
            <p>{c.missionBody}</p>
            <figure className="about-figure">
              <img src={imageAssets.aboutMission} alt={c.missionCaption} loading="lazy" />
              <figcaption>{c.missionCaption}</figcaption>
            </figure>
          </article>

          <article className="about-mv__card">
            <figure className="about-figure about-figure--top">
              <img src={imageAssets.aboutVision} alt={c.visionCaption} loading="lazy" />
              <figcaption>{c.visionCaption}</figcaption>
            </figure>
            <SectionHeading eyebrow={c.visionEyebrow} title={c.visionTitle} summary={visionText} />
            <p>{c.visionBody}</p>
          </article>
        </div>
      </section>

      {/* Expertise */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={c.expertiseEyebrow} title={c.expertiseTitle} summary={c.expertiseSummary} />
          <div className="expertise-grid">
            {expertisePoints.map((item, i) => (
              <article className="expertise-card" key={item.title} data-reveal style={{ '--reveal-delay': `${(i % 3) * 60}ms` }}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow={c.teamEyebrow} title={c.teamTitle} summary={c.teamSummary} />
          <figure className="team-group-photo">
            <img src={imageAssets.teamGroup} alt="Class One Systems team" loading="lazy" />
          </figure>
          <div className="team-grid">
            {aboutTeam.map((item, i) => (
              <article className="team-card" key={item.name} data-reveal style={{ '--reveal-delay': `${(i % 4) * 50}ms` }}>
                <div className="team-card__media">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <strong className="team-card__name">{item.name}</strong>
                <span className="team-card__role">{item.role}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
