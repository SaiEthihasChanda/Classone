import { isExternal } from '../../utils'

/**
 * Router-aware anchor.
 * - Internal hrefs → calls onNavigate (SPA navigation)
 * - External hrefs  → standard <a target="_blank" rel="noreferrer">
 * - external prop   → force external treatment regardless of href form
 */
export function AppLink({ href = '/', onNavigate, children, className = '', onClick, external = false, ...rest }) {
  const ext = external || isExternal(href)

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || ext) return
    e.preventDefault()
    onNavigate?.(href)
  }

  return (
    <a
      href={href}
      className={className || undefined}
      onClick={handleClick}
      {...(ext ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
