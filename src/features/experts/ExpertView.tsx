import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { z } from 'zod'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { ExportButtons } from '../../components/ExportButtons'
import { EmptyState, Panel } from '../../components/Panel'
import { makeId, timestamp } from '../../lib/db'
import { useRecords } from '../../hooks/useRecords'
import type { ExpertInterview } from '../../types/research'

const schema = z.object({
  alias: z.string().min(2, 'Indica un alias.'), role: z.string().min(2, 'Indica el rol.'), domain: z.string().min(2, 'Indica el dominio.'),
  yearsExperience: z.coerce.number().int().min(0).max(70), organization: z.string().min(2, 'Indica la organización o contexto.'), date: z.string().min(1, 'Selecciona la fecha.'), medium: z.enum(['presencial', 'remoto']),
  script: z.array(z.object({ id: z.string(), question: z.string().min(3, 'Escribe la pregunta.'), answer: z.string().min(3, 'Escribe la respuesta.'), keyQuote: z.boolean() })).min(1, 'Agrega una pregunta.'),
  keyConcepts: z.string().min(2, 'Incluye al menos un concepto.'), jargon: z.string(), dependencies: z.string(), ecosystemActors: z.string(),
  risks: z.string().min(3, 'Describe riesgos o restricciones.'), references: z.string().min(3, 'Incluye una referencia.'), notes: z.string(), nextSteps: z.string().min(3, 'Indica siguientes pasos.'),
})
type FormValues = z.infer<typeof schema>
const empty = (): FormValues => ({ alias: '', role: '', domain: '', yearsExperience: 1, organization: '', date: '', medium: 'remoto', script: [{ id: makeId('qa'), question: '', answer: '', keyQuote: false }], keyConcepts: '', jargon: '', dependencies: '', ecosystemActors: '', risks: '', references: '', notes: '', nextSteps: '' })
const toText = (items: string[]) => items.join(', ')
const toArray = (text: string) => text.split(',').map((item) => item.trim()).filter(Boolean)
const recordToForm = (record: ExpertInterview): FormValues => ({ ...record, keyConcepts: toText(record.keyConcepts), jargon: toText(record.jargon), dependencies: toText(record.dependencies), ecosystemActors: toText(record.ecosystemActors) })

