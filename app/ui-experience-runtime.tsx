'use client'

import { useEffect } from 'react'
import { isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'

export default function UIExperienceRuntime({ active }: { active: UIExperienceId }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const preview = params.get('ui-preview')
    const experience = isUIExperienceId(preview) ? preview : active
    document.body.dataset.uiExperience = experience
    return () => { delete document.body.dataset.uiExperience }
  }, [active])
  return null
}
