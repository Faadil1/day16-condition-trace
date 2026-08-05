export type EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNVERIFIED' | 'MISSING'
export type WorkflowStep = 'open' | 'records' | 'inspect' | 'compare' | 'finding' | 'record'

export interface ConditionRecord {
  id: string
  shortLabel: string
  title: string
  institution: string
  date: string
  examiner: string
  signed: boolean
  lighting: string
  featureStatus: string
  evidenceStatus: EvidenceStatus
  note?: string
}
