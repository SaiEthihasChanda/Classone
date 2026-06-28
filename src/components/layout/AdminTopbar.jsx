import { useAuth } from '../../lib/auth'
import { useSettings } from '../../lib/store'

/**
 * Shared admin/super-admin top bar — identical chrome on every admin page:
 * company logo on the left, an optional page identity (badge + title + subtitle),
 * and page-specific actions on the right. The bar is white for admins and golden
 * (with a shine sweep) for the super admin, decided here so it stays consistent
 * everywhere without each page re-implementing it.
 */
export function AdminTopbar({ icon: Icon, title, subtitle, actions, onNavigate }) {
  const { isSuper } = useAuth()
  const settings = useSettings()
  const logo = settings.assets?.logo

  return (
    <header className={`admin-topbar admin-topbar--brand ${isSuper ? 'admin-topbar--super' : ''}`.trim()}>
      <div className="admin-topbar__lead">
        <a className="admin-topbar__brand" href="/admin"
          onClick={(e) => { e.preventDefault(); onNavigate?.('/admin') }} aria-label="Dashboard home">
          {logo
            ? <img className="admin-topbar__logo" src={logo} alt="ClassOne Systems" />
            : <span className="admin-topbar__title">ClassOne Systems</span>}
        </a>

        {title && (
          <div className="admin-topbar__id">
            {Icon && <span className="admin-topbar__badge"><Icon /></span>}
            <div className="admin-topbar__idtext">
              <h1 className="admin-topbar__title">{title}</h1>
              {subtitle != null && subtitle !== '' && <p className="admin-topbar__user">{subtitle}</p>}
            </div>
          </div>
        )}
      </div>

      {actions && <div className="admin-topbar__actions">{actions}</div>}
    </header>
  )
}
