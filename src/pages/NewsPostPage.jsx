import DOMPurify from 'dompurify'
import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { ArrowLeft, Calendar, MapPin, Share2, ChevronLeft, ChevronRight, Newspaper } from '../components/ui/Icons'
import { adjustStyle, findAdjust, aspectStyle } from '../lib/imageAdjust'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function ImageGallery({ images, imageAdjust, imageRatio }) {
  const [idx, setIdx] = useState(0)
  if (!images?.length) return null

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  return (
    <div className="np-gallery">
      <div className="np-gallery__main" style={aspectStyle(imageRatio)}>
        <img src={images[idx]} alt={`Image ${idx + 1}`} className="np-gallery__img"
          style={adjustStyle(findAdjust(imageAdjust, images[idx]))} />
        {images.length > 1 && (
          <>
            <button className="np-gallery__nav np-gallery__nav--prev" onClick={prev} aria-label="Previous image">
              <ChevronLeft />
            </button>
            <button className="np-gallery__nav np-gallery__nav--next" onClick={next} aria-label="Next image">
              <ChevronRight />
            </button>
            <span className="np-gallery__counter">{idx + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="np-gallery__thumbs">
          {images.map((url, i) => (
            <button
              key={i}
              className={`np-gallery__thumb ${i === idx ? 'is-active' : ''}`.trim()}
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ShareButton({ post }) {
  const [state, setState] = useState(null)
  const timer = useRef(null)

  async function handleShare() {
    const url = `${window.location.origin}/news/${post.slug}`
    if (navigator.share) {
      try { await navigator.share({ title: post.title, text: post.shortDesc, url }); return } catch {}
    }
    await navigator.clipboard.writeText(url)
    setState('copied')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState(null), 2500)
  }

  return (
    <button className={`np-share ${state === 'copied' ? 'is-copied' : ''}`.trim()} onClick={handleShare}>
      <Share2 />
      {state === 'copied' ? 'Link copied!' : 'Share'}
    </button>
  )
}

export function NewsPostPage({ slug, onNavigate }) {
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'notfound'

  useEffect(() => {
    if (!slug) { setStatus('notfound'); return }
    let alive = true
    setStatus('loading'); setPost(null)
    api.getNewsPostBySlug(slug)
      .then(d => { if (alive) { setPost(d); setStatus('ready') } })
      .catch(() => { if (alive) setStatus('notfound') })
    return () => { alive = false }
  }, [slug])

  function goBack(e) {
    e.preventDefault()
    onNavigate?.('/news')
  }

  if (status === 'loading') {
    return (
      <div className="np-wrap">
        <div className="container np-container">
          <div className="np-loading">
            <div className="np-loading__img" />
            <div className="np-loading__line" style={{ width: '60%' }} />
            <div className="np-loading__line" style={{ width: '40%' }} />
            <div className="np-loading__line" style={{ width: '80%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (status === 'notfound') {
    return (
      <div className="np-wrap">
        <div className="container np-container">
          <div className="news-empty">
            <span className="news-empty__icon"><Newspaper /></span>
            <h3>Post not found</h3>
            <p>This news post doesn&apos;t exist or may have been removed.</p>
            <a href="/news" className="btn btn--primary btn--md" onClick={goBack}><ArrowLeft /> Back to News</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="np-wrap">
      <div className="container np-container">
        {/* Back nav */}
        <a href="/news" className="np-back" onClick={goBack}>
          <ArrowLeft /> Back to News
        </a>

        <article className="np-article">
          {/* Gallery */}
          {post.images?.length > 0 && <ImageGallery images={post.images} imageAdjust={post.imageAdjust} imageRatio={post.imageRatio} />}

          {/* Content */}
          <div className="np-content">
            {/* Meta row */}
            <div className="np-meta">
              <span className="np-meta__date"><Calendar />{formatDate(post.date)}</span>
              {post.location && <span className="np-meta__loc"><MapPin />{post.location}</span>}
            </div>

            <h1 className="np-title">{post.title}</h1>

            {post.shortDesc && (
              <p className="np-short">{post.shortDesc}</p>
            )}

            {post.longDesc && (
              <div className="np-long prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.longDesc) }} />
            )}

            {/* Footer actions */}
            <div className="np-footer">
              <ShareButton post={post} />
              <a href="/news" className="btn btn--ghost btn--md" onClick={goBack}>
                <ArrowLeft /> All posts
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
