import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { Profile } from '../types'
import { PAGE_SIZES, getFontPair } from '../lib/constants'
import { TEMPLATES } from './templates'
import PrintStyle from './PrintStyle'

type CssVars = CSSProperties & Record<`--${string}`, string>

export default function PreviewPane({ profile, zoom }: { profile: Profile; zoom: number }) {
  const pageRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(false)

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    const check = () => setOverflow(el.scrollHeight > el.clientHeight + 1)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [profile])

  const { theme } = profile.meta
  const pageDims = PAGE_SIZES[theme.pageSize]
  const fontPair = getFontPair(theme.fontPairId)
  const Template = TEMPLATES[profile.meta.template].component

  const pageStyle: CssVars = {
    width: `${pageDims.widthMm}mm`,
    height: `${pageDims.heightMm}mm`,
    '--accent': theme.accent,
    '--accent-soft': 'color-mix(in srgb, var(--accent) 12%, #ffffff)',
    '--font-heading': fontPair.heading,
    '--font-body': fontPair.body,
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-3 overflow-auto bg-slate-100 px-6 py-8">
      <PrintStyle pageSize={theme.pageSize} />
      {overflow && (
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-800 print:hidden">
          <AlertTriangle size={14} />
          Content overflows one page — trim a bullet or shorten the summary to keep this single-page.
        </div>
      )}
      <div className="zoom-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        <div id="resume-print-root" ref={pageRef} className="overflow-hidden bg-white shadow-xl print:shadow-none" style={pageStyle}>
          <Template profile={profile} />
        </div>
      </div>
    </div>
  )
}
