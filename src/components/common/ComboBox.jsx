import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from '../ui/Icons'

/**
 * Editable combobox: pick from existing options or type a brand-new value.
 * - Typing filters the option list (case-insensitive) and is itself a valid value.
 * - `upper` forces the typed text to uppercase (used for attribute values).
 */
export function ComboBox({ value = '', onChange, options = [], placeholder, upper = false, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const set = (v) => onChange(upper ? v.toUpperCase() : v)
  const q = (value || '').toLowerCase()
  const matches = options.filter(o => o && o.toLowerCase() !== q && o.toLowerCase().includes(q)).slice(0, 10)

  return (
    <div className={`combobox ${open ? 'is-open' : ''}`.trim()} ref={ref}>
      <input
        className="combobox__input"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => { set(e.target.value); if (!open) setOpen(true) }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      <button type="button" className="combobox__caret" tabIndex={-1} disabled={disabled}
        onClick={() => setOpen(o => !o)} aria-label="Toggle options">
        <ChevronDown />
      </button>
      {open && matches.length > 0 && (
        <div className="combobox__list" role="listbox">
          {matches.map(o => (
            <button type="button" key={o} className="combobox__opt" role="option"
              onClick={() => { onChange(o); setOpen(false) }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
