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
