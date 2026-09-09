"use client"

import { useEffect, useState } from "react"

export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setEnabled(fine && !reduced)
  }, [])
  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    let raf = 0, tx = -500, ty = -500, x = tx, y = ty
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => { x += (tx-x)*.14; y += (ty-y)*.14; root.style.setProperty("--cursor-x", `${x}px`); root.style.setProperty("--cursor-y", `${y}px`); raf = requestAnimationFrame(tick) }
    window.addEventListener("pointermove", move, { passive: true }); raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move) }
  }, [enabled])
  return null
}
