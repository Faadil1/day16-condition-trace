import type { ConditionRecord } from '../types/evidence'

export const objectRecord = {
  name: 'Vessel with Reed Pattern',
  accession: 'CT-1847',
  material: 'Glazed earthenware',
  date: 'Circa 1880',
  loanStatus: 'Returned',
  investigationStatus: 'Review in progress',
  lender: 'North Archive Museum',
  borrower: 'Alder House Museum',
  transport: 'Meridian Fine Art Logistics',
  feature: {
    type: 'Hairline crack',
    location: 'Upper-right shoulder',
    length: 'Approximately 18 mm',
  },
}

export const records: ConditionRecord[] = [
  {
    id: 'pre-departure',
    shortLabel: 'Pre-departure',
    title: 'Pre-departure condition report',
    institution: 'North Archive Museum',
    date: 'July 14, 2026',
    examiner: 'Conservator',
    signed: true,
    lighting: 'Diffuse light only',
    featureStatus: 'Feature not visible',
    evidenceStatus: 'PARTIAL',
    note: 'Equivalent raking-light examination was not completed.',
  },
  {
    id: 'borrower-incoming',
    shortLabel: 'Loan arrival',
    title: 'Borrower incoming inspection',
    institution: 'Alder House Museum',
    date: 'July 16, 2026',
    examiner: 'Registrar',
    signed: true,
    lighting: 'Diffuse light only',
    featureStatus: 'Feature not visible',
    evidenceStatus: 'PARTIAL',
  },
  {
    id: 'return-departure',
    shortLabel: 'Return handoff',
    title: 'Borrower return departure',
    institution: 'Alder House Museum',
    date: 'August 1, 2026',
    examiner: 'Conservator',
    signed: true,
    lighting: 'Diffuse light only',
    featureStatus: 'Not examined under raking light',
    evidenceStatus: 'PARTIAL',
  },
  {
    id: 'return-arrival',
    shortLabel: 'Return arrival',
    title: 'Lender return arrival',
    institution: 'North Archive Museum',
    date: 'August 3, 2026',
    examiner: 'Conservator',
    signed: true,
    lighting: 'Diffuse and raking light',
    featureStatus: 'Observed',
    evidenceStatus: 'VERIFIED',
  },
]

export const coreFinding = `An approximately 18 mm hairline crack on the upper-right shoulder was first documented during the return arrival inspection at North Archive Museum on August 3, 2026.

The feature is not visible in the prior diffuse-light records reviewed.

Equivalent raking-light documentation was not completed at departure. The previous absence of the feature therefore cannot be confirmed.

Period requiring review:
Alder House Museum return handoff → North Archive Museum return arrival.

No determination of cause or liability is made by this record.`
