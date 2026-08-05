import { ArrowLeft, Download, X } from 'lucide-react'
import { coreFinding, objectRecord, records } from '../data/objectRecord'
import { EvidenceStatus } from './EvidenceStatus'

export function GeneratedRecord({ onClose }: { onClose: () => void }) {
  const exportRecord = () => {
    const payload = {
      title: 'Condition Trace Evidence Record',
      object: objectRecord,
      recordsReviewed: records,
      finding: coreFinding,
      reviewStatus: 'Human-reviewed comparison',
      generated: new Date().toISOString(),
      limitation: 'No determination of cause or liability is made by this record.',
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
          <div className="finding-copy">
            <span className="document-label">CORE FINDING / HUMAN-REVIEWED COMPARISON</span>
            {coreFinding.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
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
