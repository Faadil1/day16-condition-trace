import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Crosshair, MoveHorizontal } from 'lucide-react'
import * as THREE from 'three'
import { CeramicVessel } from './CeramicVessel'
import { objectRecord, records } from '../data/objectRecord'
import { toGrazingAngle } from '../lib/examination'
import type { CapturedObservation, WorkflowStep } from '../types/evidence'

function CameraRig({ inspection }: { inspection: boolean }) {
  const { camera } = useThree()
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (cam.fov === undefined) return
    const target = inspection ? 28 : 30
    cam.fov += (target - cam.fov) * 0.045
    cam.updateProjectionMatrix()
  })
  return null
}

function CapturedEvidenceStage({ observation }: { observation: CapturedObservation | null }) {
  return (
    <div className="captured-evidence-stage" aria-label="Captured raking-light observation">
      <div className="capture-stage-meta">
        <span>CAPTURED OBSERVATION / {observation?.id ?? 'OBS-04'}</span>
        <strong>Raking light · {Math.round(observation?.angle ?? 9)}° from surface</strong>
      </div>

      <div className="capture-stage-photo-frame">
        {observation?.imageDataUrl ? (
          <img className="capture-stage-photo" src={observation.imageDataUrl} alt="Captured raking-light view of the vessel" />
        ) : (
          <div className="capture-stage-fallback" aria-hidden="true">
            <span className="fallback-vessel" />
          </div>
        )}
        <div className="capture-focus-ring"><i /><span>{observation?.area ?? 'Upper-right shoulder'}</span></div>
      </div>

      <div className="capture-stage-readout">
        <div><span>OBSERVATION</span><strong>{observation?.feature ?? 'Hairline crack legible'}</strong></div>
        <div><span>AREA</span><strong>{observation?.area ?? 'Upper-right shoulder'}</strong></div>
        <div><span>STATUS</span><strong>{observation?.status ?? 'Human-reviewed'}</strong></div>
      </div>
    </div>
  )
}

function RecordsOverviewStage({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="records-overview-stage" aria-label="Evidence record chain">
      <header className="records-stage-header">
        <div>
          <span>CASE {objectRecord.accession} / DOCUMENTATION SET</span>
          <h2>Evidence record chain</h2>
        </div>
        <p>Four signed moments establish what was documented, under which examination conditions, and where equivalence breaks.</p>
      </header>

      <div className="records-stage-rule"><span>14 JUL</span><i /><span>03 AUG 2026</span></div>

      <div className="records-stage-grid">
        {records.map((record, index) => (
          <button
            type="button"
            key={record.id}
            className={`records-folio ${selectedId === record.id ? 'active' : ''}`}
            onClick={() => onSelect(record.id)}
            aria-label={`Review ${record.title}`}
          >
            <div className="records-folio-index">0{index + 1}</div>
            <div className="records-folio-topline">
              <span>{record.date}</span>
              <em>{record.evidenceStatus}</em>
            </div>
            <strong>{record.shortLabel}</strong>
            <p>{record.institution}</p>
            <dl>
              <div><dt>LIGHT</dt><dd>{record.lighting}</dd></div>
              <div><dt>FEATURE</dt><dd>{record.featureStatus}</dd></div>
            </dl>
            <div className="records-folio-source">SIGNED / {record.examiner.toUpperCase()}</div>
          </button>
        ))}
      </div>

      <footer className="records-stage-footer">
        <span>04 signed records</span>
        <span>01 equivalent-lighting gap</span>
        <strong>Human-reviewed documentation set</strong>
      </footer>
    </div>
  )
}

