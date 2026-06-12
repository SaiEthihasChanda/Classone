const icon = (d, opts = {}) => (props) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill={opts.fill ? 'currentColor' : 'none'}
    stroke={opts.fill ? 'none' : 'currentColor'}
    strokeWidth={opts.sw ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
)

export const ChevronDown  = icon('m6 9 6 6 6-6')
export const ChevronRight = icon('m9 18 6-6-6-6')
export const ChevronLeft  = icon('m15 18-6-6 6-6')
export const Search       = icon(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>)
export const Mail         = icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>)
export const MapPin       = icon(<><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></>)
export const Phone        = icon('M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.8 19.8 0 0 1 1.6 3.38a2 2 0 0 1 1.99-2.2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.01 6.01l1.85-1.85a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.9Z')
export const ArrowRight   = icon('M5 12h14m-7-7 7 7-7 7')
export const ArrowUpRight = icon('M7 17 17 7M7 7h10v10')
export const X            = icon('M18 6 6 18M6 6l12 12')
export const Menu         = icon(<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)
export const Download     = icon('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3')
export const ExternalLink = icon(<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>)
export const CheckCircle  = icon(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>)
export const Star         = icon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z', { fill: true })
export const Zap          = icon('M13 2 4 14h6l-1 8 9-12h-6l1-8Z', { fill: true })
export const Atom         = icon(<><circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9C11.16 3.76 5.84 1.74 3.8 3.8c-2.04 2.04-.02 7.37 4.5 11.91 4.54 4.52 9.87 6.54 11.9 4.49Z" /><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.91-2.03-2.03-7.36-.01-11.9 4.5C3.79 12.84 1.77 18.16 3.8 20.2c2.04 2.04 7.37.02 11.9-4.5Z" /></>)
export const Layers       = icon(<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>)

// Application-area icons
export const Droplet   = icon('M12 2.7 6.3 9.1a8 8 0 1 0 11.4 0L12 2.7Z')
export const Activity  = icon('M22 12h-4l-3 9L9 3l-3 9H2')
export const Shield    = icon('M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z')
export const Wave      = icon('M2 12c2.5-4 5-4 7.5 0S15 16 17.5 12 22 8 22 12')
export const Dna       = icon(<><path d="M4 3c0 5 16 5 16 10S4 18 4 23" /><path d="M20 3c0 5-16 5-16 10s16 5 16 10" /><path d="M7 5h10M8.5 8h7M8.5 16h7M7 19h10" /></>)
export const FlaskIcon = icon('M9 3h6M10 3v6L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-10V3M7.5 14h9')

// Brand / social
export const Whatsapp = ({ ...p }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.21.85 5.75 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.05 8.05 0 0 1-1.24-4.3c0-4.47 3.64-8.11 8.11-8.11Zm-2.6 4.36c-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.19s.94 2.54 1.07 2.72c.13.18 1.85 2.83 4.49 3.96.63.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.55-.63 1.77-1.25.22-.61.22-1.14.15-1.25-.07-.11-.24-.18-.5-.31-.26-.13-1.55-.77-1.79-.85-.24-.09-.41-.13-.59.13-.18.26-.68.85-.83 1.03-.15.18-.31.2-.57.07-.26-.13-1.1-.41-2.1-1.3-.78-.69-1.3-1.55-1.45-1.81-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.18-.26.26-.44.09-.18.04-.33-.02-.46-.07-.13-.57-1.42-.81-1.94-.2-.46-.4-.4-.55-.4l-.48-.02Z" />
  </svg>
)
export const Facebook = ({ ...p }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.3c0-.84.26-1.42 1.47-1.42h1.43V5.3A21 21 0 0 0 14.6 5.2c-2.07 0-3.49 1.26-3.49 3.58v2.32H8.7V14h2.41v7h2.39Z" />
  </svg>
)
export const Twitter = ({ ...p }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M22 5.8c-.7.32-1.46.53-2.25.63a3.95 3.95 0 0 0 1.72-2.17c-.76.45-1.6.78-2.5.95a3.93 3.93 0 0 0-6.7 3.59A11.15 11.15 0 0 1 4.1 4.6a3.93 3.93 0 0 0 1.22 5.25c-.63-.02-1.23-.2-1.75-.48v.05a3.94 3.94 0 0 0 3.16 3.86c-.58.16-1.2.18-1.78.07a3.94 3.94 0 0 0 3.68 2.73A7.9 7.9 0 0 1 2 17.7a11.13 11.13 0 0 0 6.03 1.77c7.24 0 11.2-6 11.2-11.2v-.51A8 8 0 0 0 22 5.8Z" />
  </svg>
)
export const Youtube = ({ ...p }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
  </svg>
)
export const Chat = ({ ...p }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2Zm3 6h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Z" />
  </svg>
)
