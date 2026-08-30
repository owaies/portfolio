import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Editor from './editor'
import AdminSidebar from '../admin-sidebar'

const configs: Record<string,{table:string;title:string;columns:string[]}> = {
  projects:{table:'projects',title:'Projects',columns:['title','slug','short_description','detailed_description','technologies','category','thumbnail','github_url','live_demo_url','featured','display_order','published']},
  skills:{table:'skills',title:'Skills',columns:['name','proficiency','category','accent_color','icon','display_order','active']},
  languages:{table:'languages',title:'Languages',columns:['name','proficiency_level','percentage','accent_color','display_order','active']},
  experience:{table:'experience',title:'Experience',columns:['company','role','period','description','technologies','location','currently_working','display_order','active']},
  education:{table:'education',title:'Education',columns:['period','degree','institution','details','status','accent_color','icon','display_order','active']},
  certificates:{table:'certificates',title:'Certificates',columns:['title','issuing_organization','issue_date','credential_id','credential_url','thumbnail','certificate_pdf','display_order','active']},
  resume:{table:'resumes',title:'Resume',columns:['label','preview_image','resume_pdf','active']},
  gallery:{table:'gallery',title:'Gallery',columns:['image_url','caption','display_order','featured','published']},
  content:{table:'site_content',title:'Content / CMS',columns:['key','value']},
}

export default async function AdminSection({params}:{params:Promise<{section:string}>}){
  const {section}=await params
  const cfg=configs[section]
  if(!cfg)return notFound()
  const supabase=await createClient()
  const {data:claims}=await supabase.auth.getClaims()
  if(!claims?.claims)redirect('/admin/login')
  const order = cfg.table === 'site_content' ? 'key' : cfg.table === 'resumes' ? 'updated_at' : 'display_order'
  const query = supabase.from(cfg.table).select('*')
  const {data,error} = cfg.table === 'resumes'
    ? await query.order(order,{ascending:false}).limit(100)
    : await query.order(order,{ascending:true}).limit(100)
  const rows=data??[]
  return <main className="admin-shell">
    <AdminSidebar />
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="mono text-xs text-slate-500">admin</p><h1 className="text-lg font-bold">{cfg.title}</h1></div><div className="flex items-center gap-3"><Link href="/" className="hidden text-xs text-slate-500 transition hover:text-white sm:block">View site ↗</Link><span className="admin-status"><span/> Admin</span></div></header>
      <div className="admin-content">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mono text-xs text-cyan-300">CONTENT / ADMIN</p><h2 className="mt-2 text-3xl font-bold">{cfg.title}</h2><p className="mt-2 text-slate-500">Manage your {cfg.title.toLowerCase()} content.</p></div><Link href="/" className="glass rounded-full px-4 py-2 text-sm sm:hidden">View Site ↗</Link></div>
        {error?<div className="admin-panel text-red-300">{error.message}</div>:<Editor table={cfg.table} columns={cfg.columns} rows={rows}/>} 
      </div>
    </section>
  </main>
}