export function ObjectStage({ step, lightAngle, onLightAngle, observation, onCanvasReady, selectedId, onSelectRecord }: {
  step: WorkflowStep
  lightAngle: number
  onLightAngle: (value: number) => void
  observation: CapturedObservation | null
  onCanvasReady: (canvas: HTMLCanvasElement) => void
  selectedId: string
  onSelectRecord: (id: string) => void
}) {
  const inspection = step === 'inspect'
  const compare = step === 'compare'
  const recordsMode = step === 'records'
  const open = step === 'open'
  const reveal = inspection
    ? Math.max(0, (lightAngle - 48) / 34)
    : compare || step === 'finding' || step === 'record' ? 1 : 0
  const x = -4.6 + (lightAngle / 90) * 9.2
  const bandLeft = `${(lightAngle / 90) * 82 + 7}%`
  const grazingAngle = toGrazingAngle(lightAngle)
  const vesselOffset = open ? 0.72 : 0

  return (
    <section className={`object-stage ${compare ? 'compare-capture-mode' : ''} ${recordsMode ? 'records-archive-mode' : ''}`} aria-label={recordsMode ? 'Evidence archive' : 'Three-dimensional object examination'}>
      <div className="stage-number">{recordsMode ? 'EVIDENCE ARCHIVE / 04 RECORDS' : 'OBJECT / 01'}</div>

      {open && (
        <>
          <div className="stage-examination-badge">
            <span className="exam-label">RETURN EXAMINATION</span>
            <span className="exam-status">Lighting conditions not yet reviewed</span>
          </div>
          <div className="open-stage-hero">
            <span>CONSERVATION REVIEW / {objectRecord.accession}</span>
            <h2>Condition<br />Trace</h2>
            <p>Every mark has a moment.<br />Every moment has a record.</p>
            <small>Establish the first documented appearance of surface change across non-equivalent records.</small>
          </div>
        </>
      )}

      {inspection && <div className="grazing-band" style={{ left: bandLeft }} aria-hidden="true" />}

      {recordsMode ? (
        <RecordsOverviewStage selectedId={selectedId} onSelect={onSelectRecord} />
      ) : compare ? (
        <CapturedEvidenceStage observation={observation} />
      ) : (
        <Canvas
          shadows
          camera={{ position: [0, 0.04, 6.2], fov: 30 }}
          dpr={[1, 1.5]}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.04
            onCanvasReady(gl.domElement)
          }}
        >
          <color attach="background" args={['#14262A']} />
          <CameraRig inspection={inspection} />

          <hemisphereLight args={['#ead9bb', '#14282a', inspection ? 0.23 : 0.48]} />
          <ambientLight intensity={inspection ? 0.11 : 0.31} color="#d2c7ad" />

          <spotLight
            position={[x, 1.85, 3.7]}
            angle={inspection ? 0.19 : 0.5}
            penumbra={inspection ? 0.5 : 0.84}
            intensity={inspection ? 5.45 : 1.68}
            color="#f0d9ad"
            castShadow
          />

          <directionalLight position={[-3.4, 2.7, 4.4]} intensity={inspection ? 0.28 : 0.62} color="#c9b99a" />
          <directionalLight position={[-1.8, -2.6, 3.2]} intensity={inspection ? 0.065 : 0.13} color="#a58e71" />
          <directionalLight position={[2.8, 2.4, -4.8]} intensity={0.13} color="#708B94" />

          <group position={[vesselOffset, 0, 0]}>
            <CeramicVessel reveal={reveal} active={inspection} />
          </group>
          <ContactShadows position={[vesselOffset, -1.53, 0]} opacity={0.32} scale={4.7} blur={3.5} />
          <Environment preset="studio" environmentIntensity={0.045} />
          <OrbitControls
            target={[vesselOffset, 0, 0]}
            enablePan={false}
            enableZoom={false}
            minAzimuthAngle={-0.65}
            maxAzimuthAngle={0.65}
            minPolarAngle={Math.PI / 2.45}
            maxPolarAngle={Math.PI / 1.82}
          />
        </Canvas>
      )}

      {!recordsMode && (
        <div className="object-caption">
          <span>GLAZED EARTHENWARE / CIRCA 1880</span>
          <h1>Vessel with Reed Pattern</h1>
          <p>North Archive Museum · {inspection ? 'Raking-light examination' : compare ? 'Captured return-arrival observation' : 'Return arrival review'}</p>
        </div>
      )}

      {inspection && (
        <div className="inspection-mode-card">
          <span>EXAMINATION MODE</span>
          <strong>Raking light</strong>
          <small>Human-reviewed / surface relief</small>
        </div>
      )}

      {!compare && !recordsMode && (reveal > 0.2 || step === 'finding' || step === 'record') && (
        <div className="annotation-marker" style={{ opacity: Math.max(0.35, reveal) }}>
          <Crosshair size={17} /><span>Upper-right shoulder</span>
        </div>
      )}

      {inspection && (
        <div className="light-console">
          <div className="light-console-copy">
            <MoveHorizontal size={16} />
            <div>
              <strong>Grazing angle</strong>
              <span>Lower angle increases surface-relief visibility</span>
            </div>
            <output>{grazingAngle}°</output>
          </div>
          <input
            aria-label="Raking-light control"
            aria-valuetext={`${grazingAngle} degrees from surface`}
            type="range"
            min="0"
            max="90"
            value={lightAngle}
            onChange={e => onLightAngle(Number(e.target.value))}
          />
          <p>Angle shown from the object surface. Simulated examination; interpretation remains human-reviewed.</p>
        </div>
      )}
    </section>
  )
}
