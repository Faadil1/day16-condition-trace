import { AlertTriangle, ArrowDown, CheckCircle2, GitCompareArrows, ScanLine } from 'lucide-react'
import type { CapturedObservation } from '../types/evidence'

export function EvidenceLineage({ observation }: { observation: CapturedObservation | null }) {
  const angle = observation?.angle ?? 9
  const captured = observation?.id ?? 'OBS-04'

  const nodes = [
    {
      id: 'SRC-03',
      label: 'SOURCE RECORD',
      title: 'Return handoff · Aug 1',
      detail: 'Diffuse-light documentation only',
      outcome: 'No equivalent raking-light capture',
      tone: 'partial',
      icon: <ScanLine size={14} />,
    },
    {
      id: captured,
      label: 'CAPTURED OBSERVATION',
      title: 'Return arrival · Aug 3',
      detail: `${angle}° from surface · Upper-right shoulder`,
      outcome: observation?.feature ?? 'Hairline crack legible',
      tone: 'verified',
      icon: <CheckCircle2 size={14} />,
    },
    {
      id: 'CMP-01',
      label: 'DOCUMENTATION COMPARISON',
      title: 'Same area reviewed',
      detail: 'Earlier and later evidence compared',
      outcome: 'Examination conditions are not equivalent',
      tone: 'comparison',
      icon: <GitCompareArrows size={14} />,
    },
    {
      id: 'LIM-01',
      label: 'LIMITATION',
      title: 'Prior absence cannot be confirmed',
      detail: 'Equivalent raking-light evidence unavailable',
      outcome: 'Physical timing remains undetermined',
      tone: 'limitation',
      icon: <AlertTriangle size={14} />,
    },
    {
      id: 'FND-01',
      label: 'QUALIFIED FINDING',
      title: 'First documented appearance',
      detail: 'North Archive Museum · Aug 3, 2026',
      outcome: 'Documentation boundary established',
      tone: 'finding',
      icon: <CheckCircle2 size={14} />,
    },
  ]

  return (
    <section className="evidence-lineage" aria-label="Evidence lineage">
      <div className="lineage-heading">
        <span>EVIDENCE LINEAGE / 05</span>
        <strong>Traceable finding</strong>
      </div>
      <div className="lineage-flow">
        {nodes.map((node, index) => (
          <div key={node.id} className="lineage-node-wrap">
            <article className={`lineage-node tone-${node.tone}`}>
              <div className="lineage-node-id">{node.icon}<span>{node.id}</span><em>{node.label}</em></div>
              <strong>{node.title}</strong>
              <p>{node.detail}</p>
              <small>{node.outcome}</small>
            </article>
            {index < nodes.length - 1 && <ArrowDown className="lineage-arrow" size={13} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  )
}
