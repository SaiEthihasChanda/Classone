import { useSettings } from '../lib/store'
import { MediaFrame } from '../components/ui/MediaFrame'
import { SectionHeading } from '../components/common/SectionHeading'

export function AboutPage() {
  const settings = useSettings()
  const imageAssets = settings.assets || {}
  const about = settings.about || {}
  const { mission: missionText, vision: visionText, expertise: expertisePoints = [], team: aboutTeam = [], message: aboutMessage } = about
  return (
    <>
      {/* Hero */}
      <section className="page-banner">
        <div className="container">
          <p className="page-banner__eyebrow">Who We Are</p>
          <h1 className="page-banner__title">About Us</h1>
          <p className="page-banner__summary">A Delhi-based leader in nanotechnology, semiconductor and electrochemical analysis systems — serving India's premier research institutions since 2012.</p>
        </div>
      </section>

      {/* Director message */}
      <section className="section">
        <div className="container about-director">
          <div className="about-director__media">
            <MediaFrame src={imageAssets.aboutDirector} alt="Managing Director" aspect="portrait" />
          </div>
          <div className="about-director__copy">
            <p className="sh__eyebrow">Message from the Director</p>
            <h2 className="sh__title">Class One Systems S&T Pvt. Ltd.</h2>
            <p>{aboutMessage}</p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section section--alt">
        <div className="container about-mv">
          <article className="about-mv__card">
            <SectionHeading eyebrow="Our Mission" title="Mission" summary={missionText} />
            <p>
              At <strong>Class One Systems</strong>, our mission is to empower the scientific and research community
              with advanced, reliable, and accessible electrochemical and nanotechnology solutions. We strive to bridge
              the gap between scientific theory and real-world application by providing tools, insights, and hands-on
              collaboration that accelerate discovery and innovation.
            </p>
            <figure className="about-figure">
              <img src={imageAssets.aboutMission} alt="Exhibition stall inaugurated by Director General CSIR" loading="lazy" />
              <figcaption>Exhibition Stall inaugurated by Director General CSIR, Dr. N Kalaisalvi</figcaption>
            </figure>
          </article>

          <article className="about-mv__card">
            <figure className="about-figure about-figure--top">
              <img src={imageAssets.aboutVision} alt="Rasayana Ratna award" loading="lazy" />
              <figcaption>First Rasayana Ratna Award given to Director General CSIR, Dr. N Kalaisalvi</figcaption>
            </figure>
            <SectionHeading eyebrow="Our Vision" title="Vision" summary={visionText} />
            <p>
              We envision a future where scientific research is accelerated by access to cutting-edge tools, open
              knowledge systems, and collaborative ecosystems that transcend lab walls. By fostering innovation both
              inside and outside the lab, we aim to shape a dynamic and inclusive scientific future that enables
              groundbreaking discoveries, sustainable technologies, and human advancement.
            </p>
          </article>
        </div>
      </section>

      {/* Expertise */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Areas of Expertise"
            title="Our Core Expertise"
            summary="At Class One Systems, we specialize in cutting-edge technologies and solutions that serve academic, research, and industrial institutions across India."
          />
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
          <SectionHeading
            eyebrow="Our Team"
            title="Meet the Team"
            summary="A dynamic team of dedicated professionals and researchers empowering innovation in electrochemical and nanotechnology solutions."
          />
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
