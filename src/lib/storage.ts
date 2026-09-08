const PREFIX = 'profile-builder:draft:'

export function saveDraft(id: string, json: string) {
  try {
    localStorage.setItem(PREFIX + id, json)
  } catch {
    // storage unavailable (private mode, quota) — draft simply won't persist
  }
}

export function loadDraft(id: string): string | null {
  try {
    return localStorage.getItem(PREFIX + id)
  } catch {
    return null
  }
}

export function clearDraft(id: string) {
  try {
    localStorage.removeItem(PREFIX + id)
  } catch {
    // ignore
  }
}

export function listDraftIds(): string[] {
  try {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .map((k) => k.slice(PREFIX.length))
  } catch {
    return []
  }
}

const ACTIVE_PROFILE_KEY = 'profile-builder:active-id'

export function saveActiveProfileId(id: string) {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id)
  } catch {
    // storage unavailable — active profile just won't be remembered
  }
}

export function loadActiveProfileId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY)
  } catch {
    return null
  }
}
