import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const siteUrl = 'https://owaies-portfolio.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: projects } = await supabase.from('projects').select('slug,updated_at').eq('published', true).order('display_order')

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...(projects ?? []).filter(project => Boolean(project.slug)).map(project => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
