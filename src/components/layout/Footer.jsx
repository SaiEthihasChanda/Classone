import { useSettings } from '../../lib/store'
import { AppLink } from '../common/AppLink'
import { Mail, Gmail, MapPin, Facebook, Twitter, Youtube, Whatsapp, ArrowRight } from '../ui/Icons'

const SOCIAL_ICON = { facebook: Facebook, twitter: Twitter, youtube: Youtube }

export function Footer({ onNavigate }) {
  const settings = useSettings()
  const contact = settings.contact || {}
  const imageAssets = settings.assets || {}
  const footer = settings.footer || {}
  const quickLinks = footer.quickLinks || []
  const footerProducts = footer.products || []
  const socials = footer.socials || []
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
            <span className="prefooter-card__icon prefooter-card__icon--gmail"><Gmail /></span>
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
            <p className="footer-tagline">{footer.tagline}</p>
            <div className="footer-socials">
              {socials.map(s => {
                const Icon = SOCIAL_ICON[s.kind] || Mail
                return (
                  <a key={s.kind} href={s.href} target="_blank" rel="noreferrer" aria-label={s.kind} className="footer-social"><Icon /></a>
                )
              })}
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
          <p>© {new Date().getFullYear()} {footer.copyright}</p>
          <AppLink href="/enquiry" onNavigate={onNavigate} className="footer-bottom__link">Terms &amp; Conditions</AppLink>
        </div>
      </div>
    </footer>
  )
}
