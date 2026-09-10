'use client'

import { useLayoutEffect } from 'react'
import { isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'

const CHROME = {
  'digital-architecture': { theme: '#f7faff', scheme: 'light' },
  'organic-intelligence': { theme: '#081c14', scheme: 'dark' },
  'neural-interface': { theme: '#061021', scheme: 'dark' },
} as const

const ADMIN_CHROME = { theme: '#030407', scheme: 'dark' } as const

export default function UIExperienceRuntime({ active }: { active: UIExperienceId }) {
  useLayoutEffect(() => {
    const isAdminRoute = window.location.pathname.startsWith('/admin')
    const params = new URLSearchParams(window.location.search)
    const preview = params.get('ui-preview')

    // UI experiences belong to the public portfolio only. Never let the
    // public theme leak into the admin control room, including during route
    // transitions where the root layout stays mounted.
    const experience = !isAdminRoute && isUIExperienceId(preview) ? preview : !isAdminRoute ? active : null

    if (!experience) {
      document.body.dataset.uiExperience = 'admin'
      const themeMeta = document.querySelector('meta[name="theme-color"]') ?? document.createElement('meta')
      themeMeta.setAttribute('name', 'theme-color')
      themeMeta.setAttribute('content', ADMIN_CHROME.theme)
      if (!themeMeta.parentElement) document.head.appendChild(themeMeta)

      const schemeMeta = document.querySelector('meta[name="color-scheme"]') ?? document.createElement('meta')
      schemeMeta.setAttribute('name', 'color-scheme')
      schemeMeta.setAttribute('content', ADMIN_CHROME.scheme)
      if (!schemeMeta.parentElement) document.head.appendChild(schemeMeta)
      return
    }

    document.body.dataset.uiExperience = experience
    const chrome = CHROME[experience]
    const themeMeta = document.querySelector('meta[name="theme-color"]') ?? document.createElement('meta')
    themeMeta.setAttribute('name', 'theme-color')
    themeMeta.setAttribute('content', chrome.theme)
    if (!themeMeta.parentElement) document.head.appendChild(themeMeta)

    const schemeMeta = document.querySelector('meta[name="color-scheme"]') ?? document.createElement('meta')
    schemeMeta.setAttribute('name', 'color-scheme')
    schemeMeta.setAttribute('content', chrome.scheme)
    if (!schemeMeta.parentElement) document.head.appendChild(schemeMeta)
  }, [active])

  return null
}
