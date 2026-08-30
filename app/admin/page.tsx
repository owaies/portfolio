import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const sections = ['projects','skills','experience','education','certificates','resume','gallery','content']

export default async function AdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/admin/login')
  const tables = ['projects','skills','experience','education','certificates','gallery']
  const counts = await Promise.all(tables.map(t=>supabase.from(t).select('*',{count:'exact',head:true})))
  return <main className="min-h-screen bg-[#05070b] p-6"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="mono text-xs text-cyan-300">PORTFOLIO / ADMIN</p><h1 className="mt-2 text-4xl font-bold">Control Room</h1></div><Link href="/" className="glass rounded-full px-4 py-2 text-sm">Back to Site ↗</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tables.map((t,i)=><div key={t} className="glass rounded-2xl p-5"><div className="text-3xl font-bold">{counts[i].count ?? 0}</div><div className="mt-1 capitalize text-slate-400">{t}</div></div>)}</div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{sections.map(x=><Link key={x} href={`/admin/${x}`} className="glass rounded-2xl p-5 capitalize transition hover:border-cyan-300/30">Manage {x}<span className="float-right text-slate-500">→</span></Link>)}</div><div className="glass mt-8 rounded-2xl p-6 text-sm text-slate-400">Quick tips: keep only factual experience and achievements, publish projects deliberately, keep one active resume, and upload sensitive PDFs to the private storage buckets.</div></div></main>
}
