'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DEFAULT_UI_EXPERIENCE, isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'

const LOADING_COPY: Record<UIExperienceId, { label: string; sublabel: string }> = {
  'digital-architecture': { label: 'DIGITAL ARCHITECTURE', sublabel: 'Constructing your workspace' },
  'organic-intelligence': { label: 'ORGANIC INTELLIGENCE', sublabel: 'Awakening the living system' },
  'neural-interface': { label: 'NEURAL INTERFACE', sublabel: 'Linking the neural mesh' },
  'obsidian-forge': { label: 'OBSIDIAN FORGE', sublabel: 'Igniting the forge' },
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
    const startedAt = performance.now()
    const minDuration = 900
    const maxDuration = 2400
    let hideTimer: number | null = null

    const hide = () => {
      if (disposed) return
      setFading(true)
      window.setTimeout(() => { if (!disposed) setVisible(false) }, 900)
    }

    const finish = () => {
      if (!ready || disposed) return
      const remaining = Math.max(0, minDuration - (performance.now() - startedAt))
      hideTimer = window.setTimeout(hide, remaining)
    }

    const markReady = () => {
      if (ready || disposed) return
      ready = true
      finish()
    }

    if (document.readyState === 'complete') markReady()
    else window.addEventListener('load', markReady, { once: true })

    const hard = window.setTimeout(() => {
      ready = true
      hide()
    }, maxDuration)

    return () => {
      disposed = true
      window.removeEventListener('load', markReady)
      window.clearTimeout(hard)
      if (hideTimer !== null) window.clearTimeout(hideTimer)
    }
  }, [experience])

  if (isAdminRoute || !visible) return null
  const copy = LOADING_COPY[experience]

  return (
    <div id="experience-loading-screen" className={`experience-loading-screen experience-loading-${experience}${fading ? ' is-fading' : ''}`} aria-hidden="true">
      <div className="experience-loader-atmosphere" />
      <div className="experience-loader-grid" />
      <div className="experience-loader-noise" />
      <div className="experience-loader-vignette" />

      <div className="experience-loader-scene" aria-hidden="true">
        {experience === 'digital-architecture' && <div className="architecture-loader"><div className="architecture-floor"/><span/><span/><span/><span/><span/><i className="architecture-beam architecture-beam-a"/><i className="architecture-beam architecture-beam-b"/></div>}
        {experience === 'organic-intelligence' && <div className="organic-loader"><div className="organic-core"/><i/><i/><i/><i/><i/><i/><span className="organic-ring organic-ring-a"/><span className="organic-ring organic-ring-b"/></div>}
        {experience === 'neural-interface' && <div className="neural-loader"><div className="neural-core"/><span/><span/><span/><span/><span/><span/><span/><span/><i className="neural-ring neural-ring-a"/><i className="neural-ring neural-ring-b"/></div>}
        {experience === 'obsidian-forge' && <div className="forge-loader"><div className="forge-core"/><span/><span/><span/><span/><i className="forge-ring forge-ring-a"/><i className="forge-ring forge-ring-b"/></div>}
      </div>

      <div className="experience-loader-content">
        <div className="experience-loader-mark">MO<span>·</span></div>
        <div className="experience-loader-kicker">{copy.label}</div>
        <div className="experience-loader-line"><span /></div>
        <p>{copy.sublabel}</p>
      </div>
      <div className="experience-loader-progress" aria-hidden="true"><span /></div>
    </div>
  )
}
