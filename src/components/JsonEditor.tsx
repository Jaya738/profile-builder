import type { ValidationError } from '../lib/validate'

export default function JsonEditor({
  value,
  onChange,
  errors,
  parseError,
}: {
  value: string
  onChange: (value: string) => void
  errors: ValidationError[]
  parseError: string | null
}) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none rounded-md border border-slate-800 bg-slate-950 p-3 font-mono text-[12px] leading-relaxed text-slate-100 outline-none focus:border-slate-600"
      />
      {(parseError || errors.length > 0) && (
        <div className="max-h-36 flex-shrink-0 overflow-auto rounded-md border border-red-200 bg-red-50 p-2 text-[12px] text-red-700">
          {parseError ? (
            <div>{parseError}</div>
          ) : (
            errors.map((err, i) => (
              <div key={i}>
                <span className="font-mono text-red-500">{err.path || 'root'}</span>: {err.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
