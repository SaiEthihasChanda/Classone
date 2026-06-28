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
export const ChevronUp    = icon('m18 15-6-6-6 6')
export const Trash        = icon(<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>)
export const Plus         = icon('M12 5v14M5 12h14')
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

// Admin / account
export const User      = icon(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>)
export const Lock      = icon(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>)
export const LogOut    = icon(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>)
export const Grid      = icon(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>)
export const Box       = icon(<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>)
export const ImageIcon = icon(<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>)
export const FileText  = icon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>)

// Rich-text editor toolbar
export const Bold      = icon('M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z', { sw: 2 })
export const Italic    = icon(<><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></>)
export const Underline = icon(<><path d="M6 3v7a6 6 0 0 0 12 0V3" /><line x1="4" y1="21" x2="20" y2="21" /></>)
export const ListUl    = icon(<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" /><circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" /></>)
export const ListOl    = icon(<><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4M4 10h2" /><path d="M4 14h2v2H4v2h2" /></>)
export const H2        = ({ ...p }) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><path d="M4 6v12M4 12h7M11 6v12" /><path d="M15 16c0-2 4-2 4-4.5C19 10 18 9 16.5 9S14 10 14 11" /><path d="M15 18h4" /></svg>)
export const H3        = ({ ...p }) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><path d="M4 6v12M4 12h7M11 6v12" /><path d="M14 9c0-1 1-1.5 2.5-1.5S19 8.5 19 10s-1.5 1.8-2.5 1.8M16.5 11.8c1.2 0 2.5.5 2.5 2s-1 2.2-2.5 2.2S14 16.5 14 15.5" /></svg>)
export const LinkIcon  = icon(<><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>)
export const Eraser    = icon(<><path d="M20 20H7l-4-4a2 2 0 0 1 0-3l8-8a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-7 7" /><line x1="18" y1="12.5" x2="9.5" y2="4" /></>)

// Brand / social
export const Gmail = ({ ...p }) => (
  <svg viewBox="0 0 256 193" width="1em" height="1em" aria-hidden="true" {...p}>
    <path fill="#4285F4" d="M58.182 192.05V93.14L27.507 65.077 0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"/>
    <path fill="#34A853" d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837-27.026 25.798z"/>
    <path fill="#EA4335" d="M58.182 93.14l-4.174-38.647 4.174-36.989L128 69.868l69.818-52.364 4.669 34.992-4.669 40.644L128 145.504z"/>
    <path fill="#FBBC04" d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"/>
    <path fill="#EA4335" d="M0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"/>
  </svg>
)
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
export const Share2       = icon(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>)
export const Calendar     = icon(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>)
export const Tag          = icon(<><path d="M12 2H2v10l10 10 10-10L12 2Z" /><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" /></>)
export const Copy         = icon(<><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>)
export const ArrowLeft    = icon('M19 12H5m7-7-7 7 7 7')
export const Newspaper    = icon(<><path d="M4 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><line x1="6" y1="8" x2="16" y2="8" /><line x1="6" y1="12" x2="10" y2="12" /><line x1="6" y1="16" x2="10" y2="16" /><rect x="12" y="12" width="4" height="4" /></>)
export const RotateCcw    = icon(<><path d="M3 2v6h6" /><path d="M3.51 14a9 9 0 1 0 .49-5L3 8" /></>)
export const Key          = icon(<><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.5 12.5 8-8" /><path d="m16 6 2 2" /><path d="m18.5 3.5 2 2" /></>)
export const UserPlus     = icon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></>)
export const ShieldCheck  = icon(<><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></>)
export const AlertTriangle= icon(<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>)
export const ArchiveBox   = icon(<><rect x="2" y="4" width="20" height="5" rx="1" /><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" /><line x1="10" y1="13" x2="14" y2="13" /></>)
export const Filter       = icon('M22 3H2l8 9.46V19l4 2v-8.54L22 3z')
export const ZoomIn       = icon(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></>)
export const ZoomOut      = icon(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /><line x1="8" y1="11" x2="14" y2="11" /></>)
export const Move         = icon(<><polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" /><polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" /></>)
export const MessageSquare= icon('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z')
export const Users        = icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>)
export const Megaphone    = icon(<><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>)
export const Sliders      = icon(<><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></>)
export const Settings     = icon(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>)

export const Chat = ({ ...p }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2Zm3 6h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Z" />
  </svg>
)

// ─── Developer / MYOS icons ─────────────────────────────────
export const Code2     = icon(<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>)
export const Braces    = icon(<><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" /><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" /></>)
export const Terminal  = icon(<><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>)
export const Cpu       = icon(<><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></>)
export const Smartphone= icon(<><rect x="5" y="2" width="14" height="20" rx="2.5" /><line x1="12" y1="18" x2="12.01" y2="18" /></>)
export const BookOpen  = icon(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>)
export const ArrowDown = icon('M12 5v14m-7-7 7 7 7-7')
export const Puzzle    = icon('M19.4 13a1.7 1.7 0 0 0 0 3.4h.6v2.6a2 2 0 0 1-2 2h-2.6v-.6a1.7 1.7 0 1 0-3.4 0v.6H9.4a2 2 0 0 1-2-2v-2.6H8a1.7 1.7 0 1 0 0-3.4h-.6V9.4a2 2 0 0 1 2-2H12v-.6a1.7 1.7 0 1 1 3.4 0V7H18a2 2 0 0 1 2 2v2.6h-.6Z')
export const Rocket    = icon(<><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0Z" /><path d="M12 15 9 12a14 14 0 0 1 3-7 8 8 0 0 1 7-3 8 8 0 0 1-3 7 14 14 0 0 1-4 2.5" /><path d="M9 12H4s.5-2.8 2-4a3 3 0 0 1 3-.5" /><path d="M12 15v5s2.8-.5 4-2a3 3 0 0 0 .5-3" /></>)
export const EyeOff     = icon(<><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><path d="M9.9 4.24 1 1m22 22-5.06-5.06M6.61 6.61A18.5 18.5 0 0 0 2 12s3 8 10 8a9.12 9.12 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></>)
export const MoveTo      = icon(<><path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v3" /><path d="M3 12h12" /><path d="m11 8 4 4-4 4" /><path d="M21 12v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" /></>)
export const CheckSquare = icon(<><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>)
export const Github     = ({ ...p }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.52.1.71-.23.71-.5v-1.74c-2.92.64-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.1-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.07a10 10 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.45.21 2.52.1 2.79.68.74 1.08 1.67 1.08 2.82 0 4.02-2.45 4.9-4.79 5.16.38.33.71.97.71 1.96v2.9c0 .28.19.61.72.5A10.5 10.5 0 0 0 12 1.5Z" />
  </svg>
)
