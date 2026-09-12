'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ObsidianForgeCinematicHero = dynamic(
  () => import('./obsidian-forge-cinematic-hero'),
  { ssr: false },
)

export default function ObsidianForgeMonolith() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const update = () => setActive(document.body.dataset.uiExperience === 'obsidian-forge')
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-ui-experience'] })
    return () => observer.disconnect()
  }, [])

  if (!active) return null
  return <ObsidianForgeCinematicHero />
}
