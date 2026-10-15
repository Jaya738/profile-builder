import type { ComponentType } from 'react'
import type { Profile, TemplateId } from '../../types'
import TemplateSidebar from './TemplateSidebar'
import TemplateTimeline from './TemplateTimeline'

export const TEMPLATES: Record<TemplateId, { label: string; component: ComponentType<{ profile: Profile }> }> = {
  sidebar: { label: 'Sidebar', component: TemplateSidebar },
  timeline: { label: 'Timeline', component: TemplateTimeline },
}
