import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Crosshair, MoveHorizontal } from 'lucide-react'
import * as THREE from 'three'
import { CeramicVessel } from './CeramicVessel'
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
    ? Math.max(0, (lightAngle - 48) / 34)
    : compare || step === 'finding' || step === 'record' ? 1 : 0
  const x = -4.6 + (lightAngle / 90) * 9.2
  const bandLeft = `${(lightAngle / 90) * 82 + 7}%`
  const grazingAngle = toGrazingAngle(lightAngle)

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
          camera={{ position: [0, 0.04, 6.2], fov: 30 }}
          dpr={[1, 1.5]}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          onCreated={({ gl }) => onCanvasReady(gl.domElement)}
        >
          <color attach="background" args={['#190E0C']} />
          <CameraRig inspection={inspection} />
          <hemisphereLight args={['#e6d6b8', '#2d1915', inspection ? 0.16 : 0.38]} />
          <ambientLight intensity={inspection ? 0.09 : 0.28} color="#d6c7a6" />
          <spotLight
            position={[x, 1.85, 3.7]}
            angle={inspection ? 0.2 : 0.48}
            penumbra={inspection ? 0.52 : 0.8}
            intensity={inspection ? 6.3 : 2.35}
            color="#f2dfb8"
            castShadow
          />
          <directionalLight position={[-3.2, 2.5, 4]} intensity={inspection ? 0.22 : 0.48} color="#b9aa8c" />
          <directionalLight position={[2.8, 2.4, -4.8]} intensity={0.18} color="#9ca5b5" />
          <CeramicVessel reveal={reveal} active={inspection} />
          <ContactShadows position={[0, -1.53, 0]} opacity={0.42} scale={4.7} blur={3.1} />
          <Environment preset="studio" environmentIntensity={0.1} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minAzimuthAngle={-0.65}
            maxAzimuthAngle={0.65}
            minPolarAngle={Math.PI / 2.45}
            maxPolarAngle={Math.PI / 1.82}
          />
        </Canvas>
      )}

      <div className="object-caption">
        <span>GLAZED EARTHENWARE / CIRCA 1880</span>
        <h1>Vessel with Reed Pattern</h1>
        <p>North Archive Museum · {inspection ? 'Raking-light examination' : compare ? 'Captured return-arrival observation' : 'Return arrival review'}</p>
      </div>

      {!compare && (reveal > 0.2 || step === 'finding' || step === 'record') && (
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
