import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function buildCeramicTextures() {
  const size = 256
  const makeCanvas = () => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    return canvas
  }

  const colorCanvas = makeCanvas()
  const roughCanvas = makeCanvas()
  const bumpCanvas = makeCanvas()
  const colorCtx = colorCanvas.getContext('2d')!
  const roughCtx = roughCanvas.getContext('2d')!
  const bumpCtx = bumpCanvas.getContext('2d')!
  const colorImage = colorCtx.createImageData(size, size)
  const roughImage = roughCtx.createImageData(size, size)
  const bumpImage = bumpCtx.createImageData(size, size)

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4
      const broad = Math.sin(x * 0.055) * 4.5 + Math.cos(y * 0.043) * 3.8
      const kiln = Math.sin((x + y) * 0.019) * 5 + Math.cos((x - y) * 0.027) * 3
      const speck = Math.sin(x * 0.41 + y * 0.19) * 2.1 + Math.cos(x * 0.17 - y * 0.33) * 1.7
      const variation = broad + kiln + speck

      colorImage.data[i] = Math.max(0, Math.min(255, 158 + variation))
      colorImage.data[i + 1] = Math.max(0, Math.min(255, 137 + variation * 0.78))
      colorImage.data[i + 2] = Math.max(0, Math.min(255, 100 + variation * 0.5))
      colorImage.data[i + 3] = 255

      const rough = 150 + Math.sin(x * 0.071 + y * 0.043) * 25 + Math.cos(y * 0.14) * 11 + speck * 2
      roughImage.data[i] = roughImage.data[i + 1] = roughImage.data[i + 2] = Math.max(105, Math.min(220, rough))
      roughImage.data[i + 3] = 255

      const bump = 127 + Math.sin(x * 0.22) * 4 + Math.cos(y * 0.18) * 4 + Math.sin((x + y) * 0.37) * 2
      bumpImage.data[i] = bumpImage.data[i + 1] = bumpImage.data[i + 2] = Math.max(112, Math.min(142, bump))
      bumpImage.data[i + 3] = 255
    }
  }

  colorCtx.putImageData(colorImage, 0, 0)
  roughCtx.putImageData(roughImage, 0, 0)
  bumpCtx.putImageData(bumpImage, 0, 0)

  const colorMap = new THREE.CanvasTexture(colorCanvas)
  const roughnessMap = new THREE.CanvasTexture(roughCanvas)
  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  colorMap.colorSpace = THREE.SRGBColorSpace

  ;[colorMap, roughnessMap, bumpMap].forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2.2, 1.6)
    texture.needsUpdate = true
  })

  return { colorMap, roughnessMap, bumpMap }
}

