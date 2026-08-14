import { Canvas } from '@react-three/fiber'
import { ArrowRight, Link2, ScanLine, TriangleAlert } from 'lucide-react'
import { records } from '../data/objectRecord'
import { CeramicVessel } from './CeramicVessel'
import { EvidenceStatus } from './EvidenceStatus'

function EvidencePlate({ raking, reveal }: { raking: boolean; reveal: number }) {
  return (
    <div className="comparison-visual" aria-hidden="true">
      <Canvas
        camera={{ position: [0.15, 0.18, 4.85], fov: 34 }}
        dpr={[1, 1.25]}
        frameloop="demand"
      >
        <color attach="background" args={['#190E0C']} />
        <ambientLight intensity={raking ? 0.18 : 0.88} color="#d8c8a8" />
        {raking ? (
          <>
            <spotLight position={[3.7, 2.6, 3]} angle={0.26} penumbra={0.72} intensity={8.2} color="#f6e6bd" />
            <directionalLight position={[-2.2, 1.4, 2]} intensity={0.28} color="#8c7b60" />
          </>
        ) : (
          <>
            <directionalLight position={[2.3, 3, 3.5]} intensity={1.4} color="#ead9b7" />
            <directionalLight position={[-2, 1.2, 2]} intensity={0.6} color="#a89b82" />
          </>
        )}
        <CeramicVessel reveal={reveal} active />
      </Canvas>
      <div className="comparison-reticle"><ScanLine size={14} /><span>Upper-right shoulder</span></div>
      {raking && <div className="comparison-light-band" />}
    </div>
  )
}

export function ComparisonView({ observationAngle }: { observationAngle: number }) {
  const previous = records[2]
  const current = records[3]
  const angle = Math.round(observationAngle)

  return (
    <div className="comparison">
      <div className="comparison-pair-label">
        <span>A/B EVIDENCE PAIR</span>
        <strong>Same area · non-equivalent lighting</strong>
      </div>

      <div className="comparison-grid">
        <article className="comparison-frame prior">
          <div className="comparison-frame-head">
            <span className="eyebrow">A · RETURN HANDOFF</span>
            <EvidenceStatus status={previous.evidenceStatus} />
          </div>
          <EvidencePlate raking={false} reveal={0} />
          <div className="comparison-meta">
            <span>{previous.date}</span>
            <strong>{previous.institution}</strong>
            <p>{previous.lighting}</p>
            <div className="comparison-observation"><span>OBSERVATION</span><strong>{previous.featureStatus}</strong></div>
          </div>
        </article>

        <div className="comparison-sync-rail" aria-hidden="true">
          <Link2 size={15} />
          <span>AREA<br />ALIGNED</span>
        </div>

        <article className="comparison-frame current">
          <div className="comparison-frame-head">
            <span className="eyebrow">B · RETURN ARRIVAL</span>
            <EvidenceStatus status={current.evidenceStatus} />
          </div>
          <EvidencePlate raking reveal={1} />
          <div className="comparison-meta">
            <span>{current.date}</span>
            <strong>{current.institution}</strong>
            <p>Raking light · {angle}°</p>
            <div className="comparison-observation verified"><span>OBSERVATION</span><strong>Hairline crack legible</strong></div>
          </div>
        </article>
      </div>

      <div className="comparison-limit">
        <TriangleAlert size={16} />
        <div><span>COMPARISON LIMITATION</span><strong>Lighting conditions are not equivalent.</strong><p>Departure documentation does not include raking-light examination, so prior physical absence cannot be established.</p></div>
      </div>

      <div className="comparison-finding">
        <ArrowRight size={18} />
        <p><strong>Qualified finding:</strong> the feature is first documented in the return arrival examination. The record supports a documentation boundary, not a determination of when damage physically occurred.</p>
      </div>
    </div>
  )
}
