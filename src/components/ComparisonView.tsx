import { ArrowRight, ScanLine } from 'lucide-react'
import { records } from '../data/objectRecord'
import { EvidenceStatus } from './EvidenceStatus'

export function ComparisonView() {
  const previous = records[0]
  const current = records[3]
  return (
    <div className="comparison">
      <div className="comparison-grid">
        {[previous, current].map((record, i) => (
          <article className="comparison-frame" key={record.id}>
            <div className="comparison-visual">
              <div className={`vessel-crop ${i ? 'crack-visible' : ''}`}><ScanLine /></div>
              <span className="location-guide">ALIGNED AREA / UPPER-RIGHT SHOULDER</span>
            </div>
            <span className="eyebrow">{i ? 'RETURN ARRIVAL' : 'PRE-DEPARTURE'}</span>
            <strong>{record.lighting}</strong>
            <p>{record.featureStatus}</p>
            <EvidenceStatus status={record.evidenceStatus} />
          </article>
        ))}
      </div>
      <div className="comparison-finding">
        <ArrowRight size={18} />
        <p><strong>Feature first documented in the return arrival inspection.</strong> Equivalent raking-light photography was not completed at departure. Prior absence cannot be confirmed.</p>
      </div>
    </div>
  )
}
