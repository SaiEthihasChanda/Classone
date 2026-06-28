import { useEffect, useState } from 'react'
import { normalizePath } from './utils'
import { resolveRoute } from './router'
import { useBootstrap } from './lib/store'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { FloatingContact } from './components/common/FloatingContact'
import { SearchModal } from './components/common/SearchModal'

export default function App() {
  const { ready, error } = useBootstrap()
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname))
  const [searchOpen, setSearchOpen] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const onPop = () => setPathname(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Page-load entrance: start hidden, then trigger the staggered reveal
  // on the next frame so the initial hidden state paints first (no flash).
  useEffect(() => {
    setEntered(false)
    let raf2
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setEntered(true)) })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [pathname])

  useEffect(() => {
    const route = resolveRoute(pathname)
    document.title = route.title
  }, [pathname])

  // Scroll-reveal: reveal [data-reveal] elements as they enter the viewport.
  // A MutationObserver re-scans so elements added *after* an async fetch
  // (DB-driven lists/cards) are observed too — not just those present at mount.
  useEffect(() => {
    if (!ready) return
    const main = document.getElementById('content')
    if (!main) return

    if (!('IntersectionObserver' in window)) {
      const reveal = () => main.querySelectorAll('[data-reveal]:not(.is-revealed)')
        .forEach(el => el.classList.add('is-revealed'))
      reveal()
      const mo = new MutationObserver(reveal)
      mo.observe(main, { childList: true, subtree: true })
      return () => mo.disconnect()
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          obs.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

    const scan = () => main.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(el => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(main, { childList: true, subtree: true })

    return () => { io.disconnect(); mo.disconnect() }
    // Re-attach on navigation: switching to/from the admin chrome recreates the
    // #content node, which would otherwise leave the observer bound to a stale
    // element and never reveal newly-rendered [data-reveal] content.
  }, [ready, pathname])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navigate = (href) => {
    const next = normalizePath(new URL(href, window.location.origin).pathname)
    if (next !== pathname) {
      window.history.pushState({}, '', next)
      setPathname(next)
    }
    setSearchOpen(false)
  }

  if (error) {
    return (
      <div className="boot-screen">
        <div className="boot-screen__box">
          <h1>Can't reach the content service</h1>
          <p>The API isn't responding. Make sure the backend is running on port 4000.</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="boot-screen" aria-live="polite" aria-busy="true">
        <div className="boot-spinner" />
      </div>
    )
  }

  const route = resolveRoute(pathname)
  const Page = route.component

  // Admin area (login + dashboard + managers) runs without the public site
  // chrome — no marketing nav bar, footer, search or floating contact.
  const isAdminRoute = pathname === '/login' || pathname === '/admin' || pathname.startsWith('/admin/')

  if (isAdminRoute) {
    return (
      <div className="app-shell app-shell--admin">
        <main id="content" className="site-main">
          {Page ? <Page {...(route.pageProps || {})} onNavigate={navigate} /> : null}
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#content">Skip to content</a>

      <Header
        pathname={pathname}
        onNavigate={navigate}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <main id="content" className="site-main">
        <div className={`page-enter ${entered ? 'is-entered' : ''}`.trim()} key={pathname}>
          {Page ? <Page {...(route.pageProps || {})} onNavigate={navigate} /> : null}
        </div>
      </main>

      <Footer onNavigate={navigate} />
      <FloatingContact onNavigate={navigate} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
    </div>
  )
}
