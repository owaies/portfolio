'use client'

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = '/models/Photorealistic_Obsidian_Forge_Monolith_V7.glb'

type DiagnosticStage =
  | 'canvas-component-mounted'
  | 'canvas-dom-measured'
  | 'webgl-renderer-ready'
  | 'gltf-loading-started'
  | 'gltf-loaded'
  | 'scene-mesh-count'
  | 'bounding-box'
  | 'model-scale'
  | 'model-position'
  | 'camera-position'
  | 'camera-target'
  | 'render-error'

type DiagnosticState = Record<DiagnosticStage, string>

const initialDiagnostics: DiagnosticState = {
  'canvas-component-mounted': 'WAIT',
  'canvas-dom-measured': 'WAIT',
  'webgl-renderer-ready': 'WAIT',
  'gltf-loading-started': 'WAIT',
  'gltf-loaded': 'WAIT',
  'scene-mesh-count': 'WAIT',
  'bounding-box': 'WAIT',
  'model-scale': 'WAIT',
  'model-position': 'WAIT',
  'camera-position': 'WAIT',
  'camera-target': 'WAIT',
  'render-error': 'NONE',
}

const diagnosticState: DiagnosticState = { ...initialDiagnostics }

function audit(event: string, extra: Record<string, unknown> = {}) {
  const payload = {
    event,
    experience: typeof document !== 'undefined' ? document.body.dataset.uiExperience || null : null,
    path: typeof window !== 'undefined' ? window.location.pathname : null,
    timestamp: new Date().toISOString(),
    ...extra,
  }

  if (event in diagnosticState) {
    const detail = Object.entries(extra)
      .map(([key, value]) => `${key}=${typeof value === 'string' ? value : JSON.stringify(value)}`)
      .join(' ')
    diagnosticState[event as DiagnosticStage] = detail || 'OK'
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('forge-runtime-audit', { detail: { event, value: diagnosticState[event as DiagnosticStage] } }))
    }
  }

  console.info('[Forge runtime audit]', payload)
  if (typeof window !== 'undefined') {
    void fetch('/api/forge-runtime', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])
  return reduced
}

function useMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')
    const update = () => setMobile(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])
  return mobile
}

function ForgeAssetLoadingAudit() {
  const { active, loaded, total, item } = useProgress()

  useEffect(() => {
    audit('gltf-loading-started', { model: MODEL_URL, active, loaded, total, item: item || null })
  }, [])

  useEffect(() => {
    if (active || loaded > 0 || total > 0) {
      audit('gltf-loading-started', { model: MODEL_URL, active, loaded, total, item: item || null })
    }
  }, [active, item, loaded, total])

  return null
}

