import { useEffect, useState } from 'react'
import { BrainCircuit, HeartHandshake, LayoutDashboard, Menu, Network, PieChart, Search, UsersRound, X } from 'lucide-react'
import { ExpertView } from './features/experts/ExpertView'
import { ExtremeUsersView } from './features/extremes/ExtremeUsersView'
import { NeedfindingView } from './features/needfinding/NeedfindingView'
import { EmpathyView } from './features/empathy/EmpathyView'
import { RoperView } from './features/roper/RoperView'
import { RequirementsView } from './features/requirements/RequirementsView'
import { useRecords } from './hooks/useRecords'
import { initializeDemoData } from './lib/seed'
import type { EmpathyMap, ExpertInterview, ExtremeUser, Observation, RequirementMapping, RoperDynagram } from './types/research'

type View = 'dashboard' | 'experts' | 'extremes' | 'needfinding' | 'empathy' | 'roper' | 'requirements'
const navigation: { id: View; label: string; Icon: typeof LayoutDashboard; detail: string }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, detail: 'Resumen de investigación' },
  { id: 'experts', label: '1. Expertos', Icon: BrainCircuit, detail: 'Complejidad técnica' },
  { id: 'extremes', label: '2. Usuarios extremos', Icon: UsersRound, detail: 'Patrones amplificados' },
  { id: 'needfinding', label: '3. El Iceberg', Icon: Search, detail: 'Observar e inferir' },
  { id: 'empathy', label: '4. Empathy Map', Icon: HeartHandshake, detail: 'Parser cualitativo' },
  { id: 'roper', label: '5. Roper Dynagram', Icon: PieChart, detail: 'Segmentos y valores' },
  { id: 'requirements', label: '6. Requerimientos', Icon: Network, detail: 'Trazabilidad y ley' },
]
const validViews = new Set(navigation.map((item) => item.id))
const readHash = (): View => { const candidate = window.location.hash.slice(1) as View; return validViews.has(candidate) ? candidate : 'dashboard' }

