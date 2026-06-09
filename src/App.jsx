import { useEffect, useRef, useState } from 'react'
import productDetails from './productDetails.json'
import {
  aboutMessage,
  aboutTeam,
  applicationCards,
  batteryApplicationAreas,
  batteryInstruments,
  batteryHero,
  batteryHeroSlides,
  batteryTabs,
  biosensorAreas,
  biosensorProducts,
  businessSegments,
  certificateSlides,
  clientBadges,
  contact,
  contactOffices,
  expertisePoints,
  imageAssets,
  homeSlides,
  mainNavLinks,
  missionText,
  newestInnovations,
  productCatalog,
  productCategories,
  resourceCards,
  routePages,
  searchIndex,
  softwareCards,
  softwareDetailCatalog,
  softwareDetails,
  testimonials,
  topStripLinks,
  visionText,
} from './data'

const imagesEnabled = true

const categoryProductByHref = Object.values(productCategories || {}).reduce((acc, category) => {
  for (const product of category.products || []) {
    if (product.href && product.href.startsWith('/product/')) {
      acc[product.href] = product
    }
  }
  return acc
}, {})

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const cleaned = pathname.replace(/\/+$|\/+$/g, '').replace(/\/+$/, '')
  return cleaned || '/'
}

function capitalizeSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function findByAlias(items, path) {
  return items.find((item) => item.aliases.includes(path)) || null
}

function createAvatar(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

function isExternalHref(href) {
  return href.startsWith('http:') || href.startsWith('https:') || href.startsWith('mailto:') || href.startsWith('tel:')
}

function AppLink({ href, onNavigate, className = '', children, onClick, external = false, ...rest }) {
  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented) {
      return
    }

    if (external || isExternalHref(href)) {
      return
    }

    event.preventDefault()
    onNavigate(href)
  }

  return (
    <a href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

function BrandMark() {
  return (
    <img className="brand-mark" src={imageAssets.logo} alt="Class One Systems" />
  )
}

const ICONS = {
  sensing: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h4l2 6 4-14 2 8h6" />
    </svg>
  ),
  energy: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  ),
  caret: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.21.85 5.75 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.05 8.05 0 0 1-1.24-4.3c0-4.47 3.64-8.11 8.11-8.11Zm-2.6 4.36c-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.19s.94 2.54 1.07 2.72c.13.18 1.85 2.83 4.49 3.96.63.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.55-.63 1.77-1.25.22-.61.22-1.14.15-1.25-.07-.11-.24-.18-.5-.31-.26-.13-1.55-.77-1.79-.85-.24-.09-.41-.13-.59.13-.18.26-.68.85-.83 1.03-.15.18-.31.2-.57.07-.26-.13-1.1-.41-2.1-1.3-.78-.69-1.3-1.55-1.45-1.81-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.18-.26.26-.44.09-.18.04-.33-.02-.46-.07-.13-.57-1.42-.81-1.94-.2-.46-.4-.4-.55-.4l-.48-.02Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.3c0-.84.26-1.42 1.47-1.42h1.43V5.3A21 21 0 0 0 14.6 5.2c-2.07 0-3.49 1.26-3.49 3.58v2.32H8.7V14h2.41v7h2.39Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M22 5.8c-.7.32-1.46.53-2.25.63a3.95 3.95 0 0 0 1.72-2.17c-.76.45-1.6.78-2.5.95a3.93 3.93 0 0 0-6.7 3.59A11.15 11.15 0 0 1 4.1 4.6a3.93 3.93 0 0 0 1.22 5.25c-.63-.02-1.23-.2-1.75-.48v.05a3.94 3.94 0 0 0 3.16 3.86c-.58.16-1.2.18-1.78.07a3.94 3.94 0 0 0 3.68 2.73A7.9 7.9 0 0 1 2 17.7a11.13 11.13 0 0 0 6.03 1.77c7.24 0 11.2-6 11.2-11.2v-.51A8 8 0 0 0 22 5.8Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2Zm3 6h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Z" />
    </svg>
  ),
}

function PlaceholderPanel({ label, detail, tone = 'teal', compact = false, className = '', src, alt = '' }) {
  const showImage = imagesEnabled && Boolean(src)

  return (
    <div className={`placeholder-panel placeholder-panel--${tone} ${compact ? 'placeholder-panel--compact' : ''} ${showImage ? 'placeholder-panel--image' : ''} ${className}`.trim()}>
      {showImage ? (
        <img className="placeholder-panel__image" src={src} alt={alt || label || ''} loading="lazy" />
      ) : (
        <>
          <div className="placeholder-panel__glow" />
          <div className="placeholder-panel__grid" />
          <div className="placeholder-panel__label">{label}</div>
          <div className="placeholder-panel__detail">{detail}</div>
        </>
      )}
    </div>
  )
}

function SectionHeading({ eyebrow, title, summary, align = 'left', className = '' }) {
  return (
    <div className={`section-heading section-heading--${align} ${className}`.trim()}>
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <h2 className="section-heading__title">{title}</h2>
      {summary ? <p className="section-heading__summary">{summary}</p> : null}
    </div>
  )
}

function AboutHeroSection() {
  return (
    <section className="about-hero" style={{ '--about-hero-image': `url(${imageAssets.aboutHero})` }}>
      <div className="container about-hero__inner">
        <div className="about-hero__copy">
          <p className="about-hero__eyebrow">ABOUT</p>
          <h1 className="about-hero__title">ABOUT</h1>
          <p className="about-hero__summary">
            <strong>Class One Systems S&amp;T Pvt. Ltd.</strong> {aboutMessage}
          </p>
        </div>
      </div>
    </section>
  )
}

function AboutDirectorSection() {
  return (
    <section className="section about-director">
      <div className="container about-director__inner">
        <article className="about-director__copy">
          <p className="about-director__eyebrow">DIRECTOR'S MESSAGE</p>
          <p>
            Primary among these areas are information and knowledge management, systems management, distributed and high performance computing, software engineering, analytics and optimization and the emerging area of service science.
          </p>
          <p>
            The lab boasts a rich talent pool in these areas and an enviable culture of innovation. Our ideas typically germinate from the cross-pollination of multiple scientific disciplines and our insight into real-world needs.
          </p>
        </article>

        <figure className="about-director__media">
          <img src={imageAssets.aboutDirector} alt="Director's message portrait" loading="lazy" />
        </figure>
      </div>
    </section>
  )
}

function Rail({ className = '', children, ariaLabel }) {
  const railRef = useRef(null)

  const moveRail = (direction) => {
    const rail = railRef.current
    if (!rail) {
      return
    }

    const distance = Math.max(rail.clientWidth * 0.8, 320)
    rail.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }

  return (
    <div className={`rail-shell ${className}`.trim()}>
      <button type="button" className="rail-shell__button rail-shell__button--left" onClick={() => moveRail(-1)} aria-label={`Scroll ${ariaLabel || 'content'} left`}>
        &lsaquo;
      </button>
      <div className="rail" ref={railRef} aria-label={ariaLabel}>
        {children}
      </div>
      <button type="button" className="rail-shell__button rail-shell__button--right" onClick={() => moveRail(1)} aria-label={`Scroll ${ariaLabel || 'content'} right`}>
        &rsaquo;
      </button>
    </div>
  )
}

