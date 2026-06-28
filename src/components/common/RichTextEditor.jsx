import { useEffect, useRef } from 'react'
import { Bold, Italic, Underline, ListUl, ListOl, H2 as H2Icon, H3 as H3Icon, LinkIcon, Eraser } from '../ui/Icons'

/**
 * Minimal no-code rich-text editor. Admins format text visually (bold, lists,
 * headings, links) with a toolbar; the component emits HTML, so the stored
 * value stays compatible with the public pages that render it. No external
 * dependency — uses the browser's built-in editing commands.
 */
export function RichTextEditor({ value, onChange, placeholder, minHeight = 120 }) {
  const ref = useRef(null)

  // Seed the editable area once on mount (the editor owns its content after).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) ref.current.innerHTML = value || ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const emit = () => onChange(ref.current?.innerHTML || '')
  const exec = (cmd, arg) => {
    ref.current?.focus()
    document.execCommand(cmd, false, arg)
    emit()
  }
  const heading = (tag) => {
    // Toggle a block format (h2/h3/p).
    const block = document.queryCommandValue('formatBlock')
    exec('formatBlock', block?.toLowerCase() === tag ? 'p' : tag)
  }
  const addLink = () => {
    const url = window.prompt('Link URL (https://…)')
    if (url) exec('createLink', url)
  }

  const tools = [
    { icon: Bold, title: 'Bold', on: () => exec('bold') },
    { icon: Italic, title: 'Italic', on: () => exec('italic') },
    { icon: Underline, title: 'Underline', on: () => exec('underline') },
    { icon: H2Icon, title: 'Heading', on: () => heading('h2') },
    { icon: H3Icon, title: 'Subheading', on: () => heading('h3') },
    { icon: ListUl, title: 'Bulleted list', on: () => exec('insertUnorderedList') },
    { icon: ListOl, title: 'Numbered list', on: () => exec('insertOrderedList') },
    { icon: LinkIcon, title: 'Add link', on: addLink },
    { icon: Eraser, title: 'Clear formatting', on: () => exec('removeFormat') },
  ]

  return (
    <div className="rte">
      <div className="rte__toolbar">
        {tools.map((t, i) => (
          <button key={i} type="button" className="rte__btn" title={t.title}
            onMouseDown={(e) => { e.preventDefault(); t.on() }}>
            <t.icon />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        className="rte__area"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder || 'Type here…'}
        style={{ minHeight }}
        onInput={emit}
        onBlur={emit}
      />
    </div>
  )
}
