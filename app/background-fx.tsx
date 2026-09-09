"use client"

import { useEffect, useRef } from "react"

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let frame = 0
    let width = 0
    let height = 0
    const pointer = { x: -9999, y: -9999 }
    const particles = Array.from({ length: 68 }, (_, i) => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .00018, vy: (Math.random() - .5) * .00014,
      r: i % 7 === 0 ? 1.5 : .8 + Math.random() * .7,
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth; height = window.innerHeight
      canvas.width = width * dpr; canvas.height = height * dpr
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY }
    const leave = () => { pointer.x = -9999; pointer.y = -9999 }
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        const x = p.x * width, y = p.y * height
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(0,212,255,.42)"; ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j], dx = (a.x-b.x)*width, dy = (a.y-b.y)*height, d = Math.hypot(dx,dy)
        if (d < 125) { ctx.strokeStyle = `rgba(0,212,255,${(1-d/125)*.08})`; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(a.x*width,a.y*height); ctx.lineTo(b.x*width,b.y*height); ctx.stroke() }
      }
      frame = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener("resize", resize, { passive: true }); window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("pointerleave", leave)
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); window.removeEventListener("pointerleave", leave) }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] h-full w-full opacity-60" />
}
