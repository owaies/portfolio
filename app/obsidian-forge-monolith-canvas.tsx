'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = '/models/Photorealistic_Obsidian_Forge_Monolith_V7.glb'

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

function ObsidianModel({ mobile, reducedMotion }: { mobile: boolean; reducedMotion: boolean }) {
  const { scene } = useGLTF(MODEL_URL)
  const group = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()
  const [scrollY, setScrollY] = useState(0)

  const preparedScene = useMemo(() => {
    // Preserve the authored V7 PBR materials. Only renderer-facing texture
    // color spaces, visibility, and shadow flags are adjusted.
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
    // Reset before measuring so responsive changes never compound transforms.
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

    // Frame from the actual loaded bounds rather than assuming authored scale.
    const target = new THREE.Vector3(mobile ? 0.9 : 2.1, scaledSize.y * 0.48 - 0.55, 0)
    preparedScene.scale.setScalar(scale)
    preparedScene.position.set(target.x - scaledCenter.x, target.y - scaledCenter.y, -scaledCenter.z)
    preparedScene.updateMatrixWorld(true)

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
    const runtimeState = {
      model: MODEL_URL,
      mobile,
      canvas: { width: gl.domElement.clientWidth, height: gl.domElement.clientHeight },
      sceneChildren: scene.children.length,
      meshCount: meshes.length,
      boundingBox: { min: box.min.toArray(), max: box.max.toArray() },
      dimensions: size.toArray(),
      scale,
      position: preparedScene.position.toArray(),
      camera: camera.position.toArray(),
      target: target.toArray(),
    }
    document.body.dataset.forgeV7State = 'loaded'
    console.info('[Forge V7] loaded and auto-framed', runtimeState)
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

  return <group ref={group}><primitive object={preparedScene} /></group>
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

export default function ObsidianForgeMonolithCanvas() {
  const mobile = useMobile()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    document.body.dataset.forgeV7State = 'mounting'
    console.info('[Forge V7] Canvas component mounted', {
      experience: document.body.dataset.uiExperience,
      viewport: { width: window.innerWidth, height: window.innerHeight },
    })
    return () => { delete document.body.dataset.forgeV7State }
  }, [])

  return (
    <div className="obsidian-forge-3d" aria-hidden="true" data-forge-canvas="v7">
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
          console.info('[Forge V7] WebGL renderer ready', {
            renderer: gl.getContext().getParameter(gl.getContext().RENDERER),
            canvas: { width: gl.domElement.clientWidth, height: gl.domElement.clientHeight },
          })
        }}
      >
        <ForgeLighting mobile={mobile} />
        <ObsidianModel mobile={mobile} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
