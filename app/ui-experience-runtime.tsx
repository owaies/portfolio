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

function isMobileDesktopSite() {
  if (typeof window === 'undefined') return false

  // Chrome/Chromium Desktop Site on a phone deliberately exposes a desktop
  // layout viewport while the physical display is still phone-sized. Do not
  // use the UA alone: Desktop Site can rewrite/remove mobile UA markers.
  const touchDevice = navigator.maxTouchPoints > 0
  const phoneSizedScreen = Math.min(screen.width, screen.height) <= 600
  const desktopLayoutViewport = window.innerWidth >= 768
  const chromeLike = /chrome|crios|chromium/i.test(navigator.userAgent) ||
    !!(navigator as Navigator & { userAgentData?: unknown }).userAgentData

  if (touchDevice && phoneSizedScreen && desktopLayoutViewport && chromeLike) return true

  // Fallback for browsers that expose the Android platform through UA-CH but
  // hide the normal Android/mobile markers in Desktop Site mode.
  const ua = navigator.userAgent
  const uaData = (navigator as Navigator & {
    userAgentData?: { mobile?: boolean; platform?: string }
  }).userAgentData
  const android = /android/i.test(ua) || uaData?.platform?.toLowerCase() === 'android'
  return android && (uaData?.mobile === false || (!/mobile/i.test(ua) && desktopLayoutViewport))
}

export default function UIExperienceRuntime({ active }: { active: UIExperienceId }) {
  const activeRef = useRef<UIExperienceId>(active)
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const applyChrome = (experience: UIExperienceId | 'admin') => {
      document.body.dataset.uiExperience = experience
      const forgeRoot = document.querySelector('main.target-site')
      forgeRoot?.classList.toggle(
        'obsidian-forge-experience',
        experience === 'obsidian-forge',
      )
      document.body.classList.toggle(
        'forge-desktop-site',
        experience === 'obsidian-forge' && isMobileDesktopSite(),
      )

      const chrome = experience === 'admin' ? ADMIN_CHROME : CHROME[experience]
      const themeMeta = document.querySelector('meta[name="theme-color"]') ?? document.createElement('meta')
      themeMeta.setAttribute('name', 'theme-color')
      themeMeta.setAttribute('content', chrome.theme)
      if (!themeMeta.parentElement) document.head.appendChild(themeMeta)

      const schemeMeta = document.querySelector('meta[name="color-scheme"]') ?? document.createElement('meta')
      schemeMeta.setAttribute('name', 'color-scheme')
      schemeMeta.setAttribute('content', chrome.scheme)
      if (!schemeMeta.parentElement) document.head.appendChild(schemeMeta)
    }

    const applyExperience = () => {
      const isAdmin = window.location.pathname.startsWith('/admin')
      if (isAdmin) {
        applyChrome('admin')
        return
      }

      const preview = new URLSearchParams(window.location.search).get('ui-preview')
      if (
        preview === 'digital-architecture' ||
        preview === 'organic-intelligence' ||
        preview === 'neural-interface' ||
        preview === 'obsidian-forge'
      ) {
        applyChrome(preview)
      } else {
        applyChrome(activeRef.current)
      }
    }

    applyExperience()

    // Desktop Site can be toggled by the browser without a React navigation.
    // Re-apply the mode on viewport/orientation changes so the desktop canvas
    // remains correct after rotation or Chrome UI changes.
    const onViewportChange = () => applyExperience()
    window.addEventListener('resize', onViewportChange, { passive: true })
    window.addEventListener('orientationchange', onViewportChange, { passive: true })
    window.addEventListener('popstate', applyExperience)

    return () => {
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('orientationchange', onViewportChange)
      window.removeEventListener('popstate', applyExperience)
    }
  }, [active])

  return null
}
