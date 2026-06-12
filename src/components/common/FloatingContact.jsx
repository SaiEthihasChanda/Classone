import { useSettings } from '../../lib/store'
import { Chat } from '../ui/Icons'
import { AppLink } from './AppLink'

export function FloatingContact({ onNavigate }) {
  const contact = useSettings().contact || {}
  return (
    <div className="float-contact" aria-label="Contact shortcuts">
      <AppLink href="/contact" onNavigate={onNavigate} className="float-contact__pill">
        Contact us
      </AppLink>
      <a className="float-contact__bubble" href={contact.whatsappHref} target="_blank" rel="noreferrer noopener" aria-label="Open WhatsApp chat">
        <Chat />
      </a>
    </div>
  )
}
