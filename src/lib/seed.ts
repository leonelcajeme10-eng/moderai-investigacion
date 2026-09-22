import { bulkSave, list } from './db'
import type { EmpathyMap, ExpertInterview, ExtremeUser, Observation, RequirementMapping, RoperDynagram } from '../types/research'

const seededAt = '2026-09-21T12:00:00.000Z'
const base = { createdAt: seededAt, updatedAt: seededAt }
const roper: RoperDynagram = {
  ...base, id: 'roper-moderai', title: 'Segmentos ModerAI - dataset de demostración',
  segments: [
    { id: 'seg-adventurers', name: 'Adventurers', values: 'estatus, ambición, descubrimiento', uxRequirement: 'Control granular sin frenar el descubrimiento.', keyFeature: 'Revelación puntual con explicación.', systemTone: 'Directo y energético' },
    { id: 'seg-open', name: 'Open Minded', values: 'curiosidad, individualidad, creatividad', uxRequirement: 'Transparencia y personalización expresiva.', keyFeature: 'Prompts de filtro en lenguaje natural.', systemTone: 'Cercano y exploratorio' },
    { id: 'seg-realists', name: 'Realists', values: 'seguridad, pragmatismo, eficiencia', uxRequirement: 'Confianza verificable y bajo ruido.', keyFeature: 'Badge de confianza y modo estricto.', systemTone: 'Claro y sobrio' },
    { id: 'seg-organics', name: 'Organics', values: 'bienestar, arraigo, equilibrio', uxRequirement: 'Reducir carga y preservar bienestar digital.', keyFeature: 'Pausas y sensibilidad contextual.', systemTone: 'Calmo y protector' },
  ],
  assignments: [
    { id: 'assign-dani', userId: 'ext-dani', alias: 'Dani', segmentIds: ['seg-open', 'seg-organics'], evidence: 'Pide decidir qué filtrar según estreno y reporta fatiga por scroll.' },
    { id: 'assign-alma', userId: 'ext-alma', alias: 'Alma', segmentIds: ['seg-realists'], evidence: 'Prioriza evitar fraude y saber por qué se ocultó algo.' },
    { id: 'assign-nico', userId: 'ext-nico', alias: 'Nico', segmentIds: ['seg-adventurers', 'seg-open'], evidence: 'Explora tendencias, pero quiere revelar rápidamente un falso positivo.' },
  ],
}

const experts: ExpertInterview[] = [{
  ...base, id: 'expert-marina', alias: 'Marina L. (demostración)', role: 'Especialista en ML responsable', domain: 'NLP y moderación de contenido', yearsExperience: 8, organization: 'Laboratorio universitario', date: '2026-09-14', medium: 'remoto',
  script: [
    { id: 'qa-1', question: '¿Cuál es el riesgo principal de un clasificador de spoilers?', answer: 'Un falso positivo erosiona la confianza si el usuario no entiende el motivo.', keyQuote: true },
    { id: 'qa-2', question: '¿Qué debe comunicarse sobre privacidad?', answer: 'El alcance de datos y la retención deben ser explícitos y mínimos.', keyQuote: false },
  ],
  keyConcepts: ['BETO', 'calibración de confianza', 'falsos positivos'], jargon: ['umbral', 'inferencia', 'recall'], dependencies: ['DOM de la red social', 'modelo BETO', 'reglas del usuario'], ecosystemActors: ['usuario', 'plataforma social', 'equipo de ML'],
  risks: 'Deriva del modelo, cambios de DOM y percepción de intrusividad.', references: 'Documentación BETO; guías de moderación responsable.', notes: 'Explicar siempre etiqueta y porcentaje antes de revelar.', nextSteps: 'Probar tres umbrales con usuarios de distinta tolerancia.'
}]

const extremeUsers: ExtremeUser[] = [
  { ...base, id: 'ext-dani', classification: 'inexperto', alias: 'Dani (demostración)', context: 'Usuario extremo que se autoidentifica con TDAH; scroll nocturno intenso.', frequency: '4-6 horas/día', skill: 4, observedTasks: 'Recorre X e Instagram durante estrenos; busca resúmenes y fandom.', workarounds: 'Silencia palabras manualmente y abandona la app durante 24 h.', frictions: 'Spoilers antes de terminar episodios; controles escondidos; fatiga visual.', extremeNeed: 'Pausar spoilers sin aislarse por completo.', generalizationHypothesis: 'Usuarios promedio también prefieren un control temporal y reversible.', evidence: 'Nota de sesión: 2026-09-15 21:10; captura por sustituir.' },
  { ...base, id: 'ext-alma', classification: 'mainstream', alias: 'Alma (demostración)', context: 'Profesional que consulta Facebook y WhatsApp en descansos.', frequency: '45 min/día', skill: 6, observedTasks: 'Revisa noticias locales y Marketplace.', workarounds: 'Reporta anuncios y bloquea perfiles después de ver la estafa.', frictions: 'No diferencia spam, fraude y contenido patrocinado al primer vistazo.', extremeNeed: 'Entender la razón de un bloqueo antes de abrirlo.', generalizationHypothesis: 'Una etiqueta legible eleva la confianza de personas no técnicas.', evidence: 'Observación remota: 2026-09-16 13:05; enlace de evidencia pendiente.' },
  { ...base, id: 'ext-nico', classification: 'super-experto', alias: 'Nico (demostración)', context: 'Creador digital que gestiona comunidades y múltiples feeds.', frequency: '7 horas/día', skill: 9, observedTasks: 'Monitorea tendencias y modera comentarios.', workarounds: 'Usa filtros nativos, listas y scripts de palabras clave.', frictions: 'Los filtros binarios no explican confianza ni respetan contexto.', extremeNeed: 'Ajustar sensibilidad sin perder velocidad de exploración.', generalizationHypothesis: 'Los controles avanzados pueden ofrecerse como configuración progresiva.', evidence: 'Registro de pantalla: sustituir con archivo autorizado; timestamp 00:08:42.' },
]

