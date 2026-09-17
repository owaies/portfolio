'use client'

import { useEffect, useRef } from 'react'
import './ChromaGrid.css'

type ChromaItem = {
  image: string
  title: string
  subtitle: string
  handle?: string
  borderColor?: string
  gradient?: string
  url?: string | null
  location?: string
}

type ChromaGridProps = {
  items: ChromaItem[]
  className?: string
  radius?: number
  columns?: number
  rows?: number
  damping?: number
  fadeOut?: number
  ease?: string
}

const easeOutPower3 = (t: number) => 1 - Math.pow(1 - t, 3)

export default function ChromaGrid({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
}: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)
  const fadeTimer = useRef<number | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const updateCenter = () => {
      const rect = el.getBoundingClientRect()
      pos.current = { x: rect.width / 2, y: rect.height / 2 }
      target.current = { ...pos.current }
      el.style.setProperty('--x', `${pos.current.x}px`)
      el.style.setProperty('--y', `${pos.current.y}px`)
    }
    updateCenter()
    const tick = () => {
      const easing = Math.min(0.35, Math.max(0.06, damping))
      pos.current.x += (target.current.x - pos.current.x) * easing
      pos.current.y += (target.current.y - pos.current.y) * easing
      el.style.setProperty('--x', `${pos.current.x}px`)
      el.style.setProperty('--y', `${pos.current.y}px`)
      animationRef.current = window.requestAnimationFrame(tick)
    }
    animationRef.current = window.requestAnimationFrame(tick)
    window.addEventListener('resize', updateCenter)
    return () => {
      if (animationRef.current !== null) window.cancelAnimationFrame(animationRef.current)
      if (fadeTimer.current !== null) window.clearTimeout(fadeTimer.current)
      window.removeEventListener('resize', updateCenter)
    }
  }, [damping])

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    target.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    if (fadeRef.current) fadeRef.current.style.opacity = '0'
    if (fadeTimer.current !== null) window.clearTimeout(fadeTimer.current)
  }
  const handleLeave = () => {
    const fade = fadeRef.current
    if (!fade) return
    if (fadeTimer.current !== null) window.clearTimeout(fadeTimer.current)
    fadeTimer.current = window.setTimeout(() => { fade.style.opacity = '1' }, Math.max(80, fadeOut * 1000 * 0.15))
  }
  const handleCardMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
  }
  const handleCardClick = (url?: string | null) => { if (url) window.open(url, '_blank', 'noopener,noreferrer') }

  return (
    <div ref={rootRef} className={`chroma-grid ${className}`} style={{ '--r': `${radius}px`, '--cols': columns, '--rows': rows } as React.CSSProperties} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      {items?.map((card, index) => (
        <article key={`${card.title}-${index}`} className="chroma-card" onMouseMove={handleCardMove} onClick={() => handleCardClick(card.url)} style={{ '--card-border': card.borderColor || 'transparent', '--card-gradient': card.gradient || 'linear-gradient(145deg, #222, #000)', '--card-glow': card.borderColor || 'transparent', cursor: card.url ? 'pointer' : 'default' } as React.CSSProperties}>
          <div className="chroma-img-wrapper"><img src={card.image} alt={card.title} loading="lazy" /></div>
          <footer className="chroma-info"><h3 className="name">{card.title}</h3>{card.handle && <span className="handle">{card.handle}</span>}<p className="role">{card.subtitle}</p>{card.location && <span className="location">{card.location}</span>}</footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  )
}
void easeOutPower3
