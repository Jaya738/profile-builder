export type AccentSwatch = { id: string; label: string; value: string }

export const ACCENT_SWATCHES: AccentSwatch[] = [
  { id: 'blue', label: 'Blue', value: '#2563eb' },
  { id: 'teal', label: 'Teal', value: '#0d9488' },
  { id: 'violet', label: 'Violet', value: '#7c3aed' },
  { id: 'pink', label: 'Pink', value: '#db2777' },
  { id: 'orange', label: 'Orange', value: '#ea580c' },
  { id: 'green', label: 'Green', value: '#16a34a' },
  { id: 'slate', label: 'Slate', value: '#0f172a' },
  { id: 'red', label: 'Red', value: '#dc2626' },
]

export type FontPair = { id: string; label: string; heading: string; body: string }

export const FONT_PAIRS: FontPair[] = [
  { id: 'inter', label: 'Inter', heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  {
    id: 'grotesk',
    label: 'Space Grotesk / Inter',
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },
  {
    id: 'editorial',
    label: 'Playfair / Source Sans',
    heading: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
  },
  {
    id: 'technical',
    label: 'IBM Plex Mono / Sans',
    heading: "'IBM Plex Mono', monospace",
    body: "'IBM Plex Sans', sans-serif",
  },
]

export const PAGE_SIZES: Record<'A4' | 'Letter', { widthMm: number; heightMm: number; label: string }> = {
  A4: { widthMm: 210, heightMm: 297, label: 'A4' },
  Letter: { widthMm: 215.9, heightMm: 279.4, label: 'US Letter' },
}

export function getFontPair(id: string): FontPair {
  return FONT_PAIRS.find((f) => f.id === id) ?? FONT_PAIRS[0]
}
