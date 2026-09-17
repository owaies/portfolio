import type { UIExperienceId } from './ui-experiences'

export type LoadingExperienceAssets = {
  desktop: string
  mobile: string
}

// Legacy video loading assets are intentionally disabled. Loading is now
// rendered entirely with lightweight, experience-specific CSS/SVG-like art.
export const LOADING_EXPERIENCES: Record<UIExperienceId, LoadingExperienceAssets> = {
  'organic-intelligence': { desktop: '', mobile: '' },
  'digital-architecture': { desktop: '', mobile: '' },
  'neural-interface': { desktop: '', mobile: '' },
  'obsidian-forge': { desktop: '', mobile: '' },
}
