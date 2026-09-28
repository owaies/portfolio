'use client'

import { ArrowUpRight, Play } from 'lucide-react'
import { useEffect, useRef } from 'react'

const VIDEO_SRC = '/herovideo.mp4'
const PORTRAIT_SRC = '/herome.png'

export default function ObsidianForgeCinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => {
      if (!videoRef.current) return
      if (media.matches) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(() => {})
      }
    }

    syncMotionPreference()
    media.addEventListener('change', syncMotionPreference)
    return () => media.removeEventListener('change', syncMotionPreference)
  }, [])

  return (
    <div className="forge-cinematic-hero">
      <video
        ref={videoRef}
        className="forge-cinematic-video"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="forge-cinematic-grade" />
      <div className="forge-cinematic-atmosphere" />

      <div className="forge-cinematic-content">
        <div className="forge-cinematic-copy">
          <p className="forge-eyebrow">• IDEAS × TECHNOLOGY × IMPACT</p>
          <h1>BOLD<br />INTELLIGENT<br />SOLUTIONS</h1>
          <p className="forge-description">
            Transforming real-world problems<br className="forge-desktop-break" /> into meaningful AI solutions.
          </p>
          <div className="forge-actions">
            <a href="#projects" className="forge-primary-action">
              EXPLORE MY WORK <ArrowUpRight size={15} />
            </a>
            <a href="#about-copy" className="forge-story-action">
              <span className="forge-play"><Play size={11} fill="currentColor" /></span>
              <span>WATCH<br />OUR STORY</span>
            </a>
          </div>
        </div>

        <img className="forge-cinematic-portrait" src={PORTRAIT_SRC} alt="Mohammed Owaies" draggable={false} />

        <div className="forge-identity-card">
          <strong>MOHAMMED OWAIES</strong>
          <span>AI/ML ENGINEER</span>
          <span>AI · ML · DATA</span>
          <i><ArrowUpRight size={15} /></i>
        </div>

        <div className="forge-side-copy forge-side-top">
          <span>PEOPLE</span>
          <span>IDEAS</span>
          <span>PRODUCTS</span>
          <span>A BRIGHTER</span>
          <span>TOMORROW</span>
        </div>

        <div className="forge-side-copy forge-side-bottom">
          <span>FROM</span>
          <span>IDEAS</span>
          <span>TO A BRIGHTER</span>
          <span>TOMORROW</span>
        </div>

        <div className="forge-hero-rule" />
      </div>

      <div className="forge-cinematic-rim" />
      <div className="forge-cinematic-grain" />
    </div>
  )
}