export function CeramicVessel({ reveal = 0, active = false }: { reveal?: number; active?: boolean }) {
  const group = useRef<THREE.Group>(null)

  const profile = useMemo(() => [
    new THREE.Vector2(0.40, -1.62),
    new THREE.Vector2(0.56, -1.58),
    new THREE.Vector2(0.73, -1.44),
    new THREE.Vector2(0.91, -1.13),
    new THREE.Vector2(1.05, -0.70),
    new THREE.Vector2(1.10, -0.16),
    new THREE.Vector2(1.08, 0.32),
    new THREE.Vector2(0.97, 0.70),
    new THREE.Vector2(0.79, 0.98),
    new THREE.Vector2(0.57, 1.16),
    new THREE.Vector2(0.47, 1.28),
    new THREE.Vector2(0.46, 1.48),
    new THREE.Vector2(0.54, 1.56),
  ], [])

  const bodyGeometry = useMemo(() => {
    const geometry = new THREE.LatheGeometry(profile, 128)
    const positions = geometry.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)
      const theta = Math.atan2(z, x)
      const radialVariation = 1
        + Math.sin(theta * 3.1 + y * 2.7) * 0.006
        + Math.sin(theta * 7.4 - y * 1.6) * 0.0028
      const lean = (y + 1.6) * 0.0045
      const verticalWobble = Math.sin(theta * 2.2 + y * 3.4) * 0.0025

      positions.setXYZ(
        i,
        x * radialVariation + lean,
        y + verticalWobble,
        z * (radialVariation + Math.sin(theta * 4.4) * 0.0018),
      )
    }

    geometry.computeVertexNormals()
    return geometry
  }, [profile])

  const { colorMap, roughnessMap, bumpMap } = useMemo(buildCeramicTextures, [])

  const handleLeft = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.55, 1.17, 0.00),
    new THREE.Vector3(-0.92, 1.12, 0.01),
    new THREE.Vector3(-1.18, 0.91, -0.02),
    new THREE.Vector3(-1.22, 0.61, 0.02),
    new THREE.Vector3(-0.97, 0.39, 0.03),
  ]), [])

  const handleRight = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.56, 1.16, 0.00),
    new THREE.Vector3(0.94, 1.10, -0.015),
    new THREE.Vector3(1.20, 0.88, 0.02),
    new THREE.Vector3(1.18, 0.58, -0.01),
    new THREE.Vector3(0.95, 0.38, 0.02),
  ]), [])

  const crackMain = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.70, 0.91, 0.61),
    new THREE.Vector3(0.73, 0.84, 0.63),
    new THREE.Vector3(0.705, 0.77, 0.65),
    new THREE.Vector3(0.75, 0.69, 0.63),
    new THREE.Vector3(0.725, 0.61, 0.65),
    new THREE.Vector3(0.755, 0.53, 0.62),
  ]), [])

  const crackBranch = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.735, 0.73, 0.645),
    new THREE.Vector3(0.79, 0.70, 0.61),
    new THREE.Vector3(0.82, 0.66, 0.58),
  ]), [])

  useFrame((_, delta) => {
    if (group.current && !active) group.current.rotation.y += delta * 0.028
  })

  const crackOpacity = Math.max(0.025, reveal * 0.62)

  return (
    <group ref={group} rotation={[0.015, -0.20, -0.008]} position={[0, -0.02, 0]} scale={0.92}>
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={colorMap}
          color="#d4c29c"
          roughness={0.5}
          roughnessMap={roughnessMap}
          bumpMap={bumpMap}
          bumpScale={0.028}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.58}
          envMapIntensity={0.38}
        />
      </mesh>

      {/* Slightly imperfect foot and lip reveal real wall thickness rather than a closed primitive. */}
      <mesh position={[0.008, -1.59, -0.004]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.48, 0.046, 12, 96]} />
        <meshPhysicalMaterial map={colorMap} color="#c7b48d" roughness={0.62} bumpMap={bumpMap} bumpScale={0.018} />
      </mesh>
      <mesh position={[-0.006, 1.555, 0.004]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.535, 0.052, 14, 112]} />
        <meshPhysicalMaterial map={colorMap} color="#d0bd94" roughness={0.48} roughnessMap={roughnessMap} clearcoat={0.16} clearcoatRoughness={0.62} />
      </mesh>
      <mesh position={[-0.006, 1.565, 0.004]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.455, 0.025, 10, 96]} />
        <meshStandardMaterial color="#6e5c45" roughness={0.88} />
      </mesh>

      {/* Restrained, hand-applied reed decoration. */}
      {[-0.38, -0.22].map((y, index) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.075 - index * 0.005, 0.010, 8, 128]} />
          <meshStandardMaterial color="#5f5b42" roughness={0.82} transparent opacity={0.58} />
        </mesh>
      ))}

      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2
        const radial = 1.005 + Math.sin(i * 1.83) * 0.008
        const lengthScale = 0.88 + (i % 4) * 0.035
        const yOffset = -0.79 + Math.sin(i * 2.11) * 0.018
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * radial, yOffset, Math.cos(a) * radial]}
            rotation={[0, a, Math.sin(i * 1.47) * 0.08]}
            scale={[1, lengthScale, 1]}
          >
            <capsuleGeometry args={[0.011, 0.48, 4, 8]} />
            <meshStandardMaterial color="#5a5841" roughness={0.86} transparent opacity={0.42 + (i % 3) * 0.035} />
          </mesh>
        )
      })}

      <mesh castShadow>
        <tubeGeometry args={[handleLeft, 40, 0.052, 9, false]} />
        <meshPhysicalMaterial map={colorMap} color="#c8b48a" roughness={0.56} roughnessMap={roughnessMap} bumpMap={bumpMap} bumpScale={0.018} clearcoat={0.14} clearcoatRoughness={0.64} />
      </mesh>
      <mesh castShadow>
        <tubeGeometry args={[handleRight, 40, 0.049, 9, false]} />
        <meshPhysicalMaterial map={colorMap} color="#c8b48a" roughness={0.56} roughnessMap={roughnessMap} bumpMap={bumpMap} bumpScale={0.018} clearcoat={0.14} clearcoatRoughness={0.64} />
      </mesh>

      {/* Hairline condition feature: low-contrast surface interruption that becomes legible under grazing light. */}
      <mesh>
        <tubeGeometry args={[crackMain, 30, 0.0042, 5, false]} />
        <meshStandardMaterial color="#4a3c30" roughness={0.98} transparent opacity={crackOpacity} depthWrite={false} />
      </mesh>
      <mesh>
        <tubeGeometry args={[crackBranch, 16, 0.0028, 5, false]} />
        <meshStandardMaterial color="#514236" roughness={1} transparent opacity={reveal * 0.42} depthWrite={false} />
      </mesh>
      <mesh position={[-0.004, 0.002, 0.003]}>
        <tubeGeometry args={[crackMain, 30, 0.0019, 4, false]} />
        <meshStandardMaterial color="#d7c397" roughness={0.9} transparent opacity={reveal * 0.14} depthWrite={false} />
      </mesh>
    </group>
  )
}
