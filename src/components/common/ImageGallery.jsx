import { useState } from 'react'
import { ChevronLeft, ChevronRight } from '../ui/Icons'

/** Product image gallery with thumbnail strip. */
export function ImageGallery({ images = [], title = '' }) {
  const [active, setActive] = useState(0)

  if (!images.length) return (
    <div className="img-gallery img-gallery--empty">
      <div className="img-gallery__placeholder" aria-hidden="true" />
    </div>
  )

  return (
    <div className="img-gallery">
      <div className="img-gallery__main">
        <img src={images[active]} alt={`${title} — image ${active + 1}`} loading="eager" />
        {images.length > 1 && <>
          <button className="img-gallery__arrow img-gallery__arrow--prev" onClick={() => setActive(i => (i - 1 + images.length) % images.length)} aria-label="Previous image">
            <ChevronLeft />
          </button>
          <button className="img-gallery__arrow img-gallery__arrow--next" onClick={() => setActive(i => (i + 1) % images.length)} aria-label="Next image">
            <ChevronRight />
          </button>
        </>}
      </div>
      {images.length > 1 && (
        <div className="img-gallery__thumbs" role="listbox" aria-label="Image thumbnails">
          {images.map((src, i) => (
            <button
              key={src}
              role="option"
              aria-selected={i === active}
              className={`img-gallery__thumb ${i === active ? 'is-active' : ''}`.trim()}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Auto-cycling gallery for application pages. */
export function AutoGallery({ images = [] }) {
  const [idx, setIdx] = useState(0)
  const count = images.length

  if (count < 2) return (
    <div className="auto-gallery">
      {images[0] && <img src={images[0].src} alt={images[0].alt || ''} loading="lazy" />}
    </div>
  )

  return (
    <div className="auto-gallery">
      <button className="auto-gallery__arrow auto-gallery__arrow--prev" onClick={() => setIdx(i => (i - 1 + count) % count)} aria-label="Previous">
        <ChevronLeft />
      </button>
      <div className="auto-gallery__frame">
        <img src={images[idx].src} alt={images[idx].alt || ''} loading="lazy" key={idx} />
      </div>
      <button className="auto-gallery__arrow auto-gallery__arrow--next" onClick={() => setIdx(i => (i + 1) % count)} aria-label="Next">
        <ChevronRight />
      </button>
      <div className="auto-gallery__dots">
        {images.map((_, i) => (
          <button key={i} className={i === idx ? 'is-active' : ''} onClick={() => setIdx(i)} aria-label={`Image ${i + 1}`} />
        ))}
      </div>
    </div>
  )
}