const observations: Observation[] = [
  { ...base, id: 'obs-dani', place: 'Sesión remota - feed de X', date: '2026-09-15', duration: '35 min', activity: 'Explorar publicaciones durante estreno', obviousNeeds: 'Botón para ocultar palabras y spoilers.', hiddenNeeds: 'Conservar pertenencia social sin exponerse a revelaciones; sentir control sin tener que abandonar el feed.', rawBehavior: 'Dani pasó rápido por 18 publicaciones, leyó hashtags y cerró X al encontrar un spoiler.', interpretation: 'La evasión total sustituye una herramienta de control graduado.', innovationPotential: 'alto' },
  { ...base, id: 'obs-alma', place: 'Sesión remota - Facebook', date: '2026-09-16', duration: '25 min', activity: 'Revisar Marketplace y noticias', obviousNeeds: 'Eliminar promociones repetidas.', hiddenNeeds: 'Saber que la herramienta no lee mensajes ni censura noticias relevantes.', rawBehavior: 'Alma abrió dos publicaciones dudosas para decidir si eran fraude.', interpretation: 'Necesita una explicación breve antes de revelar o descartar contenido.', innovationPotential: 'alto' },
]

const empathyMaps: EmpathyMap[] = [{
  ...base, id: 'map-dani', subject: 'Dani - usuario extremo (datos de demostración)',
  fragments: [
    { id: 'frag-1', text: 'No quiero desaparecer de redes cada vez que sale un capítulo.', quadrant: 'dice' },
    { id: 'frag-2', text: 'Silencia palabras y vuelve al día siguiente.', quadrant: 'hace' },
    { id: 'frag-3', text: 'Si la IA se equivoca, quizá me oculta algo importante.', quadrant: 'piensa' },
    { id: 'frag-4', text: 'Siente ansiedad al ver una miniatura antes de poder ignorarla.', quadrant: 'siente', emotionalIntensity: 8 },
  ],
  insights: [
    { id: 'insight-control', type: 'necesidad oculta', description: 'El control debe ser temporal, reversible y conservar el sentido de pertenencia al feed.', priority: 9 },
    { id: 'insight-trust', type: 'carga cognitiva', description: 'La razón y confianza del filtro deben poder escanearse sin revelar el contenido.', priority: 8 },
  ],
}]

const requirements: RequirementMapping[] = [
  { ...base, id: 'req-overlay', insightId: 'insight-control', insightLabel: 'Control temporal y reversible', segmentId: 'seg-open', segmentLabel: 'Open Minded', functionalRequirement: 'Crear reglas temporales por prompt y revelar una publicación bajo demanda.', uxRequirement: 'La acción debe ser reversible en un clic, con explicación visible.', basePriority: 9, impactFactor: 1.2, computedPriority: 54.5, validationStatus: 'pendiente', architectureDecision: 'Overlay no destructivo sobre el DOM; reglas locales en IndexedDB.' },
  { ...base, id: 'req-badge', insightId: 'insight-trust', insightLabel: 'Confianza escaneable', segmentId: 'seg-realists', segmentLabel: 'Realists', functionalRequirement: 'Mostrar etiqueta y porcentaje de confianza junto al contenido difuminado.', uxRequirement: 'Contraste AA y texto comprensible sin jerga de ML.', basePriority: 8, impactFactor: 1, computedPriority: 45.5, validationStatus: 'requiere seguimiento', architectureDecision: 'Badge accesible con explicación y reporte de falso positivo.' },
]

export async function initializeDemoData() {
  const setting = await list<{ id: string; createdAt: string; updatedAt: string }>('settings')
  if (setting.some((item) => item.id === 'demo-seed-v1')) return
  await Promise.all([
    bulkSave('experts', experts), bulkSave('extremeUsers', extremeUsers), bulkSave('observations', observations),
    bulkSave('empathyMaps', empathyMaps), bulkSave('roperDynagrams', [roper]), bulkSave('requirements', requirements),
    bulkSave('settings', [{ ...base, id: 'demo-seed-v1' }]),
  ])
}
