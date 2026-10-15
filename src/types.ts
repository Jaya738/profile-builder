export type LinkIconKey = 'website' | 'link' | 'mail' | 'phone' | 'location'

export type ProfileLink = {
  label: string
  url: string
  icon: LinkIconKey
}

export type ContactInfo = {
  email?: string
  phone?: string
  location?: string
}

export type ExperienceItem = {
  id: string
  company: string
  role: string
  location?: string
  startDate: string
  endDate?: string
  bullets: string[]
}

export type EducationItem = {
  id: string
  school: string
  degree: string
  location?: string
  startDate: string
  endDate?: string
  details?: string[]
}

export type SkillGroup = {
  id: string
  label: string
  items: string[]
}

export type ProjectItem = {
  id: string
  name: string
  description: string
  link?: string
  tags?: string[]
}

export type CertificationItem = {
  id: string
  name: string
  issuer: string
  date?: string
}

export type SectionKey = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications'

export type TemplateId = 'sidebar' | 'timeline'

export type PageSizeId = 'A4' | 'Letter'

export type ThemeConfig = {
  accent: string
  fontPairId: string
  pageSize: PageSizeId
}

export type ProfileMeta = {
  profileName: string
  role: 'developer' | 'dataEngineer' | 'other'
  template: TemplateId
  sectionOrder: SectionKey[]
  hiddenSections: SectionKey[]
  theme: ThemeConfig
}

export type Profile = {
  id: string
  meta: ProfileMeta
  personal: {
    fullName: string
    title: string
    contact: ContactInfo
    links: ProfileLink[]
  }
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillGroup[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'experience',
  'projects',
  'education',
  'skills',
  'certifications',
]
