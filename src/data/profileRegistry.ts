import type { Profile } from '../types'
import developer from '../profiles/developer.json'
import dataEngineer from '../profiles/data-engineer.json'
import other from '../profiles/other.json'

export const BUNDLED_PROFILES: Profile[] = [developer as Profile, dataEngineer as Profile, other as Profile]

export type RoleOption = {
  role: Profile['meta']['role']
  label: string
  description: string
  seed: Profile
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'developer',
    label: 'Developer',
    description: 'Software engineering roles — languages, frameworks, and shipped projects.',
    seed: developer as Profile,
  },
  {
    role: 'dataEngineer',
    label: 'Data Engineer',
    description: 'Pipelines, warehousing, and data platform work.',
    seed: dataEngineer as Profile,
  },
  {
    role: 'other',
    label: 'Other',
    description: 'A general-purpose starting point for any other role.',
    seed: other as Profile,
  },
]

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createProfileFromRole(role: RoleOption['role'], profileName: string): Profile {
  const seed = ROLE_OPTIONS.find((r) => r.role === role)?.seed ?? BUNDLED_PROFILES[0]
  const clone: Profile = JSON.parse(JSON.stringify(seed))
  clone.id = generateId()
  clone.meta.profileName = profileName
  return clone
}
