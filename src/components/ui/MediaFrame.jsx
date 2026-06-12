/**
 * MediaFrame — reliable image container with aspect-ratio support.
 * Falls back to a branded placeholder when src is absent or fails.
 *
 * aspect: 'square' | 'wide' | 'video' | 'portrait' | 'auto'
 */
export function MediaFrame({ src, alt = '', aspect = 'square', className = '', eager = false, style }) {
  return (
    <div className={`media-frame media-frame--${aspect} ${className}`.trim()} style={style}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="media-frame__placeholder" aria-hidden="true">
          <span className="media-frame__placeholder-mark" />
        </div>
      )}
    </div>
  )
}
