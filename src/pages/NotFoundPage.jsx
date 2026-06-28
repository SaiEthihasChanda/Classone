import { AppLink } from '../components/common/AppLink'
import { useContent } from '../lib/store'

export function NotFoundPage({ onNavigate }) {
  const c = useContent().notFound || {}
  return (
    <section className="section not-found">
      <div className="container not-found__inner">
        <h1 className="not-found__code">{c.code || '404'}</h1>
        <p className="not-found__title">{c.title || 'Page not found'}</p>
        <p className="not-found__desc">{c.body}</p>
        <AppLink href={c.button?.href || '/'} onNavigate={onNavigate} className="btn btn--primary btn--md">
          {c.button?.label || 'Return Home'}
        </AppLink>
      </div>
    </section>
  )
}
