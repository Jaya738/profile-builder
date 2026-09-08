import type { Profile, SectionKey } from '../../types'
import { splitForSidebarLayout } from '../../lib/sections'
import { formatDateRange } from '../../lib/format'
import { LINK_ICONS } from '../../lib/icons'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function TemplateSidebar({ profile }: { profile: Profile }) {
  const { sidebar, main } = splitForSidebarLayout(profile)
  const { personal } = profile

  return (
    <div className="grid h-full grid-cols-[34%_66%] font-body text-[10.5pt] leading-snug text-slate-800">
      <aside className="flex flex-col gap-5 bg-accent-soft px-6 py-8">
        <div>
          <h1 className="font-heading text-[19pt] font-bold leading-tight text-slate-900">{personal.fullName}</h1>
          <p className="mt-1 text-[11pt] font-medium text-accent">{personal.title}</p>
        </div>

        <div className="flex flex-col gap-1.5 text-[9pt] text-slate-600">
          {personal.contact.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={12} className="shrink-0 text-accent" />
              <span className="break-all">{personal.contact.email}</span>
            </div>
          )}
          {personal.contact.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="shrink-0 text-accent" />
              <span>{personal.contact.phone}</span>
            </div>
          )}
          {personal.contact.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="shrink-0 text-accent" />
              <span>{personal.contact.location}</span>
            </div>
          )}
          {personal.links.map((link) => {
            const Icon = LINK_ICONS[link.icon]
            return (
              <div key={link.url + link.label} className="flex items-center gap-1.5">
                <Icon size={12} className="shrink-0 text-accent" />
                <span className="break-all">{link.label}</span>
              </div>
            )
          })}
        </div>

        {sidebar.map((section) => (
          <SidebarSection key={section} section={section} profile={profile} />
        ))}
      </aside>

      <main className="flex flex-col gap-5 px-7 py-8">
        {main.map((section) => (
          <MainSection key={section} section={section} profile={profile} />
        ))}
      </main>
    </div>
  )
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-[9.5pt] font-semibold uppercase tracking-wider text-slate-900">{children}</h2>
  )
}

function SidebarSection({ section, profile }: { section: SectionKey; profile: Profile }) {
  if (section === 'skills' && profile.skills.length > 0) {
    return (
      <div className="flex flex-col gap-2.5">
        <SidebarHeading>Skills</SidebarHeading>
        {profile.skills.map((group) => (
          <div key={group.id}>
            <p className="text-[9pt] font-semibold text-slate-700">{group.label}</p>
            <p className="text-[9pt] text-slate-600">{group.items.join(' · ')}</p>
          </div>
        ))}
      </div>
    )
  }

  if (section === 'education' && profile.education.length > 0) {
    return (
      <div className="flex flex-col gap-2.5">
        <SidebarHeading>Education</SidebarHeading>
        {profile.education.map((edu) => (
          <div key={edu.id}>
            <p className="text-[9pt] font-semibold text-slate-800">{edu.school}</p>
            <p className="text-[9pt] text-slate-600">{edu.degree}</p>
            <p className="text-[8.5pt] text-slate-500">{formatDateRange(edu.startDate, edu.endDate)}</p>
          </div>
        ))}
      </div>
    )
  }

  if (section === 'certifications' && profile.certifications.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <SidebarHeading>Certifications</SidebarHeading>
        {profile.certifications.map((cert) => (
          <div key={cert.id}>
            <p className="text-[9pt] font-semibold text-slate-800">{cert.name}</p>
            <p className="text-[8.5pt] text-slate-500">
              {cert.issuer}
              {cert.date ? ` · ${cert.date}` : ''}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return null
}

function MainHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-[10.5pt] font-semibold uppercase tracking-wider text-accent border-b border-slate-200 pb-1">
      {children}
    </h2>
  )
}

function MainSection({ section, profile }: { section: SectionKey; profile: Profile }) {
  if (section === 'summary' && profile.summary) {
    return (
      <div className="flex flex-col gap-1.5">
        <MainHeading>Summary</MainHeading>
        <p className="text-slate-700">{profile.summary}</p>
      </div>
    )
  }

  if (section === 'experience' && profile.experience.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        <MainHeading>Experience</MainHeading>
        {profile.experience.map((exp) => (
          <div key={exp.id} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-heading text-[10.5pt] font-semibold text-slate-900">
                {exp.role} <span className="font-normal text-slate-500">· {exp.company}</span>
              </p>
              <p className="whitespace-nowrap text-[8.5pt] text-slate-500">{formatDateRange(exp.startDate, exp.endDate)}</p>
            </div>
            <ul className="ml-4 list-disc space-y-0.5 text-slate-700">
              {exp.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  if (section === 'projects' && profile.projects.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <MainHeading>Projects</MainHeading>
        {profile.projects.map((project) => (
          <div key={project.id}>
            <p className="font-heading text-[10pt] font-semibold text-slate-900">{project.name}</p>
            <p className="text-slate-700">{project.description}</p>
          </div>
        ))}
      </div>
    )
  }

  return null
}
