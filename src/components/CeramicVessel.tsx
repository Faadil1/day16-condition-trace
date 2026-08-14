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
      const broad = Math.sin(x * 0.052) * 5.2 + Math.cos(y * 0.041) * 4.4
      const kiln = Math.sin((x + y) * 0.018) * 5.5 + Math.cos((x - y) * 0.026) * 3.6
      const speck = Math.sin(x * 0.39 + y * 0.17) * 2 + Math.cos(x * 0.16 - y * 0.31) * 1.6
      const mottling = Math.sin(x * 0.013) * Math.cos(y * 0.017) * 5.5
      const variation = broad + kiln + speck + mottling

      colorImage.data[i] = Math.max(0, Math.min(255, 176 + variation))
      colorImage.data[i + 1] = Math.max(0, Math.min(255, 151 + variation * 0.78))
      colorImage.data[i + 2] = Math.max(0, Math.min(255, 108 + variation * 0.48))
      colorImage.data[i + 3] = 255

      const rough = 172 + Math.sin(x * 0.068 + y * 0.041) * 24 + Math.cos(y * 0.13) * 12 + speck * 2
      roughImage.data[i] = roughImage.data[i + 1] = roughImage.data[i + 2] = Math.max(130, Math.min(232, rough))
      roughImage.data[i + 3] = 255

      const bump = 127 + Math.sin(x * 0.21) * 3.6 + Math.cos(y * 0.17) * 3.4 + Math.sin((x + y) * 0.35) * 1.7
      bumpImage.data[i] = bumpImage.data[i + 1] = bumpImage.data[i + 2] = Math.max(114, Math.min(140, bump))
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
    texture.repeat.set(2.15, 1.7)
    texture.needsUpdate = true
  })

  return { colorMap, roughnessMap, bumpMap }
}

