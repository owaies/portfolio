'use client'

import { ArrowUpRight, Play } from 'lucide-react'
import AeroShards from './AeroShards'

const PORTRAIT_SRC = '/herome.png'

export default function ObsidianForgeCinematicHero() {
  return (
    <div className="forge-cinematic-hero">
      <AeroShards
        className="forge-aero-background"
        backgroundColor="#120F17"
        shardColor="#896ABD"
        accentColor="#A855F7"
        placement="full"
        flow="stream"
        material="pearl"
        detail="balanced"
        effect="none"
        scale={1}
        spread={1}
        depth={1}
        speed={1}
        spin={1}
        interaction="repel"
        density={1.5}
        shardSize={1.1}
        stretch={1}
        turbulence={1}
        glow={1}
        edgeSoftness={2}
        bloom={0.5}
        grain={0.05}
        chromaticAberration={0.0075}
        transitionDuration={1}
        interactionRadius={1.5}
        interactionStrength={0.5}
        rippleIntensity={1}
        holdToGather
        paused={false}
      />

      <div className="forge-cinematic-grade" />
      <div className="forge-cinematic-atmosphere" />

      <div className="forge-cinematic-content">
        <div className="forge-cinematic-copy">
          <p className="forge-eyebrow">• IDEAS × TECHNOLOGY × IMPACT</p>
          <h1>BUILD<br />INTELLIGENT<br />SOLUTIONS.</h1>
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

        <img className="forge-cinematic-portrait" src={PORTRAIT_SRC} alt="" draggable={false} />

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
