/**
 * SectionHeading — editorial heading with an optional section index and a
 * mono technical kicker. align: 'left' | 'center'
 */
export function SectionHeading({ index, eyebrow, title, summary, align = 'left', as: Tag = 'h2', className = '' }) {
  return (
    <div className={`sh sh--${align} ${className}`.trim()}>
      {(eyebrow || index) && (
        <p className="sh__kicker">
          {index && <span className="sh__index">{index}</span>}
          {eyebrow && <span className="sh__eyebrow">{eyebrow}</span>}
        </p>
      )}
      <Tag className="sh__title">{title}</Tag>
      {summary && <p className="sh__summary">{summary}</p>}
    </div>
  )
}
