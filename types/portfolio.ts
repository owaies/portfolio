export type PortfolioId = string

export interface Project {
  id: PortfolioId
  title: string
  slug: string
  short_description: string | null
  detailed_description: string | null
  technologies: string[] | null
  category: string | null
  thumbnail: string | null
  screenshots: string[] | null
  github_url: string | null
  live_demo_url: string | null
  featured: boolean
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: PortfolioId
  name: string
  proficiency: number
  category: string
  accent_color: string | null
  icon: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Language {
  id: PortfolioId
  name: string
  proficiency_level: string
  percentage: number | null
  accent_color: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Experience {
  id: PortfolioId
  company: string
  role: string
  period: string | null
  description: string | null
  technologies: string[] | null
  location: string | null
  currently_working: boolean
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Education {
  id: PortfolioId
  period: string
  degree: string
  institution: string
  details: string | null
  status: string | null
  accent_color: string | null
  icon: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: PortfolioId
  title: string
  issuing_organization: string
  issue_date: string | null
  credential_id: string | null
  credential_url: string | null
  thumbnail: string | null
  certificate_pdf: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Resume {
  id: PortfolioId
  label: string
  preview_image: string | null
  resume_pdf: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface SiteContent {
  key: string
  value: string
  created_at: string
  updated_at: string
}

export interface ProfileSummary {
  id: PortfolioId
  full_name: string | null
  avatar_url: string | null
}
