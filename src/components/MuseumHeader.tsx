import { CircleDot } from 'lucide-react'
import { objectRecord } from '../data/objectRecord'

export function MuseumHeader() {
  return (
    <header className="museum-header">
      <div className="brand-lockup">
        <span className="brand-mark"><i /><i /><i /></span>
        <div>
          <div className="wordmark">CONDITION TRACE</div>
          <div className="tagline">TRACE THE RECORD. NOT THE BLAME.</div>
        </div>
      </div>
      <div className="header-object">
        <span className="header-label">OBJECT RECORD</span>
        <strong>{objectRecord.accession}</strong>
        <span className="header-divider" />
        <span className="review-status"><CircleDot size={13} />{objectRecord.investigationStatus}</span>
      </div>
    </header>
  )
}
