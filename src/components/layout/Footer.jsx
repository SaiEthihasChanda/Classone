import { useSettings } from '../../lib/store'
import { AppLink } from '../common/AppLink'
import { Mail, MapPin, Facebook, Twitter, Youtube, Whatsapp, ArrowRight } from '../ui/Icons'

const quickLinks = [
  { label: 'Home',         href: '/' },
  { label: 'About Us',     href: '/about' },
  { label: 'Software',     href: '/software' },
  { label: 'Resources',    href: '/resources' },
  { label: 'Applications', href: '/applications' },
  { label: 'Contact Us',   href: '/contact' },
  { label: 'News',         href: '/news' },
]

const footerProducts = [
  { label: 'Nexus',            href: '/product/nexus' },
  { label: 'PalmSens4',        href: '/product/palmsens4' },
  { label: 'EmStat4S',         href: '/product/emstat4s' },
  { label: 'Sensit Wearable',  href: '/product/sensit-wearable' },
  { label: 'EmStat Go',        href: '/product/emstat-go' },
]

export function Footer({ onNavigate }) {
  const settings = useSettings()
  const contact = settings.contact || {}
  const imageAssets = settings.assets || {}
  return (
    <footer className="site-footer">
      {/* ── Pre-footer CTA strip ── */}
      <div className="prefooter">
        <div className="container prefooter__inner">
          <a className="prefooter-card" href={contact.whatsappHref} target="_blank" rel="noreferrer noopener">
            <span className="prefooter-card__icon prefooter-card__icon--green"><Whatsapp /></span>
            <div>
              <strong>Chat via WhatsApp</strong>
              <span>Chat directly, or leave a message</span>
            </div>
            <ArrowRight className="prefooter-card__arrow" />
          </a>
          <a className="prefooter-card" href={`mailto:${contact.email}`}>
            <span className="prefooter-card__icon prefooter-card__icon--blue"><Mail /></span>
            <div>
              <strong>Email Us</strong>
              <span>Usually respond within a business day</span>
            </div>
            <ArrowRight className="prefooter-card__arrow" />
          </a>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand column */}
          <div className="footer-col footer-col--brand">
            <img src={imageAssets.logo} alt="Class One Systems" className="footer-logo" loading="lazy" />
            <p className="footer-tagline">
              Advanced electrochemical instruments and solutions for biosensor and battery research.
            </p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/Class-One-Systems-ST-Pvt-Ltd-104121998557239" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social"><Facebook /></a>
              <a href="https://twitter.com/class_pvt" target="_blank" rel="noreferrer" aria-label="Twitter" className="footer-social"><Twitter /></a>
              <a href="https://www.youtube.com/channel/UCz4hk9KnO4n1yNkIKoKHIqA" target="_blank" rel="noreferrer" aria-label="YouTube" className="footer-social"><Youtube /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4 className="footer-col__heading">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map(item => (
                <li key={item.label}>
                  <AppLink href={item.href} onNavigate={onNavigate} className="footer-link">{item.label}</AppLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="footer-col">
            <h4 className="footer-col__heading">Products</h4>
            <ul className="footer-links">
              {footerProducts.map(item => (
                <li key={item.label}>
                  <AppLink href={item.href} onNavigate={onNavigate} className="footer-link">{item.label}</AppLink>
                </li>
              ))}
            </ul>
            <AppLink href="/product" onNavigate={onNavigate} className="footer-all-link">
              View all products →
            </AppLink>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col__heading">Contact</h4>
            <div className="footer-contact">
              <a href={`mailto:${contact.email}`} className="footer-contact__item">
                <Mail className="footer-contact__icon" />
                <span>{contact.email}</span>
              </a>
              <div className="footer-contact__item">
                <MapPin className="footer-contact__icon" />
                <span>{contact.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p>© {new Date().getFullYear()} Class One Systems S&T Pvt. Ltd. All rights reserved.</p>
          <AppLink href="/enquiry" onNavigate={onNavigate} className="footer-bottom__link">Terms &amp; Conditions</AppLink>
        </div>
      </div>
    </footer>
  )
}
