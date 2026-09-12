'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
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
  const { camera, gl, size } = useThree()
  const [scrollY, setScrollY] = useState(0)
  const [fitVersion, setFitVersion] = useState(0)

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
    const requestRefit = () => setFitVersion((version) => version + 1)
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(requestRefit) : null

    resizeObserver?.observe(gl.domElement)
    window.addEventListener('resize', requestRefit, { passive: true })
    window.addEventListener('orientationchange', requestRefit, { passive: true })

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', requestRefit)
      window.removeEventListener('orientationchange', requestRefit)
    }
  }, [gl])

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    if (size.width <= 0 || size.height <= 0) return

    preparedScene.scale.setScalar(1)
    preparedScene.position.set(0, 0, 0)
    preparedScene.updateMatrixWorld(true)

    // Use the complete loaded GLB bounds. The bounding sphere encloses every mesh,
    // including the asymmetric shoulders, seams, supports, and rear tower.
    const box = new THREE.Box3().setFromObject(preparedScene)
    const center = box.getCenter(new THREE.Vector3())
    const sphere = box.getBoundingSphere(new THREE.Sphere())
    const radius = Math.max(sphere.radius, 0.001)

    // Keep the authored V7 geometry at native scale. Only the camera framing changes.
    const target = new THREE.Vector3(mobile ? 0.85 : 2.05, 0, 0)
    preparedScene.position.copy(target).sub(center)
    preparedScene.updateMatrixWorld(true)

    const aspect = size.width / size.height
    camera.aspect = aspect
    camera.fov = 34

    const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov * 0.5)
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * aspect)
    const limitingHalfFov = Math.max(
      THREE.MathUtils.degToRad(1),
      Math.min(verticalHalfFov, horizontalHalfFov),
    )

    // Distance for a complete bounding-sphere fit, then a 20-30% safety margin.
    // This keeps the monolith substantial while preventing any edge clipping.
    const exactFitDistance = radius / Math.sin(limitingHalfFov)
    const safetyMargin = mobile ? 1.25 : 1.22
    const distance = exactFitDistance * safetyMargin

    // Small lateral/elevation offsets preserve the intended architectural perspective.
    const cameraOffsetX = mobile ? 0.16 : 0.22
    const cameraOffsetY = mobile ? 0.035 : 0.055
    camera.position.set(
      target.x + distance * cameraOffsetX,
      target.y + distance * cameraOffsetY,
      target.z + distance,
    )
    camera.near = 0.1
    camera.far = Math.max(120, distance * 5)
    camera.lookAt(target)
    camera.updateProjectionMatrix()

    void fitVersion
  }, [camera, fitVersion, gl, mobile, preparedScene, size.height, size.width])

  useFrame((state) => {
    if (!group.current) return

    const elapsed = state.clock.getElapsedTime()
    const scrollProgress = Math.min(1, scrollY / Math.max(window.innerHeight * 3.2, 1))
    const motion = reducedMotion ? 0 : 1

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      Math.sin(elapsed * 0.055) * 0.035 * motion + scrollProgress * 0.055 * motion,
      0.035,
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      Math.sin(elapsed * 0.035) * 0.008 * motion,
      0.025,
    )
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      Math.sin(elapsed * 0.035) * 0.08 * motion + scrollProgress * (mobile ? -0.12 : -0.35),
      0.025,
    )
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      Math.sin(elapsed * 0.045) * 0.035 * motion - scrollProgress * 0.22,
      0.025,
    )
  })

  return (
    <group ref={group}>
      <primitive object={preparedScene} />
    </group>
  )
}

function ForgeLighting({ mobile }: { mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.07} />
      <directionalLight
        position={[-9, 13, 11]}
        intensity={mobile ? 1.25 : 1.65}
        color="#d8e0e7"
        castShadow={!mobile}
        shadow-mapSize-width={mobile ? 512 : 1024}
        shadow-mapSize-height={mobile ? 512 : 1024}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[11, 7, -9]} intensity={mobile ? 0.42 : 0.55} color="#6d8194" />
      <rectAreaLight
        position={[-2, 10, 8]}
        rotation={[-0.38, -0.2, -0.05]}
        width={7}
        height={13}
        intensity={mobile ? 2.2 : 3.0}
        color="#b9c4cd"
      />
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
    return () => {
      delete document.body.dataset.forgeV7State
    }
  }, [])

  return (
    <div className="obsidian-forge-3d" aria-hidden="true">
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
        }}
      >
        <ForgeLighting mobile={mobile} />
        <Suspense fallback={null}>
          <ObsidianModel mobile={mobile} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
