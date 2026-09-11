export type UIExperienceId = 'digital-architecture' | 'organic-intelligence' | 'neural-interface' | 'obsidian-forge'

export type UIExperience = {
  id: UIExperienceId
  name: string
  icon: string
  tagline: string
  description: string
  keywords: string[]
  accent: string
}

export const DEFAULT_UI_EXPERIENCE: UIExperienceId = 'digital-architecture'

export const UI_EXPERIENCES: Record<UIExperienceId, UIExperience> = {
  'digital-architecture': {
    id: 'digital-architecture', name: 'Digital Architecture', icon: '🧬', tagline: 'BUILD / LEARN / SOLVE',
    description: 'A clean futuristic scientific interface inspired by modern digital architecture, AI research, precision engineering, and intelligent systems.',
    keywords: ['Light', 'Futuristic', 'Scientific'], accent: '#1677ff',
  },
  'organic-intelligence': {
    id: 'organic-intelligence', name: 'Organic Intelligence', icon: '🌿', tagline: 'TECHNOLOGY × NATURE',
    description: 'A human-centered visual experience where intelligent technology meets organic forms, natural environments, and sustainable thinking.',
    keywords: ['Nature', 'Technology', 'Organic'], accent: '#168b57',
  },
  'neural-interface': {
    id: 'neural-interface', name: 'Neural Interface', icon: '⚡', tagline: 'AI / DATA / VISION',
    description: 'A futuristic technical interface inspired by neural networks, artificial intelligence systems, data visualization, and advanced computing.',
    keywords: ['Dark', 'Futuristic', 'Technical'], accent: '#35e6ff',
  },
  'obsidian-forge': {
    id: 'obsidian-forge', name: 'Obsidian Forge', icon: '🪨', tagline: 'IDEAS × TECHNOLOGY × IMPACT',
    description: 'A monumental cinematic portfolio experience built around obsidian, glass, architecture, editorial typography, and intelligent digital products.',
    keywords: ['Cinematic', 'Architectural', 'Monochrome'], accent: '#e8e4dc',
  },
}

export function isUIExperienceId(value: string | null | undefined): value is UIExperienceId {
  return value === 'digital-architecture' || value === 'organic-intelligence' || value === 'neural-interface' || value === 'obsidian-forge'
}
