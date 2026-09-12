'use client'

const VIDEO_SRC = '/herovideo.mp4'
const PORTRAIT_SRC = '/herome.png'

export default function ObsidianForgeCinematicHero() {
  return (
    <div className="forge-cinematic-hero" aria-hidden="true">
      <video
        className="forge-cinematic-video"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="forge-cinematic-grade" />
      <div className="forge-cinematic-atmosphere" />
      <img className="forge-cinematic-portrait" src={PORTRAIT_SRC} alt="" draggable={false} />
      <div className="forge-cinematic-rim" />
      <div className="forge-cinematic-copy-veil" />
      <div className="forge-cinematic-grain" />
    </div>
  )
}
