export type ID = string

export interface BaseRecord { id: ID; createdAt: string; updatedAt: string }

export interface QuestionAnswer { id: ID; question: string; answer: string; keyQuote: boolean }
export interface ExpertInterview extends BaseRecord {
  alias: string; role: string; domain: string; yearsExperience: number; organization: string
  date: string; medium: 'presencial' | 'remoto'; script: QuestionAnswer[]
  keyConcepts: string[]; jargon: string[]; dependencies: string[]; ecosystemActors: string[]
  risks: string; references: string; notes: string; nextSteps: string
}

export type ExtremeClassification = 'super-experto' | 'inexperto' | 'mainstream'
export interface ExtremeUser extends BaseRecord {
  classification: ExtremeClassification; alias: string; context: string; frequency: string; skill: number
  observedTasks: string; workarounds: string; frictions: string; extremeNeed: string; generalizationHypothesis: string; evidence: string
}

export interface Observation extends BaseRecord {
  place: string; date: string; duration: string; activity: string; obviousNeeds: string; hiddenNeeds: string
  rawBehavior: string; interpretation: string; innovationPotential: 'bajo' | 'alto'
}

export type Quadrant = 'dice' | 'hace' | 'piensa' | 'siente'
export interface EmpathyFragment { id: ID; text: string; quadrant: Quadrant | 'inbox'; emotionalIntensity?: number }
export type InsightType = 'usabilidad' | 'necesidad oculta' | 'carga cognitiva' | 'adaptación manual' | 'innovación potencial'
export interface Insight { id: ID; type: InsightType; description: string; priority: number }
export interface EmpathyMap extends BaseRecord { subject: string; fragments: EmpathyFragment[]; insights: Insight[] }

export interface Segment { id: ID; name: string; values: string; uxRequirement: string; keyFeature: string; systemTone: string }
export interface SegmentAssignment { id: ID; userId?: ID; alias: string; segmentIds: ID[]; evidence: string }
export interface RoperDynagram extends BaseRecord { title: string; segments: Segment[]; assignments: SegmentAssignment[] }

export type ValidationStatus = 'pendiente' | 'validado' | 'requiere seguimiento'
export interface RequirementMapping extends BaseRecord {
  insightId?: ID; insightLabel: string; segmentId?: ID; segmentLabel: string
  functionalRequirement: string; uxRequirement: string; basePriority: number; impactFactor: number
  computedPriority: number; validationStatus: ValidationStatus; architectureDecision: string
}

export type StoreName = 'experts' | 'extremeUsers' | 'observations' | 'empathyMaps' | 'roperDynagrams' | 'requirements' | 'settings'
export type ResearchRecord = ExpertInterview | ExtremeUser | Observation | EmpathyMap | RoperDynagram | RequirementMapping | BaseRecord
