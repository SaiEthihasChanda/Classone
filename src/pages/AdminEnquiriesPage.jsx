import { useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { AdminTopbar } from '../components/layout/AdminTopbar'
import { SettingsManager } from '../components/admin/SettingsManager'
import { Grid, LogOut, Mail } from '../components/ui/Icons'

export function AdminEnquiriesPage({ onNavigate }) {
  const { isAdmin, loading, logout } = useAuth()

  useEffect(() => { if (!loading && !isAdmin) onNavigate?.('/login') }, [loading, isAdmin, onNavigate])

  async function handleSignOut() { await logout(); onNavigate?.('/') }

  if (loading) return <section className="section admin-section"><div className="container"><p>Checking access…</p></div></section>
  if (!isAdmin) return null

  return (
    <section className="admin-section">
      <AdminTopbar
        icon={Mail}
        title="Enquiries"
        subtitle="Notification email and submitted enquiry forms"
        onNavigate={onNavigate}
        actions={<>
          <button className="btn btn--ghost btn--sm" onClick={() => onNavigate?.('/admin')}><Grid /> Dashboard</button>
          <button className="btn btn--primary btn--sm" onClick={handleSignOut}><LogOut /> Sign out</button>
        </>}
      />
      <div className="admin-sm">
        <div className="sm-panel">
          <SettingsManager />
        </div>
      </div>
    </section>
  )
}
