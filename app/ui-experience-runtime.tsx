'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'
import { createClient } from '@/lib/supabase/client'

const CHROME = {
  'digital-architecture': { theme: '#f7faff', scheme: 'light' },
  'organic-intelligence': { theme: '#081c14', scheme: 'dark' },
  'neural-interface': { theme: '#061021', scheme: 'dark' },
} as const

const ADMIN_CHROME = { theme: '#030407', scheme: 'dark' } as const

export default function UIExperienceRuntime({ active }: { active: UIExperienceId }) {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const isAdminRoute = pathname.startsWith('/admin')
    const params = new URLSearchParams(window.location.search)
    const preview = params.get('ui-preview')
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

    let cancelled = false
    let observer: MutationObserver | null = null
    const imageKey = `profile_image_${experience}`

    const applyProfileImage = (url: string) => {
      if (cancelled || !url) return false
      const image = document.querySelector<HTMLImageElement>('.target-portrait img')
      if (!image) return false
      if (image.getAttribute('src') === url || image.currentSrc === url || image.src === url) return true
      image.src = url
      image.setAttribute('data-experience-profile-image', experience)
      return true
    }

    const loadOverride = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('site_content').select('value').eq('key', imageKey).maybeSingle()
        const url = data?.value?.trim()
        if (!url || cancelled) return

        // Next Image can mount its <img> a tick after the page component. Keep
        // watching briefly so preview always receives the same image as the
        // profile-picture manager, rather than falling back to the default.
        if (applyProfileImage(url)) return
        observer = new MutationObserver(() => {
          if (applyProfileImage(url)) {
            observer?.disconnect()
            observer = null
          }
        })
        observer.observe(document.body, { childList: true, subtree: true })
        const retry = () => {
          if (cancelled || applyProfileImage(url)) return
          window.requestAnimationFrame(retry)
        }
        window.requestAnimationFrame(retry)
      } catch {
        // Keep the server-rendered profile image if the optional override cannot load.
      }
    }

    void loadOverride()
    return () => { cancelled = true; observer?.disconnect() }
  }, [active, pathname])

  return null
}
