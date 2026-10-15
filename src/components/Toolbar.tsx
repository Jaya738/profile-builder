import { Plus, Printer, Save, ClipboardList, ZoomIn, ZoomOut, PanelLeft, Rows3, Check, Code2, Trash2, RotateCcw } from 'lucide-react'
import type { Profile, TemplateId, ThemeConfig, SectionKey } from '../types'
import { FONT_PAIRS, PAGE_SIZES } from '../lib/constants'
import ColorPicker from './ColorPicker'
import SectionsPanel from './SectionsPanel'

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-r border-slate-200 px-3 last:border-r-0">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </div>
  )
}

export default function Toolbar({
  profiles,
  activeProfileId,
  onSelectProfile,
  onNewResume,
  isActiveProfileBundled,
  onRemoveProfile,
  showJsonEditor,
  onToggleJsonEditor,
  saved,
  template,
  onTemplateChange,
  theme,
  onThemeChange,
  sectionOrder,
  hiddenSections,
  onSectionsChange,
  zoom,
  onZoomChange,
  onExportPdf,
  onSaveToFile,
  onCopyPlainText,
}: {
  profiles: Profile[]
  activeProfileId: string
  onSelectProfile: (id: string) => void
  onNewResume: () => void
  isActiveProfileBundled: boolean
  onRemoveProfile: () => void
  showJsonEditor: boolean
  onToggleJsonEditor: () => void
  saved: boolean
  template: TemplateId
  onTemplateChange: (t: TemplateId) => void
  theme: ThemeConfig
  onThemeChange: (patch: Partial<ThemeConfig>) => void
  sectionOrder: SectionKey[]
  hiddenSections: SectionKey[]
  onSectionsChange: (order: SectionKey[], hidden: SectionKey[]) => void
  zoom: number
  onZoomChange: (z: number) => void
  onExportPdf: () => void
  onSaveToFile: () => void
  onCopyPlainText: () => void
}) {
  return (
    <div className="flex flex-col border-b border-slate-200 bg-white print:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-900">Profile Builder</span>
          <select
            value={activeProfileId}
            onChange={(e) => onSelectProfile(e.target.value)}
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.meta.profileName}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onNewResume}
            className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Plus size={14} /> New
          </button>
          <button
            type="button"
            onClick={onRemoveProfile}
            title={isActiveProfileBundled ? 'Reset this profile to its default content' : 'Delete this profile'}
            className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            {isActiveProfileBundled ? <RotateCcw size={14} /> : <Trash2 size={14} />}
          </button>
          <span className={`flex items-center gap-1 text-[12px] transition-opacity ${saved ? 'opacity-100' : 'opacity-0'} text-emerald-600`}>
            <Check size={13} /> Saved
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleJsonEditor}
            className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm ${
              showJsonEditor ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Code2 size={14} /> JSON
          </button>
          <button
            type="button"
            onClick={onCopyPlainText}
            title="Copy ATS-friendly plain text"
            className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <ClipboardList size={14} /> Copy text
          </button>
          <button
            type="button"
            onClick={onSaveToFile}
            title="Save this profile to its JSON file in src/profiles"
            className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Save size={14} /> Save to file
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Printer size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-y-2 border-t border-slate-100 px-4 py-2">
        <Group label="Template">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onTemplateChange('sidebar')}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
                template === 'sidebar' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PanelLeft size={14} /> Sidebar
            </button>
            <button
              type="button"
              onClick={() => onTemplateChange('timeline')}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
                template === 'timeline' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Rows3 size={14} /> Timeline
            </button>
          </div>
        </Group>

        <Group label="Sections">
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:bg-slate-50">
              Show / reorder
            </summary>
            <div className="absolute left-0 top-full z-20 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg">
              <SectionsPanel order={sectionOrder} hidden={hiddenSections} onChange={onSectionsChange} />
            </div>
          </details>
        </Group>

        <Group label="Color">
          <ColorPicker value={theme.accent} onChange={(hex) => onThemeChange({ accent: hex })} />
        </Group>

        <Group label="Font">
          <select
            value={theme.fontPairId}
            onChange={(e) => onThemeChange({ fontPairId: e.target.value })}
            className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600 outline-none focus:border-slate-400"
          >
            {FONT_PAIRS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </Group>

        <Group label="Page">
          <div className="flex items-center gap-1">
            {(Object.keys(PAGE_SIZES) as Array<keyof typeof PAGE_SIZES>).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onThemeChange({ pageSize: size })}
                className={`rounded-md px-2 py-1 text-sm ${
                  theme.pageSize === size ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {PAGE_SIZES[size].label}
              </button>
            ))}
          </div>
        </Group>

        <Group label="Zoom">
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onZoomChange(Math.max(0.6, zoom - 0.1))} className="rounded p-1 text-slate-500 hover:bg-slate-100">
              <ZoomOut size={14} />
            </button>
            <span className="w-10 text-center text-sm text-slate-600">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => onZoomChange(Math.min(1.3, zoom + 0.1))} className="rounded p-1 text-slate-500 hover:bg-slate-100">
              <ZoomIn size={14} />
            </button>
          </div>
        </Group>
      </div>
    </div>
  )
}
