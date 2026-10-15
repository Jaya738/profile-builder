export function exportToPdf(fileName: string) {
  const previousTitle = document.title
  document.title = fileName
  window.requestAnimationFrame(() => {
    window.print()
    document.title = previousTitle
  })
}

export async function saveProfileToFile(id: string, data: unknown): Promise<{ ok: boolean; path?: string; error?: string }> {
  try {
    const res = await fetch('/api/save-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, data }),
    })
    const body = (await res.json().catch(() => null)) as { ok: boolean; path?: string; error?: string } | null
    if (!res.ok || !body) {
      return { ok: false, error: body?.error ?? `Save failed (${res.status})` }
    }
    return body
  } catch {
    return { ok: false, error: 'Save endpoint unavailable — this only works while running `npm run dev`.' }
  }
}

export function toPlainText(profile: {
  personal: { fullName: string; title: string; contact: { email?: string; phone?: string; location?: string } }
  summary: string
  experience: { company: string; role: string; startDate: string; endDate?: string; bullets: string[] }[]
  education: { school: string; degree: string; startDate: string; endDate?: string }[]
  skills: { label: string; items: string[] }[]
  projects: { name: string; description: string }[]
  certifications: { name: string; issuer: string; date?: string }[]
}): string {
  const lines: string[] = []
  const { personal } = profile
  lines.push(personal.fullName)
  lines.push(personal.title)
  const contactLine = [personal.contact.email, personal.contact.phone, personal.contact.location]
    .filter(Boolean)
    .join(' | ')
  if (contactLine) lines.push(contactLine)
  lines.push('')

  if (profile.summary) {
    lines.push('SUMMARY')
    lines.push(profile.summary)
    lines.push('')
  }

  if (profile.experience.length) {
    lines.push('EXPERIENCE')
    for (const exp of profile.experience) {
      lines.push(`${exp.role}, ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`)
      for (const b of exp.bullets) lines.push(`- ${b}`)
    }
    lines.push('')
  }

  if (profile.projects.length) {
    lines.push('PROJECTS')
    for (const p of profile.projects) lines.push(`${p.name}: ${p.description}`)
    lines.push('')
  }

  if (profile.education.length) {
    lines.push('EDUCATION')
    for (const e of profile.education) {
      lines.push(`${e.degree}, ${e.school} (${e.startDate} - ${e.endDate || 'Present'})`)
    }
    lines.push('')
  }

  if (profile.skills.length) {
    lines.push('SKILLS')
    for (const s of profile.skills) lines.push(`${s.label}: ${s.items.join(', ')}`)
    lines.push('')
  }

  if (profile.certifications.length) {
    lines.push('CERTIFICATIONS')
    for (const c of profile.certifications) lines.push(`${c.name}, ${c.issuer}${c.date ? ` (${c.date})` : ''}`)
  }

  return lines.join('\n').trim()
}
