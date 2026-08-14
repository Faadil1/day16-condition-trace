import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Crosshair, MoveHorizontal } from 'lucide-react'
import * as THREE from 'three'
import { CeramicVessel } from './CeramicVessel'
import type { CapturedObservation, WorkflowStep } from '../types/evidence'

function CameraRig({ inspection }: { inspection: boolean }) {
  const { camera } = useThree()
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (cam.fov === undefined) return
    const target = inspection ? 33 : 36
    cam.fov += (target - cam.fov) * 0.04
    cam.updateProjectionMatrix()
  })
  return null
}

function CapturedEvidenceStage({ observation }: { observation: CapturedObservation | null }) {
  return (
    <div className="captured-evidence-stage" aria-label="Captured raking-light observation">
      <div className="capture-stage-meta">
        <span>CAPTURED OBSERVATION / {observation?.id ?? 'OBS-04'}</span>
        <strong>Raking light · {Math.round(observation?.angle ?? 72)}°</strong>
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

export function ObjectStage({ step, lightAngle, onLightAngle, observation, onCanvasReady }: {
  step: WorkflowStep
  lightAngle: number
  onLightAngle: (value: number) => void
  observation: CapturedObservation | null
  onCanvasReady: (canvas: HTMLCanvasElement) => void
}) {
  const inspection = step === 'inspect'
  const compare = step === 'compare'
  const reveal = inspection
    ? Math.max(0, (lightAngle - 45) / 45)
    : compare || step === 'finding' || step === 'record' ? 1 : 0
  const x = -4 + (lightAngle / 90) * 8
  const bandLeft = `${(lightAngle / 90) * 82 + 7}%`

  return (
    <section className={`object-stage ${compare ? 'compare-capture-mode' : ''}`} aria-label="Three-dimensional object examination">
      <div className="stage-number">OBJECT / 01</div>

      {step === 'open' && (
        <div className="stage-examination-badge">
          <span className="exam-label">RETURN EXAMINATION</span>
          <span className="exam-status">Lighting conditions not yet reviewed</span>
        </div>
      )}

      {inspection && <div className="grazing-band" style={{ left: bandLeft }} aria-hidden="true" />}

      {compare ? (
        <CapturedEvidenceStage observation={observation} />
      ) : (
        <Canvas
          shadows
          camera={{ position: [0, .1, 5.7], fov: 36 }}
          dpr={[1, 1.5]}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          onCreated={({ gl }) => onCanvasReady(gl.domElement)}
        >
          <color attach="background" args={['#190E0C']} />
          <CameraRig inspection={inspection} />
          <ambientLight intensity={inspection ? .18 : .7} color="#d6c7a6" />
          <spotLight
            position={[x, 3.5, 3]}
            angle={inspection ? .28 : .6}
            penumbra={.7}
            intensity={inspection ? 8 : 3}
            color="#f6e6bd"
            castShadow
          />
          <directionalLight position={[-3, 1, 2]} intensity={.7} color="#8c7b60" />
          <directionalLight position={[2.5, 2.8, -4.5]} intensity={0.38} color="#b0b4c8" />
          <CeramicVessel reveal={reveal} active={inspection} />
          <ContactShadows position={[0, -1.58, 0]} opacity={.5} scale={5} blur={2.5} />
          <Environment preset="warehouse" environmentIntensity={.15} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.75}
          />
        </Canvas>
      )}

      <div className="object-caption">
        <span>GLAZED EARTHENWARE / CIRCA 1880</span>
        <h1>Vessel with Reed Pattern</h1>
        <p>North Archive Museum · {inspection ? 'Raking-light examination' : compare ? 'Captured return-arrival observation' : 'Return arrival review'}</p>
      </div>

      {!compare && (reveal > .2 || step === 'finding' || step === 'record') && (
        <div className="annotation-marker" style={{ opacity: Math.max(.35, reveal) }}>
          <Crosshair size={17} /><span>Upper-right shoulder</span>
        </div>
      )}

      {inspection && (
        <div className="light-console">
          <div className="light-console-copy">
            <MoveHorizontal size={16} />
            <div>
              <strong>Raking-light angle</strong>
              <span>Move toward a shallow angle</span>
            </div>
            <output>{lightAngle}°</output>
          </div>
          <input
            aria-label="Raking-light angle"
            type="range"
            min="0"
            max="90"
            value={lightAngle}
            onChange={e => onLightAngle(Number(e.target.value))}
          />
          <p>Simulated raking-light examination. Interpretation remains human-reviewed.</p>
        </div>
      )}
    </section>
  )
}
