import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function CeramicVessel({ reveal = 0, active = false }: { reveal?: number; active?: boolean }) {
  const group = useRef<THREE.Group>(null)

  const profile = useMemo(() => [
    new THREE.Vector2(0.38, -1.65), new THREE.Vector2(0.72, -1.55),
    new THREE.Vector2(0.87, -1.2),  new THREE.Vector2(0.92, -0.55),
    new THREE.Vector2(1.13, 0.1),   new THREE.Vector2(1.02, 0.68),
    new THREE.Vector2(0.7, 1.05),   new THREE.Vector2(0.43, 1.18),
    new THREE.Vector2(0.42, 1.45),  new THREE.Vector2(0.55, 1.52),
    new THREE.Vector2(0.58, 1.62),  new THREE.Vector2(0.38, 1.68),
  ], [])

  // Arch handles: bottom attachment at shoulder (y≈0.65, r≈1.0), top at neck (y≈1.18, r≈0.42)
  // Front handle has a slight forward tilt for visible asymmetry
  const handleF = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.04,  0.63,  1.0),
    new THREE.Vector3(0.07,  0.84,  1.43),
    new THREE.Vector3(0.03,  1.09,  0.67),
    new THREE.Vector3(0.0,   1.18,  0.41),
  ]), [])

  const handleB = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.03, 0.63, -1.0),
    new THREE.Vector3(-0.06, 0.84, -1.43),
    new THREE.Vector3(-0.02, 1.09, -0.67),
    new THREE.Vector3(0.0,   1.18, -0.41),
  ]), [])

  useFrame((_, delta) => {
    if (group.current && !active) group.current.rotation.y += delta * 0.055
  })

  return (
    <group ref={group} rotation={[0, -0.28, 0]} position={[0, -0.08, 0]} scale={0.86}>
      {/* Main vessel body — warmer earthenware base, higher roughness for handmade look */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 96]} />
        <meshPhysicalMaterial
          color="#c4b088"
          roughness={0.56}
          metalness={0.0}
          clearcoat={0.07}
          clearcoatRoughness={0.74}
        />
      </mesh>
      {/* Glaze variation overlay — darker undertone at low opacity to break the uniform hue */}
      <mesh>
        <latheGeometry args={[profile, 96]} />
        <meshStandardMaterial color="#9e8860" roughness={0.82} transparent opacity={0.16} depthWrite={false} />
      </mesh>

      {/* Decorative banding rings */}
      {[-0.65, -0.53, 0.43, 0.55].map((y, i) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[i < 2 ? 0.9 : 1.02, 0.018, 12, 96]} />
          <meshStandardMaterial color="#756e50" roughness={0.6} />
        </mesh>
      ))}

      {/* Reed pattern with subtle handmade asymmetry — slight radial and vertical wobble */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2
        const rWobble = Math.sin(i * 3.7) * 0.009
        const yWobble = Math.sin(i * 2.3) * 0.011
        return (
          <mesh
            key={i}
            position={[
              Math.sin(a) * (0.985 + rWobble),
              0.02 + yWobble,
              Math.cos(a) * (0.985 + rWobble),
            ]}
            rotation={[0, a, i % 2 ? 0.24 : -0.24]}
          >
            <capsuleGeometry args={[0.019, 0.38, 4, 8]} />
            <meshStandardMaterial color="#6e6748" roughness={0.66} />
          </mesh>
        )
      })}

      {/* Handles */}
      <mesh castShadow>
        <tubeGeometry args={[handleF, 28, 0.042, 7, false]} />
        <meshPhysicalMaterial color="#c2aa7a" roughness={0.63} metalness={0.0} clearcoat={0.04} clearcoatRoughness={0.8} />
      </mesh>
      <mesh castShadow>
        <tubeGeometry args={[handleB, 28, 0.042, 7, false]} />
        <meshPhysicalMaterial color="#c2aa7a" roughness={0.63} metalness={0.0} clearcoat={0.04} clearcoatRoughness={0.8} />
      </mesh>

      {/* Crack — fully invisible (opacity 0) until raking-light threshold is crossed */}
      <mesh position={[0.76, 0.78, 0.66]} rotation={[0.3, 0.7, -0.15]}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3([
          new THREE.Vector3(-.03, .18, 0),  new THREE.Vector3(.01, .1, 0),
          new THREE.Vector3(-.015, .02, 0), new THREE.Vector3(.035, -.08, 0),
          new THREE.Vector3(.015, -.18, 0),
        ]), 20, 0.008 + reveal * 0.005, 5, false]} />
        <meshBasicMaterial color="#30271f" transparent opacity={reveal} depthWrite={false} />
      </mesh>
    </group>
  )
}
