const escapeCsv = (value: unknown) => `"${JSON.stringify(value ?? '').replace(/"/g, '""').slice(1, -1)}"`
const flatten = (item: Record<string, unknown>) => Object.fromEntries(Object.entries(item).map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value]))

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = filename; anchor.click()
  URL.revokeObjectURL(url)
}

export const timeStampFile = () => new Date().toISOString().replace(/[:.]/g, '-')
export function exportJson(label: string, records: unknown[]) {
  download(`${label}-${timeStampFile()}.json`, JSON.stringify(records, null, 2), 'application/json')
}
export function exportCsv(label: string, records: Record<string, unknown>[]) {
  const rows = records.map(flatten)
  const fields = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  const csv = [fields.join(','), ...rows.map((row) => fields.map((field) => escapeCsv(row[field])).join(','))].join('\n')
  download(`${label}-${timeStampFile()}.csv`, csv, 'text/csv;charset=utf-8')
}
