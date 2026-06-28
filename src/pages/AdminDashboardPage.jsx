import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { AdminTopbar } from '../components/layout/AdminTopbar'
import { Box, Sliders, LogOut, User, ArrowRight, ExternalLink, Newspaper, ShieldCheck, RotateCcw, Key, MessageSquare, Users, Mail } from '../components/ui/Icons'

const STAT_CARDS = [
  { name: 'products',     label: 'Products',     icon: Box },
  { name: 'newsposts',    label: 'News Posts',   icon: Newspaper },
  { name: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { name: 'clients',      label: 'Clients',      icon: Users },
]

const MANAGE_CARDS = [
  { href: '/admin/products',  icon: Box,       title: 'Products',     desc: 'Add, edit, organise and reorder catalog products.' },
  { href: '/admin/news',      icon: Newspaper, title: 'News',         desc: 'Publish and manage news posts and announcements.' },
  { href: '/admin/site',      icon: Sliders,   title: 'Site Manager', desc: 'Home carousel, testimonials, clients, team and the headline bar.' },
  { href: '/admin/enquiries', icon: Mail,      title: 'Enquiries',    desc: 'View submitted enquiry forms and set notification email.' },
]

// Available to every admin.
const ACCOUNT_CARDS = [
  { href: '/admin/account', icon: Key, title: 'Account', desc: 'Change your password and manage your sign-in.' },
]

function useCountUp(target, run) {
  const [value, setValue] = useState(null)
  const raf = useRef(null)
  const fromRef = useRef(0) // animate from the previously-shown number, not 0

  useEffect(() => {
    if (!run) return
    if (target === null || target === undefined) { setValue(target); return }
    const start = performance.now()
    const from = fromRef.current ?? 0
    const duration = 700
    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, run])

  return value
}

function StatCard({ label, icon: Icon, rawCount, index, run }) {
  const displayed = useCountUp(rawCount, run)
  return (
    <div className="admin-stat" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="admin-stat__top">
        <span className="admin-stat__icon"><Icon /></span>
        <span className="admin-stat__num">
          {displayed === undefined || displayed === null
            ? (rawCount === null ? '—' : '…')
            : displayed}
        </span>
      </div>
      <span className="admin-stat__label">{label}</span>
    </div>
  )
}

function ActionRow({ href, icon: Icon, title, desc, onNavigate }) {
  return (
    <a className="actionrow" href={href}
      onClick={(e) => { e.preventDefault(); onNavigate?.(href) }}>
      <span className="actionrow__icon"><Icon /></span>
      <span className="actionrow__body">
        <span className="actionrow__title">{title}</span>
        <span className="actionrow__desc">{desc}</span>
      </span>
      <span className="actionrow__go"><ArrowRight /></span>
    </a>
  )
}

function ActionGroup({ label, items, onNavigate, gold }) {
  return (
    <div className={`admin-actions__group ${gold ? 'is-super' : ''}`.trim()}>
      <h3 className="admin-actions__label">{label}</h3>
      <div className="admin-actions__list">
        {items.map(c => <ActionRow key={c.href} {...c} onNavigate={onNavigate} />)}
      </div>
    </div>
  )
}

/** One-time login welcome: a soft greeting that flies into the dashboard. */
function WelcomeOverlay({ name, targetRef, gold, onWake, onDone }) {
  const floatRef = useRef(null)
  const [phase, setPhase] = useState('enter') // 'enter' | 'fly' | 'gone'
  const [flyStyle, setFlyStyle] = useState(null)

  useEffect(() => {
    const timers = []
    timers.push(setTimeout(() => {
      const f = floatRef.current?.getBoundingClientRect()
      const t = targetRef.current?.getBoundingClientRect()
      if (f && t && f.height) {
        const scale = t.height / f.height
        setFlyStyle({ transform: `translate(${t.left - f.left}px, ${t.top - f.top}px) scale(${scale})` })
      }
      setPhase('fly')
      timers.push(setTimeout(() => onWake?.(), 480))   // wake the dashboard as the name lands
    }, 1250))
    timers.push(setTimeout(() => { setPhase('gone'); onDone?.() }, 2120))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'gone') return null
  return (
    <div className={`welcome ${phase === 'fly' ? 'is-fly' : ''} ${gold ? 'is-gold' : ''}`.trim()} aria-hidden="true">
      <div className="welcome__backdrop" />
      <div className="welcome__center">
        <span className="welcome__hi">Welcome,</span>
        <span ref={floatRef} className="welcome__name" style={flyStyle}>{name}</span>
      </div>
    </div>
  )
}

export function AdminDashboardPage({ onNavigate }) {
  const { user, isAdmin, isSuper, loading, logout, accountName, photoURL } = useAuth()
  const [counts, setCounts] = useState({})
  const greetingRef = useRef(null)
  const name = accountName

  // Welcome flow: read the one-time flag set at login. `booting` keeps the
  // dashboard dimmed until the welcome name lands, then it springs to life.
  const startedWelcome = useRef(false)
  const [welcome, setWelcome] = useState(false)
  const [booting, setBooting] = useState(false)

  useEffect(() => {
    if (startedWelcome.current) return
    let flagged = false
    try { flagged = sessionStorage.getItem('co_welcome') === '1'; if (flagged) sessionStorage.removeItem('co_welcome') } catch { /* ignore */ }
    if (flagged) { startedWelcome.current = true; setWelcome(true); setBooting(true) }
  }, [])

  useEffect(() => { if (!loading && !isAdmin) onNavigate?.('/login') }, [loading, isAdmin, onNavigate])

  // Live counts — Firestore real-time listeners keep the stats current the
  // moment a product or news post is added, deleted or restored.
  useEffect(() => {
    if (!isAdmin) return
    const unsubs = [
      api.watchProductsCount(n => setCounts(c => ({ ...c, products: n }))),
      api.watchNewsCount(n => setCounts(c => ({ ...c, newsposts: n }))),
      api.watchCollectionCount('testimonials', n => setCounts(c => ({ ...c, testimonials: n }))),
      api.watchCollectionCount('clients', n => setCounts(c => ({ ...c, clients: n }))),
    ]
    return () => unsubs.forEach(u => { try { u && u() } catch { /* already off */ } })
  }, [isAdmin])

  async function handleSignOut() { await logout(); onNavigate?.('/') }

  if (loading) return <section className="section admin-section"><div className="container"><p>Checking access…</p></div></section>
  if (!isAdmin) return null

  const statsRun = !booting   // hold the count-up until the dashboard wakes

  return (
    <section className="admin-section">
      <AdminTopbar
        onNavigate={onNavigate}
        actions={<>
          <a className="btn btn--ghost btn--sm" href="/" target="_blank" rel="noopener"><ExternalLink /> View site</a>
          <button className="btn btn--primary btn--sm" onClick={handleSignOut}><LogOut /> Sign out</button>
        </>}
      />

      <div className={`admin-dash ${booting ? 'is-booting' : ''}`.trim()}>
        {/* Greeting */}
        <div className="admin-dash__head">
          <div className="admin-greeting">
            <h1 className="admin-greeting__title">
              Welcome, <span ref={greetingRef} className="admin-greeting__name">{name}</span>
            </h1>
            <p className="admin-greeting__sub">Manage your site’s content, media and people — all from one place.</p>
          </div>
        </div>

        <div className="admin-dash__grid">
          {/* Left — signed-in card (tall) + content overview */}
          <div className="admin-dash__main">
            <div className={`admin-usercard admin-usercard--tall ${isSuper ? 'is-super' : ''}`.trim()}>
              <span className="admin-usercard__avatar">
                {photoURL ? <img src={photoURL} alt="" /> : (isSuper ? <ShieldCheck /> : <User />)}
              </span>
              <div className="admin-usercard__body">
                <span className="admin-usercard__label">Signed in as</span>
                <span className="admin-usercard__email">{user?.email}</span>
                <span className={`admin-usercard__role ${isSuper ? 'is-super' : ''}`.trim()}>
                  {isSuper && <ShieldCheck />}{isSuper ? 'Super admin' : 'Admin'}
                </span>
                {isSuper && (
                  <div className="admin-usercard__actions">
                    <a className="usercard-btn" href="/admin/recovery"
                      onClick={(e) => { e.preventDefault(); onNavigate?.('/admin/recovery') }}>
                      <RotateCcw /> Recovery
                    </a>
                    <a className="usercard-btn" href="/admin/admins"
                      onClick={(e) => { e.preventDefault(); onNavigate?.('/admin/admins') }}>
                      <ShieldCheck /> Admins
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-panel">
              <h2 className="admin-panel__heading">Content overview</h2>
              <div className="admin-stats">
                {STAT_CARDS.map(({ name, label, icon }, i) => (
                  <StatCard key={name} label={label} icon={icon} rawCount={counts[name]} index={i} run={statsRun} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — management actions, compact. Super-admin tools (Recovery,
              Admins) live in the signed-in card above, not here. */}
          <div className="admin-actions">
            <ActionGroup label="Manage" items={MANAGE_CARDS} onNavigate={onNavigate} />
            <ActionGroup label="Your account" items={ACCOUNT_CARDS} onNavigate={onNavigate} />
          </div>
        </div>
      </div>

      {welcome && (
        <WelcomeOverlay
          name={name}
          targetRef={greetingRef}
          gold={isSuper}
          onWake={() => setBooting(false)}
          onDone={() => setWelcome(false)}
        />
      )}
    </section>
  )
}
