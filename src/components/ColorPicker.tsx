import { ACCENT_SWATCHES } from '../lib/constants'

export default function ColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {ACCENT_SWATCHES.map((swatch) => (
        <button
          key={swatch.id}
          type="button"
          title={swatch.label}
          onClick={() => onChange(swatch.value)}
          className={`h-6 w-6 rounded-full border-2 transition ${
            value.toLowerCase() === swatch.value.toLowerCase() ? 'border-slate-900' : 'border-transparent hover:border-slate-300'
          }`}
          style={{ backgroundColor: swatch.value }}
        />
      ))}
      <label
        title="Custom color"
        className="relative flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-slate-300 text-[11px] text-slate-400 hover:border-slate-400"
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute -left-1 -top-1 h-8 w-8 cursor-pointer opacity-0"
        />
        +
      </label>
    </div>
  )
}
