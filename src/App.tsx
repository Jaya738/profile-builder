import { useEffect, useMemo, useRef, useState } from 'react'
import type { Profile, SectionKey, TemplateId, ThemeConfig } from './types'
import { BUNDLED_PROFILES, createProfileFromRole, type RoleOption } from './data/profileRegistry'
import { clearDraft, listDraftIds, loadActiveProfileId, loadDraft, saveActiveProfileId, saveDraft } from './lib/storage'
import { validateProfile, type ValidationError } from './lib/validate'
import { exportToPdf, saveProfileToFile, toPlainText } from './lib/export'
import Toolbar from './components/Toolbar'
import JsonEditor from './components/JsonEditor'
import PreviewPane from './components/PreviewPane'
import NewResumeModal from './components/NewResumeModal'

const BUNDLED_IDS = new Set(BUNDLED_PROFILES.map((p) => p.id))

function loadInitialProfiles(): Profile[] {
  const bundled = BUNDLED_PROFILES.map((profile) => {
    const draft = loadDraft(profile.id)
    if (!draft) return profile
    try {
      return JSON.parse(draft) as Profile
    } catch {
      return profile
    }
  })

  const customProfiles = listDraftIds()
    .filter((id) => !BUNDLED_IDS.has(id))
    .map((id) => {
      const draft = loadDraft(id)
      if (!draft) return null
      try {
        return JSON.parse(draft) as Profile
      } catch {
        return null
      }
    })
    .filter((p): p is Profile => p !== null)

  return [...bundled, ...customProfiles]
}

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>(loadInitialProfiles)
  const [activeId, setActiveId] = useState(() => {
    const stored = loadActiveProfileId()
    return stored && profiles.some((p) => p.id === stored) ? stored : profiles[0].id
  })
  const [jsonText, setJsonText] = useState(() => JSON.stringify(profiles.find((p) => p.id === activeId) ?? profiles[0], null, 2))
  const [parseError, setParseError] = useState<string | null>(null)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [showJsonEditor, setShowJsonEditor] = useState(true)
  const [zoom, setZoom] = useState(0.85)
  const [modalOpen, setModalOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const savedTimer = useRef<number | undefined>(undefined)
  const toastTimer = useRef<number | undefined>(undefined)

  const activeProfile = useMemo(() => profiles.find((p) => p.id === activeId) ?? profiles[0], [profiles, activeId])

  useEffect(() => {
    setJsonText(JSON.stringify(activeProfile, null, 2))
    setParseError(null)
    setErrors([])
    saveActiveProfileId(activeId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  function flashSaved() {
    setSaved(true)
    window.clearTimeout(savedTimer.current)
    savedTimer.current = window.setTimeout(() => setSaved(false), 1500)
  }

  function showToast(message: string) {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2000)
  }

  function commitProfile(next: Profile) {
    setProfiles((prev) => prev.map((p) => (p.id === next.id ? next : p)))
    saveDraft(next.id, JSON.stringify(next))
    setJsonText(JSON.stringify(next, null, 2))
    flashSaved()
  }

  function handleJsonChange(text: string) {
    setJsonText(text)
    try {
      const parsed = JSON.parse(text)
      const validationErrors = validateProfile(parsed)
      setParseError(null)
      setErrors(validationErrors)
      if (validationErrors.length === 0) {
        const next = parsed as Profile
        setProfiles((prev) => prev.map((p) => (p.id === activeId ? next : p)))
        saveDraft(activeId, text)
        flashSaved()
      }
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Invalid JSON')
      setErrors([])
    }
  }

  function updateMeta(patch: Partial<Profile['meta']>) {
    commitProfile({ ...activeProfile, meta: { ...activeProfile.meta, ...patch } })
  }

  function handleThemeChange(patch: Partial<ThemeConfig>) {
    updateMeta({ theme: { ...activeProfile.meta.theme, ...patch } })
  }

  function handleSectionsChange(order: SectionKey[], hidden: SectionKey[]) {
    updateMeta({ sectionOrder: order, hiddenSections: hidden })
  }

  function handleTemplateChange(template: TemplateId) {
    updateMeta({ template })
  }

  function handleCreateResume(role: RoleOption['role'], profileName: string) {
    const next = createProfileFromRole(role, profileName)
    setProfiles((prev) => [...prev, next])
    saveDraft(next.id, JSON.stringify(next))
    setActiveId(next.id)
    showToast('New resume created')
  }

  function handleRemoveProfile() {
    const label = activeProfile.meta.profileName

    if (BUNDLED_IDS.has(activeProfile.id)) {
      const original = BUNDLED_PROFILES.find((p) => p.id === activeProfile.id)
      if (!original) return
      if (!window.confirm(`Reset "${label}" back to its default content? Your edits will be lost.`)) return
      clearDraft(activeProfile.id)
      setProfiles((prev) => prev.map((p) => (p.id === original.id ? original : p)))
      showToast('Reset to default')
      return
    }

    if (!window.confirm(`Delete "${label}"? This can't be undone.`)) return
    clearDraft(activeProfile.id)
    const remaining = profiles.filter((p) => p.id !== activeProfile.id)
    setProfiles(remaining)
    setActiveId(remaining[0]?.id ?? BUNDLED_PROFILES[0].id)
    showToast('Profile deleted')
  }

  function handleExportPdf() {
    exportToPdf(`${activeProfile.personal.fullName} - Resume`)
  }

  async function handleSaveToFile() {
    const result = await saveProfileToFile(activeProfile.id, activeProfile)
    showToast(result.ok ? `Saved to ${result.path}` : result.error ?? 'Save failed')
  }

  async function handleCopyPlainText() {
    const text = toPlainText(activeProfile)
    try {
      await navigator.clipboard.writeText(text)
      showToast('Plain-text resume copied')
    } catch {
      showToast('Could not access clipboard')
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Toolbar
        profiles={profiles}
        activeProfileId={activeId}
        onSelectProfile={setActiveId}
        onNewResume={() => setModalOpen(true)}
        isActiveProfileBundled={BUNDLED_IDS.has(activeProfile.id)}
        onRemoveProfile={handleRemoveProfile}
        showJsonEditor={showJsonEditor}
        onToggleJsonEditor={() => setShowJsonEditor((v) => !v)}
        saved={saved}
        template={activeProfile.meta.template}
        onTemplateChange={handleTemplateChange}
        theme={activeProfile.meta.theme}
        onThemeChange={handleThemeChange}
        sectionOrder={activeProfile.meta.sectionOrder}
        hiddenSections={activeProfile.meta.hiddenSections}
        onSectionsChange={handleSectionsChange}
        zoom={zoom}
        onZoomChange={setZoom}
        onExportPdf={handleExportPdf}
        onSaveToFile={handleSaveToFile}
        onCopyPlainText={handleCopyPlainText}
      />

      <div className="flex flex-1 overflow-hidden">
        {showJsonEditor && (
          <div className="w-[420px] flex-shrink-0 border-r border-slate-200 bg-white print:hidden">
            <JsonEditor value={jsonText} onChange={handleJsonChange} errors={errors} parseError={parseError} />
          </div>
        )}
        <PreviewPane profile={activeProfile} zoom={zoom} />
      </div>

      <NewResumeModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreateResume} />

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-md bg-slate-900 px-3 py-2 text-sm text-white shadow-lg print:hidden">{toast}</div>
      )}
    </div>
  )
}
