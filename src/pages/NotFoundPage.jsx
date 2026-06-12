import { AppLink } from '../components/common/AppLink'

export function NotFoundPage({ onNavigate }) {
  return (
    <section className="section not-found">
      <div className="container not-found__inner">
        <h1 className="not-found__code">404</h1>
        <p className="not-found__title">Page not found</p>
        <p className="not-found__desc">The page you are looking for does not exist or has been moved.</p>
        <AppLink href="/" onNavigate={onNavigate} className="btn btn--primary btn--md">
          Return Home
        </AppLink>
      </div>
    </section>
  )
}
