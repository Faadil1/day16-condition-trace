import { ArrowRight, ImageOff, Link2, ScanLine, TriangleAlert } from 'lucide-react'
import { records } from '../data/objectRecord'
import { toGrazingAngle } from '../lib/examination'
import type { CapturedObservation } from '../types/evidence'
import { EvidenceStatus } from './EvidenceStatus'

function DocumentaryGapPlate() {
  return (
    <div className="comparison-visual comparison-documentary-gap" aria-label="Equivalent raking-light capture unavailable">
      <div className="comparison-gap-grid" aria-hidden="true" />
      <div className="comparison-gap-content">
        <ImageOff size={18} />
        <span>NO EQUIVALENT RAKING-LIGHT CAPTURE</span>
        <strong>Diffuse documentation only</strong>
      </div>
      <div className="comparison-gap-area"><ScanLine size={12} /><span>Upper-right shoulder documented</span></div>
    </div>
  )
}

function CapturedEvidencePlate({ imageDataUrl }: { imageDataUrl?: string }) {
  return (
    <div className="comparison-visual comparison-captured-visual" aria-label="Captured raking-light observation">
      {imageDataUrl ? (
        <img className="comparison-captured-photo" src={imageDataUrl} alt="Captured raking-light observation of the upper-right shoulder" />
      ) : (
        <div className="comparison-capture-missing">Captured frame unavailable</div>
      )}
      <div className="comparison-reticle"><ScanLine size={14} /><span>Upper-right shoulder</span></div>
    </div>
  )
}

export function ComparisonView({ observationAngle, observation }: { observationAngle: number; observation: CapturedObservation | null }) {
  const previous = records[2]
  const current = records[3]
  const angle = Math.round(observation?.angle ?? toGrazingAngle(observationAngle))

  return (
    <div className="comparison">
      <div className="comparison-pair-label">
        <span>DOCUMENTATION COMPARISON</span>
        <strong>Same area · non-equivalent examination conditions</strong>
      </div>

      <div className="comparison-grid">
        <article className="comparison-frame prior">
          <div className="comparison-frame-head">
            <span className="eyebrow">A · RETURN HANDOFF</span>
            <EvidenceStatus status={previous.evidenceStatus} />
          </div>
          <DocumentaryGapPlate />
          <div className="comparison-meta">
            <span>{previous.date}</span>
            <strong>{previous.institution}</strong>
            <p>{previous.lighting}</p>
            <div className="comparison-observation">
              <span>RECORD LIMIT</span>
              <strong>Equivalent raking-light evidence unavailable</strong>
            </div>
          </div>
        </article>

        <div className="comparison-sync-rail" aria-hidden="true">
          <Link2 size={15} />
          <span>AREA MATCH<br />LIGHTING GAP</span>
        </div>

        <article className="comparison-frame current">
          <div className="comparison-frame-head">
            <span className="eyebrow">B · CAPTURED RETURN ARRIVAL</span>
            <EvidenceStatus status={current.evidenceStatus} />
          </div>
          <CapturedEvidencePlate imageDataUrl={observation?.imageDataUrl} />
          <div className="comparison-meta">
            <span>{current.date} · {observation?.id ?? 'OBS-04'}</span>
            <strong>{current.institution}</strong>
            <p>Raking light · {angle}° from surface</p>
            <div className="comparison-observation verified"><span>OBSERVATION</span><strong>{observation?.feature ?? 'Hairline crack legible'}</strong></div>
          </div>
        </article>
      </div>

      <div className="comparison-limit">
        <TriangleAlert size={16} />
        <div>
          <span>COMPARISON LIMITATION</span>
          <strong>Lighting conditions are not equivalent.</strong>
          <p>The handoff record documents the same object area under diffuse light, but no equivalent grazing-light capture exists. Prior physical absence therefore cannot be established.</p>
        </div>
      </div>

      <div className="comparison-finding">
        <ArrowRight size={18} />
        <p><strong>Qualified finding:</strong> the feature is first documented in captured observation {observation?.id ?? 'OBS-04'}. The record supports a documentation boundary, not a determination of when damage physically occurred.</p>
      </div>
    </div>
  )
}
