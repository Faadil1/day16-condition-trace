import { ArrowLeft, Download, X } from 'lucide-react'
import { coreFinding, objectRecord, records } from '../data/objectRecord'
import type { CapturedObservation } from '../types/evidence'
import { EvidenceStatus } from './EvidenceStatus'

export function GeneratedRecord({ observation, onClose }: { observation: CapturedObservation | null; onClose: () => void }) {
  const exportRecord = () => {
    const capturedObservation = observation ? {
      id: observation.id,
      capturedAt: observation.capturedAt,
      examinationCondition: `${observation.angle}° from surface`,
      area: observation.area,
      feature: observation.feature,
      reviewStatus: observation.status,
      imageCaptured: Boolean(observation.imageDataUrl),
    } : null

    const payload = {
      title: 'Condition Trace Evidence Record',
      object: objectRecord,
      recordsReviewed: records,
      capturedObservation,
      comparison: {
        earlierEvidence: 'Return handoff · Aug 1, 2026 · diffuse-light documentation only',
        laterEvidence: `${observation?.id ?? 'OBS-04'} · Return arrival · Aug 3, 2026`,
        sameArea: objectRecord.feature.location,
        conditionEquivalence: 'NON_EQUIVALENT',
      },
      evidenceLineage: [
        'SRC-03 — Return handoff source record',
        `${observation?.id ?? 'OBS-04'} — Captured raking-light observation`,
        'CMP-01 — Same-area documentation comparison',
        'LIM-01 — Equivalent prior raking-light evidence unavailable',
        'FND-01 — First documented appearance, qualified',
      ],
      finding: coreFinding,
      findingStatus: 'QUALIFIED',
      reviewStatus: 'Human-reviewed comparison',
      generated: new Date().toISOString(),
      limitation: 'No determination of cause, physical moment of damage, or liability is made by this record.',
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CT-1847-condition-trace-review.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="drawer-backdrop">
      <section className="record-drawer" aria-label="Generated evidence record">
        <button className="drawer-close" onClick={onClose} aria-label="Close evidence record"><X /></button>
        <header className="document-header">
          <div className="document-seal">CT</div>
          <div><span>CONDITION TRACE / REVIEW RECORD</span><h2>First documented appearance</h2></div>
          <span className="doc-id">CT-1847 / 03 AUG 2026</span>
        </header>
        <div className="document-body">
          <div className="doc-meta">
            <div><span>Object</span><strong>{objectRecord.name}</strong></div>
            <div><span>Accession</span><strong>{objectRecord.accession}</strong></div>
            <div><span>Tracked feature</span><strong>{objectRecord.feature.type} · {objectRecord.feature.length}</strong></div>
            <div><span>Location</span><strong>{objectRecord.feature.location}</strong></div>
          </div>

          <div className="doc-observation">
            <div className="doc-observation-visual">
              {observation?.imageDataUrl ? <img src={observation.imageDataUrl} alt="Captured raking-light observation" /> : <span>CAPTURE UNAVAILABLE</span>}
            </div>
            <div className="doc-observation-copy">
              <span className="document-label">CAPTURED OBSERVATION / {observation?.id ?? 'OBS-04'}</span>
              <strong>{observation?.feature ?? 'Hairline crack legible'}</strong>
              <p>{observation?.area ?? 'Upper-right shoulder'} · {observation?.angle ?? 9}° from surface · Human-reviewed</p>
              <small>{observation?.capturedAt ? `Captured ${new Date(observation.capturedAt).toLocaleString()}` : 'Captured during return-arrival examination'}</small>
            </div>
          </div>

          <div className="finding-copy">
            <span className="document-label">CORE FINDING / HUMAN-REVIEWED COMPARISON</span>
            {coreFinding.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="doc-lineage">
            <span className="document-label">EVIDENCE LINEAGE / TRACEABLE</span>
            <div className="doc-lineage-track">
              <div><span>SRC-03</span><strong>Return handoff</strong><small>Diffuse only</small></div>
              <i>→</i>
              <div><span>{observation?.id ?? 'OBS-04'}</span><strong>Captured observation</strong><small>{observation?.angle ?? 9}° from surface</small></div>
              <i>→</i>
              <div><span>CMP-01</span><strong>Comparison</strong><small>Non-equivalent</small></div>
              <i>→</i>
              <div><span>LIM-01</span><strong>Limitation</strong><small>Prior absence unconfirmed</small></div>
              <i>→</i>
              <div className="doc-lineage-finding"><span>FND-01</span><strong>Qualified finding</strong><small>Aug 3, 2026</small></div>
            </div>
          </div>

          <div className="records-reviewed">
            <span className="document-label">RECORDS REVIEWED / 04</span>
            {records.map(record => (
              <div className="doc-record" key={record.id}>
                <div><strong>{record.title}</strong><span>{record.institution} · {record.date}</span></div>
                <div><span>{record.examiner} · Signed</span><span>{record.lighting}</span></div>
                <EvidenceStatus status={record.evidenceStatus} />
              </div>
            ))}
          </div>
          <div className="doc-gap"><span>DOCUMENTATION GAP</span><p>Equivalent raking-light examination was unavailable in departure documentation. Prior absence cannot be confirmed.</p></div>
          <footer><span>REVIEW STATUS</span><strong>Human review required · No cause attributed · No liability determination</strong></footer>
        </div>
        <div className="drawer-actions">
          <button className="secondary-action" onClick={onClose}><ArrowLeft size={16} />Return to evidence</button>
          <button className="primary-action" onClick={exportRecord}>Export review record <Download size={16} /></button>
        </div>
      </section>
    </div>
  )
}