function Header({ pathname, onNavigate, onSearchOpen, mobileMenuOpen, setMobileMenuOpen, desktopMenuOpen, setDesktopMenuOpen, productGroupOpen, setProductGroupOpen }) {
  const activePath = normalizePath(pathname)
  const closeDesktopMenuTimer = useRef(null)

  const closeDesktopMenu = () => {
    if (closeDesktopMenuTimer.current) {
      window.clearTimeout(closeDesktopMenuTimer.current)
      closeDesktopMenuTimer.current = null
    }

    setDesktopMenuOpen(null)
    setProductGroupOpen('Sensing')
  }

  const openDesktopMenu = (label) => {
    if (closeDesktopMenuTimer.current) {
      window.clearTimeout(closeDesktopMenuTimer.current)
      closeDesktopMenuTimer.current = null
    }

    setDesktopMenuOpen(label)
  }

  const scheduleDesktopMenuClose = () => {
    if (closeDesktopMenuTimer.current) {
      window.clearTimeout(closeDesktopMenuTimer.current)
    }

    closeDesktopMenuTimer.current = window.setTimeout(() => {
      closeDesktopMenuTimer.current = null
      setDesktopMenuOpen(null)
      setProductGroupOpen('Sensing')
    }, 700)
  }

  useEffect(() => () => {
    if (closeDesktopMenuTimer.current) {
      window.clearTimeout(closeDesktopMenuTimer.current)
    }
  }, [])

  const renderDesktopTrigger = (item) => {
    const hasMenu = Boolean(item.menu)
    const active = normalizePath(item.href || '') === activePath || activePath.startsWith(normalizePath(item.href || '').replace(/\/$/, '') + '/')
    const commonProps = {
      className: `nav__link ${active ? 'nav__link--active' : ''}`.trim(),
      onMouseEnter: hasMenu ? () => openDesktopMenu(item.label) : undefined,
      onFocus: hasMenu ? () => openDesktopMenu(item.label) : undefined,
      onClick: () => setMobileMenuOpen(false),
    }

    if (hasMenu && item.href === '#') {
      return (
        <button
          type="button"
          {...commonProps}
          className={`${commonProps.className} nav__link--button`.trim()}
          onClick={(event) => {
            event.preventDefault()
            openDesktopMenu(item.label)
          }}
        >
          {item.label}
          <span className="nav__caret">{ICONS.caret}</span>
        </button>
      )
    }

    return (
      <AppLink href={item.href} onNavigate={onNavigate} {...commonProps}>
        {item.label}
        {hasMenu ? <span className="nav__caret">&#8964;</span> : null}
      </AppLink>
    )
  }

  const renderDesktopMenu = (item) => {
    if (!item.menu) return null

    if (item.label === 'Products') {
      const groups = item.menu.groups || []
      const activeGroup = groups.find((group) => group.label === productGroupOpen) || groups[0]

      return (
        <div className="nav__dropdown-panel nav__dropdown-panel--products" onMouseEnter={() => openDesktopMenu(item.label)} onMouseLeave={scheduleDesktopMenuClose}>
          <div className="nav__products-groups">
            {groups.map((group) => {
              if (group.items) {
                const isActive = group.label === activeGroup?.label
                return (
                  <button
                    key={group.label}
                    type="button"
                    className={`nav__products-group ${isActive ? 'is-active' : ''}`}
                    aria-pressed={isActive}
                    onMouseEnter={() => {
                      openDesktopMenu(item.label)
                      setProductGroupOpen(group.label)
                    }}
                    onFocus={() => {
                      openDesktopMenu(item.label)
                      setProductGroupOpen(group.label)
                    }}
                    onClick={() => {
                      openDesktopMenu(item.label)
                      setProductGroupOpen(group.label)
                    }}
                  >
                    <span>{group.label}</span>
                    <span className="nav__products-group-caret">&rsaquo;</span>
                  </button>
                )
              }

              return (
                <AppLink key={group.label} href={group.href} onNavigate={onNavigate} className="nav__products-group nav__products-group--link" onMouseEnter={() => openDesktopMenu(item.label)}>
                  {group.label}
                </AppLink>
              )
            })}
          </div>

          <div className="nav__products-flyout">
            {(activeGroup?.items || []).map((subItem) => (
              <AppLink key={subItem.label} href={subItem.href} onNavigate={onNavigate} className="nav__submenu-link nav__submenu-link--flyout" onClick={closeDesktopMenu}>
                {subItem.label}
              </AppLink>
            ))}
          </div>
        </div>
      )
    }

    if (item.label === 'Software') {
      return (
        <div className="nav__dropdown-panel nav__dropdown-panel--mega" onMouseEnter={() => openDesktopMenu(item.label)} onMouseLeave={scheduleDesktopMenuClose}>
          <div className="nav__mega-grid">
            {item.menu.items.map((subItem) => (
              <AppLink key={subItem.label} href={subItem.href} onNavigate={onNavigate} external={subItem.external} className="nav__mega-item" onClick={closeDesktopMenu}>
                <span className="nav__mega-image">
                  <img src={subItem.image} alt={subItem.label} loading="lazy" />
                </span>
                <span className="nav__mega-text">
                  <span className="nav__mega-title">{subItem.label}</span>
                  {subItem.description ? <span className="nav__mega-desc">{subItem.description}</span> : null}
                </span>
              </AppLink>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="nav__dropdown-panel nav__dropdown-panel--simple" onMouseEnter={() => openDesktopMenu(item.label)} onMouseLeave={scheduleDesktopMenuClose}>
        <div className="nav__simple-list">
          {item.menu.items.map((subItem) => (
            <AppLink key={subItem.label} href={subItem.href} onNavigate={onNavigate} className="nav__submenu-link nav__submenu-link--simple" onClick={closeDesktopMenu}>
              {subItem.label}
            </AppLink>
          ))}
        </div>
      </div>
    )
  }

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="container top-strip__inner">
          <div className="top-strip__links">
            {topStripLinks.map((link) => (
              <AppLink key={link.label} href={link.href} onNavigate={onNavigate} className="top-strip__link">
                <span className="top-strip__icon">{link.label === 'ENERGY' ? ICONS.energy : ICONS.sensing}</span>
                {link.label}
              </AppLink>
            ))}
          </div>
          <AppLink href="/news" onNavigate={onNavigate} className="top-strip__news">
            News
          </AppLink>
        </div>
      </div>

      <div className="header-bar">
        <div className="container header-bar__inner">
          <AppLink href="/" onNavigate={onNavigate} className="header-bar__brand-link" aria-label="Go to home">
            <BrandMark />
          </AppLink>

          <nav className={`nav ${mobileMenuOpen ? 'nav--open' : ''}`} aria-label="Main navigation" onMouseLeave={scheduleDesktopMenuClose} onMouseEnter={() => {
            if (closeDesktopMenuTimer.current) {
              window.clearTimeout(closeDesktopMenuTimer.current)
              closeDesktopMenuTimer.current = null
            }
          }}>
            {mainNavLinks.map((item) => {
              const hasMenu = Boolean(item.menu)
              const isOpen = desktopMenuOpen === item.label

              return (
                <div key={item.label} className={`nav__item ${hasMenu ? 'nav__item--dropdown' : ''} ${isOpen ? 'is-open' : ''}`.trim()} onMouseEnter={hasMenu ? () => openDesktopMenu(item.label) : undefined}>
                  {renderDesktopTrigger(item)}
                  {hasMenu && isOpen ? renderDesktopMenu(item) : null}
                </div>
              )
            })}
          </nav>

          <div className="header-bar__actions">
            <button type="button" className="icon-button" onClick={onSearchOpen} aria-label="Search site">
              {ICONS.search}
            </button>
            <button type="button" className="icon-button icon-button--menu" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle menu">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu--open' : ''}`}>
          <div className="container mobile-menu__inner">
            {mainNavLinks.map((item) => {
              if (!item.menu) {
                return (
                  <AppLink
                    key={`mobile-${item.label}`}
                    href={item.href}
                    onNavigate={onNavigate}
                    className="mobile-menu__link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </AppLink>
                )
              }

              if (item.label === 'Products') {
                return (
                  <details key={`mobile-${item.label}`} className="mobile-menu__dropdown">
                    <summary>{item.label}</summary>
                    <div className="mobile-menu__submenu mobile-menu__submenu--stacked">
                      {item.menu.groups.map((group) => (
                        <div key={group.label} className="mobile-menu__group">
                          <div className="mobile-menu__group-label">{group.label}</div>
                          {'items' in group
                            ? group.items.map((subItem) => (
                                <AppLink
                                  key={subItem.label}
                                  href={subItem.href}
                                  onNavigate={onNavigate}
                                  className="mobile-menu__link mobile-menu__link--sub"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subItem.label}
                                </AppLink>
                              ))
                            : null}
                          {'href' in group ? (
                            <AppLink
                              href={group.href}
                              onNavigate={onNavigate}
                              className="mobile-menu__link mobile-menu__link--sub"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {group.label}
                            </AppLink>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </details>
                )
              }

              return (
                <details key={`mobile-${item.label}`} className="mobile-menu__dropdown">
                  <summary>{item.label}</summary>
                  <div className="mobile-menu__submenu">
                    {item.menu.items.map((subItem) => (
                      <AppLink
                        key={subItem.label}
                        href={subItem.href}
                        onNavigate={onNavigate}
                        external={subItem.external}
                        className="mobile-menu__link mobile-menu__link--sub"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </AppLink>
                    ))}
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}

function PromoModal({ open, onClose, onNavigate }) {
  if (!open) {
    return null
  }

  return (
    <div className="modal modal--promo" role="dialog" aria-modal="true" aria-label="Promotional poster">
      <button type="button" className="modal__backdrop" onClick={onClose} aria-label="Close poster backdrop" />
      <div className="promo-poster">
        <div className="promo-poster__top">
          <div className="promo-poster__brand">PalmSens</div>
          <div className="promo-poster__brand promo-poster__brand--right">class one systems</div>
        </div>
        <p className="promo-poster__eyebrow">MAKE YOUR OWN</p>
        <p className="promo-poster__eyebrow promo-poster__eyebrow--accent">TOUCH SCREEN</p>
        <p className="promo-poster__eyebrow">DEVICE</p>
        <div className="promo-poster__ribbon">
          TAILORED ELECTROCHEMISTRY THROUGH TOUCH-CONTROLLED APPS BAR/QR-CODE SCANNER
        </div>
        <div className="promo-poster__device">
          <PlaceholderPanel src={imageAssets.hero} alt="PalmSens promotional device" tone="deep" compact />
        </div>
        <div className="promo-poster__cta-row">
          <AppLink href="/product/emstat4t-3" onNavigate={onNavigate} className="button button--primary">
            View Details
          </AppLink>
          <button type="button" className="button button--ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close poster">
          &times;
        </button>
      </div>
    </div>
  )
}

function SearchModal({ open, onClose, onNavigate }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  const filtered = searchIndex.filter((item) => {
    const needle = query.trim().toLowerCase()
    if (!needle) {
      return true
    }

    return [item.title, item.description, item.group, item.href].join(' ').toLowerCase().includes(needle)
  })

  const showResults = query.trim().length > 0

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" className="search-overlay__backdrop" onClick={onClose} aria-label="Close search overlay" tabIndex={-1} />
      <button type="button" className="search-overlay__close" onClick={onClose} aria-label="Close search">
        &times;
      </button>
      <div className="search-overlay__panel">
        <form className="search-overlay__form" role="search" onSubmit={(event) => event.preventDefault()}>
          <input
            className="search-overlay__input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            aria-label="Search"
            autoFocus
          />
          <button type="submit" className="search-overlay__button" aria-label="Search">
            {ICONS.search}
          </button>
        </form>

        {showResults ? (
          <div className="search-overlay__results">
            {filtered.length ? (
              filtered.map((item) => (
                <button
                  key={`${item.group}-${item.title}`}
                  type="button"
                  className="search-result"
                  onClick={() => {
                    onNavigate(item.href)
                    onClose()
                  }}
                >
                  <span className="search-result__group">{item.group}</span>
                  <span className="search-result__title">{item.title}</span>
                  <span className="search-result__description">{item.description}</span>
                </button>
              ))
            ) : (
              <p className="search-overlay__empty">No results found.</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function HomeHero({ onNavigate }) {
  const slides = homeSlides
  const slideCount = slides.length
  const extendedSlides = [slides[slideCount - 1], ...slides, slides[0]]
  const cycleLength = extendedSlides.length
  const step = 100 / extendedSlides.length
  const [position, setPosition] = useState(1)
  const [transitioning, setTransitioning] = useState(true)
  const trackRef = useRef(null)

  const renderedPosition = ((position % cycleLength) + cycleLength) % cycleLength
  const activeSlide = slides[((renderedPosition - 1) % slideCount + slideCount) % slideCount]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPosition((current) => current + 1)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const handleTransitionEnd = () => {
    if (renderedPosition === 0) {
      setTransitioning(false)
      setPosition(slideCount)
      window.requestAnimationFrame(() => setTransitioning(true))
      return
    }

    if (renderedPosition === slideCount + 1) {
      setTransitioning(false)
      setPosition(1)
      window.requestAnimationFrame(() => setTransitioning(true))
    }
  }

  const moveTo = (nextPosition) => {
    setTransitioning(true)
    setPosition(nextPosition)
  }

  return (
    <section className="hero-section">
      <div className="container hero-section__inner">
        <div
          className={`hero-card ${activeSlide.banner ? 'hero-card--banner' : ''}`.trim()}
          style={{
            '--hero-accent': activeSlide.accent,
            '--hero-start': activeSlide.gradient[0],
            '--hero-end': activeSlide.gradient[1],
            ...(activeSlide.banner
              ? { backgroundImage: `linear-gradient(90deg, rgba(8,18,30,0.94) 0%, rgba(8,18,30,0.6) 34%, rgba(8,18,30,0) 58%), url(${activeSlide.image})` }
              : {}),
          }}
        >
          {activeSlide.banner ? <div className="hero-card__badge hero-card__badge--hidden">class one systems</div> : <div className="hero-card__badge">class one systems</div>}

          <div className="hero-mobile-static">
            <h1 className="hero-card__title">{slides[0].title}</h1>
            <p className="hero-card__description">{slides[0].description}</p>
            <AppLink href={slides[0].href} onNavigate={onNavigate} className="button button--primary">
              {slides[0].cta}
            </AppLink>
          </div>

          <div className="hero-carousel">
            <div
              className="hero-carousel__track"
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
              style={{
                width: `${extendedSlides.length * 100}%`,
                transform: `translateX(-${renderedPosition * step}%)`,
                transition: transitioning ? 'transform 600ms cubic-bezier(.2,.9,.2,1)' : 'none',
              }}
            >
              {extendedSlides.map((slide, slideIndex) => (
                <article className="hero-carousel__slide" key={`${slide.title}-${slideIndex}`} style={{ flex: `0 0 ${100 / extendedSlides.length}%`, width: `${100 / extendedSlides.length}%` }}>
                  <div
                    className={`slide__content ${slide.banner ? 'slide__content--banner' : ''}`.trim()}
                    style={slide.banner ? { backgroundImage: `url(${slide.image})` } : undefined}
                  >
                    <div className="slide__copy">
                      <p className="hero-card__eyebrow">{slide.eyebrow}</p>
                      <h1 className="hero-card__title">{slide.title}</h1>
                      <p className="hero-card__description">{slide.description}</p>
                      <div className="hero-card__actions">
                        <AppLink href={slide.href} onNavigate={onNavigate} className="button button--primary">
                          {slide.cta}
                        </AppLink>
                      </div>
                    </div>
                    {slide.banner ? null : (
                      <div className="slide__media">
                        <img
                          className="slide__img"
                          src={slide.image}
                          alt={slide.title}
                          loading="eager"
                          decoding="async"
                          style={{ objectPosition: slide.objectPosition || 'center center', transform: `scale(${slide.scale || 1})` }}
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-card__controls">
            <button type="button" onClick={() => moveTo(position - 1)} aria-label="Previous hero slide">&lsaquo;</button>
            <div className="hero-card__dots" aria-label="Hero slide indicators">
              {slides.map((slide, slideIndex) => (
                <button
                  key={`${slide.title}-${slideIndex}`}
                  type="button"
                  className={((position - 1 + slideCount) % slideCount) === slideIndex ? 'is-active' : ''}
                  onClick={() => moveTo(slideIndex + 1)}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                />
              ))}
            </div>
            <button type="button" onClick={() => moveTo(position + 1)} aria-label="Next hero slide">&rsaquo;</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stars({ count = 5 }) {
  return (
    <div className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`stars__star ${i < count ? 'is-filled' : ''}`.trim()} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  )
}

function TestimonialsSlider() {
  const perView = 3
  const pages = Math.ceil(testimonials.length / perView)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setPage((p) => (p + 1) % pages), 6000)
    return () => window.clearInterval(timer)
  }, [pages])

  const go = (dir) => setPage((p) => (p + dir + pages) % pages)

  return (
    <div className="testimonials-slider">
      <button type="button" className="testimonials-slider__nav testimonials-slider__nav--prev" onClick={() => go(-1)} aria-label="Previous testimonials">
        &lsaquo;
      </button>
      <div className="testimonials-slider__viewport">
        <div className="testimonials-slider__track" style={{ transform: `translateX(-${page * 100}%)` }}>
          {Array.from({ length: pages }).map((_, pageIndex) => (
            <div className="testimonials-slider__page" key={pageIndex}>
              {testimonials.slice(pageIndex * perView, pageIndex * perView + perView).map((item) => (
                <article className="testimonial-card" key={item.name}>
                  <div className="testimonial-card__avatar">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <strong className="testimonial-card__name">{item.name}</strong>
                  <span className="testimonial-card__role">{item.role}</span>
                  <Stars count={item.rating || 5} />
                  <p className="testimonial-card__quote-text">{item.quote}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="testimonials-slider__nav testimonials-slider__nav--next" onClick={() => go(1)} aria-label="Next testimonials">
        &rsaquo;
      </button>
      <div className="testimonials-slider__dots">
        {Array.from({ length: pages }).map((_, i) => (
          <button key={i} type="button" className={i === page ? 'is-active' : ''} onClick={() => setPage(i)} aria-label={`Page ${i + 1}`} />
        ))}
      </div>
    </div>
  )
}

function HomePage({ onNavigate }) {
  return (
    <>
      <HomeHero onNavigate={onNavigate} />

      <section className="section section--intro">
        <div className="container section--intro__inner section--intro__inner--reverse">
          <PlaceholderPanel src={imageAssets.hero} alt="Biosensor innovation equipment" tone="light" className="section--intro__art" />
          <div className="section--intro__copy">
            <h5 className="section-heading__eyebrow">Compact. Sensitive. Real-Time.</h5>
            <h2 className="section-heading__title">Biosensor Innovation</h2>
            <p className="section-heading__summary">
              Biosensors require highly sensitive and compact potentiostats for real-time electrochemical detection in medical,
              environmental, and wearable applications. We offer a full range of instruments from PalmSens tailored for biosensor
              development and integration.
            </p>
            <AppLink href="/about" onNavigate={onNavigate} className="button button--primary">
              Know More
            </AppLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Biosensor Deployment Zones" title="Application Areas" />
          <div className="card-grid card-grid--six">
            {biosensorAreas.map((item) => (
              <article className="info-card" key={item.title}>
                <div className="info-card__icon">
                  {item.icon ? <img src={item.icon} alt={`${item.title} icon`} /> : '?'}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading title="Proven Solutions for Biosensor Research by PalmSens" />
          <div className="card-grid card-grid--products">
            {biosensorProducts.map((item) => (
              <AppLink href={item.href} onNavigate={onNavigate} className="product-card" key={item.title}>
                <PlaceholderPanel src={item.image} alt={item.title} tone="teal" compact className="product-card__media" />
                <h3>{item.title}</h3>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Business Segments" summary="Serving standard or customised equipment, devices, components, accessories & consumables to different segments." />
          <div className="segment-grid">
            {businessSegments.map((item, index) => (
              <article className="segment-card" key={`${item.title}-${index}`}>
                <div className="segment-card__media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading title="Explore Our Newest Innovations" />
          <div className="card-grid card-grid--four">
            {newestInnovations.map((item) => (
              <AppLink href={item.href} onNavigate={onNavigate} className="product-card product-card--compact" key={item.title}>
                <PlaceholderPanel src={item.image} alt={item.title} tone="deep" compact className="product-card__media" />
                <h3>{item.title}</h3>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Testimonials" align="center" />
          <TestimonialsSlider />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading title="Licenses and Certificates" align="center" />
          <div className="certificate-grid">
            {certificateSlides.map((item) => (
              <article className="certificate-card" key={item.key}>
                <img src={item.image} alt={item.key} loading="lazy" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--clients">
        <div className="container">
          <SectionHeading eyebrow="Trusted Across Research Sectors" title="Our Esteemed Clients" align="center" />
          <Rail ariaLabel="Clients" className="rail-shell--clients">
            {clientBadges.map((item, index) => (
              <div className="client-badge" key={`${item}-${index}`}>
                <img src={item} alt="Client logo" loading="lazy" />
              </div>
            ))}
          </Rail>
        </div>
      </section>

      <section className="section section--alt community-callout">
        <div className="container community-callout__inner">
          <div>
            <p className="section-heading__eyebrow">Subscribe</p>
            <h2 className="section-heading__title">Join the ClassOnesystems Community</h2>
          </div>
          <AppLink href="/contact" onNavigate={onNavigate} className="button button--primary">
            Contact us
          </AppLink>
        </div>
      </section>

      <section className="section contact-headquarters">
        <div className="container contact-headquarters__inner">
          <div className="contact-headquarters__copy">
            <h2 className="contact-headquarters__eyebrow contact-headquarters__eyebrow--heading">Visit or Contact Our Corporate Headquarters</h2>
            <p className="contact-headquarters__line">Find us easily using the interactive map below.</p>
            <p className="contact-headquarters__line">Our head office is here to support your research and instrumentation needs.</p>
          </div>

          <div className="contact-map" aria-label="Corporate headquarters map">
            <div className="contact-map__info">
              <strong>Saket District Centre</strong>
              <span>Saket District Centre, District Centre</span>
              <span>No reviews</span>
            </div>
            <iframe
              title="Class One Systems headquarters map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.172%2C28.500%2C77.240%2C28.562&layer=mapnik&marker=28.5245%2C77.2061"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  )
}

function DetailBanner({ eyebrow, title, summary, accent = '#269fb7', mediaSrc, mediaAlt, heroImage }) {
  if (heroImage) {
    return (
      <section className="detail-banner detail-banner--image" style={{ '--banner-image': `url(${heroImage})` }}>
        <div className="container detail-banner__inner detail-banner__inner--image">
          <div>
            {eyebrow ? <p className="detail-banner__eyebrow">{eyebrow}</p> : null}
            <h1 className="detail-banner__title">{title}</h1>
            {summary ? <p className="detail-banner__summary">{summary}</p> : null}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="detail-banner" style={{ '--banner-accent': accent }}>
      <div className={`container detail-banner__inner ${mediaSrc ? '' : 'detail-banner__inner--text-only'}`.trim()}>
        <div>
          {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
          <h1 className="detail-banner__title">{title}</h1>
          {summary ? <p className="detail-banner__summary">{summary}</p> : null}
        </div>
        {mediaSrc ? <PlaceholderPanel src={mediaSrc} alt={mediaAlt || title} tone="deep" className="detail-banner__media" /> : null}
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <section className="section">
        <AboutDirectorSection />
      </section>

      <section className="section section--alt">
        <div className="container content-grid content-grid--two about-mission-vision">
          <article className="content-card content-card--about-block">
            <SectionHeading eyebrow="Our Mission" title="Mission" summary={missionText} />
            <p>
              At <strong>Class One Systems</strong>, our mission is to empower the scientific and research community with advanced, reliable, and accessible electrochemical and nanotechnology solutions. We strive to bridge the gap between scientific theory and real-world application by providing tools, insights, and hands-on collaboration that accelerate discovery and innovation.
            </p>
            <figure className="about-figure">
              <img src={imageAssets.aboutMission} alt="Exhibition Stall inaugurated by Director General- CSIR, Dr. N Kalaisalvi" loading="lazy" />
              <figcaption>Exhibition Stall inaugurated by Director General- CSIR, Dr. N Kalaisalvi</figcaption>
            </figure>
          </article>

          <article className="content-card content-card--about-block">
            <figure className="about-figure about-figure--top">
              <img src={imageAssets.aboutVision} alt="First Rasayana Ratna award given to Director General- CSIR, Dr. N Kalaisalvi" loading="lazy" />
              <figcaption>First -Rasayana Ratna- Award given to Director General- CSIR, Dr. N Kalaisalvi</figcaption>
            </figure>
            <SectionHeading eyebrow="Our Vision" title="Vision" summary={visionText} />
            <p>
              We envision a future where scientific research is accelerated by access to cutting-edge tools, open knowledge systems, and collaborative ecosystems that transcend lab walls. By fostering innovation both inside and outside the lab, we aim to shape a dynamic and inclusive scientific future that enables groundbreaking discoveries, sustainable technologies, and human advancement.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Areas of Expertise" title="Areas of Expertise" summary="At Class One Systems, we specialize in cutting-edge technologies and solutions that serve academic, research, and industrial institutions across India." />
          <div className="about-expertise">
            <p className="about-expertise__lead">Our core areas of expertise include:</p>
            <div className="about-expertise__grid">
              {expertisePoints.map((item) => (
                <article className="about-expertise__item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Our Team" title="Our Team" summary="A dynamic team of dedicated professionals and researchers empowering innovation in electrochemical and nanotechnology solutions." />
          <figure className="team-group-photo">
            <img src={imageAssets.teamGroup} alt="Class One Systems team" loading="lazy" />
          </figure>
          <div className="team-grid">
            {aboutTeam.map((item) => (
              <article className="team-card" key={item.name}>
                <PlaceholderPanel src={item.image} alt={item.name} tone="light" compact className="team-card__media" />
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function SoftwarePage({ onNavigate }) {
  return (
    <>
      <section className="section software-overview-hero">
        <div className="container">
          <SectionHeading align="center" title="Software overview" summary="Control your potentiostat with your PC, phone or tablet." />
        </div>
      </section>
      <section className="section software-overview">
        <div className="container">
          <div className="software-grid">
            {softwareCards.map((item) => (
              <AppLink href={item.href} onNavigate={onNavigate} external={item.external} className="software-card" key={item.title}>
                <PlaceholderPanel src={item.image} alt={item.title} tone="light" compact className="software-card__media" />
                <div className="software-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ProductsPage({ onNavigate, title = 'Products', summary = 'Browse our electrochemical instruments, modules, accessories, and research solutions.' }) {
  return (
    <>
      <DetailBanner title={title} summary={summary} />
      <section className="section">
        <div className="container">
          <div className="card-grid card-grid--four">
            {productCatalog.map((item) => (
              <AppLink href={item.aliases[0]} onNavigate={onNavigate} className="product-card" key={item.key}>
                <PlaceholderPanel src={item.image} alt={item.title} tone="light" compact className="product-card__media" />
                <p className="section-heading__eyebrow">{item.category}</p>
                <h3>{item.title}</h3>
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function CategoryProductsPage({ categoryKey, onNavigate }) {
  const category = productCategories?.[categoryKey]
  const title = category?.title || 'Products'
  const products = category?.products || []

  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="category-hero__banner">
            <h1 className="category-hero__title">{title}</h1>
          </div>
        </div>
      </section>

      <section className="section category-products">
        <div className="container">
          {products.length ? (
            <div className="category-grid">
              {products.map((item) => (
                <AppLink href={item.href} onNavigate={onNavigate} external={item.external} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} className="catalog-card" key={item.title}>
                  {item.image ? (
                    <span className="catalog-card__media catalog-card__media--image">
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </span>
                  ) : (
                    <span className="catalog-card__media" aria-hidden="true" />
                  )}
                  <span className="catalog-card__body">
                    <span className="catalog-card__title">{item.title}</span>
                    {item.description ? <span className="catalog-card__desc">{item.description}</span> : null}
                  </span>
                </AppLink>
              ))}
            </div>
          ) : (
            <p className="category-empty">No products were found in this collection.</p>
          )}
        </div>
      </section>
    </>
  )
}

function ResourcesPage({ onNavigate }) {
  return (
    <>
      <section className="resources-hero" style={{ '--resources-hero-image': `url(${imageAssets.resourcesHero})` }} aria-label="Resources" />

      <section className="section resources-intro">
        <div className="container resources-intro__inner">
          <div className="resources-intro__head">
            <p className="section-heading__eyebrow">KNOWLEDGE BASE</p>
            <h2 className="section-heading__title">Learning and training</h2>
          </div>
          <p className="resources-intro__text">
            Access a comprehensive suite of resources—including application notes, user guides, and tutorials—crafted to support researchers, engineers, and innovators in maximizing the performance and value of their scientific instruments.
          </p>
        </div>
      </section>

      <section className="section resources-cards-section">
        <div className="container">
          <div className="card-grid card-grid--four">
            {resourceCards.map((item) => (
              <article className="resource-card" key={item.title}>
                <PlaceholderPanel src={item.image} alt={item.title} tone="light" compact className="resource-card__media" />
                <div className="resource-card__body">
                  <h3>{item.title}</h3>
                  <AppLink href={item.href} onNavigate={onNavigate} className="resource-card__link">
                    <span className="resource-card__link-icon">{ICONS.caret}</span>
                    VIEW PROFILE
                  </AppLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ApplicationsPage({ onNavigate }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const activeTab = applicationCards[activeTabIndex] ?? applicationCards[0]
  const activePanelId = 'applications-panel-active'

  const description = activeTab.panelParagraphs[0]
  const recommendedLabel = activeTab.panelParagraphs[1]
  const recommendedItems = activeTab.panelParagraphs.slice(2)

  return (
    <>
      <section className="applications-hero" style={{ '--applications-hero-image': `url(${imageAssets.applicationsHero})` }} aria-label="Applications" />

      <section className="section applications-page">
        <div className="container applications-page__inner">
          <div className="applications-tablist" role="tablist" aria-label="Application tabs" aria-orientation="vertical">
            {applicationCards.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={index === activeTabIndex}
                aria-controls={activePanelId}
                tabIndex={index === activeTabIndex ? 0 : -1}
                className={`applications-tab ${index === activeTabIndex ? 'is-active' : ''}`.trim()}
                onClick={() => setActiveTabIndex(index)}
              >
                {item.title}
              </button>
            ))}
          </div>

          <article id={activePanelId} role="tabpanel" className="applications-panel">
            <h2 className="applications-panel__title">{activeTab.panelTitle}</h2>
            <p className="applications-panel__lead">{description}</p>
            {recommendedLabel ? <p className="applications-panel__label">{recommendedLabel}</p> : null}
            {recommendedItems.length ? (
              <ul className="applications-panel__list">
                {recommendedItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {activeTab.panelFooter ? <p className="applications-panel__label">{activeTab.panelFooter}</p> : null}
            {activeTab.youtubeId ? (
              <div className="applications-panel__video">
                <iframe
                  src={`https://www.youtube.com/embed/${activeTab.youtubeId}`}
                  title={`${activeTab.panelTitle} video`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
          </article>
        </div>
      </section>
    </>
  )
}

function NewsPage() {
  return (
    <>
      <DetailBanner title="Blog" />
      <section className="section">
        <div className="container content-card content-card--banner">
          <article className="blog-card">
            <p className="blog-card__eyebrow">Hello world!</p>
            <h3>Welcome to WordPress</h3>
            <p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p>
          </article>
        </div>
      </section>
    </>
  )
}

function ContactPage() {
  return (
    <>
      <section className="contact-hero contact-hero--image" style={{ '--contact-hero-image': `url(${imageAssets.contactHero})` }}>
        <div className="container contact-hero__inner">
          <h1 className="contact-hero__title">CONTACT US</h1>
        </div>
      </section>

      <section className="section contact-locations">
        <div className="container">
          <SectionHeading eyebrow="LOCATION" title="FIND THE OFFICE NEAREST YOU" />
          <div className="contact-office-grid contact-office-grid--maps">
            {contactOffices.map((office) => (
              <article className="content-card contact-office-card contact-office-card--map" key={office.title}>
                {office.mapSrc ? (
                  <div className="contact-office-card__map">
                    <iframe
                      title={office.mapTitle}
                      src={office.mapSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                ) : null}
                <h3>{office.title}</h3>
                <div className="contact-office-card__lines">
                  {office.lines.map((line, index) => (
                    <p key={`${office.title}-${index}`}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function BatteryHeroCarousel({ onNavigate }) {
  const [index, setIndex] = useState(0)
  const count = batteryHeroSlides.length

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => window.clearInterval(timer)
  }, [count])

  const go = (dir) => setIndex((i) => (i + dir + count) % count)
  const slide = batteryHeroSlides[index]

  return (
    <section className="hero-section battery-hero">
      <div className="container hero-section__inner">
        <div className="hero-card battery-hero__card" style={{ '--hero-start': '#0f2336', '--hero-end': '#0a1622' }}>
          <div className="battery-hero__content">
            <div className="battery-hero__copy">
              <h1 className="hero-card__title">{slide.title}</h1>
              <p className="hero-card__description">{slide.description}</p>
              <div className="hero-card__actions">
                <AppLink href={slide.href} onNavigate={onNavigate} external={slide.external} target={slide.external ? '_blank' : undefined} rel={slide.external ? 'noreferrer' : undefined} className="button button--primary">
                  {slide.cta}
                </AppLink>
              </div>
            </div>
            <div className="battery-hero__media">
              <img src={slide.image} alt={slide.title} loading="eager" />
            </div>
          </div>
        </div>
        <div className="battery-hero__dots" role="tablist" aria-label="Slides">
          {batteryHeroSlides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={i === index ? 'is-active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function BatteriesPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(0)
  const tab = batteryTabs[activeTab] ?? batteryTabs[0]

  return (
    <>
      <BatteryHeroCarousel onNavigate={onNavigate} />

      <section className="section battery-tabs-section">
        <div className="container">
          <div className="battery-tablist" role="tablist" aria-label="Battery brands">
            {batteryTabs.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={index === activeTab}
                className={`battery-tab ${index === activeTab ? 'is-active' : ''}`.trim()}
                onClick={() => setActiveTab(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            className={`card-grid battery-products ${tab.products.length <= 3 ? 'battery-products--few' : 'battery-products--many'}`.trim()}
          >
            {tab.products.map((item) => (
              <AppLink href={item.href} onNavigate={onNavigate} external={item.external} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} className="product-card" key={item.title}>
                <PlaceholderPanel src={item.image} alt={item.title} tone="light" compact className="product-card__media" />
                <h3>{item.title}</h3>
                {item.description ? <p>{item.description}</p> : null}
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Empowering Advanced Electrochemical Research"
            title="Battery Testing Solutions"
            summary="Battery research demands robust and precise electrochemical workstations for evaluating battery materials, cycling performance, and degradation mechanisms. ClassOne Systems offers a curated selection of instruments from Corrtest, TOBE, and other reputed brands-tailored for academic, industrial, and R&D applications."
          />
          <div className="battery-solutions__cta">
            <AppLink href="/about" onNavigate={onNavigate} className="button button--primary">
              Know More
            </AppLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading align="center" title="Application Areas" />
          <div className="card-grid card-grid--six battery-areas">
            {batteryApplicationAreas.map((item) => (
              <article className="info-card" key={item.title}>
                <div className="info-card__icon">{ICONS.energy}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading align="center" eyebrow="Reliable, Scalable, and Ready for R&D Excellence" title="Advanced Battery Testing Instruments" />
          <div className="card-grid card-grid--two">
            {batteryInstruments.map((item) => (
              <AppLink href={item.href} onNavigate={onNavigate} external={item.external} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} className="product-card" key={item.title}>
                <PlaceholderPanel src={item.image} alt={item.title} tone="light" compact className="product-card__media" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section community-callout">
        <div className="container community-callout__inner">
          <div>
            <p className="section-heading__eyebrow">Subscribe</p>
            <h2 className="section-heading__title">Join the ClassOnesystems Community</h2>
          </div>
          <AppLink href="/contact" onNavigate={onNavigate} className="button button--primary">
            Contact us
          </AppLink>
        </div>
      </section>
    </>
  )
}

function ProductGallery({ images, title }) {
  const [active, setActive] = useState(0)
  const list = images && images.length ? images : []

  if (!list.length) {
    return <PlaceholderPanel src={imageAssets.hero} alt={title} tone="light" className="product-gallery__main" />
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__frame">
        <img src={list[active]} alt={title} loading="eager" />
      </div>
      {list.length > 1 ? (
        <div className="product-gallery__thumbs">
          {list.map((src, index) => (
            <button
              key={src}
              type="button"
              className={`product-gallery__thumb ${index === active ? 'is-active' : ''}`.trim()}
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ProductDetailPage({ slug, onNavigate }) {
  const data = productDetails[slug]
  if (!data) return <GenericRoutePage title={capitalizeSlug(slug.replace('/product/', ''))} summary="Product details from the source site." />

  return (
    <>
      <section className="product-detail">
        <div className="container product-detail__inner">
          <div className="product-detail__media">
            <ProductGallery images={data.images} title={data.title} />
          </div>
          <div className="product-detail__summary">
            <p className="product-detail__eyebrow">PRODUCT</p>
            <h1 className="product-detail__title">{data.title}</h1>
            {data.shortHtml ? (
              <div className="product-detail__short product-prose" dangerouslySetInnerHTML={{ __html: data.shortHtml }} />
            ) : null}
            <div className="product-detail__actions">
              <AppLink href="/enquiry" onNavigate={onNavigate} className="button button--primary">Enquiry Now</AppLink>
              <AppLink href="/product" onNavigate={onNavigate} className="button button--ghost">View All Products</AppLink>
            </div>
          </div>
        </div>
      </section>

      {data.descHtml ? (
        <section className="section product-desc-section">
          <div className="container">
            <h2 className="product-desc-section__title">Description &amp; Specification</h2>
            <div className="product-prose product-prose--desc" dangerouslySetInnerHTML={{ __html: data.descHtml }} />
          </div>
        </section>
      ) : null}

      {data.displayImages && data.displayImages.length > 0 ? (
        <section className="section product-display-section">
          <div className="container">
            <h2 className="product-display-section__title">Product Display</h2>
            <div className="product-display-grid">
              {data.displayImages.map((src, i) => (
                <div key={src} className="product-display-grid__item">
                  <img src={src} alt={`${data.title} display ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

function ProductPage({ data, fallbackTitle, onNavigate }) {
  const title = data?.title || fallbackTitle
  const accent = data?.accent || '#269fb7'
  const summary = data?.summary || 'Product details from the source site.'
  const details = data?.details || 'Product details from the source site.'
  const features = data?.features || ['Product overview', 'Source-site copy', 'Navigation route', 'Product detail']

  return (
    <>
      <DetailBanner eyebrow={data?.category || 'PRODUCT'} title={title} summary={summary} accent={accent} />
      <section className="section">
        <div className="container content-grid content-grid--two">
          <article className="content-card content-card--wide">
            <SectionHeading eyebrow="Overview" title={title} />
            <p>{details}</p>
            <ul className="feature-list feature-list--two-col">
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="button-row">
              <AppLink href="/contact" onNavigate={onNavigate} className="button button--primary">
                Ask About This Product
              </AppLink>
              <AppLink href="/product" onNavigate={onNavigate} className="button button--ghost">
                View All Products
              </AppLink>
            </div>
          </article>
          <PlaceholderPanel src={data?.image || imageAssets.hero} alt={title} tone="deep" className="content-card__media content-card__media--tall" />
        </div>
      </section>
    </>
  )
}

function SoftwareDetailPage({ data, fallbackTitle, onNavigate }) {
  const detail = data?.key ? softwareDetails?.[data.key] : null

  if (!detail) {
    const title = data?.title || fallbackTitle
    const accent = data?.accent || '#269fb7'
    const summary = data?.summary || 'Software route content from the source site.'
    const details = data?.details || 'Software route content from the source site.'
    const features = data?.features || ['Desktop support', 'Mobile workflows', 'Developer tools', 'Source copy']

    return (
      <>
        <DetailBanner eyebrow="SOFTWARE" title={title} summary={summary} accent={accent} />
        <section className="section">
          <div className="container content-grid content-grid--two">
            <article className="content-card content-card--wide">
              <SectionHeading eyebrow="Overview" title={title} />
              <p>{details}</p>
              <ul className="feature-list feature-list--two-col">
                {features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <PlaceholderPanel src={data?.image || imageAssets.softwarePreview} alt={title} tone="light" className="content-card__media content-card__media--tall" />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="software-detail-hero">
        <div className={`container software-detail-hero__inner ${detail.heroImage ? 'software-detail-hero__inner--media' : ''}`.trim()}>
          <div className="software-detail-hero__copy">
            <p className="software-detail-hero__eyebrow">{detail.eyebrow}</p>
            <h1 className="software-detail-hero__title">{detail.title}</h1>
            <p className="software-detail-hero__desc">{detail.description}</p>
            {detail.button ? (
              <button type="button" className="button button--primary software-detail-hero__btn">{detail.button}</button>
            ) : null}
          </div>
          {detail.heroImage ? (
            <div className="software-detail-hero__media">
              <img src={detail.heroImage} alt={detail.title} loading="eager" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="section software-detail-features">
        <div className="container">
          <div className="software-feature-grid">
            {detail.cards.map((card) => (
              <article className="software-feature-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {detail.sections.map((section, index) => (
        <section className={`section software-detail-section ${index % 2 === 1 ? 'section--alt' : ''}`.trim()} key={section.title}>
          <div className={`container ${section.image ? 'software-detail-section__inner' : ''}`.trim()}>
            <div className="software-detail-section__text">
              <SectionHeading title={section.title} />
              {section.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            {section.image ? (
              <PlaceholderPanel src={section.image} alt={section.title} tone="light" className="software-detail-section__media" />
            ) : null}
          </div>
        </section>
      ))}
    </>
  )
}

function GenericRoutePage({ title, summary }) {
  return (
    <>
      <DetailBanner title={title} summary={summary || 'Route content from the source site.'} />
      <section className="section">
        <div className="container content-card content-card--banner">
          <p>Route content from the source site.</p>
        </div>
      </section>
    </>
  )
}

function CategoryPage({ title, summary, onNavigate }) {
  return <ProductsPage title={title} summary={summary} onNavigate={onNavigate} />
}

function AppGallery({ images }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const go = (dir) => setIndex((prev) => (prev + dir + count) % count)

  useEffect(() => {
    if (count < 2) return undefined
    const timer = window.setInterval(() => setIndex((prev) => (prev + 1) % count), 4500)
    return () => window.clearInterval(timer)
  }, [count])

  return (
    <div className="app-gallery">
      {count > 1 ? (
        <button type="button" className="app-gallery__nav app-gallery__nav--prev" onClick={() => go(-1)} aria-label="Previous image">
          &lsaquo;
        </button>
      ) : null}
      <div className="app-gallery__frame">
        <img src={images[index].src} alt={images[index].alt || ''} loading="lazy" />
      </div>
      {count > 1 ? (
        <button type="button" className="app-gallery__nav app-gallery__nav--next" onClick={() => go(1)} aria-label="Next image">
          &rsaquo;
        </button>
      ) : null}
      {count > 1 ? (
        <div className="app-gallery__dots">
          {images.map((img, i) => (
            <button key={img.src} type="button" className={i === index ? 'is-active' : ''} onClick={() => setIndex(i)} aria-label={`Image ${i + 1}`} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function AppForm({ form }) {
  if (!form) return null

  return (
    <form className="app-form" onSubmit={(event) => event.preventDefault()}>
      {(form.selects || []).map((field) => (
        <label className="app-form__field" key={field.label}>
          <span className="app-form__label">{field.label}</span>
          <select className="app-form__control" defaultValue="">
            <option value="" disabled>Choose an option</option>
          </select>
        </label>
      ))}
      {(form.inputs || []).map((field) => (
        <label className="app-form__field" key={field.label}>
          <span className="app-form__label">{field.label}</span>
          <input className="app-form__control" type="text" />
        </label>
      ))}
      {(form.contact || []).map((field) => (
        <label className="app-form__field" key={field.label}>
          <span className="app-form__label">{field.label}{field.required ? ' (required)' : ''}</span>
          <input className="app-form__control" type={field.type || 'text'} />
        </label>
      ))}
      {form.message ? (
        <label className="app-form__field">
          <span className="app-form__label">{form.message.label}{form.message.required ? ' (required)' : ''}</span>
          <textarea className="app-form__control" rows={5} />
        </label>
      ) : null}
      <button type="submit" className="app-form__submit">{form.submit || 'SEND REQUEST'}</button>
    </form>
  )
}

function SpecAccordion({ groups }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="spec-accordion">
      {groups.map((group, index) => {
        const isOpen = openIndex === index
        return (
          <div className={`spec-accordion__item ${isOpen ? 'is-open' : ''}`} key={group.title}>
            <button type="button" className="spec-accordion__head" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen}>
              <span>{group.title}</span>
              <span className="spec-accordion__sign">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? (
              <ul className="spec-accordion__body">
                {group.rows.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function ApplicationBodyBlock({ block }) {
  if (block.type === 'contents') {
    return (
      <section className="app-block" id={block.id}>
        <h2 className="app-section-title">{block.title}</h2>
        {block.intro ? <p className="app-block__lead">{block.intro}</p> : null}
        {block.items ? (
          <ul className="app-list">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {block.subIntro ? <p className="app-block__lead">{block.subIntro}</p> : null}
        {block.subItems ? (
          <ul className="app-list app-list--sub">
            {block.subItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {block.footer ? <p className="app-block__footer">{block.footer}</p> : null}
      </section>
    )
  }

  if (block.type === 'columns') {
    return (
      <section className="app-block" id={block.id}>
        <h2 className="app-section-title">{block.title}</h2>
        <div className="tech-grid">
          {block.groups.map((group) => (
            <div className="tech-group" key={group.title}>
              <h3 className="tech-group__title">{group.title}</h3>
              <ul className="app-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {block.callouts ? (
          <div className="tech-callouts">
            {block.callouts.map((callout) => (
              <div className="app-callout" key={callout.title}>
                <h4>{callout.title}</h4>
                <p>{callout.text}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    )
  }

  if (block.type === 'specs') {
    return (
      <section className="app-block" id={block.id}>
        <h2 className="app-section-title">{block.title}</h2>
        <SpecAccordion groups={block.groups} />
      </section>
    )
  }

  if (block.type === 'photoCell') {
    return (
      <section className="app-block app-block--media" id={block.id}>
        <div className="app-block__media-text">
          <h2 className="app-section-title">{block.title}</h2>
          {block.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <PlaceholderPanel src={block.image} alt={block.imageAlt || block.title} tone="light" className="app-block__media-img" />
      </section>
    )
  }

  if (block.type === 'text') {
    return (
      <section className="app-block" id={block.id}>
        <h2 className="app-section-title">{block.title}</h2>
        {block.paragraphs.map((paragraph, i) => (
          <p key={i} className="app-block__para">{paragraph}</p>
        ))}
      </section>
    )
  }

  if (block.type === 'downloads') {
    return (
      <section className="app-block" id={block.id}>
        <h2 className="app-section-title">{block.title}</h2>
        <div className="download-list">
          {block.items.map((item) => (
            <a className="download-card" href={item.href} target="_blank" rel="noreferrer" key={item.href}>
              <span className="download-card__icon">{ICONS.mail}</span>
              <span className="download-card__body">
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    )
  }

  return null
}

function ApplicationDetailPage({ pageKey }) {
  const page = routePages?.[pageKey]
  if (!page) return <GenericRoutePage title={capitalizeSlug(pageKey)} />

  const description = page.description || {}

  const handleTabClick = (event, id) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <section className="app-hero">
        <div className="container app-hero__inner">
          <div className="app-hero__left">
            {page.gallery ? <AppGallery images={page.gallery} /> : null}

            <div className="app-desc">
              <h2 className="app-section-title">Description</h2>
              {(description.paragraphs || []).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {(description.sections || []).map((section) => (
                <div className="app-desc__section" key={section.title}>
                  <h3>{section.title}</h3>
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ))}
              {description.callout ? (
                <div className="app-callout app-callout--inline">
                  <h4>{description.callout.title}</h4>
                  <p>{description.callout.text}</p>
                </div>
              ) : null}
              {description.list ? (
                <div className="app-desc__list">
                  <h3 className="app-desc__list-title">{description.list.title}</h3>
                  <ul className="app-list">
                    {description.list.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="app-hero__right">
            <h1 className="app-hero__title">{page.title}</h1>
            <p className="app-hero__subtitle">{page.summary}</p>
            {page.bullets ? (
              <ul className="app-hero__bullets">
                {page.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            <div className="app-form-box">
              <AppForm form={page.form} />
            </div>
          </div>
        </div>
      </section>

      {page.tabs ? (
        <div className="app-tabbar">
          <div className="container app-tabbar__inner">
            {page.tabs.map((tab) => (
              <a className="app-tabbar__link" href={`#${tab.id}`} key={tab.id} onClick={(event) => handleTabClick(event, tab.id)}>
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <section className="section app-body">
        <div className="container">
          {(page.body || []).map((block) => (
            <ApplicationBodyBlock block={block} key={block.id} />
          ))}
        </div>
      </section>
    </>
  )
}

function EnquiryFormPage({ page }) {
  const groups = page.sections?.[0]?.groups || []

  return (
    <>
      <section className="section enquiry-hero">
        <div className="container enquiry-hero__inner">
          <div className="enquiry-hero__copy">
            <h1 className="enquiry-hero__title">{page.title}</h1>
            <p className="enquiry-hero__text">{page.intro}</p>
          </div>
          <div className="enquiry-hero__media">
            <img src={page.mediaSrc} alt={page.mediaAlt || 'Enquiry'} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section enquiry-form-section">
        <div className="container">
          <form className="enquiry-form" onSubmit={(event) => event.preventDefault()}>
            <h2 className="enquiry-form__title">{page.formTitle}</h2>

            <div className="enquiry-fields">
              {(page.textFields || []).map((field) => (
                <label className={`enquiry-field ${field.textarea ? 'enquiry-field--full' : ''}`.trim()} key={field.label}>
                  <span>{field.label}</span>
                  {field.textarea ? (
                    <textarea rows={3} />
                  ) : (
                    <input type={field.type || 'text'} />
                  )}
                </label>
              ))}
            </div>

            {groups.map((group) => (
              <fieldset className="enquiry-group" key={group.title}>
                <legend>{group.title}</legend>
                <div className="enquiry-options">
                  {group.items.map((item) => (
                    <label key={item}>
                      <input type="checkbox" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <button type="submit" className="button button--primary route-submit">{page.submitLabel || 'SUBMIT'}</button>
          </form>
        </div>
      </section>
    </>
  )
}

function RouteContentPage({ pageKey, onNavigate }) {
  const page = routePages?.[pageKey]
  if (!page) return <GenericRoutePage title={capitalizeSlug(pageKey)} />
  if (page.layout === 'application') return <ApplicationDetailPage pageKey={pageKey} />
  if (page.layout === 'enquiry') return <EnquiryFormPage page={page} onNavigate={onNavigate} />

  return (
    <>
      <DetailBanner eyebrow={page.eyebrow} title={page.title} summary={page.summary} mediaSrc={page.mediaSrc} mediaAlt={page.mediaAlt} heroImage={page.heroImage} />

      <section className="section">
        <div className="container">
          {page.intro ? (
            <article className="content-card">
              <p>{page.intro}</p>
            </article>
          ) : null}

          {page.bullets ? (
            <article className="content-card">
              <SectionHeading title="Highlights" />
              <ul className="feature-list">
                {page.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ) : null}

          {page.contents ? (
            <article className="content-card">
              <SectionHeading title="Contents" />
              <ul>
                {page.contents.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </article>
          ) : null}

          {page.sections?.map((s) => (
            <article className="content-card" key={s.title}>
              <SectionHeading title={s.title} />
              {s.paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.groups?.map((group) => (
                <fieldset className="enquiry-group" key={group.title}>
                  <legend>{group.title}</legend>
                  <div className="enquiry-options">
                    {group.items.map((item) => (
                      <label key={item}>
                        <input type="checkbox" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </article>
          ))}

          {page.gallery ? (
            <div className="route-gallery">
              {page.gallery.map((image) => (
                <img src={image.src} alt={image.alt} loading="lazy" key={image.src} />
              ))}
            </div>
          ) : null}

          {page.flyers ? (
            <div className="route-flyers">
              <SectionHeading title={page.flyersTitle || 'Flyers & Announcements'} />
              <div className="route-flyers__grid">
                {page.flyers.map((image) => (
                  <img src={image.src} alt={image.alt} loading="lazy" key={image.src} />
                ))}
              </div>
            </div>
          ) : null}

          {page.photoCell ? (
            <article className="content-card content-card--about-block">
              <SectionHeading title={page.photoCell.title} />
              {page.photoCell.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <PlaceholderPanel src={page.photoCell.image} alt={page.photoCell.imageAlt} tone="light" />
            </article>
          ) : null}

          {page.downloads ? (
            <article className="content-card">
              <SectionHeading title="Downloads" />
              <ul>
                {page.downloads.map((d) => (
                  <li key={d.href}><a href={d.href} target="_blank" rel="noreferrer">{d.title}</a> - {d.detail}</li>
                ))}
              </ul>
            </article>
          ) : null}

          {page.submitLabel ? (
            <button type="button" className="button button--primary route-submit">{page.submitLabel}</button>
          ) : null}
        </div>
      </section>
    </>
  )
}

function SpectroelectrochemistryPage() { return <RouteContentPage pageKey="spectroelectrochemistry" /> }
function EducationalKitPage() { return <RouteContentPage pageKey="educationalKit" /> }
function CorrosionPackagePage() { return <RouteContentPage pageKey="corrosionPackage" /> }
function EventPage() { return <RouteContentPage pageKey="event" /> }
function EnquiryPage() { return <RouteContentPage pageKey="enquiry" /> }

function Footer({ onNavigate }) {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Software', href: '/software' },
    { label: 'Resources', href: '/resources' },
    { label: 'Applications', href: '/applications' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'News', href: '/news' },
  ]

  const footerProducts = [
    { label: 'Nexus', href: '/product/nexus' },
    { label: 'PalmSens4', href: '/product/palmsens4' },
    { label: 'EmStat4S', href: '/product/emstat4s' },
    { label: 'Sensit Wearable', href: '/product/sensit-wearable' },
    { label: 'EmStat Go', href: '/product/emstat-go' },
  ]

  return (
    <footer className="site-footer">
      <div className="container prefooter-actions">
        <a className="content-card contact-action-card" href={contact.whatsappHref} target="_blank" rel="noreferrer">
          <span className="contact-action-card__icon contact-action-card__icon--whatsapp">{ICONS.whatsapp}</span>
          <div>
            <h3>CHAT VIA WHATSAPP</h3>
            <p>Chat directly, or leave a message</p>
          </div>
        </a>
        <a className="content-card contact-action-card" href={`mailto:${contact.email}`}>
          <span className="contact-action-card__icon contact-action-card__icon--mail">{ICONS.mail}</span>
          <div>
            <h3>MESSAGE US</h3>
            <p>Usually respond within a business day</p>
          </div>
        </a>
      </div>

      <div className="container footer-grid">
        <div className="footer-grid__brand">
          <BrandMark />
          <p>Focused on biosensors and batteries, Class One offers advanced electrochemical instruments and solutions.</p>
          <div className="footer-grid__socials">
            <a className="social--facebook" href="https://www.facebook.com/Class-One-Systems-ST-Pvt-Ltd-104121998557239" target="_blank" rel="noreferrer" aria-label="Facebook">{ICONS.facebook}</a>
            <a className="social--twitter" href="https://twitter.com/class_pvt" target="_blank" rel="noreferrer" aria-label="Twitter">{ICONS.twitter}</a>
            <a className="social--youtube" href="https://www.youtube.com/channel/UCz4hk9KnO4n1yNkIKoKHIqA" target="_blank" rel="noreferrer" aria-label="YouTube">{ICONS.youtube}</a>
          </div>
        </div>

        <div>
          <h3>Quick Link</h3>
          <div className="footer-list">
            {quickLinks.map((item) => (
              <AppLink key={item.label} href={item.href} onNavigate={onNavigate} className="footer-list__link">
                {item.label}
              </AppLink>
            ))}
          </div>
        </div>

        <div>
          <h3>Products</h3>
          <div className="footer-list">
            {footerProducts.map((item) => (
              <AppLink key={item.label} href={item.href} onNavigate={onNavigate} className="footer-list__link">
                {item.label}
              </AppLink>
            ))}
          </div>
          <AppLink href="/product" onNavigate={onNavigate} className="footer-cta">
            View All Products
          </AppLink>
        </div>

        <div>
          <h3>Contact</h3>
          <div className="footer-contact__row">
            <span className="footer-contact__icon">{ICONS.mail}</span>
            <div>
              <p className="footer-contact__label">EMAIL</p>
              <a href={`mailto:${contact.email}`} className="footer-contact__value">{contact.email}</a>
            </div>
          </div>
          <div className="footer-contact__row">
            <span className="footer-contact__icon">{ICONS.pin}</span>
            <div>
              <p className="footer-contact__label">ADDRESS</p>
              <p className="footer-contact__address">{contact.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p>Copyright &copy; 2025 | All rights reserved</p>
          <div className="footer-bottom__mobile-links">
            <a href="/enquiry" onClick={(e) => { e.preventDefault(); onNavigate('/enquiry') }}>Terms and Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FloatingContact({ onNavigate }) {
  return (
    <div className="floating-contact" aria-label="Contact shortcuts">
      <AppLink href="/contact" onNavigate={onNavigate} className="floating-contact__pill">
        Contact us
      </AppLink>
      <a className="floating-contact__bubble" href={contact.whatsappHref} target="_blank" rel="noreferrer" aria-label="Open chat">
        {ICONS.chat}
      </a>
    </div>
  )
}

export default function App() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname))
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(null)
  const [productGroupOpen, setProductGroupOpen] = useState('Sensing')

  useEffect(() => {
    const onPopState = () => setPathname(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    setDesktopMenuOpen(null)
    setProductGroupOpen('Sensing')
  }, [pathname])

  useEffect(() => {
    const route = resolveRoute(pathname)
    document.title = route.title
  }, [pathname])

  const navigate = (href) => {
    const nextPath = normalizePath(new URL(href, window.location.origin).pathname)
    if (nextPath !== pathname) {
      window.history.pushState({}, '', nextPath)
      setPathname(nextPath)
    }
    setMobileMenuOpen(false)
    setSearchOpen(false)
    setDesktopMenuOpen(null)
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const route = resolveRoute(pathname)
  const Page = route.component

  return (
    <div className="app-shell">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header
        pathname={pathname}
        onNavigate={navigate}
        onSearchOpen={() => setSearchOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        desktopMenuOpen={desktopMenuOpen}
        setDesktopMenuOpen={setDesktopMenuOpen}
        productGroupOpen={productGroupOpen}
        setProductGroupOpen={setProductGroupOpen}
      />

      <main id="content" className="site-main">
        {Page ? <Page {...(route.pageProps || {})} onNavigate={navigate} /> : <GenericRoutePage title={route.title} summary={route.summary} />}
      </main>

      <Footer onNavigate={navigate} />
      <FloatingContact onNavigate={navigate} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
    </div>
  )
}

function resolveRoute(pathname) {
  const path = normalizePath(pathname)

  if (path === '/') {
    return { title: 'ClassOneSystem - ClassOneSystem', component: HomePage }
  }

  if (path === '/about') {
    return { title: 'About Us - ClassOneSystem', component: AboutPage }
  }

  if (path === '/software') {
    return { title: 'Software - ClassOneSystem', component: SoftwarePage }
  }

  if (path === '/resources') {
    return { title: 'Resources - ClassOneSystem', component: ResourcesPage }
  }

  if (path === '/applications') {
    return { title: 'Applications - ClassOneSystem', component: ApplicationsPage }
  }

  if (path === '/spectroelectrochemistry') {
    return { title: 'Spectroelectrochemistry - ClassOneSystem', component: SpectroelectrochemistryPage }
  }

  if (path === '/educational-kit') {
    return { title: 'Educational Kit - ClassOneSystem', component: EducationalKitPage }
  }

  if (path === '/corrosion-package') {
    return { title: 'Corrosion Package - ClassOneSystem', component: CorrosionPackagePage }
  }

  if (path === '/event') {
    return { title: 'Event - ClassOneSystem', component: EventPage }
  }

  if (path === '/enquiry') {
    return { title: 'Enquiry - ClassOneSystem', component: EnquiryPage }
  }

  if (path === '/news') {
    return { title: 'Blog - ClassOneSystem', component: NewsPage }
  }

  if (path === '/contact') {
    return { title: 'Contact Us - ClassOneSystem', component: ContactPage }
  }

  if (path === '/batteries') {
    return { title: 'Batteries - ClassOneSystem', component: BatteriesPage }
  }

  if (path === '/product' || path === '/all-products') {
    return { title: 'Products - ClassOneSystem', component: ProductsPage }
  }

  const categoryRoutes = {
    '/single-channel-electrochemical': ['Single Channel Electrochemical', 'Single-channel potentiostats and galvanostats for research and sensing.'],
    '/multi-channel-electrochemical': ['Multi Channel Electrochemical', 'Multi-channel electrochemical systems for parallel measurements.'],
    '/electrochemical-development-kit': ['Electrochemical Development Kit', 'Modules and development kits for custom electrochemical devices.'],
    '/corrtest': ['Corrtest', 'Electrochemical workstations for corrosion, batteries, and materials research.'],
    '/tob': ['TOB Battery Equipment', 'Battery research, assembly, and testing equipment.'],
    '/nano-technology': ['Nano Technology', 'Systems for nanotechnology and materials science research.'],
    '/electrodes': ['Electrodes', 'Working, reference, and counter electrodes for electrochemical research.'],
    '/glass-cell': ['Glass Cell', 'Electrochemical and corrosion cells for laboratory workflows.'],
    '/electrochemical-accessories': ['Electrochemical Accessories', 'Accessories and consumables for electrochemical systems.'],
  }

  if (categoryRoutes[path]) {
    const categoryKey = path.replace(/^\//, '')
    if (productCategories?.[categoryKey]) {
      return { title: `${productCategories[categoryKey].title} - ClassOneSystem`, component: CategoryProductsPage, pageProps: { categoryKey } }
    }
    const [title, summary] = categoryRoutes[path]
    return { title: `${title} - ClassOneSystem`, component: CategoryPage, pageProps: { title, summary } }
  }

  // Real product detail pages (scraped) take precedence over any template.
  if (path.startsWith('/product/')) {
    const aliases = { '/product/emstat4x': '/product/emstat-4x', '/product/emstat-blue': '/product/emstat-go' }
    const resolved = aliases[path] || path
    const detail = productDetails[resolved]
    if (detail) {
      return { title: `${detail.title} - ClassOneSystem`, component: ProductDetailPage, pageProps: { slug: resolved } }
    }
  }

  const software = findByAlias(softwareDetailCatalog, path)
  if (software) {
    return { title: `${software.title} - ClassOneSystem`, component: SoftwareDetailPage, pageProps: { data: software } }
  }

  if (path.startsWith('/software/')) {
    const softwareSlug = `/${path.split('/').filter(Boolean).pop()}`
    const nestedSoftware = findByAlias(softwareDetailCatalog, softwareSlug)
    if (nestedSoftware) {
      return { title: `${nestedSoftware.title} - ClassOneSystem`, component: SoftwareDetailPage, pageProps: { data: nestedSoftware } }
    }
  }

  if (path.startsWith('/product/')) {
    const fallbackTitle = capitalizeSlug(path.split('/').filter(Boolean).pop())
    return { title: `${fallbackTitle} - ClassOneSystem`, component: ProductDetailPage, pageProps: { slug: path } }
  }

  return {
    title: `${capitalizeSlug(path.replace(/^\//, '')) || 'Page'} - ClassOneSystem`,
    summary: 'Route content from the source site.',
    component: GenericRoutePage,
    pageProps: { title: capitalizeSlug(path.replace(/^\//, '')) || 'Page', summary: 'Route content from the source site.' },
  }
}
