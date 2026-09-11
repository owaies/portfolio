import type { UIExperienceId } from './ui-experiences'

export type LoadingExperienceAssets = {
  desktop: string
  mobile: string
}

export const LOADING_EXPERIENCES: Record<UIExperienceId, LoadingExperienceAssets> = {
  'organic-intelligence': {
    desktop: '/loading/organic-intelligence-desktop.mp4',
    mobile: '/loading/organic-intelligence-mobile.mp4',
  },
  'digital-architecture': {
    desktop: '/loading/digital-architecture-desktop.mp4',
    mobile: '/loading/digital-architecture-mobile.mp4',
  },
  'neural-interface': {
    desktop: '/loading/neural-interface-desktop.mp4',
    mobile: '/loading/neural-interface-mobile.mp4',
  },
  'obsidian-forge': {
    desktop: '/loading/obsidian-forge-desktop.mp4',
    mobile: '/loading/obsidian-forge-mobile.mp4',
  },
}
