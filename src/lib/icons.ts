import { Globe, ExternalLink, Mail, Phone, MapPin } from 'lucide-react'
import type { LinkIconKey } from '../types'

export const LINK_ICONS: Record<LinkIconKey, typeof Globe> = {
  website: Globe,
  link: ExternalLink,
  mail: Mail,
  phone: Phone,
  location: MapPin,
}
