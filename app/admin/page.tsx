import { FolderKanban, Wrench, BriefcaseBusiness, GraduationCap, Award, Images } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from './admin-sidebar'

const sections = ['projects','skills','experience','education','certificates','resume','gallery','content']
const cards = [
  ['projects','Projects',FolderKanban],
  ['skills','Skills',Wrench],
  ['experience','Experience',BriefcaseBusiness],
  ['education','Education',GraduationCap],
  ['certificates','Certificates',Award],
  ['gallery','Gallery Images',Images],
] as const

export default async function AdminPage() {
  const supabase=await createClient()
  const {data}=await supabase.auth.getClaims()
  if(!data?.claims) redirect('/admin/login')
  const counts=await Promise.all(cards.map(([table])=>supabase.from(table).select('*',{count:'exact',head:true})))
  return <main className="admin-shell">
    <AdminSidebar />
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="mono text-xs text-slate-500">admin</p><h1 className="text-lg font-bold">Projects</h1></div><span className="admin-status"><span/> Admin</span></header>
      <div className="admin-content">
        <div className="mb-8"><p className="mono text-xs text-cyan-300">PORTFOLIO / CONTROL ROOM</p><h2 className="mt-2 text-3xl font-bold">Dashboard Overview</h2><p className="mt-2 text-slate-500">Manage all content on your portfolio from one place.</p></div>
        <div className="admin-stat-grid">{cards.map(([table,label,Icon],i)=><div key={table} className="admin-stat-card"><div className="admin-stat-icon"><Icon size={18}/></div><div className="mt-5 text-sm text-slate-500">{label}</div><div className="absolute right-5 top-5 text-3xl font-bold">{counts[i].count ?? 0}</div></div>)}</div>
        <div className="admin-panel mt-8"><div className="flex items-center gap-2 font-semibold"><span className="text-cyan-300">▣</span> Quick Tips</div><ul className="mt-4 space-y-2 text-sm leading-6 text-slate-500"><li>• Use the <span className="text-cyan-300">Content / CMS</span> tab to edit text, profile photo, contact info, or social links shown on the site.</li><li>• Upload a resume PDF in the <span className="text-cyan-300">Resume</span> tab. Only one active resume shows on the site.</li><li>• Set thumbnail images and PDFs per certificate in the <span className="text-cyan-300">Certificates</span> tab.</li><li>• Changes appear on the live portfolio after the page is refreshed or revalidated.</li></ul></div>
        <div className="sr-only">{sections.join(', ')}</div>
      </div>
    </section>
  </main>
}
