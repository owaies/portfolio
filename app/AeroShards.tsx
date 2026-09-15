'use client'

import { useEffect, useRef } from 'react'
import './AeroShards.css'

type Props = {
  backgroundColor?: string
  shardColor?: string
  accentColor?: string
  placement?: 'right' | 'left' | 'center' | 'full'
  flow?: 'stream' | 'vortex' | 'ribbon'
  material?: 'pearl' | 'chrome' | 'satin'
  detail?: 'bold' | 'balanced' | 'fine'
  effect?: 'none' | 'dither' | 'ascii'
  scale?: number
  spread?: number
  depth?: number
  speed?: number
  spin?: number
  interaction?: 'none' | 'repel' | 'attract'
  density?: number
  shardSize?: number
  stretch?: number
  turbulence?: number
  glow?: number
  edgeSoftness?: number
  bloom?: number
  grain?: number
  chromaticAberration?: number
  transitionDuration?: number
  interactionRadius?: number
  interactionStrength?: number
  rippleIntensity?: number
  holdToGather?: boolean
  paused?: boolean
  className?: string
}

type Shard = { x: number; y: number; vx: number; vy: number; z: number; size: number; angle: number; phase: number }

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const hex = (value: string, fallback: string) => {
  const source = /^#?([\da-f]{6})$/i.exec(value)?.[1] || fallback.replace('#', '')
  return [parseInt(source.slice(0, 2), 16), parseInt(source.slice(2, 4), 16), parseInt(source.slice(4, 6), 16)]
}

export default function AeroShards({
  backgroundColor = '#120F17',
  shardColor = '#896ABD',
  accentColor = '#A855F7',
  placement = 'full',
  flow = 'stream',
  material = 'pearl',
  detail = 'balanced',
  effect = 'none',
  scale = 1,
  spread = 1,
  depth = 1,
  speed = 1,
  spin = 1,
  interaction = 'repel',
  density = 1.5,
  shardSize = 1.1,
  stretch = 1,
  turbulence = 1,
  glow = 1,
  bloom = 0.5,
  grain = 0.05,
  interactionRadius = 1.5,
  interactionStrength = 0.5,
  paused = false,
  className = ''
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const background = hex(backgroundColor, '#120F17')
    const shard = hex(shardColor, '#896ABD')
    const accent = hex(accentColor, '#A855F7')
    const count = Math.round((detail === 'fine' ? 150 : detail === 'bold' ? 90 : 120) * clamp(density, 0.5, 1.5))
    const shards: Shard[] = Array.from({ length: count }, (_, i) => {
      const t = i / Math.max(count - 1, 1)
      return {
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00012,
        vy: (Math.random() - 0.5) * 0.00012,
        z: Math.random(),
        size: (0.7 + Math.random() * 1.7) * shardSize,
        angle: Math.random() * Math.PI * 2,
        phase: t * Math.PI * 8 + Math.random() * 6
      }
    })

    let raf = 0
    let last = performance.now()
    let width = 1
    let height = 1
    let pointerX = 0.5
    let pointerY = 0.5
    let pointerActive = false

    const resize = () => {
      const rect = root.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      pointerX = clamp((event.clientX - rect.left) / rect.width, 0, 1)
      pointerY = clamp((event.clientY - rect.top) / rect.height, 0, 1)
      pointerActive = true
    }
    const onLeave = () => { pointerActive = false }
    const observer = new ResizeObserver(resize)
    observer.observe(root)
    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave, { passive: true })
    resize()

    const render = (now: number) => {
      const dt = Math.min(32, now - last)
      last = now
      ctx.fillStyle = `rgb(${background[0]},${background[1]},${background[2]})`
      ctx.fillRect(0, 0, width, height)

      const motion = paused ? 0 : speed
      const cx = width * 0.5
      const cy = height * 0.5
      const minSize = Math.min(width, height)

      for (const p of shards) {
        if (motion) {
          p.phase += dt * 0.00045 * motion
          if (flow === 'vortex') {
            const dx = p.x - 0.5
            const dy = p.y - 0.5
            p.vx += -dy * 0.0000009 * motion
            p.vy += dx * 0.0000009 * motion
          } else if (flow === 'ribbon') {
            p.vy += Math.sin(p.phase + p.x * 7) * 0.0000011 * motion
          } else {
            p.vx += 0.0000007 * motion
          }
          p.x += p.vx * dt * 60
          p.y += p.vy * dt * 60
          if (p.x < -0.08) p.x = 1.08
          if (p.x > 1.08) p.x = -0.08
          if (p.y < -0.08) p.y = 1.08
          if (p.y > 1.08) p.y = -0.08
        }

        if (pointerActive && interaction !== 'none') {
          const dx = p.x - pointerX
          const dy = p.y - pointerY
          const dist = Math.hypot(dx * width / minSize, dy * height / minSize)
          const radius = 0.7 * interactionRadius
          if (dist < radius) {
            const force = (1 - dist / radius) * interactionStrength * 0.0012
            const sign = interaction === 'attract' ? -1 : 1
            p.x += (dx / Math.max(dist, 0.01)) * force * sign
            p.y += (dy / Math.max(dist, 0.01)) * force * sign
          }
        }

        const posX = p.x * width
        const posY = p.y * height
        const shimmer = 0.55 + 0.45 * Math.sin(p.phase)
        const alpha = clamp((0.12 + shimmer * 0.42) * (0.65 + p.z * 0.35) * glow, 0.04, 0.78)
        const colorMix = 0.25 + shimmer * 0.45
        const r = Math.round(shard[0] + (accent[0] - shard[0]) * colorMix)
        const g = Math.round(shard[1] + (accent[1] - shard[1]) * colorMix)
        const b = Math.round(shard[2] + (accent[2] - shard[2]) * colorMix)
        const size = (p.size * minSize / 150) * (0.75 + p.z * 0.75) * spread * scale
        const angle = p.angle + p.phase * 0.15 * spin
        const length = size * (1.8 + stretch * 1.2)

        ctx.save()
        ctx.translate(posX, posY)
        ctx.rotate(angle)
        ctx.globalAlpha = alpha
        if (bloom > 0) {
          ctx.shadowBlur = Math.min(24, bloom * 12)
          ctx.shadowColor = `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha * 0.7})`
        }
        ctx.beginPath()
        ctx.moveTo(0, -length)
        ctx.lineTo(size * 0.58, 0)
        ctx.lineTo(0, length * 0.58)
        ctx.lineTo(-size * 0.58, 0)
        ctx.closePath()
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fill()
        ctx.restore()
      }

      if (grain > 0) {
        ctx.globalAlpha = Math.min(0.08, grain)
        ctx.fillStyle = 'rgba(255,255,255,.5)'
        for (let i = 0; i < 90; i += 1) ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1)
      }

      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [accentColor, backgroundColor, bloom, density, detail, flow, glow, grain, interaction, interactionRadius, interactionStrength, paused, scale, shardColor, shardSize, speed, spread, spin, stretch, turbulence])

  return (
    <div ref={rootRef} className={`aero-shards ${className}`} data-ready="true" style={{ backgroundColor }} aria-hidden="true">
      <canvas ref={canvasRef} className="aero-shards__canvas" />
    </div>
  )
}
