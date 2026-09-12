'use client'

import { useEffect, useRef } from 'react'
import type { UIExperienceId } from '@/lib/ui-experiences'

const CHROME: Record<UIExperienceId, { theme: string; scheme: string }> = {
  'digital-architecture': { theme: '#f7faff', scheme: 'light' },
  'organic-intelligence': { theme: '#081c14', scheme: 'dark' },
  'neural-interface': { theme: '#061021', scheme: 'dark' },
  'obsidian-forge': { theme: '#08090b', scheme: 'dark' },
}
const ADMIN_CHROME = { theme: '#030407', scheme: 'dark' }

function isAndroidChromeDesktopSite() {
  const userAgent = navigator.userAgent
  const userAgentData = (navigator as Navigator & {
    userAgentData?: { mobile?: boolean; platform?: string }
  }).userAgentData
  const android = userAgentData?.platform?.toLowerCase() === 'android' || /android/i.test(userAgent)
  if (!android) return false
  if (userAgentData?.mobile === false) return true
  return userAgentData?.mobile === undefined && !/mobile/i.test(userAgent)
}

export default function UIExperienceRuntime({ active }: { active: UIExperienceId }) {
  const activeRef = useRef<UIExperienceId>(active)
  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => {
    const applyChrome = (experience: UIExperienceId | 'admin') => {
      document.body.dataset.uiExperience = experience
      const forgeRoot = document.querySelector('main.target-site')
      forgeRoot?.classList.toggle('obsidian-forge-experience', experience === 'obsidian-forge')
      document.body.classList.toggle(
        'forge-desktop-site',
        experience === 'obsidian-forge' && isAndroidChromeDesktopSite(),
      )
      const chrome = experience === 'admin' ? ADMIN_CHROME : CHROME[experience]
      const themeMeta = document.querySelector('meta[name="theme-color"]') ?? document.createElement('meta')
      themeMeta.setAttribute('name', 'theme-color'); themeMeta.setAttribute('content', chrome.theme)
      if (!themeMeta.parentElement) document.head.appendChild(themeMeta)
      const schemeMeta = document.querySelector('meta[name="color-scheme"]') ?? document.createElement('meta')
      schemeMeta.setAttribute('name', 'color-scheme'); schemeMeta.setAttribute('content', chrome.scheme)
      if (!schemeMeta.parentElement) document.head.appendChild(schemeMeta)
    }
    const applyExperience = () => {
      const isAdmin = window.location.pathname.startsWith('/admin')
      if (isAdmin) { applyChrome('admin'); return }
      const preview = new URLSearchParams(window.location.search).get('ui-preview')
      if (preview === 'digital-architecture' || preview === 'organic-intelligence' || preview === 'neural-interface' || preview === 'obsidian-forge') applyChrome(preview)
      else applyChrome(activeRef.current)
    }
    applyExperience()
    const onPop = () => applyExperience()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [active])
  return null
}
