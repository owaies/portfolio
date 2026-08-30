import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Code2, ArrowLeft, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('title,short_description').eq('slug', slug).eq('published', true).single()
  return data ? { title: `${data.title} | Mohammed Owaies`, description: data.short_description } : { title: 'Project | Mohammed Owaies' }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data:p } = await supabase.from('projects').select('*').eq('slug', slug).eq('published', true).single()
  if (!p) notFound()
  return <main className="min-h-screen bg-[#05070b] py-16"><div className="container"><Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16}/> Back to projects</Link><article className="glass mt-8 rounded-3xl p-8 md:p-12"><p className="mono text-xs text-cyan-300">PROJECT / {p.category}</p><h1 className="mt-3 text-5xl font-extrabold">{p.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{p.detailed_description || p.short_description}</p><div className="mt-6 flex flex-wrap gap-2">{(p.technologies ?? []).map((t:string)=><span key={t} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-300">{t}</span>)}</div><div className="mt-8 flex flex-wrap gap-3">{p.github_url&&<a href={p.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-black"><Code2 size={16}/> GitHub</a>}{p.live_demo_url&&<a href={p.live_demo_url} target="_blank" rel="noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-5 py-3" target="_blank"><ExternalLink size={16}/> Live Demo</a>}</div></article></div></main>
}
