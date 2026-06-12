import { useEffect, useRef, useState } from 'react'
import { normalizePath } from '../../utils'
import { useSettings } from '../../lib/store'
import { AppLink } from '../common/AppLink'
import { Search, ChevronDown, ChevronRight, Menu, X, Zap, Atom, Phone } from '../ui/Icons'

function BrandLogo({ src }) {
  return <img className="brand-logo" src={src} alt="Class One Systems" />
}

export function Header({ pathname, onNavigate, onSearchOpen }) {
  const settings = useSettings()
  const mainNavLinks = settings.nav?.main || []
  const topStripLinks = settings.nav?.top || []
  const imageAssets = settings.assets || {}
  const contact = settings.contact || {}
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(null)
  const [productGroup, setProductGroup] = useState('Sensing')
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const timerRef = useRef(null)

  const activePath = normalizePath(pathname)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setMobileExpanded(null) }, [pathname])

  // Close desktop dropdowns on route change
  useEffect(() => { setDesktopOpen(null); setProductGroup('Sensing') }, [pathname])

  // Keyboard ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setMobileOpen(false); setDesktopOpen(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openMenu  = (label) => { clearTimeout(timerRef.current); setDesktopOpen(label) }
  const scheduleClose = () => {
    timerRef.current = setTimeout(() => { setDesktopOpen(null); setProductGroup('Sensing') }, 220)
  }
  const cancelClose = () => clearTimeout(timerRef.current)

  const isActive = (href) => {
    const norm = normalizePath(href || '')
    return norm === activePath || (norm !== '/' && activePath.startsWith(norm.replace(/\/$/, '') + '/'))
  }

  return (
    <header className="site-header" role="banner">
      {/* ── Top strip ── */}
      <div className="top-strip">
        <div className="container top-strip__inner">
          <div className="top-strip__segments">
            {topStripLinks.map(link => (
              <AppLink key={link.label} href={link.href} onNavigate={onNavigate}
                className={`top-strip__link ${activePath === normalizePath(link.href) ? 'is-active' : ''}`.trim()}>
                <span className="top-strip__link-icon">
                  {link.label === 'ENERGY' ? <Zap /> : <Atom />}
                </span>
                {link.label}
              </AppLink>
            ))}
          </div>
          <div className="top-strip__right">
            <a href={`tel:${contact.phone}`} className="top-strip__tel">
              <Phone /> {contact.phoneDisplay}
            </a>
            <AppLink href="/news" onNavigate={onNavigate} className="top-strip__news">News</AppLink>
          </div>
        </div>
      </div>

      {/* ── Main bar ── */}
      <div className="header-bar" onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
        <div className="container header-bar__inner">
          {/* Brand */}
          <AppLink href="/" onNavigate={onNavigate} className="header-bar__brand" aria-label="ClassOne Systems — home">
            <BrandLogo src={imageAssets.logo} />
          </AppLink>

          {/* Desktop nav */}
          <nav className="main-nav" aria-label="Main navigation">
            {mainNavLinks.map(item => {
              const hasMenu = Boolean(item.menu)
              const active  = isActive(item.href)
              const open    = desktopOpen === item.label

              return (
                <div
                  key={item.label}
                  className={`main-nav__item ${hasMenu ? 'main-nav__item--has-menu' : ''} ${item.label === 'Software' ? 'main-nav__item--mega' : ''} ${open ? 'is-open' : ''}`.trim()}
                  onMouseEnter={hasMenu ? () => openMenu(item.label) : undefined}
                >
                  {hasMenu && item.href === '#' ? (
                    <button
                      className={`nav-link ${active ? 'is-active' : ''}`.trim()}
                      onClick={() => open ? setDesktopOpen(null) : openMenu(item.label)}
                    >
                      {item.label}
                      <ChevronDown className="nav-link__caret" />
                    </button>
                  ) : (
                    <AppLink href={item.href} onNavigate={onNavigate}
                      className={`nav-link ${active ? 'is-active' : ''}`.trim()}>
                      {item.label}
                      {hasMenu && <ChevronDown className="nav-link__caret" />}
                    </AppLink>
                  )}

                  {/* Dropdown panels */}
                  {hasMenu && open && (
                    item.label === 'Products' ? (
                      <ProductsDropdown
                        groups={item.menu.groups}
                        activeGroup={productGroup}
                        onGroupHover={setProductGroup}
                        onNavigate={onNavigate}
                        onClose={() => setDesktopOpen(null)}
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      />
                    ) : item.label === 'Software' ? (
                      <SoftwareMegaMenu
                        items={item.menu.items}
                        onNavigate={onNavigate}
                        onClose={() => setDesktopOpen(null)}
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      />
                    ) : (
                      <SimpleDropdown
                        items={item.menu.items}
                        onNavigate={onNavigate}
                        onClose={() => setDesktopOpen(null)}
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      />
                    )
                  )}
                </div>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="header-bar__actions">
            <button className="icon-btn" onClick={onSearchOpen} aria-label="Search">
              <Search />
            </button>
            <button
              className={`icon-btn icon-btn--menu ${mobileOpen ? 'is-open' : ''}`.trim()}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`.trim()} aria-hidden={!mobileOpen}>
        <div className="container mobile-menu__body">
          {mainNavLinks.map(item => {
            if (!item.menu) return (
              <AppLink key={item.label} href={item.href} onNavigate={onNavigate} className={`mobile-nav-link ${isActive(item.href) ? 'is-active' : ''}`.trim()}>
                {item.label}
              </AppLink>
            )

            const isExpanded = mobileExpanded === item.label
            const groups = item.menu.groups || item.menu.items || []

            return (
              <div key={item.label} className="mobile-nav-group">
                <button
                  className={`mobile-nav-toggle ${isExpanded ? 'is-open' : ''}`.trim()}
                  onClick={() => setMobileExpanded(v => v === item.label ? null : item.label)}
                  aria-expanded={isExpanded}
                >
                  {item.label}
                  <ChevronDown className="mobile-nav-toggle__caret" />
                </button>
                {isExpanded && (
                  <div className="mobile-nav-submenu">
                    {item.label === 'Products' ? groups.map(group => (
                      <div key={group.label} className="mobile-nav-section">
                        <span className="mobile-nav-section__label">{group.label}</span>
                        {group.items ? group.items.map(sub => (
                          <AppLink key={sub.label} href={sub.href} onNavigate={onNavigate} className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
                            {sub.label}
                          </AppLink>
                        )) : (
                          <AppLink href={group.href} onNavigate={onNavigate} className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
                            {group.label}
                          </AppLink>
                        )}
                      </div>
                    )) : groups.map(sub => (
                      <AppLink key={sub.label} href={sub.href || sub.href} onNavigate={onNavigate} external={sub.external}
                        className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
                        {sub.label}
                      </AppLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </header>
  )
}

function ProductsDropdown({ groups, activeGroup, onGroupHover, onNavigate, onClose, onMouseEnter, onMouseLeave }) {
  const active = groups.find(g => g.label === activeGroup) || groups[0]
  return (
    <div className="dropdown dropdown--products" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="dropdown__groups">
        {groups.map(g => (
          g.items ? (
            <button
              key={g.label}
              className={`dropdown__group-btn ${g.label === activeGroup ? 'is-active' : ''}`.trim()}
              onMouseEnter={() => onGroupHover(g.label)}
              onClick={() => onGroupHover(g.label)}
            >
              {g.label}
              <ChevronRight className="dropdown__group-caret" />
            </button>
          ) : (
            <AppLink key={g.label} href={g.href} onNavigate={onNavigate} className="dropdown__group-link" onClick={onClose}>
              {g.label}
            </AppLink>
          )
        ))}
      </div>
      <div className="dropdown__panel">
        {(active?.items || []).map(item => (
          <AppLink key={item.label} href={item.href} onNavigate={onNavigate} className="dropdown__item" onClick={onClose}>
            {item.label}
          </AppLink>
        ))}
      </div>
    </div>
  )
}

function SoftwareMegaMenu({ items, onNavigate, onClose, onMouseEnter, onMouseLeave }) {
  return (
    <div className="dropdown dropdown--mega" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="mega-grid">
        {items.map(item => (
          <AppLink key={item.label} href={item.href} onNavigate={onNavigate} external={item.external}
            className="mega-item" onClick={onClose}>
            <span className="mega-item__img">
              <img src={item.image} alt={item.label} loading="lazy" />
            </span>
            <span className="mega-item__body">
              <span className="mega-item__title">{item.label}</span>
              {item.description && <span className="mega-item__desc">{item.description}</span>}
            </span>
          </AppLink>
        ))}
      </div>
    </div>
  )
}

function SimpleDropdown({ items, onNavigate, onClose, onMouseEnter, onMouseLeave }) {
  return (
    <div className="dropdown dropdown--simple" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {items.map(item => (
        <AppLink key={item.label} href={item.href} onNavigate={onNavigate} className="dropdown__item" onClick={onClose}>
          {item.label}
        </AppLink>
      ))}
    </div>
  )
}
