const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatMonthYear(value?: string): string {
  if (!value) return ''
  const [y, m] = value.split('-')
  if (!y) return value
  const monthIndex = Number(m) - 1
  if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return y
  return `${MONTHS[monthIndex]} ${y}`
}

export function formatDateRange(start?: string, end?: string): string {
  const startLabel = formatMonthYear(start)
  if (!startLabel) return ''
  return `${startLabel} – ${end ? formatMonthYear(end) : 'Present'}`
}
