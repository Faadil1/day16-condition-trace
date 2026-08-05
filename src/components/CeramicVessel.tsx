import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function CeramicVessel({ reveal = 0, active = false }: { reveal?: number; active?: boolean }) {
  const group = useRef<THREE.Group>(null)
  const profile = useMemo(() => [
    new THREE.Vector2(0.38, -1.65), new THREE.Vector2(0.72, -1.55),
    new THREE.Vector2(0.87, -1.2), new THREE.Vector2(0.92, -0.55),
    new THREE.Vector2(1.13, 0.1), new THREE.Vector2(1.02, 0.68),
    new THREE.Vector2(0.7, 1.05), new THREE.Vector2(0.43, 1.18),
    new THREE.Vector2(0.42, 1.45), new THREE.Vector2(0.55, 1.52),
    new THREE.Vector2(0.58, 1.62), new THREE.Vector2(0.38, 1.68),
  ], [])

  useFrame((_, delta) => {
    if (group.current && !active) group.current.rotation.y += delta * 0.055
  })

  return (
    <group ref={group} rotation={[0, -0.28, 0]} position={[0, -0.1, 0]} scale={1.12}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 96]} />
        <meshPhysicalMaterial color="#c9b995" roughness={0.29} metalness={0.03} clearcoat={0.5} clearcoatRoughness={0.25} />
      </mesh>
      {[-0.65, -0.53, 0.43, 0.55].map((y, i) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[i < 2 ? 0.9 : 1.02, 0.018, 12, 96]} />
          <meshStandardMaterial color="#756e50" roughness={0.55} />
        </mesh>
      ))}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(a) * .985, 0.02, Math.cos(a) * .985]} rotation={[0, a, i % 2 ? .23 : -.23]}>
            <capsuleGeometry args={[0.018, 0.36, 4, 8]} />
            <meshStandardMaterial color="#716b4e" roughness={0.6} />
          </mesh>
        )
      })}
      <mesh position={[0.76, 0.78, 0.66]} rotation={[0.3, 0.7, -0.15]}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3([
          new THREE.Vector3(-.03, .18, 0), new THREE.Vector3(.01, .1, 0),
          new THREE.Vector3(-.015, .02, 0), new THREE.Vector3(.035, -.08, 0),
          new THREE.Vector3(.015, -.18, 0),
        ]), 20, 0.008 + reveal * 0.005, 5, false]} />
        <meshBasicMaterial color="#30271f" transparent opacity={reveal} depthWrite={false} />
      </mesh>
    </group>
  )
}
