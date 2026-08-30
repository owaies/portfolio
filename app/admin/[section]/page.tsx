import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Editor from './editor'

const configs: Record<string,{table:string;title:string;columns:string[]}> = {
  projects:{table:'projects',title:'Projects',columns:['title','slug','short_description','detailed_description','technologies','category','github_url','live_demo_url','featured','display_order','published']},
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
  const {section}=await params; const cfg=configs[section]; if(!cfg)return notFound();
  const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims();
  if(!claims?.claims)redirect('/admin/login');
  const order=cfg.table==='site_content'?'key':'display_order';
  const {data,error}=await supabase.from(cfg.table).select('*').order(order,{ascending:true}).limit(100);
  const rows=data??[];
  return <main className="min-h-screen bg-[#05070b] p-6"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><Link href="/admin" className="mono text-xs text-cyan-300">← CONTROL ROOM</Link><h1 className="mt-2 text-4xl font-bold">{cfg.title}</h1></div><Link href="/" className="glass rounded-full px-4 py-2 text-sm">View Site ↗</Link></div>{error?<div className="glass mt-8 rounded-2xl p-8 text-red-300">{error.message}</div>:<div className="mt-8"><Editor table={cfg.table} columns={cfg.columns} rows={rows}/></div>}</div></main>
}
