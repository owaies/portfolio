'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ObsidianForgeMonolithCanvas = dynamic(
  () => import('./obsidian-forge-monolith-canvas'),
  { ssr: false },
)

function audit(event: string, extra: Record<string, unknown> = {}) {
  const payload = {
    event,
    experience: document.body.dataset.uiExperience || null,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...extra,
  }
  console.info('[Forge runtime audit]', payload)
  void fetch('/api/forge-runtime', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}

export default function ObsidianForgeMonolith() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const update = () => {
      const isForge = document.body.dataset.uiExperience === 'obsidian-forge'
      setActive(isForge)
      if (isForge) audit('activation-component-active')
    }

    update()
    const observer = new MutationObserver(update)
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-ui-experience'] })
    return () => observer.disconnect()
  }, [])

  if (!active) return null

  return (
    <>
      <div
        data-forge-runtime-indicator="active"
        data-forge-audit-version="2026-09-12"
        style={{
          position: 'fixed',
          top: 86,
          left: 12,
          zIndex: 9999,
          padding: '7px 10px',
          border: '1px solid rgba(255,255,255,.55)',
          borderRadius: 3,
          background: 'rgba(0,0,0,.82)',
          color: '#fff',
          font: '600 10px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace',
          letterSpacing: '.12em',
          pointerEvents: 'none',
        }}
      >
        OBSIDIAN FORGE / V7 ACTIVE
      </div>
      <ObsidianForgeMonolithCanvas />
    </>
  )
}
