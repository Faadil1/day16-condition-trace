import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Crosshair, MoveHorizontal } from 'lucide-react'
import { CeramicVessel } from './CeramicVessel'
import type { WorkflowStep } from '../types/evidence'

export function ObjectStage({ step, lightAngle, onLightAngle }: {
  step: WorkflowStep
  lightAngle: number
  onLightAngle: (value: number) => void
}) {
  const inspection = step === 'inspect'
  const reveal = inspection
    ? Math.max(0, (lightAngle - 45) / 45)
    : step === 'compare' || step === 'finding' || step === 'record' ? 1 : 0
  const x = -4 + (lightAngle / 90) * 8

  return (
    <section className="object-stage" aria-label="Three-dimensional object examination">
      <div className="stage-number">OBJECT / 01</div>

      {/* Examination status badge — shown before lighting review begins */}
      {step === 'open' && (
        <div className="stage-examination-badge">
          <span className="exam-label">RETURN EXAMINATION</span>
          <span className="exam-status">Lighting conditions not yet reviewed</span>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, .1, 5.7], fov: 36 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#151411']} />
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
        {/* Rim light from behind for depth and edge separation */}
        <directionalLight position={[2.5, 2.8, -4.5]} intensity={0.38} color="#b0b4c8" />
        <CeramicVessel reveal={reveal} active={inspection} />
        {/* Shadow plane adjusted for reduced vessel scale */}
        <ContactShadows position={[0, -1.58, 0]} opacity={.5} scale={5} blur={2.5} />
        <Environment preset="warehouse" environmentIntensity={.15} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.75}
        />
      </Canvas>

      <div className="object-caption">
        <span>{'GLAZED EARTHENWARE / CIRCA 1880'}</span>
        <h1>Vessel with Reed Pattern</h1>
        <p>North Archive Museum · {inspection ? 'Raking-light examination' : 'Return arrival review'}</p>
      </div>

      {(reveal > .2 || step === 'finding' || step === 'record') && (
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
