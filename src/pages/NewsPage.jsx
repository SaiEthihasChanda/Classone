import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { Search, Share2, Calendar, MapPin, Tag, X, Newspaper } from '../components/ui/Icons'
import { adjustStyle, findAdjust } from '../lib/imageAdjust'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function slugToUrl(slug) {
  return `${window.location.origin}/news/${slug}`
}

async function sharePost(post) {
  const url = slugToUrl(post.slug)
  if (navigator.share) {
    try {
      await navigator.share({ title: post.title, text: post.shortDesc, url })
      return
    } catch { /* cancelled or unsupported */ }
  }
  await navigator.clipboard.writeText(url)
  return 'copied'
}

function ShareButton({ post }) {
  const [state, setState] = useState(null) // null | 'copied'
  const timer = useRef(null)

  async function handleShare(e) {
    e.preventDefault(); e.stopPropagation()
    const result = await sharePost(post)
    if (result === 'copied') {
      setState('copied')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setState(null), 2000)
    }
  }

  return (
    <button
      className={`news-card__share ${state === 'copied' ? 'is-copied' : ''}`.trim()}
      onClick={handleShare}
      aria-label="Share this post"
      title={state === 'copied' ? 'Link copied!' : 'Share'}
    >
      {state === 'copied' ? <span className="news-card__share-text">Copied!</span> : <Share2 />}
    </button>
  )
}

function NewsCard({ post, onNavigate }) {
  const hasImages = post.images?.length > 0

  function handleClick(e) {
    e.preventDefault()
    onNavigate?.(`/news/${post.slug}`)
  }

  return (
    <article className="news-card" data-reveal>
      <a href={`/news/${post.slug}`} className="news-card__inner" onClick={handleClick}>
        <div className="news-card__media">
          {hasImages ? (
            <img src={post.images[0]} alt={post.title} loading="lazy"
              style={adjustStyle(findAdjust(post.imageAdjust, post.images[0]))} />
          ) : (
            <div className="news-card__media-empty"><Newspaper /></div>
          )}
          {post.images?.length > 1 && (
            <span className="news-card__imgcount">+{post.images.length - 1}</span>
          )}
        </div>

        <div className="news-card__body">
          <div className="news-card__meta">
            <span className="news-card__date"><Calendar />{formatDate(post.date)}</span>
            {post.location && (
              <span className="news-card__loc"><MapPin />{post.location}</span>
            )}
          </div>

          <h3 className="news-card__title">{post.title}</h3>
          {post.shortDesc && <p className="news-card__desc">{post.shortDesc}</p>}
        </div>
      </a>
      <ShareButton post={post} />
    </article>
  )
}

function EmptyState({ query }) {
  return (
    <div className="news-empty">
      <span className="news-empty__icon"><Newspaper /></span>
      <h3>{query ? 'No results found' : 'No news yet'}</h3>
      <p>
        {query
          ? `No posts match "${query}". Try different keywords or tags.`
          : 'Check back soon for updates, announcements, and insights.'}
      </p>
    </div>
  )
}

export function NewsPage({ onNavigate }) {
  const [posts, setPosts] = useState(null)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    let alive = true
    api.listNewsPosts()
      .then(d => alive && setPosts(d.filter(p => p.published !== false)))
      .catch(() => alive && setPosts([]))
    return () => { alive = false }
  }, [])

  const filtered = (posts || []).filter(p => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      p.shortDesc?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    )
  })

  return (
    <div className="news-page">
      {/* Header band */}
      <div className="news-header">
        <div className="container news-header__inner">
          <div className="news-header__text">
            <p className="news-header__eyebrow">Latest Updates</p>
            <h1 className="news-header__title">News &amp; Announcements</h1>
            <p className="news-header__sub">
              Research milestones, product launches, events and insights from ClassOne Systems.
            </p>
          </div>

          <div className="news-search">
            <span className="news-search__icon"><Search /></span>
            <input
              ref={inputRef}
              className="news-search__input"
              type="search"
              placeholder="Search by keyword, tag or location…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search news"
            />
            {query && (
              <button className="news-search__clear" onClick={() => { setQuery(''); inputRef.current?.focus() }} aria-label="Clear search">
                <X />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="container news-feed-wrap">
        {posts === null ? (
          <div className="news-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="news-skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <>
            {query && (
              <p className="news-results-count">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </p>
            )}
            <div className="news-feed">
              {filtered.map(post => (
                <NewsCard key={post.id} post={post} onNavigate={onNavigate} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
