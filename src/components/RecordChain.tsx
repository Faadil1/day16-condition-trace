import { motion } from 'framer-motion'
import { records } from '../data/objectRecord'
import { EvidenceStatus } from './EvidenceStatus'

const previewLabels = ['PRE-DEPARTURE', 'BORROWER INCOMING', 'RETURN DEPARTURE', 'RETURN ARRIVAL']

export function RecordChain({ selectedId, onSelect, expanded, highlightPeriod }: {
  selectedId: string
  onSelect: (id: string) => void
  expanded: boolean
  highlightPeriod: boolean
}) {
  return (
    <motion.section
      className={`record-chain ${expanded ? 'expanded' : ''}`}
      animate={{ height: expanded ? 178 : 74 }}
    >
      <div className="chain-heading">
        <span>RECORD CHAIN / 04 MOMENTS</span>
        {!expanded && <span>Review chain to continue</span>}
      </div>

      {/* Subdued inactive preview shown before chain is expanded */}
      {!expanded && (
        <div className="chain-preview">
          {previewLabels.map((label, i) => (
            <span key={label} className="chain-preview-item">
              {i > 0 && <span className="chain-preview-sep">→</span>}
              {label}
            </span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="record-track">
          {records.map((record, index) => (
            <div className="track-segment" key={record.id}>
              <button
                className={`record-node ${selectedId === record.id ? 'active' : ''}`}
                onClick={() => onSelect(record.id)}
                aria-label={`Open ${record.title}`}
              >
                <span className="node-index">0{index + 1}</span>
                <span className="node-dot" />
                <span className="node-date">{record.date}</span>
                <strong>{record.shortLabel}</strong>
                <span className="node-institution">{record.institution}</span>
                <EvidenceStatus status={record.evidenceStatus} />
              </button>
              {index < records.length - 1 && (
                <div className={`handoff ${highlightPeriod && index === 2 ? 'highlight' : ''}`}>
                  <span>{index === 2 ? 'Between handoffs' : 'Handoff'}</span><i />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.section>
  )
}