function ObsidianModel({ mobile, reducedMotion }: { mobile: boolean; reducedMotion: boolean }) {
  const { scene } = useGLTF(MODEL_URL)
  const group = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()
  const [scrollY, setScrollY] = useState(0)
  const [diagnosticBox, setDiagnosticBox] = useState<THREE.Box3 | null>(null)
  const [testPosition, setTestPosition] = useState<[number, number, number]>([-3, 5, 0])

  const preparedScene = useMemo(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.visible = true
      object.castShadow = !mobile
      object.receiveShadow = !mobile

      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial) && !(material instanceof THREE.MeshPhysicalMaterial)) return
        if (material.map) material.map.colorSpace = THREE.SRGBColorSpace
        if (material.normalMap) material.normalMap.colorSpace = THREE.NoColorSpace
        if (material.metalnessMap) material.metalnessMap.colorSpace = THREE.NoColorSpace
        if (material.roughnessMap) material.roughnessMap.colorSpace = THREE.NoColorSpace
        if (material.aoMap) material.aoMap.colorSpace = THREE.NoColorSpace
        if (material.emissiveMap) material.emissiveMap.colorSpace = THREE.SRGBColorSpace
        material.needsUpdate = true
      })
    })
    return scene
  }, [mobile, scene])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    preparedScene.scale.setScalar(1)
    preparedScene.position.set(0, 0, 0)
    preparedScene.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(preparedScene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const targetHeight = mobile ? 11.8 : 14.2
    const scale = targetHeight / Math.max(size.y, 0.001)
    const scaledSize = size.clone().multiplyScalar(scale)
    const scaledCenter = center.clone().multiplyScalar(scale)
    const scaledRadius = Math.max(scaledSize.length() * 0.5, 0.5)

    const target = new THREE.Vector3(mobile ? 0.9 : 2.1, scaledSize.y * 0.48 - 0.55, 0)
    preparedScene.scale.setScalar(scale)
    preparedScene.position.set(target.x - scaledCenter.x, target.y - scaledCenter.y, -scaledCenter.z)
    preparedScene.updateMatrixWorld(true)

    const worldBox = new THREE.Box3().setFromObject(preparedScene)
    const fovRadians = THREE.MathUtils.degToRad(34)
    const fitDistance = (scaledRadius / Math.sin(fovRadians * 0.5)) * (mobile ? 1.18 : 1.12)
    const distance = THREE.MathUtils.clamp(fitDistance, mobile ? 13 : 16, mobile ? 30 : 34)
    const cameraPosition = new THREE.Vector3(
      target.x + distance * (mobile ? 0.24 : 0.34),
      target.y + distance * (mobile ? 0.04 : 0.08),
      target.z + distance,
    )

    camera.near = 0.1
    camera.far = Math.max(120, distance * 5)
    camera.position.copy(cameraPosition)
    camera.lookAt(target)
    camera.updateProjectionMatrix()

    const meshes: THREE.Mesh[] = []
    scene.traverse((object) => { if (object instanceof THREE.Mesh) meshes.push(object) })

    setDiagnosticBox(worldBox.clone())
    const nextTestPosition: [number, number, number] = [
      target.x - Math.max(scaledSize.x * 0.65, 2.2),
      target.y + 0.2,
      0,
    ]
    setTestPosition(nextTestPosition)

    const common = {
      model: MODEL_URL,
      mobile,
      canvas: { width: gl.domElement.clientWidth, height: gl.domElement.clientHeight },
      sceneChildren: scene.children.length,
      meshCount: meshes.length,
      dimensions: size.toArray(),
      boundingBox: { min: box.min.toArray(), max: box.max.toArray() },
      worldBoundingBox: { min: worldBox.min.toArray(), max: worldBox.max.toArray() },
      scale,
      position: preparedScene.position.toArray(),
      camera: camera.position.toArray(),
      target: target.toArray(),
    }

    document.body.dataset.forgeV7State = 'loaded'
    audit('gltf-loaded', { model: MODEL_URL })
    audit('scene-mesh-count', { count: meshes.length, sceneChildren: scene.children.length })
    audit('bounding-box', { dimensions: size.toArray(), min: box.min.toArray(), max: box.max.toArray(), worldMin: worldBox.min.toArray(), worldMax: worldBox.max.toArray() })
    audit('model-scale', { scale })
    audit('model-position', { position: preparedScene.position.toArray() })
    audit('camera-position', { position: camera.position.toArray(), near: camera.near, far: camera.far })
    audit('camera-target', { target: target.toArray() })
    audit('gltf-loaded-and-framed', common)
  }, [camera, gl, mobile, preparedScene, scene])

  useFrame((state) => {
    if (!group.current) return
    const elapsed = state.clock.getElapsedTime()
    const scrollProgress = Math.min(1, scrollY / Math.max(window.innerHeight * 3.2, 1))
    const motion = reducedMotion ? 0 : 1

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(elapsed * 0.055) * 0.035 * motion + scrollProgress * 0.055 * motion, 0.035)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.sin(elapsed * 0.035) * 0.008 * motion, 0.025)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, Math.sin(elapsed * 0.035) * 0.08 * motion + scrollProgress * (mobile ? -0.12 : -0.35), 0.025)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(elapsed * 0.045) * 0.035 * motion - scrollProgress * 0.22, 0.025)

    const target = new THREE.Vector3(mobile ? 0.9 : 2.1, mobile ? 5.1 : 6.25, 0)
    const baseDistance = mobile ? 17.5 : 21.5
    const cameraDrift = reducedMotion ? 0 : 1
    const targetCamera = new THREE.Vector3(
      target.x + baseDistance * (mobile ? 0.24 : 0.34) + Math.sin(elapsed * 0.028) * 0.35 * cameraDrift - scrollProgress * 0.45,
      target.y + baseDistance * (mobile ? 0.04 : 0.08) + Math.sin(elapsed * 0.021) * 0.12 * cameraDrift,
      baseDistance + Math.cos(elapsed * 0.024) * 0.18 * cameraDrift,
    )
    camera.position.lerp(targetCamera, 0.018)
    camera.lookAt(target.x - scrollProgress * (mobile ? 0.12 : 0.25), target.y - scrollProgress * 0.18, 0)
  })

  return (
    <group ref={group}>
      <primitive object={preparedScene} />
      {diagnosticBox && <primitive object={new THREE.Box3Helper(diagnosticBox, new THREE.Color(0x00ff66))} />}
      <mesh position={testPosition}>
        <boxGeometry args={[1.25, 1.25, 1.25]} />
        <meshBasicMaterial color={0xff00ff} wireframe={false} />
      </mesh>
    </group>
  )
}

function ForgeLighting({ mobile }: { mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.07} />
      <directionalLight position={[-9, 13, 11]} intensity={mobile ? 1.25 : 1.65} color="#d8e0e7" castShadow={!mobile} shadow-mapSize-width={mobile ? 512 : 1024} shadow-mapSize-height={mobile ? 512 : 1024} shadow-bias={-0.0002} />
      <directionalLight position={[11, 7, -9]} intensity={mobile ? 0.42 : 0.55} color="#6d8194" />
      <rectAreaLight position={[-2, 10, 8]} rotation={[-0.38, -0.2, -0.05]} width={7} height={13} intensity={mobile ? 2.2 : 3.0} color="#b9c4cd" />
      <pointLight position={[0.8, 7.0, 8.5]} intensity={mobile ? 0.7 : 1.05} distance={14} decay={2} color="#ff9b5a" />
      <pointLight position={[-1.5, 13.0, 1.5]} intensity={mobile ? 0.4 : 0.5} distance={18} decay={2} color="#d47c46" />
    </>
  )
}

class ForgeRuntimeErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null }

  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error.message : String(error) }
  }

  componentDidCatch(error: unknown) {
    audit('render-error', { error: error instanceof Error ? error.message : String(error) })
  }

  render() {
    if (this.state.error) {
      return <div data-forge-runtime-error={this.state.error} />
    }
    return this.props.children
  }
}

function ForgeDiagnosticsPanel() {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const onAudit = () => forceUpdate((value) => value + 1)
    window.addEventListener('forge-runtime-audit', onAudit)
    return () => window.removeEventListener('forge-runtime-audit', onAudit)
  }, [])

  const rows: Array<[DiagnosticStage, string]> = [
    ['canvas-component-mounted', '1 Canvas component mounted'],
    ['canvas-dom-measured', '2 Canvas DOM width × height'],
    ['webgl-renderer-ready', '3 WebGL renderer created'],
    ['gltf-loading-started', '4 useGLTF loading started'],
    ['gltf-loaded', '5 GLTF loaded'],
    ['scene-mesh-count', '6 scene mesh count'],
    ['bounding-box', '7 bounding-box dimensions'],
    ['model-scale', '8 model scale'],
    ['model-position', '9 model position'],
    ['camera-position', '10 camera position'],
    ['camera-target', '11 camera target'],
    ['render-error', '12 render-error'],
  ]

  return (
    <div
      data-forge-runtime-diagnostics="panel"
      style={{
        position: 'absolute',
        top: 42,
        left: 10,
        zIndex: 101,
        width: 'min(430px, calc(100% - 20px))',
        maxHeight: 'calc(100% - 52px)',
        overflow: 'auto',
        padding: '8px 10px',
        border: '1px solid rgba(0,255,102,.55)',
        borderRadius: 3,
        background: 'rgba(0,0,0,.86)',
        color: '#fff',
        font: '500 9px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace',
        letterSpacing: '.02em',
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 5, letterSpacing: '.1em' }}>FORGE V7 POST-ACTIVATION DIAGNOSTICS</div>
      {rows.map(([stage, label]) => (
        <div key={stage} style={{ marginBottom: 3 }}>
          <span style={{ fontWeight: 800 }}>{label}: </span>
          <span>{diagnosticState[stage]}</span>
        </div>
      ))}
      <div style={{ marginTop: 5, opacity: .7 }}>TEST MESH = MAGENTA CUBE · BOX HELPER = GREEN</div>
    </div>
  )
}

export default function ObsidianForgeMonolithCanvas() {
  const mobile = useMobile()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    document.body.dataset.forgeV7State = 'mounting'
    audit('canvas-component-mounted', {
      viewport: { width: window.innerWidth, height: window.innerHeight },
    })

    const measure = () => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-forge-canvas="v7"] canvas')
      const rect = canvas?.getBoundingClientRect()
      audit('canvas-dom-measured', {
        present: Boolean(canvas),
        width: rect?.width ?? 0,
        height: rect?.height ?? 0,
        display: canvas ? getComputedStyle(canvas).display : null,
        visibility: canvas ? getComputedStyle(canvas).visibility : null,
        opacity: canvas ? getComputedStyle(canvas).opacity : null,
      })
    }

    const frame = requestAnimationFrame(measure)
    return () => {
      cancelAnimationFrame(frame)
      delete document.body.dataset.forgeV7State
    }
  }, [])

  return (
    <div className="obsidian-forge-3d" aria-hidden="true" data-forge-canvas="v7">
      <div
        data-forge-runtime-indicator="canvas"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 102,
          padding: '5px 8px',
          border: '1px solid rgba(255,255,255,.45)',
          borderRadius: 2,
          background: 'rgba(0,0,0,.72)',
          color: '#fff',
          font: '600 9px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace',
          letterSpacing: '.1em',
          pointerEvents: 'none',
        }}
      >
        FORGE 3D CANVAS MOUNTED
      </div>
      <ForgeDiagnosticsPanel />
      <Canvas
        dpr={mobile ? [1, 1.35] : [1, 1.8]}
        frameloop="always"
        shadows={!mobile}
        camera={{ fov: 34, near: 0.1, far: 120, position: [12, 6, 25] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.8
          audit('webgl-renderer-ready', {
            renderer: gl.getContext().getParameter(gl.getContext().RENDERER),
            vendor: gl.getContext().getParameter(gl.getContext().VENDOR),
            canvas: { width: gl.domElement.clientWidth, height: gl.domElement.clientHeight },
          })
        }}
      >
        <ForgeRuntimeErrorBoundary>
          <ForgeAssetLoadingAudit />
          <ForgeLighting mobile={mobile} />
          <Suspense fallback={null}>
            <ObsidianModel mobile={mobile} reducedMotion={reducedMotion} />
          </Suspense>
        </ForgeRuntimeErrorBoundary>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
