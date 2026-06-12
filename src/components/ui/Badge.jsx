/** Small label chip — variant: 'brand' | 'gray' | 'navy' | 'success' */
export function Badge({ variant = 'brand', children, className = '' }) {
  return <span className={`badge badge--${variant} ${className}`.trim()}>{children}</span>
}
