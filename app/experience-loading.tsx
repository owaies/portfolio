'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_UI_EXPERIENCE, isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'
import { LOADING_EXPERIENCES } from '@/lib/loading-experiences'

function getExperienceFromDocument(): UIExperienceId {
  if (typeof document === 'undefined') return DEFAULT_UI_EXPERIENCE
  const preview = new URLSearchParams(window.location.search).get('ui-preview')
  if (isUIExperienceId(preview)) return preview
  const value = document.body.dataset.uiExperience
  return isUIExperienceId(value) ? value : DEFAULT_UI_EXPERIENCE
}

function isMobileOrPortrait() {
  const portrait = window.matchMedia('(orientation: portrait)').matches
  const narrow = window.matchMedia('(max-width: 900px)').matches
  const touchPortrait = portrait && (navigator.maxTouchPoints > 0 || window.innerWidth < 900)
  return narrow || touchPortrait
}

export default function ExperienceLoadingScreen() {
  const [visible, setVisible] = useState(() => typeof window === 'undefined' || !window.location.pathname.startsWith('/admin'))
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const experience = useMemo(() => getExperienceFromDocument(), [])

  useEffect(() => {
    let disposed = false
    if (window.location.pathname.startsWith('/admin')) {
      setVisible(false)
      return
    }

    const video = videoRef.current
    if (!video) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = isMobileOrPortrait()
    const source = mobile ? LOADING_EXPERIENCES[experience].mobile : LOADING_EXPERIENCES[experience].desktop
    let appReady = false
    let videoFinished = reducedMotion
    let failed = false
    let fastTransitionStarted = false
    let fallbackTimer: number | undefined
    let hideTimer: number | undefined
    let fastTransitionTimer: number | undefined
    let normalPlaybackTimer: number | undefined

    const hide = () => {
      if (disposed) return
      setFading(true)
      hideTimer = window.setTimeout(() => { if (!disposed) setVisible(false) }, reducedMotion ? 180 : 650)
    }

    const maybeHide = () => {
      if (appReady && videoFinished) hide()
    }

    const preserveCinematicEnding = () => {
      if (disposed || failed || reducedMotion || !Number.isFinite(video.duration)) return
      const endingWindow = 1.15
      const remaining = video.duration - video.currentTime
      if (remaining <= endingWindow) {
        video.playbackRate = 1
        if (normalPlaybackTimer) window.clearTimeout(normalPlaybackTimer)
        return
      }
      video.playbackRate = 2.5
      if (normalPlaybackTimer) window.clearTimeout(normalPlaybackTimer)
      normalPlaybackTimer = window.setTimeout(preserveCinematicEnding, 120)
    }

    const accelerateForFastLoad = () => {
      if (disposed || failed || reducedMotion || fastTransitionStarted || !appReady) return
      if (!video.duration || !Number.isFinite(video.duration)) return
      const minimumCinematicTime = 1.8
      const endingWindow = 1.15
      if (video.currentTime < minimumCinematicTime) {
        fastTransitionTimer = window.setTimeout(accelerateForFastLoad, Math.max(80, (minimumCinematicTime - video.currentTime) * 1000))
        return
      }
      const remaining = video.duration - video.currentTime
      if (remaining <= endingWindow) {
        video.playbackRate = 1
        fastTransitionStarted = true
        return
      }
      fastTransitionStarted = true
      preserveCinematicEnding()
    }

    const markAppReady = () => {
      if (disposed) return
      appReady = true
      maybeHide()
      accelerateForFastLoad()
    }

    const onEnded = () => {
      videoFinished = true
      maybeHide()
    }

    const onError = () => {
      if (failed || disposed) return
      failed = true
      videoFinished = true
      fallbackTimer = window.setTimeout(() => {
        if (!disposed) hide()
      }, 700)
    }

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = source
    video.load()
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)

    if (!reducedMotion) {
      void video.play().catch(onError)
    } else {
      markAppReady()
    }

    window.addEventListener('load', markAppReady, { once: true })
    if (document.readyState === 'complete') markAppReady()

    const hardTimeout = window.setTimeout(() => {
      if (!disposed && !failed) {
        appReady = true
        videoFinished = true
        hide()
      }
    }, 12000)

    return () => {
      disposed = true
      video.pause()
      video.removeAttribute('src')
      video.load()
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      window.clearTimeout(hardTimeout)
      if (fallbackTimer) window.clearTimeout(fallbackTimer)
      if (hideTimer) window.clearTimeout(hideTimer)
      if (fastTransitionTimer) window.clearTimeout(fastTransitionTimer)
      if (normalPlaybackTimer) window.clearTimeout(normalPlaybackTimer)
      window.removeEventListener('load', markAppReady)
    }
  }, [experience])

  if (!visible || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'))) return null

  return (
    <div id="experience-loading-screen" className={`experience-loading-screen${fading ? ' is-fading' : ''}`} aria-label="Loading portfolio" aria-busy="true">
      <div className="experience-loading-poster" data-loading-poster data-experience={experience} aria-hidden="true" />
      <video className="experience-loading-video" autoPlay muted playsInline preload="none" aria-hidden="true" ref={videoRef} />
      <div className="experience-loading-fallback" role="status"><span className="sr-only">Loading portfolio</span></div>
    </div>
  )
}