export function ExpertView() {
  const { records, loading, upsert, destroy } = useRecords<ExpertInterview>('experts')
  const [editing, setEditing] = useState<ExpertInterview | null>(null)
  const [pendingDelete, setPendingDelete] = useState<ExpertInterview | null>(null)
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty() })
  const script = useFieldArray({ control: form.control, name: 'script' })
  useEffect(() => { form.reset(editing ? recordToForm(editing) : empty()) }, [editing, form])
  const submit = async (values: FormValues) => {
    const record: ExpertInterview = { id: editing?.id ?? makeId('expert'), createdAt: editing?.createdAt ?? timestamp(), updatedAt: timestamp(), ...values, keyConcepts: toArray(values.keyConcepts), jargon: toArray(values.jargon), dependencies: toArray(values.dependencies), ecosystemActors: toArray(values.ecosystemActors) }
    await upsert(record); setEditing(null)
  }
  const error = (name: keyof FormValues) => form.formState.errors[name]?.message as string | undefined
  return <div className="space-y-6">
    <header><p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Método 1</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Entrevista a expertos</h1><p className="mt-2 max-w-3xl text-slate-600">Convierte la entrevista técnica en decisiones rastreables: lenguaje, dependencias, riesgos y citas clave.</p></header>
    <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <Panel title={editing ? `Editar: ${editing.alias}` : 'Nueva entrevista'} subtitle="Los campos con * son obligatorios.">
        <form className="space-y-5" onSubmit={form.handleSubmit(submit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Alias *" error={error('alias')}><input className="field" {...form.register('alias')} /></Field>
            <Field label="Rol *" error={error('role')}><input className="field" {...form.register('role')} /></Field>
            <Field label="Dominio *" error={error('domain')}><input className="field" {...form.register('domain')} /></Field>
            <Field label="Años de experiencia *" error={error('yearsExperience')}><input type="number" min="0" max="70" className="field" {...form.register('yearsExperience', { valueAsNumber: true })} /></Field>
            <Field label="Organización / contexto *" error={error('organization')}><input className="field" {...form.register('organization')} /></Field>
            <Field label="Fecha *" error={error('date')}><input type="date" className="field" {...form.register('date')} /></Field>
          </div>
          <Field label="Medio *" error={error('medium')}><select className="field" {...form.register('medium')}><option value="remoto">Remoto</option><option value="presencial">Presencial</option></select></Field>
          <fieldset className="rounded-xl border border-slate-200 p-4"><legend className="px-1 text-sm font-bold text-slate-800">Guion dinámico: pregunta → respuesta</legend><div className="space-y-4">{script.fields.map((pair, index) => <div className="rounded-lg bg-slate-50 p-3" key={pair.id}><div className="flex justify-between gap-2"><p className="text-sm font-semibold">Par {index + 1}</p>{script.fields.length > 1 && <button type="button" className="btn-secondary !px-2 !py-1" onClick={() => script.remove(index)} aria-label={`Eliminar par ${index + 1}`}><X size={15} /></button>}</div><div className="mt-2 grid gap-3 md:grid-cols-2"><Field label="Pregunta *" error={form.formState.errors.script?.[index]?.question?.message}><textarea className="field min-h-20" {...form.register(`script.${index}.question`)} /></Field><Field label="Respuesta *" error={form.formState.errors.script?.[index]?.answer?.message}><textarea className="field min-h-20" {...form.register(`script.${index}.answer`)} /></Field></div><label className="mt-2 inline-flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-teal-700" {...form.register(`script.${index}.keyQuote`)} /> Cita textual clave</label></div>)}</div><button type="button" className="btn-secondary mt-3" onClick={() => script.append({ id: makeId('qa'), question: '', answer: '', keyQuote: false })}><Plus size={16} /> Añadir par</button></fieldset>
          <fieldset className="rounded-xl border border-slate-200 p-4"><legend className="px-1 text-sm font-bold text-slate-800">Mapa de complejidad técnica</legend><div className="mt-2 grid gap-4 md:grid-cols-2"><Field label="Conceptos clave *" hint="Separados por coma" error={error('keyConcepts')}><input className="field" {...form.register('keyConcepts')} /></Field><Field label="Jerga del dominio" hint="Separada por coma"><input className="field" {...form.register('jargon')} /></Field><Field label="Dependencias" hint="Separadas por coma"><input className="field" {...form.register('dependencies')} /></Field><Field label="Actores del ecosistema" hint="Separados por coma"><input className="field" {...form.register('ecosystemActors')} /></Field></div></fieldset>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Restricciones y riesgos técnicos *" error={error('risks')}><textarea className="field min-h-24" {...form.register('risks')} /></Field><Field label="Referencias / fuentes *" error={error('references')}><textarea className="field min-h-24" {...form.register('references')} /></Field><Field label="Notas"><textarea className="field min-h-24" {...form.register('notes')} /></Field><Field label="Siguientes pasos *" error={error('nextSteps')}><textarea className="field min-h-24" {...form.register('nextSteps')} /></Field></div>
          <div className="flex flex-wrap gap-3"><button className="btn-primary" type="submit">{editing ? 'Guardar cambios' : 'Crear entrevista'}</button>{editing && <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancelar edición</button>}</div>
        </form>
      </Panel>
      <Panel title="Registros" subtitle={`${records.length} entrevista(s) guardada(s)`} actions={<ExportButtons label="moderai-entrevistas-expertos" records={records as unknown as Record<string, unknown>[]} />}>
        <div className="space-y-3">{loading ? <p className="text-sm text-slate-500">Cargando…</p> : records.length === 0 ? <EmptyState>No hay entrevistas. Crea la primera desde el formulario.</EmptyState> : records.map((record) => <article className="rounded-xl border border-slate-200 p-4" key={record.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900">{record.alias}</h3><p className="text-sm text-slate-600">{record.role} · {record.domain} · {record.yearsExperience} años</p></div><div className="flex gap-1"><button className="btn-secondary !p-2" onClick={() => setEditing(record)} aria-label={`Editar ${record.alias}`}><Pencil size={16} /></button><button className="btn-secondary !p-2 text-rose-700" onClick={() => setPendingDelete(record)} aria-label={`Eliminar ${record.alias}`}><Trash2 size={16} /></button></div></div><div className="mt-3 flex flex-wrap gap-1">{record.keyConcepts.map((concept) => <span className="tag" key={concept}>{concept}</span>)}</div><p className="mt-3 text-sm text-slate-600"><strong>Riesgo:</strong> {record.risks}</p><p className="mt-2 text-sm text-slate-600"><strong>Citas clave:</strong> {record.script.filter((item) => item.keyQuote).length}</p></article>)}</div>
      </Panel>
    </div>
    <ConfirmDialog open={Boolean(pendingDelete)} message={`Se eliminará la entrevista de ${pendingDelete?.alias ?? ''}. Esta acción no se puede deshacer.`} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (pendingDelete) void destroy(pendingDelete.id); setPendingDelete(null); if (editing?.id === pendingDelete?.id) setEditing(null) }} />
  </div>
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) { return <label className="label">{label}{children}{hint && <span className="help">{hint}</span>}{error && <span className="error">{error}</span>}</label> }
