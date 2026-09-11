'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DEFAULT_UI_EXPERIENCE, isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'
import { LOADING_EXPERIENCES } from '@/lib/loading-experiences'

export default function ExperienceLoadingScreen() {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  const [visible, setVisible] = useState(() => !isAdminRoute)
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const experience = useMemo<UIExperienceId>(() => {
    if (typeof window === 'undefined') return DEFAULT_UI_EXPERIENCE
    const preview = new URLSearchParams(window.location.search).get('ui-preview')
    return isUIExperienceId(preview) ? preview : isUIExperienceId(document.body.dataset.uiExperience) ? document.body.dataset.uiExperience : DEFAULT_UI_EXPERIENCE
  }, [])
  useEffect(() => { if (isAdminRoute) setVisible(false) }, [isAdminRoute])
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) { setVisible(false); return }
    const video = videoRef.current
    if (!video) return
    const source = LOADING_EXPERIENCES[experience]?.mobile && window.matchMedia('(max-width: 900px)').matches ? LOADING_EXPERIENCES[experience].mobile : LOADING_EXPERIENCES[experience].desktop
    let disposed = false
    let appReady = false
    let videoFinished = false
    let playbackStarted = false
    const hide = () => { if (disposed) return; setFading(true); window.setTimeout(() => { if (!disposed) setVisible(false) }, 450) }
    const maybeHide = () => { if (appReady && videoFinished) hide() }
    const ended = () => { videoFinished = true; maybeHide() }
    const playing = () => { playbackStarted = true }
    const error = () => { videoFinished = true; appReady = true; hide() }
    video.muted = true; video.defaultMuted = true; video.playsInline = true; video.preload = 'auto'; video.src = source; video.load()
    video.addEventListener('ended', ended); video.addEventListener('playing', playing); video.addEventListener('error', error)
    void video.play().catch(error)
    const ready = () => { appReady = true; maybeHide(); if (!playbackStarted) window.setTimeout(() => { if (!playbackStarted && !disposed) hide() }, 4200) }
    window.addEventListener('load', ready, { once: true }); if (document.readyState === 'complete') ready()
    const hard = window.setTimeout(() => { appReady = true; videoFinished = true; hide() }, 9000)
    return () => { disposed = true; video.pause(); video.removeAttribute('src'); video.load(); video.removeEventListener('ended', ended); video.removeEventListener('playing', playing); video.removeEventListener('error', error); window.removeEventListener('load', ready); window.clearTimeout(hard) }
  }, [experience])
  if (isAdminRoute || !visible) return null
  return <div id="experience-loading-screen" className={`experience-loading-screen${fading ? ' is-fading' : ''}`} aria-hidden="true"><div className="experience-loading-poster" data-loading-poster data-experience={experience} /><video className="experience-loading-video" autoPlay muted playsInline preload="none" ref={videoRef} /></div>
}
