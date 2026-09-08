import type { Profile, SectionKey } from '../../types'
import { visibleSections } from '../../lib/sections'
import { formatDateRange } from '../../lib/format'
import { LINK_ICONS } from '../../lib/icons'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function TemplateTimeline({ profile }: { profile: Profile }) {
  const sections = visibleSections(profile)
  const { personal } = profile

  return (
    <div className="flex h-full flex-col gap-5 px-10 py-9 font-body text-[10.5pt] leading-snug text-slate-800">
      <header className="flex flex-col gap-2 border-b-2 border-accent pb-4">
        <h1 className="font-heading text-[22pt] font-bold leading-tight text-slate-900">{personal.fullName}</h1>
        <p className="text-[11.5pt] font-medium text-accent">{personal.title}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9pt] text-slate-600">
          {personal.contact.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={11} className="text-accent" /> {personal.contact.email}
            </span>
          )}
          {personal.contact.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={11} className="text-accent" /> {personal.contact.phone}
            </span>
          )}
          {personal.contact.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={11} className="text-accent" /> {personal.contact.location}
            </span>
          )}
          {personal.links.map((link) => {
            const Icon = LINK_ICONS[link.icon]
            return (
              <span key={link.url + link.label} className="flex items-center gap-1.5">
                <Icon size={11} className="text-accent" /> {link.label}
              </span>
            )
          })}
        </div>
      </header>

      {sections.map((section) => (
        <Section key={section} section={section} profile={profile} />
      ))}
    </div>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading text-[11pt] font-semibold uppercase tracking-wider text-slate-900">{children}</h2>
}

function TimelineItem({
  title,
  subtitle,
  dateLabel,
  children,
}: {
  title: string
  subtitle?: string
  dateLabel: string
  children?: React.ReactNode
}) {
  return (
    <div className="relative flex flex-col gap-1 border-l-2 border-slate-200 pl-4">
      <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-accent" />
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-heading text-[10.5pt] font-semibold text-slate-900">
          {title} {subtitle && <span className="font-normal text-slate-500">· {subtitle}</span>}
        </p>
        <p className="whitespace-nowrap text-[8.5pt] text-slate-500">{dateLabel}</p>
      </div>
      {children}
    </div>
  )
}

function Section({ section, profile }: { section: SectionKey; profile: Profile }) {
  if (section === 'summary' && profile.summary) {
    return (
      <div className="flex flex-col gap-1.5">
        <Heading>Summary</Heading>
        <p className="text-slate-700">{profile.summary}</p>
      </div>
    )
  }

  if (section === 'experience' && profile.experience.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        <Heading>Experience</Heading>
        <div className="flex flex-col gap-3">
          {profile.experience.map((exp) => (
            <TimelineItem key={exp.id} title={exp.role} subtitle={exp.company} dateLabel={formatDateRange(exp.startDate, exp.endDate)}>
              <ul className="ml-4 list-disc space-y-0.5 text-slate-700">
                {exp.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </TimelineItem>
          ))}
        </div>
      </div>
    )
  }

  if (section === 'projects' && profile.projects.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <Heading>Projects</Heading>
        {profile.projects.map((project) => (
          <div key={project.id}>
            <p className="font-heading text-[10pt] font-semibold text-slate-900">{project.name}</p>
            <p className="text-slate-700">{project.description}</p>
          </div>
        ))}
      </div>
    )
  }

  if (section === 'education' && profile.education.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        <Heading>Education</Heading>
        <div className="flex flex-col gap-3">
          {profile.education.map((edu) => (
            <TimelineItem key={edu.id} title={edu.degree} subtitle={edu.school} dateLabel={formatDateRange(edu.startDate, edu.endDate)} />
          ))}
        </div>
      </div>
    )
  }

  if (section === 'skills' && profile.skills.length > 0) {
    return (
      <div className="flex flex-col gap-1.5">
        <Heading>Skills</Heading>
        <div className="flex flex-col gap-1">
          {profile.skills.map((group) => (
            <p key={group.id} className="text-slate-700">
              <span className="font-semibold text-slate-800">{group.label}: </span>
              {group.items.join(', ')}
            </p>
          ))}
        </div>
      </div>
    )
  }

  if (section === 'certifications' && profile.certifications.length > 0) {
    return (
      <div className="flex flex-col gap-1.5">
        <Heading>Certifications</Heading>
        {profile.certifications.map((cert) => (
          <p key={cert.id} className="text-slate-700">
            <span className="font-semibold text-slate-800">{cert.name}</span> — {cert.issuer}
            {cert.date ? ` (${cert.date})` : ''}
          </p>
        ))}
      </div>
    )
  }

  return null
}
