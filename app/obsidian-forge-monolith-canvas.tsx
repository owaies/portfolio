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

    const sourceBox = new THREE.Box3().setFromObject(preparedScene)
    const sourceCenter = sourceBox.getCenter(new THREE.Vector3())
    const sourceSphere = sourceBox.getBoundingSphere(new THREE.Sphere())
    const radius = Math.max(sourceSphere.radius, 0.001)

    const aspect = size.width / size.height
    camera.aspect = aspect
    camera.fov = 34

    const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov * 0.5)
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * aspect)
    const limitingHalfFov = Math.max(
      THREE.MathUtils.degToRad(1),
      Math.min(verticalHalfFov, horizontalHalfFov),
    )

    const frameTarget = new THREE.Vector3(mobile ? 0 : 0.35, 0, 0)
    const modelOffset = new THREE.Vector3(mobile ? 2.0 : 0.8, 0, 0)
    preparedScene.position.copy(frameTarget).add(modelOffset).sub(sourceCenter)
    preparedScene.updateMatrixWorld(true)

    const framedBox = new THREE.Box3().setFromObject(preparedScene)
    const framedSphere = framedBox.getBoundingSphere(new THREE.Sphere())
    const framedRadius = Math.max(framedSphere.radius, radius, 0.001)
    const corners: THREE.Vector3[] = []
    const min = framedBox.min
    const max = framedBox.max
    for (const x of [min.x, max.x]) {
      for (const y of [min.y, max.y]) {
        for (const z of [min.z, max.z]) corners.push(new THREE.Vector3(x, y, z))
      }
    }

    const cameraOffset = new THREE.Vector3(mobile ? 0.45 : 0.75, mobile ? 0.25 : 0.35, 0)
    const safetyMargin = mobile ? 1.25 : 1.22
    const targetOccupancy = 1 / safetyMargin
    const sphereDistanceReference = (framedRadius / Math.sin(limitingHalfFov)) * safetyMargin

    const projectFits = (distance: number) => {
      camera.position.set(
        frameTarget.x + cameraOffset.x,
        frameTarget.y + cameraOffset.y,
        frameTarget.z + distance,
      )
      camera.lookAt(frameTarget)
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld(true)

      return corners.every((corner) => {
        const projected = corner.clone().project(camera)
        return (
          Number.isFinite(projected.x) &&
          Number.isFinite(projected.y) &&
          projected.z >= -1 &&
          projected.z <= 1 &&
          Math.abs(projected.x) <= targetOccupancy &&
          Math.abs(projected.y) <= targetOccupancy
        )
      })
    }

    let low = Math.max(24, framedRadius * 1.5)
    let high = Math.max(48, sphereDistanceReference)
    while (!projectFits(high) && high < 2048) high *= 1.35

    for (let iteration = 0; iteration < 32; iteration += 1) {
      const mid = (low + high) * 0.5
      if (projectFits(mid)) high = mid
      else low = mid
    }

    const distance = high
    camera.position.set(
      frameTarget.x + cameraOffset.x,
      frameTarget.y + cameraOffset.y,
      frameTarget.z + distance,
    )
    camera.near = 0.1
    camera.far = Math.max(120, distance * 5)
    camera.lookAt(frameTarget)
    camera.updateProjectionMatrix()

    void fitVersion
  }, [camera, fitVersion, gl, mobile, preparedScene, size.height, size.width])

  useFrame((state) => {
    if (!group.current) return

    // The monolith rotates around its vertical Y axis only. A complete
    // left -> right -> left oscillation takes 8 seconds, never a 360-degree spin.
    const yawAmplitude = THREE.MathUtils.degToRad(mobile ? 3.5 : 4)
    const yawPeriod = 8
    const yaw = reducedMotion ? 0 : Math.sin((state.clock.getElapsedTime() / yawPeriod) * Math.PI * 2) * yawAmplitude

    group.current.rotation.y = yaw
    group.current.rotation.x = 0
    group.current.rotation.z = 0
    group.current.position.set(0, 0, 0)
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