export function CeramicVessel({ reveal = 0, active = false }: { reveal?: number; active?: boolean }) {
  const group = useRef<THREE.Group>(null)

  // Sparse historical-form control points are spline-sampled before lathe generation.
  // This preserves a slightly handmade silhouette without the large planar facets that
  // made the previous version read like a low-poly game asset.
  const profile = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.40, -1.62, 0),
      new THREE.Vector3(0.56, -1.58, 0),
      new THREE.Vector3(0.73, -1.44, 0),
      new THREE.Vector3(0.91, -1.13, 0),
      new THREE.Vector3(1.05, -0.70, 0),
      new THREE.Vector3(1.10, -0.16, 0),
      new THREE.Vector3(1.08, 0.32, 0),
      new THREE.Vector3(0.97, 0.70, 0),
      new THREE.Vector3(0.79, 0.98, 0),
      new THREE.Vector3(0.57, 1.16, 0),
      new THREE.Vector3(0.47, 1.28, 0),
      new THREE.Vector3(0.46, 1.48, 0),
      new THREE.Vector3(0.54, 1.56, 0),
    ], false, 'centripetal')

    return curve.getPoints(72).map(point => new THREE.Vector2(Math.max(0.39, point.x), point.y))
  }, [])

  const bodyGeometry = useMemo(() => {
    const geometry = new THREE.LatheGeometry(profile, 160)
    const positions = geometry.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)
      const theta = Math.atan2(z, x)
      const radialVariation = 1
        + Math.sin(theta * 3.1 + y * 2.7) * 0.0045
        + Math.sin(theta * 7.4 - y * 1.6) * 0.0018
      const lean = (y + 1.6) * 0.0038
      const verticalWobble = Math.sin(theta * 2.2 + y * 3.4) * 0.0018

      positions.setXYZ(
        i,
        x * radialVariation + lean,
        y + verticalWobble,
        z * (radialVariation + Math.sin(theta * 4.4) * 0.0012),
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
  ], false, 'centripetal'), [])

  const handleRight = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.56, 1.16, 0.00),
    new THREE.Vector3(0.94, 1.10, -0.015),
    new THREE.Vector3(1.20, 0.88, 0.02),
    new THREE.Vector3(1.18, 0.58, -0.01),
    new THREE.Vector3(0.95, 0.38, 0.02),
  ], false, 'centripetal'), [])

  // The feature sits slightly proud of the rendered surface to avoid depth-fighting.
  // A dark interruption plus a faint adjacent highlight approximates a shallow groove
  // becoming legible under raking light without turning into a painted black line.
  const crackMain = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.61, 0.91, 0.70),
    new THREE.Vector3(0.635, 0.84, 0.72),
    new THREE.Vector3(0.615, 0.775, 0.735),
    new THREE.Vector3(0.655, 0.705, 0.715),
    new THREE.Vector3(0.635, 0.635, 0.725),
    new THREE.Vector3(0.665, 0.565, 0.69),
  ], false, 'centripetal'), [])

  const crackBranch = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.64, 0.735, 0.725),
    new THREE.Vector3(0.69, 0.71, 0.695),
    new THREE.Vector3(0.725, 0.675, 0.66),
  ], false, 'centripetal'), [])

  useFrame((_, delta) => {
    if (group.current && !active) group.current.rotation.y += delta * 0.028
  })

  const crackOpacity = Math.max(0.012, reveal * 0.68)

  const ceramicMaterial = {
    map: colorMap,
    color: '#f3ead5',
    roughness: 0.68,
    roughnessMap,
    bumpMap,
    bumpScale: 0.018,
    metalness: 0,
    clearcoat: 0.055,
    clearcoatRoughness: 0.84,
    envMapIntensity: 0.16,
  } as const

  return (
    <group ref={group} rotation={[0.015, -0.20, -0.008]} position={[0, -0.02, 0]} scale={0.92}>
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial {...ceramicMaterial} />
      </mesh>

      <mesh position={[0.008, -1.59, -0.004]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.48, 0.046, 12, 96]} />
        <meshPhysicalMaterial {...ceramicMaterial} color="#e4d5b7" roughness={0.74} bumpScale={0.015} />
      </mesh>
      <mesh position={[-0.006, 1.555, 0.004]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.535, 0.052, 14, 112]} />
        <meshPhysicalMaterial {...ceramicMaterial} color="#eee0c2" roughness={0.64} />
      </mesh>
      <mesh position={[-0.006, 1.565, 0.004]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.455, 0.025, 10, 96]} />
        <meshStandardMaterial color="#745f43" roughness={0.96} />
      </mesh>

      {/* Hand-applied decoration: lower contrast, thinner and deliberately imperfect. */}
      {[-0.38, -0.22].map((y, index) => (
        <mesh key={y} position={[0, y + (index ? 0.004 : -0.003), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.074 - index * 0.004, 0.0065, 7, 144]} />
          <meshStandardMaterial color="#77694b" roughness={0.96} transparent opacity={0.46} />
        </mesh>
      ))}

      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2 + Math.sin(i * 2.17) * 0.055
        const radial = 1.004 + Math.sin(i * 1.83) * 0.008
        const lengthScale = 0.82 + (i % 5) * 0.045
        const yOffset = -0.80 + Math.sin(i * 2.11) * 0.022
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * radial, yOffset, Math.cos(a) * radial]}
            rotation={[0, a, Math.sin(i * 1.47) * 0.11]}
            scale={[0.82 + (i % 3) * 0.08, lengthScale, 1]}
          >
            <capsuleGeometry args={[0.009, 0.45, 4, 8]} />
            <meshStandardMaterial color="#6c6549" roughness={1} transparent opacity={0.38 + (i % 4) * 0.025} />
          </mesh>
        )
      })}

      <mesh castShadow>
        <tubeGeometry args={[handleLeft, 48, 0.052, 10, false]} />
        <meshPhysicalMaterial {...ceramicMaterial} color="#eadabd" roughness={0.72} bumpScale={0.015} />
      </mesh>
      <mesh castShadow>
        <tubeGeometry args={[handleRight, 48, 0.049, 10, false]} />
        <meshPhysicalMaterial {...ceramicMaterial} color="#e7d6b7" roughness={0.73} bumpScale={0.015} />
      </mesh>

      <mesh renderOrder={4}>
        <tubeGeometry args={[crackMain, 36, 0.0052, 6, false]} />
        <meshStandardMaterial
          color="#594638"
          roughness={1}
          transparent
          opacity={crackOpacity}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>
      <mesh renderOrder={4}>
        <tubeGeometry args={[crackBranch, 18, 0.0031, 5, false]} />
        <meshStandardMaterial color="#604a3a" roughness={1} transparent opacity={reveal * 0.48} depthWrite={false} />
      </mesh>
      <mesh position={[-0.006, 0.003, 0.006]} renderOrder={5}>
        <tubeGeometry args={[crackMain, 36, 0.0019, 4, false]} />
        <meshStandardMaterial color="#e0cfa9" roughness={0.98} transparent opacity={reveal * 0.24} depthWrite={false} />
      </mesh>
    </group>
  )
}
