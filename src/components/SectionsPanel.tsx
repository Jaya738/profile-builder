import { Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import { SECTION_LABELS, type SectionKey } from '../types'

export default function SectionsPanel({
  order,
  hidden,
  onChange,
}: {
  order: SectionKey[]
  hidden: SectionKey[]
  onChange: (order: SectionKey[], hidden: SectionKey[]) => void
}) {
  function toggle(section: SectionKey) {
    const isHidden = hidden.includes(section)
    onChange(order, isHidden ? hidden.filter((s) => s !== section) : [...hidden, section])
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...order]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next, hidden)
  }

  return (
    <div className="flex w-60 flex-col gap-0.5 p-2">
      {order.map((section, i) => {
        const isHidden = hidden.includes(section)
        return (
          <div key={section} className="flex items-center justify-between gap-1 rounded-md px-2 py-1.5 hover:bg-slate-50">
            <span className={`text-sm ${isHidden ? 'text-slate-400' : 'text-slate-700'}`}>{SECTION_LABELS[section]}</span>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === order.length - 1}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronDown size={14} />
              </button>
              <button type="button" onClick={() => toggle(section)} className="rounded p-1 text-slate-500 hover:bg-slate-100">
                {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
