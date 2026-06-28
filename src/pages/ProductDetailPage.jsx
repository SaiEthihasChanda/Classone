import DOMPurify from 'dompurify'
import { useProductBySlug } from '../lib/store'
import { AppLink } from '../components/common/AppLink'
import { ImageGallery } from '../components/common/ImageGallery'
import { adjustStyle, findAdjust, aspectStyle } from '../lib/imageAdjust'

export function ProductDetailPage({ slug, onNavigate }) {
  const { data, status } = useProductBySlug(slug)

  if (status === 'loading') {
    return (
      <section className="section">
        <div className="container"><div className="skeleton-card" style={{ minHeight: 360 }} /></div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="section">
        <div className="container">
          <h1>Product not found</h1>
          <AppLink href="/product" onNavigate={onNavigate} className="btn btn--primary btn--md" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            View All Products
          </AppLink>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="product-detail">
        <div className="container product-detail__inner">
          <div className="product-detail__media">
            <ImageGallery images={data.images || []} title={data.title} adjust={data.imageAdjust} ratio={data.imageRatio} />
          </div>
          <div className="product-detail__info">
            <p className="product-detail__eyebrow">PRODUCT</p>
            <h1 className="product-detail__title">{data.title}</h1>
            {data.shortHtml && (
              <div className="product-detail__short product-prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.shortHtml) }} />
            )}
            <div className="product-detail__actions">
              <AppLink href="/enquiry" onNavigate={onNavigate} className="btn btn--primary btn--md">
                Enquiry Now
              </AppLink>
              <AppLink href="/product" onNavigate={onNavigate} className="btn btn--outline btn--md">
                View All Products
              </AppLink>
            </div>
          </div>
        </div>
      </section>

      {data.descHtml && (
        <section className="section product-desc-section">
          <div className="container">
            <h2 className="product-desc-section__title">Description &amp; Specification</h2>
            <div className="product-prose product-prose--desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.descHtml) }} />
          </div>
        </section>
      )}

      {data.displayImages && data.displayImages.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="product-desc-section__title">Product Display</h2>
            <div className="product-display-grid">
              {data.displayImages.map((src, i) => (
                <div key={src} className="product-display-grid__item" style={aspectStyle(data.imageRatio)}>
                  <img src={src} alt={`${data.title} display ${i + 1}`} loading="lazy"
                    style={adjustStyle(findAdjust(data.imageAdjust, src))} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
