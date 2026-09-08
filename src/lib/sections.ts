import type { Profile, SectionKey } from '../types'

export function visibleSections(profile: Profile): SectionKey[] {
  return profile.meta.sectionOrder.filter((s) => !profile.meta.hiddenSections.includes(s))
}

const SIDEBAR_GROUP: SectionKey[] = ['skills', 'education', 'certifications']
const MAIN_GROUP: SectionKey[] = ['summary', 'experience', 'projects']

export function splitForSidebarLayout(profile: Profile): { sidebar: SectionKey[]; main: SectionKey[] } {
  const visible = visibleSections(profile)
  return {
    sidebar: visible.filter((s) => SIDEBAR_GROUP.includes(s)),
    main: visible.filter((s) => MAIN_GROUP.includes(s)),
  }
}
