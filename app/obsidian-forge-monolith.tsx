'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ObsidianForgeMonolithCanvas = dynamic(
  () => import('./obsidian-forge-monolith-canvas'),
  { ssr: false },
)

/**
 * Mounts the heavyweight R3F scene only while Obsidian Forge is active.
 * Other portfolio experiences never download or instantiate the GLB viewer.
 */
export default function ObsidianForgeMonolith() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const update = () => {
      setActive(document.body.dataset.uiExperience === 'obsidian-forge')
    }

    update()
    const observer = new MutationObserver(update)
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-ui-experience'] })

    return () => observer.disconnect()
  }, [])

  if (!active) return null

  return <ObsidianForgeMonolithCanvas />
}
