import { Download } from 'lucide-react'
import { exportCsv, exportJson } from '../lib/export'

export function ExportButtons({ label, records }: { label: string; records: Record<string, unknown>[] }) {
  return <div className="flex flex-wrap gap-2" aria-label="Exportar datos">
    <button className="btn-secondary" onClick={() => exportJson(label, records)}><Download size={16} /> JSON</button>
    <button className="btn-secondary" onClick={() => exportCsv(label, records)}><Download size={16} /> CSV</button>
  </div>
}
