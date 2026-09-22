import { AlertTriangle } from 'lucide-react'

interface Props { open: boolean; title?: string; message: string; onConfirm: () => void; onCancel: () => void }
export function ConfirmDialog({ open, title = '¿Eliminar registro?', message, onConfirm, onCancel }: Props) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="presentation">
    <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 text-rose-700" aria-hidden="true" /><div><h2 id="delete-title" className="text-lg font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-600">{message}</p></div></div>
      <div className="mt-6 flex justify-end gap-3"><button className="btn-secondary" onClick={onCancel}>Cancelar</button><button className="btn-danger" onClick={onConfirm}>Eliminar</button></div>
    </section>
  </div>
}
