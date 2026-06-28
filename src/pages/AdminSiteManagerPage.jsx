import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { AdminTopbar } from '../components/layout/AdminTopbar'
import { CarouselManager } from '../components/admin/CarouselManager'
import { TestimonialsManager } from '../components/admin/TestimonialsManager'
import { ClientsManager } from '../components/admin/ClientsManager'
import { HeadlineManager } from '../components/admin/HeadlineManager'
import { TeamManager } from '../components/admin/TeamManager'
import { Grid, LogOut, ImageIcon, MessageSquare, Users, Megaphone, Sliders, User } from '../components/ui/Icons'

const TABS = [
  { key: 'carousel',     label: 'Home Carousel', icon: ImageIcon,     Comp: CarouselManager },
  { key: 'testimonials', label: 'Testimonials',  icon: MessageSquare, Comp: TestimonialsManager },
  { key: 'clients',      label: 'Clients',       icon: Users,         Comp: ClientsManager },
  { key: 'headlines',    label: 'Headline Bar',  icon: Megaphone,     Comp: HeadlineManager },
  { key: 'team',         label: 'Team',          icon: User,          Comp: TeamManager },
]

/**
 * Site Manager — one home for managing the home carousel, testimonials, client
 * logos and the rotating headline bar. Each lives in its own tab. The active tab
 * is reflected in the URL hash so a refresh keeps your place.
 */
export function AdminSiteManagerPage({ onNavigate, tab }) {
  const { isAdmin, loading, logout } = useAuth()
  const initial = tab || (typeof window !== 'undefined' && window.location.hash.replace('#', '')) || 'carousel'
  const [active, setActive] = useState(TABS.some(t => t.key === initial) ? initial : 'carousel')

  useEffect(() => { if (!loading && !isAdmin) onNavigate?.('/login') }, [loading, isAdmin, onNavigate])

  function pick(key) {
    setActive(key)
    try { window.history.replaceState({}, '', `/admin/site#${key}`) } catch { /* ignore */ }
  }

  async function handleSignOut() { await logout(); onNavigate?.('/') }

  if (loading) return <section className="section admin-section"><div className="container"><p>Checking access…</p></div></section>
  if (!isAdmin) return null

  const Active = TABS.find(t => t.key === active) || TABS[0]
  const ActiveComp = Active.Comp

  return (
    <section className="admin-section">
      <AdminTopbar
        icon={Sliders}
        title="Site Manager"
        subtitle="Home carousel, testimonials, clients & headline bar"
        onNavigate={onNavigate}
        actions={<>
          <button className="btn btn--ghost btn--sm" onClick={() => onNavigate?.('/admin')}><Grid /> Dashboard</button>
          <button className="btn btn--primary btn--sm" onClick={handleSignOut}><LogOut /> Sign out</button>
        </>}
      />

      <div className="admin-sm">
        <div className="sm-tabs" role="tablist" aria-label="Site sections">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.key} role="tab" aria-selected={t.key === active}
                className={`sm-tab ${t.key === active ? 'is-active' : ''}`.trim()}
                onClick={() => pick(t.key)}>
                <Icon /> {t.label}
              </button>
            )
          })}
        </div>

        <div className="sm-panel" key={active}>
          <ActiveComp />
        </div>
      </div>
    </section>
  )
}
