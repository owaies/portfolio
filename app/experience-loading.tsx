'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DEFAULT_UI_EXPERIENCE, isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'

const LOADING_COPY: Record<UIExperienceId, { label: string; sublabel: string }> = {
  'digital-architecture': { label: 'DIGITAL ARCHITECTURE', sublabel: 'Assembling the interface' },
  'organic-intelligence': { label: 'ORGANIC INTELLIGENCE', sublabel: 'Growing the experience' },
  'neural-interface': { label: 'NEURAL INTERFACE', sublabel: 'Synchronizing the network' },
  'obsidian-forge': { label: 'OBSIDIAN FORGE', sublabel: 'Forging the interface' },
}

export default function ExperienceLoadingScreen() {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  const [visible, setVisible] = useState(() => !isAdminRoute)
  const [fading, setFading] = useState(false)
  const experience = useMemo<UIExperienceId>(() => {
    if (typeof window === 'undefined') return DEFAULT_UI_EXPERIENCE
    const preview = new URLSearchParams(window.location.search).get('ui-preview')
    const runtimeExperience = document.body.dataset.uiExperience
    return isUIExperienceId(preview) ? preview : isUIExperienceId(runtimeExperience) ? runtimeExperience : DEFAULT_UI_EXPERIENCE
  }, [])

  useEffect(() => {
    if (isAdminRoute) setVisible(false)
  }, [isAdminRoute])

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) {
      setVisible(false)
      return
    }

    let disposed = false
    let ready = false
    const hide = () => {
      if (disposed) return
      setFading(true)
      window.setTimeout(() => { if (!disposed) setVisible(false) }, 500)
    }
    const markReady = () => {
      if (ready || disposed) return
      ready = true
      window.setTimeout(hide, 500)
    }

    if (document.readyState === 'complete') markReady()
    else window.addEventListener('load', markReady, { once: true })

    const safety = window.setTimeout(markReady, 2200)
    return () => {
      disposed = true
      window.removeEventListener('load', markReady)
      window.clearTimeout(safety)
    }
  }, [experience])

  if (isAdminRoute || !visible) return null
  const copy = LOADING_COPY[experience]

  return (
    <div id="experience-loading-screen" className={`experience-loading-screen experience-loading-${experience}${fading ? ' is-fading' : ''}`} aria-hidden="true">
      <div className="experience-loader-noise" />
      <div className="experience-loader-grid" />
      <div className="experience-loader-art" aria-hidden="true">
        {experience === 'digital-architecture' && <div className="architecture-loader"><span /><span /><span /><span /><span /></div>}
        {experience === 'organic-intelligence' && <div className="organic-loader"><i /><i /><i /><i /><i /><i /></div>}
        {experience === 'neural-interface' && <div className="neural-loader"><span /><span /><span /><span /><span /><span /><span /><span /></div>}
        {experience === 'obsidian-forge' && <div className="forge-loader"><div /><div /><div /><div /></div>}
      </div>
      <div className="experience-loader-content">
        <div className="experience-loader-mark">MO<span>·</span></div>
        <div className="experience-loader-kicker">{copy.label}</div>
        <div className="experience-loader-line"><span /></div>
        <p>{copy.sublabel}</p>
      </div>
    </div>
  )
}
