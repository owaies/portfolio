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
  const { camera } = useThree()
  const [scrollY, setScrollY] = useState(0)

  const preparedScene = useMemo(() => {
    // GLTFLoader already creates the authored PBR materials. We only correct
    // texture color spaces and renderer-facing flags. No material is replaced.
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return

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
    const box = new THREE.Box3().setFromObject(preparedScene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // V7 is authored at architectural scale (~20.6 units tall). Normalize
    // only the object transform so the authored geometry/materials remain intact.
    const targetHeight = mobile ? 11.8 : 14.2
    const scale = targetHeight / Math.max(size.y, 0.001)

    preparedScene.scale.setScalar(scale)
    preparedScene.position.set(-center.x * scale + (mobile ? 0.1 : 3.0), -center.y * scale - 0.8, -center.z * scale)

    camera.position.set(mobile ? 12.2 : 17.8, mobile ? 6.8 : 8.8, mobile ? 25.5 : 29.5)
    camera.lookAt(mobile ? 0.4 : 2.0, mobile ? 5.4 : 6.8, 0)
  }, [camera, mobile, preparedScene])

  useFrame((state) => {
    if (!group.current) return

    const elapsed = state.clock.getElapsedTime()
    const scrollProgress = Math.min(1, scrollY / Math.max(window.innerHeight * 3.2, 1))
    const motion = reducedMotion ? 0 : 1

    // Monumental drift, not product-spin. Scroll contributes only a small
    // architectural parallax shift through the hero and early page.
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
      (mobile ? 0.1 : 0) + Math.sin(elapsed * 0.035) * 0.08 * motion + scrollProgress * (mobile ? -0.12 : -0.35),
      0.025,
    )
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      Math.sin(elapsed * 0.045) * 0.035 * motion - scrollProgress * 0.22,
      0.025,
    )

    const baseCamera = mobile
      ? new THREE.Vector3(12.2, 6.8, 25.5)
      : new THREE.Vector3(17.8, 8.8, 29.5)
    const cameraDrift = reducedMotion ? 0 : 1
    const targetCamera = baseCamera.clone().add(new THREE.Vector3(
      Math.sin(elapsed * 0.028) * 0.7 * cameraDrift - scrollProgress * 1.25,
      Math.sin(elapsed * 0.021) * 0.22 * cameraDrift - scrollProgress * 0.35,
      Math.cos(elapsed * 0.024) * 0.35 * cameraDrift,
    ))
    camera.position.lerp(targetCamera, 0.018)
    camera.lookAt(
      mobile ? 0.45 - scrollProgress * 0.25 : 2.0 - scrollProgress * 0.65,
      mobile ? 5.35 - scrollProgress * 0.3 : 6.8 - scrollProgress * 0.55,
      0,
    )
  })

  return <group ref={group}><primitive object={preparedScene} /></group>
}

function ForgeLighting({ mobile }: { mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.055} />
      <directionalLight
        position={[-9, 13, 11]}
        intensity={mobile ? 1.15 : 1.65}
        color="#d8e0e7"
        castShadow={!mobile}
        shadow-mapSize-width={mobile ? 512 : 1024}
        shadow-mapSize-height={mobile ? 512 : 1024}
        shadow-bias={-0.0002}
      />
      <directionalLight
        position={[11, 7, -9]}
        intensity={mobile ? 0.38 : 0.55}
        color="#6d8194"
      />
      <rectAreaLight
        position={[-2, 10, 8]}
        rotation={[-0.38, -0.2, -0.05]}
        width={7}
        height={13}
        intensity={mobile ? 2.0 : 3.0}
        color="#b9c4cd"
      />
      <pointLight
        position={[0.8, 7.0, 8.5]}
        intensity={mobile ? 0.65 : 1.05}
        distance={14}
        decay={2}
        color="#ff9b5a"
      />
      <pointLight
        position={[-1.5, 13.0, 1.5]}
        intensity={mobile ? 0.35 : 0.5}
        distance={18}
        decay={2}
        color="#d47c46"
      />
    </>
  )
}

export default function ObsidianForgeMonolithCanvas() {
  const mobile = useMobile()
  const reducedMotion = useReducedMotion()

  return (
    <div className="obsidian-forge-3d" aria-hidden="true">
      <Canvas
        dpr={mobile ? [1, 1.35] : [1, 1.8]}
        frameloop="always"
        shadows={!mobile}
        camera={{ fov: 34, near: 0.1, far: 120, position: [17.8, 8.8, 29.5] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.8
        }}
      >
        <ForgeLighting mobile={mobile} />
        <ObsidianModel mobile={mobile} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
