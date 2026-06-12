/**
 * Button — the core interactive element.
 *
 * variant: 'primary' | 'secondary' | 'ghost' | 'outline'
 * size:    'sm' | 'md' | 'lg'
 * as:      override element (e.g. 'a')
 */
export function Button({ variant = 'primary', size = 'md', as: Tag = 'button', className = '', children, ...rest }) {
  return (
    <Tag
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      {...(Tag === 'button' ? { type: rest.type ?? 'button' } : {})}
      {...rest}
    >
      {children}
    </Tag>
  )
}
