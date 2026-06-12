import { useCollection } from '../lib/store'

export function NewsPage() {
  const { data: posts } = useCollection('posts')

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="page-banner__eyebrow">News & Updates</p>
          <h1 className="page-banner__title">Blog</h1>
          <p className="page-banner__summary">Product announcements, application stories and updates from Class One Systems.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.map(post => (
            <article className="blog-card blog-card--standalone" key={post.slug}>
              {post.eyebrow && <p className="blog-card__eyebrow">{post.eyebrow}</p>}
              <h3 className="blog-card__title">{post.title}</h3>
              <p>{post.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
