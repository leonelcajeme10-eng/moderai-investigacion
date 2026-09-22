import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { ExportButtons } from '../../components/ExportButtons'
import { EmptyState, Panel } from '../../components/Panel'
import { useRecords } from '../../hooks/useRecords'
import { makeId, timestamp } from '../../lib/db'
import type { ExtremeUser } from '../../types/research'

const schema = z.object({
  classification: z.enum(['super-experto', 'inexperto', 'mainstream']), alias: z.string().min(2, 'Indica un alias.'), context: z.string().min(8, 'Describe el contexto.'), frequency: z.string().min(2, 'Indica la frecuencia.'), skill: z.coerce.number().int().min(1, 'La escala inicia en 1.').max(10, 'La escala termina en 10.'),
  observedTasks: z.string().min(8, 'Describe tareas observadas.'), workarounds: z.string().min(3, 'Registra un workaround o “ninguno”.'), frictions: z.string().min(8, 'Describe una fricción.'), extremeNeed: z.string().min(8, 'Explica la necesidad extrema.'), generalizationHypothesis: z.string().min(8, 'Incluye la hipótesis.'), evidence: z.string().min(3, 'Agrega evidencia o una referencia.'),
})
type FormValues = z.infer<typeof schema>
const empty = (): FormValues => ({ classification: 'mainstream', alias: '', context: '', frequency: '', skill: 5, observedTasks: '', workarounds: '', frictions: '', extremeNeed: '', generalizationHypothesis: '', evidence: '' })

export function ExtremeUsersView() {
  const { records, loading, upsert, destroy } = useRecords<ExtremeUser>('extremeUsers')
  const [editing, setEditing] = useState<ExtremeUser | null>(null)
  const [pendingDelete, setPendingDelete] = useState<ExtremeUser | null>(null)
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty() })
  useEffect(() => { form.reset(editing ?? empty()) }, [editing, form])
  const submit = async (values: FormValues) => { await upsert({ ...values, id: editing?.id ?? makeId('extreme'), createdAt: editing?.createdAt ?? timestamp(), updatedAt: timestamp() }); setEditing(null) }
  const error = (name: keyof FormValues) => form.formState.errors[name]?.message as string | undefined
  return <div className="space-y-6">
    <header><p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Método 2</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Usuarios extremos</h1><p className="mt-2 max-w-3xl text-slate-600">Documenta patrones amplificados para construir hipótesis que puedan validarse con usuarios mainstream.</p></header>
    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <Panel title={editing ? `Editar: ${editing.alias}` : 'Nuevo perfil observado'} subtitle="Clasifica al participante por su relación con la tarea, no por su valor como persona.">
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Clasificación *" error={error('classification')}><select className="field" {...form.register('classification')}><option value="super-experto">Súper-experto</option><option value="inexperto">Inexperto</option><option value="mainstream">Mainstream</option></select></Field><Field label="Alias *" error={error('alias')}><input className="field" {...form.register('alias')} /></Field><Field label="Contexto *" error={error('context')}><input className="field" placeholder="Situación, dispositivo, objetivo" {...form.register('context')} /></Field><Field label="Frecuencia de uso *" error={error('frequency')}><input className="field" placeholder="p. ej., 2 h/día" {...form.register('frequency')} /></Field><Field label="Habilidad (1-10) *" error={error('skill')}><input type="number" min="1" max="10" className="field" {...form.register('skill', { valueAsNumber: true })} /></Field></div>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Tareas observadas *" error={error('observedTasks')}><textarea className="field min-h-24" {...form.register('observedTasks')} /></Field><Field label="Workarounds / adaptaciones *" error={error('workarounds')}><textarea className="field min-h-24" {...form.register('workarounds')} /></Field><Field label="Errores o fricciones amplificadas *" error={error('frictions')}><textarea className="field min-h-24" {...form.register('frictions')} /></Field><Field label="Necesidad extrema *" error={error('extremeNeed')}><textarea className="field min-h-24" {...form.register('extremeNeed')} /></Field><Field label="Hipótesis para usuario promedio *" error={error('generalizationHypothesis')}><textarea className="field min-h-24" {...form.register('generalizationHypothesis')} /></Field><Field label="Evidencia (enlace, foto, timestamp) *" error={error('evidence')}><textarea className="field min-h-24" {...form.register('evidence')} /></Field></div>
          <div className="flex flex-wrap gap-3"><button className="btn-primary">{editing ? 'Guardar cambios' : 'Guardar usuario'}</button>{editing && <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancelar edición</button>}</div>
        </form>
      </Panel>
      <Panel title="Participantes" subtitle={`${records.length} perfil(es) guardado(s)`} actions={<ExportButtons label="moderai-usuarios-extremos" records={records as unknown as Record<string, unknown>[]} />}>
        <div className="space-y-3">{loading ? <p className="text-sm text-slate-500">Cargando…</p> : records.length === 0 ? <EmptyState>Agrega un usuario extremo o mainstream para iniciar.</EmptyState> : records.map((record) => <article className="rounded-xl border border-slate-200 p-4" key={record.id}><div className="flex items-start justify-between gap-2"><div><div className="flex flex-wrap gap-2"><h3 className="font-bold text-slate-900">{record.alias}</h3><span className="tag">{record.classification}</span></div><p className="mt-1 text-sm text-slate-600">{record.frequency} · habilidad {record.skill}/10</p></div><div className="flex gap-1"><button className="btn-secondary !p-2" aria-label={`Editar ${record.alias}`} onClick={() => setEditing(record)}><Pencil size={16} /></button><button className="btn-secondary !p-2 text-rose-700" aria-label={`Eliminar ${record.alias}`} onClick={() => setPendingDelete(record)}><Trash2 size={16} /></button></div></div><p className="mt-3 text-sm text-slate-700"><strong>Necesidad:</strong> {record.extremeNeed}</p><p className="mt-2 text-sm text-slate-600"><strong>Hipótesis:</strong> {record.generalizationHypothesis}</p></article>)}</div>
      </Panel>
    </div>
    <ConfirmDialog open={Boolean(pendingDelete)} message={`Se eliminará el perfil de ${pendingDelete?.alias ?? ''}.`} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (pendingDelete) void destroy(pendingDelete.id); setPendingDelete(null); if (editing?.id === pendingDelete?.id) setEditing(null) }} />
  </div>
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="label">{label}{children}{error && <span className="error">{error}</span>}</label> }
