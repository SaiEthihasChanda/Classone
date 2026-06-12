/**
 * SectionHeading — eyebrow + title + optional summary.
 * align: 'left' | 'center'
 */
export function SectionHeading({ eyebrow, title, summary, align = 'left', as: Tag = 'h2', className = '' }) {
  return (
    <div className={`sh sh--${align} ${className}`.trim()}>
      {eyebrow && <p className="sh__eyebrow">{eyebrow}</p>}
      <Tag className="sh__title">{title}</Tag>
      {summary && <p className="sh__summary">{summary}</p>}
    </div>
  )
}
