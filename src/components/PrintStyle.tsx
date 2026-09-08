import { useEffect } from 'react'
import { PAGE_SIZES } from '../lib/constants'
import type { PageSizeId } from '../types'

export default function PrintStyle({ pageSize }: { pageSize: PageSizeId }) {
  useEffect(() => {
    const { widthMm, heightMm } = PAGE_SIZES[pageSize]
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-print-style', 'true')
    styleEl.textContent = `@page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }`
    document.head.appendChild(styleEl)
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [pageSize])

  return null
}
