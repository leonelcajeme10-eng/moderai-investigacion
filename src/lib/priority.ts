import type { RequirementMapping, RoperDynagram } from '../types/research'

/**
 * Ley embebida: puntaje_i = (prioridadBase_i × factorImpacto_i × pesoSegmento_i) /
 * Σ(prioridadBase × factorImpacto × pesoSegmento) × 100.
 * El peso del segmento es su cuota observada (asignaciones); si no hay segmento, vale 1.
 */
export function normalizePriorities(mappings: RequirementMapping[], roper?: RoperDynagram): RequirementMapping[] {
  const segmentWeights = new Map<string, number>()
  roper?.segments.forEach((segment) => {
    segmentWeights.set(segment.id, Math.max(1, roper.assignments.filter((a) => a.segmentIds.includes(segment.id)).length))
  })
  const raw = mappings.map((mapping) => Math.max(1, mapping.basePriority) * Math.max(0.1, mapping.impactFactor) * (mapping.segmentId ? (segmentWeights.get(mapping.segmentId) ?? 1) : 1))
  const total = raw.reduce((sum, value) => sum + value, 0) || 1
  return mappings.map((mapping, index) => ({ ...mapping, computedPriority: Math.round((raw[index] / total) * 1000) / 10 }))
}
