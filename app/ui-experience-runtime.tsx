'use client'

import { useEffect } from 'react'
import { isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'

const CHROME = {
  'digital-architecture': { theme: '#f7faff', scheme: 'light' },
  'organic-intelligence': { theme: '#081c14', scheme: 'dark' },
  'neural-interface': { theme: '#061021', scheme: 'dark' },
} as const

export default function UIExperienceRuntime({ active }: { active: UIExperienceId }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const preview = params.get('ui-preview')
    const experience = isUIExperienceId(preview) ? preview : active
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

    return () => { delete document.body.dataset.uiExperience }
  }, [active])
  return null
}