export function App() {
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<View>(readHash)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  useEffect(() => { void initializeDemoData().then(() => setReady(true)) }, [])
  useEffect(() => { const onHash = () => setView(readHash()); window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [view])
  const navigate = (to: View) => { window.scrollTo(0, 0); window.location.hash = to; setView(to); setMobileNavOpen(false) }
  if (!ready) return <main className="grid min-h-screen place-items-center bg-mist p-6"><div className="rounded-2xl bg-white p-8 text-center shadow-soft"><div className="mx-auto size-10 animate-pulse rounded-xl bg-teal-600" /><h1 className="mt-4 text-xl font-black">Preparando ModerAI Research</h1><p className="mt-2 text-sm text-slate-600">Cargando la base local y datos de demostración…</p></div></main>
  return <div className="min-h-screen bg-[#f8fbfb] lg:grid lg:grid-cols-[280px_1fr]">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:w-auto lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Navegación principal">
      <div className="flex items-center justify-between px-2 py-3"><button className="flex items-center gap-3 text-left" onClick={() => navigate('dashboard')}><div className="grid size-10 place-items-center rounded-xl bg-teal-700 font-black text-white">M</div><span><strong className="block text-lg tracking-tight">ModerAI</strong><span className="text-xs font-semibold text-teal-700">User Research Suite</span></span></button><button className="btn-secondary !p-2 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Cerrar menú"><X size={18} /></button></div>
      <nav className="mt-4 flex-1 space-y-1">{navigation.map(({ id, label, Icon, detail }) => <button key={id} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${view === id ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`} onClick={() => navigate(id)} aria-current={view === id ? 'page' : undefined}><Icon size={19} aria-hidden="true" /><span><span className="block text-sm font-bold">{label}</span><span className={`block text-xs ${view === id ? 'text-teal-100' : 'text-slate-500'}`}>{detail}</span></span></button>)}</nav>
      <div className="rounded-xl bg-mist p-3 text-xs text-slate-600"><strong className="block text-teal-900">Persistencia local activa</strong><p className="mt-1">Tus cambios se guardan en IndexedDB de este navegador.</p></div>
    </aside>
    {mobileNavOpen && <button className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" aria-label="Cerrar menú" onClick={() => setMobileNavOpen(false)} />}
    <main className="min-w-0"><div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8"><button className="btn-secondary !p-2 lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Abrir menú"><Menu size={20} /></button><div className="hidden text-sm text-slate-500 sm:block">Investigación centrada en humanos · ModerAI</div><span className="tag">Cliente local · IndexedDB</span></div><div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{view === 'dashboard' && <Dashboard onNavigate={navigate} />}{view === 'experts' && <ExpertView />}{view === 'extremes' && <ExtremeUsersView />}{view === 'needfinding' && <NeedfindingView />}{view === 'empathy' && <EmpathyView />}{view === 'roper' && <RoperView />}{view === 'requirements' && <RequirementsView />}</div></main>
  </div>
}

function Dashboard({ onNavigate }: { onNavigate: (view: View) => void }) {
  const experts = useRecords<ExpertInterview>('experts'); const extremes = useRecords<ExtremeUser>('extremeUsers'); const observations = useRecords<Observation>('observations'); const empathy = useRecords<EmpathyMap>('empathyMaps'); const roper = useRecords<RoperDynagram>('roperDynagrams'); const requirements = useRecords<RequirementMapping>('requirements')
  const insights = empathy.records.reduce((total, map) => total + map.insights.length, 0)
  const segments = roper.records.reduce((total, config) => total + config.segments.length, 0)
  const cards: { value: number; label: string; view: View; note: string }[] = [
    { value: experts.records.length, label: 'Expertos', view: 'experts', note: 'mapas técnicos' }, { value: extremes.records.length, label: 'Participantes', view: 'extremes', note: 'extremos y mainstream' }, { value: observations.records.length, label: 'Observaciones', view: 'needfinding', note: 'icebergs documentados' }, { value: insights, label: 'Insights', view: 'empathy', note: 'del parser cualitativo' }, { value: segments, label: 'Segmentos', view: 'roper', note: 'cuotas en la rueda' }, { value: requirements.records.length, label: 'Requisitos', view: 'requirements', note: 'con trazabilidad' },
  ]
  return <div className="space-y-6"><header className="rounded-3xl bg-gradient-to-br from-teal-800 to-cyan-800 p-6 text-white shadow-soft sm:p-8"><p className="text-sm font-bold uppercase tracking-widest text-teal-100">ModerAI · investigación de usuarios</p><h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">Del ruido del feed a decisiones de diseño comprobables.</h1><p className="mt-3 max-w-2xl text-teal-50">Documenta cómo las personas enfrentan spoilers, spam y contenido no deseado; después conecta evidencia, segmentos y arquitectura.</p><button className="btn mt-6 bg-white text-teal-900 hover:bg-teal-50" onClick={() => onNavigate('experts')}>Comenzar con entrevista experta →</button></header><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <button className="panel text-left transition hover:-translate-y-0.5 hover:border-teal-400" onClick={() => onNavigate(card.view)} key={card.label}><span className="text-3xl font-black text-teal-700">{card.value}</span><h2 className="mt-2 font-bold text-slate-900">{card.label}</h2><p className="text-sm text-slate-600">{card.note}</p></button>)}</section><section className="grid gap-6 lg:grid-cols-2"><div className="panel"><h2 className="text-lg font-black">Flujo de la suite</h2><ol className="mt-4 space-y-3 text-sm text-slate-700"><li><strong>1–3. Captura:</strong> experto, extremos y observación directa.</li><li><strong>4. Sintetiza:</strong> clasifica ruido en cuadrícula y crea insights.</li><li><strong>5. Segmenta:</strong> asigna evidencia y recalcula cuotas en la rueda.</li><li><strong>6. Decide:</strong> enlaza insight → requisito → arquitectura con prioridad proporcional.</li></ol></div><div className="panel"><h2 className="text-lg font-black">Antes de entregar</h2><p className="mt-3 text-sm text-slate-600">La app incluye datos de demostración coherentes con ModerAI para que no abra vacía. Reemplázalos por tus entrevistas reales, conserva evidencia autorizada y usa las exportaciones por método como respaldo del dataset.</p><button className="btn-secondary mt-4" onClick={() => onNavigate('requirements')}>Abrir trazabilidad</button></div></section></div>
}
