import { useCollection } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { MediaFrame } from '../components/ui/MediaFrame'

export function ProductsPage({ onNavigate }) {
  const { data: products, loading } = useCollection('products')

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="page-banner__eyebrow">Our Catalog</p>
          <h1 className="page-banner__title">Products</h1>
          <p className="page-banner__summary">Browse our electrochemical instruments, modules, accessories, and research solutions.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="grid-skeleton product-grid product-grid--4" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => <div className="skeleton-card" key={i} />)}
            </div>
          ) : (
            <div className="product-grid product-grid--4">
              {products.map((item, i) => (
                <AppLink href={`/product/${item.slug}`} onNavigate={onNavigate} className="pcard" key={item.slug} data-reveal style={{ '--reveal-delay': `${(i % 4) * 55}ms` }}>
                  <MediaFrame src={item.images?.[0]} alt={item.title} aspect="square" className="pcard__media" />
                  <div className="pcard__body">
                    {item.category && <p className="pcard__category">{item.category}</p>}
                    <h3 className="pcard__title">{item.title}</h3>
                  </div>
                </AppLink>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
