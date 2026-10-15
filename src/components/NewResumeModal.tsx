import { useState } from 'react'
import { X } from 'lucide-react'
import { ROLE_OPTIONS, type RoleOption } from '../data/profileRegistry'

export default function NewResumeModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (role: RoleOption['role'], profileName: string) => void
}) {
  const [role, setRole] = useState<RoleOption['role']>('developer')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setSubmitting(false)
  }

  if (!open) return null

  const selected = ROLE_OPTIONS.find((r) => r.role === role) ?? ROLE_OPTIONS[0]

  function handleCreate() {
    if (submitting) return
    setSubmitting(true)
    onCreate(role, name.trim() || selected.seed.meta.profileName)
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Create a new resume</h2>
            <p className="mt-1 text-sm text-slate-500">Pick a starting point — you can edit everything after.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.role}
              type="button"
              onClick={() => setRole(opt.role)}
              className={`rounded-lg border p-3 text-left transition ${
                role === opt.role ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className="text-sm font-medium text-slate-900">{opt.label}</p>
              <p className="text-xs text-slate-500">{opt.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-slate-600">Profile name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={selected.seed.meta.profileName}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Create resume
          </button>
        </div>
      </div>
    </div>
  )
}
