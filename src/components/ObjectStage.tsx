import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Crosshair, MoveHorizontal } from 'lucide-react'
import * as THREE from 'three'
import { CeramicVessel } from './CeramicVessel'
import type { WorkflowStep } from '../types/evidence'

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

function CapturedEvidenceStage({ angle }: { angle: number }) {
  return (
    <div className="captured-evidence-stage" aria-label="Captured raking-light observation">
      <div className="capture-stage-meta">
        <span>CAPTURED OBSERVATION / RETURN ARRIVAL</span>
        <strong>Raking light · {Math.round(angle)}°</strong>
      </div>

      <svg className="capture-stage-vessel" viewBox="0 0 520 500" role="img" aria-label="Vessel under raking light with upper-right shoulder crack marked">
        <defs>
          <linearGradient id="capture-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#665a45" />
            <stop offset=".43" stopColor="#8f7d5c" />
            <stop offset=".57" stopColor="#d8c59a" />
            <stop offset=".68" stopColor="#897757" />
            <stop offset="1" stopColor="#493f32" />
          </linearGradient>
          <linearGradient id="capture-shade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#160c0a" stopOpacity=".46" />
            <stop offset=".5" stopColor="#160c0a" stopOpacity="0" />
            <stop offset="1" stopColor="#160c0a" stopOpacity=".34" />
          </linearGradient>
          <linearGradient id="capture-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f6e6bd" stopOpacity="0" />
            <stop offset=".48" stopColor="#f6e6bd" stopOpacity=".2" />
            <stop offset=".58" stopColor="#fff3cc" stopOpacity=".34" />
            <stop offset="1" stopColor="#f6e6bd" stopOpacity="0" />
          </linearGradient>
          <filter id="capture-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <ellipse cx="260" cy="445" rx="120" ry="18" fill="#050302" opacity=".48" filter="url(#capture-soft)" />

        <path d="M222 86 C220 112 208 127 188 139 C157 158 139 192 133 233 C125 289 141 354 183 385 C205 401 232 408 260 408 C289 408 316 401 338 385 C380 354 396 289 387 233 C381 192 363 158 332 139 C312 127 300 112 298 86 Z" fill="url(#capture-body)" stroke="#d7c69d" strokeOpacity=".28" strokeWidth="2" />
        <ellipse cx="260" cy="86" rx="39" ry="11" fill="#8e7e5f" stroke="#d7c69d" strokeOpacity=".32" />

        <path d="M222 96 C193 99 181 122 178 147" fill="none" stroke="#b9a57c" strokeWidth="10" strokeLinecap="round" opacity=".8" />
        <path d="M298 96 C327 99 339 122 342 147" fill="none" stroke="#b9a57c" strokeWidth="10" strokeLinecap="round" opacity=".8" />
        <path d="M138 167 C116 156 95 166 84 188 C69 220 75 267 101 288 C112 297 124 301 139 297" fill="none" stroke="#b39e73" strokeWidth="11" strokeLinecap="round" opacity=".72" />
        <path d="M382 167 C404 156 425 166 436 188 C451 220 445 267 419 288 C408 297 396 301 381 297" fill="none" stroke="#b39e73" strokeWidth="11" strokeLinecap="round" opacity=".72" />

        <path d="M154 244 C184 233 220 228 260 228 C301 228 337 233 367 244" fill="none" stroke="#675f47" strokeWidth="5" opacity=".76" />
        <path d="M154 263 C188 254 222 250 260 250 C298 250 332 254 367 263" fill="none" stroke="#675f47" strokeWidth="5" opacity=".76" />

        {[190, 212, 234, 256, 278, 300, 322].map((x, index) => (
          <path key={x} d={`M${x} 270 C${x + (index % 2 ? 8 : -7)} 289 ${x + (index % 2 ? -5 : 7)} 313 ${x} 340`} fill="none" stroke="#625b42" strokeWidth="5" strokeLinecap="round" opacity=".72" />
        ))}

        <path d="M222 86 C220 112 208 127 188 139 C157 158 139 192 133 233 C125 289 141 354 183 385 C205 401 232 408 260 408 C289 408 316 401 338 385 C380 354 396 289 387 233 C381 192 363 158 332 139 C312 127 300 112 298 86 Z" fill="url(#capture-shade)" />

        <path d="M330 80 L410 430" stroke="url(#capture-beam)" strokeWidth="82" opacity=".9" filter="url(#capture-soft)" />
        <path d="M332 151 C340 165 332 178 344 193 C334 210 347 226 338 244" fill="none" stroke="#2b231c" strokeWidth="4" strokeLinecap="round" />
        <circle cx="339" cy="195" r="38" fill="none" stroke="#b58a59" strokeWidth="1.5" strokeDasharray="4 7" opacity=".72" />
        <circle cx="339" cy="195" r="5" fill="#b58a59" />
      </svg>

      <div className="capture-stage-readout">
        <div><span>OBSERVATION</span><strong>Hairline crack legible</strong></div>
        <div><span>AREA</span><strong>Upper-right shoulder</strong></div>
        <div><span>STATUS</span><strong>Human-reviewed</strong></div>
      </div>
    </div>
  )
}

export function ObjectStage({ step, lightAngle, onLightAngle }: {
  step: WorkflowStep
  lightAngle: number
  onLightAngle: (value: number) => void
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

      {inspection && (
        <div className="grazing-band" style={{ left: bandLeft }} aria-hidden="true" />
      )}

      {compare ? (
        <CapturedEvidenceStage angle={lightAngle} />
      ) : (
        <Canvas shadows camera={{ position: [0, .1, 5.7], fov: 36 }} dpr={[1, 1.5]}>
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
        <span>{'GLAZED EARTHENWARE / CIRCA 1880'}</span>
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
