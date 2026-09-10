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
    const imageKey = `profile_image_${experience}`
    const applyProfileImage = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('site_content').select('value').eq('key', imageKey).maybeSingle()
        const url = data?.value?.trim()
        if (!url || cancelled) return
        const image = document.querySelector<HTMLImageElement>('.target-portrait img')
        if (!image) return
        if (image.currentSrc === url || image.src === url) return
        image.src = url
      } catch {
        // Keep the server-rendered profile image if the optional override cannot load.
      }
    }
    void applyProfileImage()

    return () => { cancelled = true }
  }, [active, pathname])

  return null
}
