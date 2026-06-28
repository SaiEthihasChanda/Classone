import { useState } from 'react'
import { X, Plus } from '../ui/Icons'

/**
 * Chip-based tag editor. Type a tag and press Enter (or comma) to add it;
 * click the × on a chip to remove it. An optional "Auto-generate" button
 * calls the supplied generator and merges its suggestions in (deduped).
 *
 * Tags are normalised to lowercase, single-spaced — keeping the search index
 * predictable wherever these tags are later matched.
 */
export function TagInput({ tags = [], onChange, autoGenerate, placeholder }) {
  const [input, setInput] = useState('')

  const norm = (raw) => raw.trim().toLowerCase().replace(/\s+/g, ' ')

  const addOne = (raw) => {
    const t = norm(raw)
    if (!t || tags.includes(t)) return
    onChange([...tags, t])
  }

  const addMany = (arr) => {
    const next = [...tags]
    for (const raw of arr) {
      const t = norm(raw)
      if (t && !next.includes(t)) next.push(t)
    }
    onChange(next)
  }

  const remove = (i) => onChange(tags.filter((_, idx) => idx !== i))

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addOne(input); setInput('')
    } else if (e.key === 'Backspace' && !input && tags.length) {
      remove(tags.length - 1)
    }
  }

  return (
    <div className="taginput">
      <div className="taginput__field">
        {tags.map((t, i) => (
          <span key={t} className="taginput__chip">
            {t}
            <button type="button" onClick={() => remove(i)} aria-label={`Remove tag ${t}`}><X /></button>
          </span>
        ))}
        <input
          className="taginput__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => { if (input.trim()) { addOne(input); setInput('') } }}
          placeholder={tags.length ? 'Add another…' : (placeholder || 'Type a tag and press Enter')}
        />
      </div>
      {autoGenerate && (
        <button type="button" className="taginput__auto" onClick={() => addMany(autoGenerate())}>
          <Plus /> Auto-generate from product details
        </button>
      )}
    </div>
  )
}
