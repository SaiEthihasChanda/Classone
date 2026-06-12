import { MediaFrame } from '../ui/MediaFrame'
import { AppLink } from './AppLink'

/** Standard product card used across catalog, category, and home grids. */
export function ProductCard({ href, image, title, category, description, external, onNavigate, compact = false, className = '' }) {
  return (
    <AppLink
      href={href}
      onNavigate={onNavigate}
      external={external}
      className={`pcard ${compact ? 'pcard--compact' : ''} ${className}`.trim()}
    >
      <MediaFrame src={image} alt={title} aspect="square" className="pcard__media" />
      <div className="pcard__body">
        {category && <span className="pcard__category">{category}</span>}
        <h3 className="pcard__title">{title}</h3>
        {description && <p className="pcard__desc">{description}</p>}
      </div>
    </AppLink>
  )
}
