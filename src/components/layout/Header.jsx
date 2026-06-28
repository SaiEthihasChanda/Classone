import { useEffect, useRef, useState } from 'react'
import { normalizePath } from '../../utils'
import { useSettings, useSite } from '../../lib/store'
import { useAuth } from '../../lib/auth'
import { useTaxonomy } from '../../lib/taxonomy'
import { api } from '../../lib/api'
import { AppLink } from '../common/AppLink'
import { HeadlineBar } from './HeadlineBar'
import { Search, ChevronDown, ChevronRight, Menu, X, Zap, Atom, Code2, Phone, User, Grid, ArrowRight, ArrowUpRight, Box, ImageIcon } from '../ui/Icons'

function BrandLogo({ src }) {
  return <img className="brand-logo" src={src} alt="Class One Systems" />
}

export function Header({ pathname, onNavigate, onSearchOpen }) {
  const settings = useSettings()
  const headlines = useSite().headlines || []
  const { isAdmin } = useAuth()
  const { groups: taxGroups } = useTaxonomy()

  // Nav items temporarily hidden from the top bar. Remove a label here to
  // restore it (the page/route itself still works — only the tab is hidden).
  const HIDDEN_NAV = ['Resources']

  // The "Products" menu is driven by the live taxonomy, so admin-created or
  // renamed groups/categories appear in the top nav automatically. Other nav
  // items come from site settings unchanged.
  // The Unpublished group is a hidden holding area — never expose it in the nav.
  const publicGroups = taxGroups.filter(g => g.slug !== 'unpublished')
  const mainNavLinks = (settings.nav?.main || []).filter(item => !HIDDEN_NAV.includes(item.label)).map(item => {
    if (item.label !== 'Products' || !publicGroups.length) return item
    return {
      ...item,
      menu: {
        groups: publicGroups.map(g => ({
          label: g.label,
          items: g.categories.map(c => ({ label: c.label, href: `/${c.slug}/`, slug: c.slug })),
        })),
      },
    }
  })
  // Top-strip segments come from site settings (SENSING / ENERGY). MYOS — the
  // developer hub — always sits alongside them, appended here so it appears even
  // before any settings migration (deduped if it ever lands in the DB too).
  const topStripLinks = (() => {
    const fromDb = settings.nav?.top || []
    return fromDb.some(l => l.label === 'MYOS') ? fromDb : [...fromDb, { label: 'MYOS', href: '/myos' }]
  })()
  const imageAssets = settings.assets || {}
  const contact = settings.contact || {}
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(null)
  const [productGroup, setProductGroup] = useState('Sensing')
  const [mobileExpanded, setMobileExpanded] = useState(null)
  // Lazily-loaded catalog for the Products menu preview (fetched on first hover).
  const [menuProducts, setMenuProducts] = useState(null)
  const productsLoaded = useRef(false)
  const timerRef = useRef(null)

  function loadMenuProducts() {
    if (productsLoaded.current) return
    productsLoaded.current = true
    api.listCatalog().then(setMenuProducts).catch(() => setMenuProducts([]))
  }

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

  const openMenu  = (label) => { clearTimeout(timerRef.current); setDesktopOpen(label); if (label === 'Products') loadMenuProducts() }
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
                  {link.label === 'ENERGY' ? <Zap /> : link.label === 'MYOS' ? <Code2 /> : <Atom />}
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

      {/* ── Rotating headline ribbon (between the top strip and the logo bar) ── */}
      <HeadlineBar texts={headlines} />

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
                  className={`main-nav__item ${hasMenu ? 'main-nav__item--has-menu' : ''} ${(item.label === 'Software' || item.label === 'Products') ? 'main-nav__item--mega' : ''} ${open ? 'is-open' : ''}`.trim()}
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
                      <ProductsMegaMenu
                        groups={item.menu.groups}
                        products={menuProducts}
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
            {isAdmin ? (
              <AppLink href="/admin" onNavigate={onNavigate} className="btn-login btn-login--admin" aria-label="Admin dashboard">
                <Grid /> <span>Admin</span>
              </AppLink>
            ) : (
              /* Navigates in the SAME tab: login → dashboard, no extra windows. */
              <AppLink href="/login" onNavigate={onNavigate} className="btn-login" aria-label="Admin login">
                <User /> <span>Login</span>
              </AppLink>
            )}
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

function ProductsMegaMenu({ groups, products, onNavigate, onClose, onMouseEnter, onMouseLeave }) {
  const [activeGroup, setActiveGroup] = useState(groups[0]?.label)
  const grp = groups.find(g => g.label === activeGroup) || groups[0]
  const cats = grp?.items || []
  const [activeCat, setActiveCat] = useState(cats[0]?.slug)

  const pickGroup = (g) => { setActiveGroup(g.label); setActiveCat((g.items || [])[0]?.slug) }
  const curCat = cats.find(c => c.slug === activeCat) || cats[0]
  const slug = curCat?.slug
  const previews = (products || []).filter(p => p.category === slug && !p.deleted).slice(0, 6)

  return (
    <div className="dropdown dropdown--mega dropdown--pmega" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="mega-inner pmega">
        {/* Groups (same structure as before) */}
        <div className="pmega__groups">
          {groups.map(g => (
            <button key={g.label} type="button"
              className={`pmega__grp ${g.label === activeGroup ? 'is-active' : ''}`.trim()}
              onMouseEnter={() => pickGroup(g)} onFocus={() => pickGroup(g)}>
              {g.label}<ChevronRight />
            </button>
          ))}
        </div>

        {/* Categories of the active group */}
        <div className="pmega__cats">
          {cats.map(c => (
            <AppLink key={c.label} href={c.href} onNavigate={onNavigate}
              className={`pmega__cat ${c.slug === slug ? 'is-active' : ''}`.trim()}
              onMouseEnter={() => setActiveCat(c.slug)} onClick={onClose}>
              {c.label}
            </AppLink>
          ))}
          {!cats.length && <span className="pmega__empty">No categories.</span>}
        </div>

        {/* Top products of the hovered category fill the remaining space */}
        <div className="pmega__preview">
          <div className="pmega__preview-top">
            <span className="pmega__preview-title">{curCat?.label || 'Products'}</span>
            <AppLink href="/product" onNavigate={onNavigate} className="pmega__viewall" onClick={onClose}>
              View all products <ArrowRight />
            </AppLink>
          </div>
          <div className="pmega__grid">
            {products === null ? (
              Array.from({ length: 6 }).map((_, i) => <span key={i} className="pmega__prod pmega__prod--sk" />)
            ) : previews.length ? (
              previews.map(p => (
                <AppLink key={p.path || p.slug} href={p.external ? p.href : `/product/${p.slug}`}
                  external={p.external} onNavigate={onNavigate} className="pmega__prod" onClick={onClose}>
                  <span className="pmega__prod-img">
                    {(p.images?.[0] || p.image) ? <img src={p.images?.[0] || p.image} alt="" loading="lazy" /> : <ImageIcon />}
                  </span>
                  <span className="pmega__prod-name">{p.title}</span>
                </AppLink>
              ))
            ) : (
              <p className="pmega__none">No products in this category yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SoftwareMegaMenu({ items, onNavigate, onClose, onMouseEnter, onMouseLeave }) {
  return (
    <div className="dropdown dropdown--mega dropdown--swmega" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="mega-inner">
        <div className="mega-grid">
          {items.map(item => (
            <AppLink key={item.label} href={item.href} onNavigate={onNavigate} external={item.external}
              className="mega-item" onClick={onClose}>
              <span className="mega-item__img">
                <img src={item.image} alt={item.label} loading="lazy" />
              </span>
              <span className="mega-item__body">
                <span className="mega-item__title">
                  {item.label}{item.external && <ArrowUpRight className="mega-item__ext" />}
                </span>
                {item.description && <span className="mega-item__desc">{item.description}</span>}
              </span>
            </AppLink>
          ))}
        </div>
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
