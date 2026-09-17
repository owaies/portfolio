import type { UIExperienceId } from './ui-experiences'

export type LoadingExperienceAssets = {
  desktop: string
  mobile: string
}

// Kept only as a compatibility shape for existing imports. The actual loading
// screen is now rendered with lightweight experience-specific CSS animations.
export const LOADING_EXPERIENCES: Record<UIExperienceId, LoadingExperienceAssets> = {
  'organic-intelligence': { desktop: '', mobile: '' },
  'digital-architecture': { desktop: '', mobile: '' },
  'neural-interface': { desktop: '', mobile: '' },
  'obsidian-forge': { desktop: '', mobile: '' },
}
