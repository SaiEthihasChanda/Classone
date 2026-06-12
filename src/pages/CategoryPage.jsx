import { useEntity } from '../lib/store'
import { AppLink } from '../components/common/AppLink'

export function CategoryPage({ categoryKey, onNavigate }) {
  const { data: category } = useEntity('categories', categoryKey)
  const title = category?.title || 'Products'
  const products = category?.products || []

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="page-banner__eyebrow">Products</p>
          <h1 className="page-banner__title">{title}</h1>
          {category?.summary && <p className="page-banner__summary">{category.summary}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {products.length ? (
            <div className="category-grid">
              {products.map((item, i) => (
                <AppLink
                  href={item.href}
                  onNavigate={onNavigate}
                  external={item.external}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="catalog-card"
                  key={item.title}
                  data-reveal style={{ '--reveal-delay': `${(i % 4) * 55}ms` }}
                >
                  <span className="catalog-card__media">
                    {item.image ? (
                      <img src={item.image} alt={item.title} loading="lazy" />
                    ) : (
                      <span className="catalog-card__media-placeholder" aria-hidden="true" />
                    )}
                  </span>
                  <span className="catalog-card__body">
                    <span className="catalog-card__title">{item.title}</span>
                    {item.description && <span className="catalog-card__desc">{item.description}</span>}
                  </span>
                </AppLink>
              ))}
            </div>
          ) : (
            <p className="category-empty">No products found in this collection.</p>
          )}
        </div>
      </section>
    </>
  )
}
