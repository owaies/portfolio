import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const configs: Record<string,{table:string;title:string;columns:string[]}> = {
  projects:{table:'projects',title:'Projects',columns:['title','slug','category','featured','display_order','published']},
  skills:{table:'skills',title:'Skills',columns:['name','category','proficiency','display_order','active']},
  languages:{table:'languages',title:'Languages',columns:['name','proficiency_level','percentage','display_order','active']},
  experience:{table:'experience',title:'Experience',columns:['company','role','period','display_order','active']},
  education:{table:'education',title:'Education',columns:['period','degree','institution','display_order','active']},
  certificates:{table:'certificates',title:'Certificates',columns:['title','issuing_organization','issue_date','display_order','active']},
  resume:{table:'resumes',title:'Resume',columns:['label','active','created_at']},
  gallery:{table:'gallery',title:'Gallery',columns:['caption','display_order','featured','published']},
  content:{table:'site_content',title:'Content / CMS',columns:['key','value','updated_at']},
}

function inputType(key:string){if(key==='value'||key==='short_description'||key==='detailed_description'||key==='description'||key==='details'||key==='message')return 'textarea';return 'text'}

export default async function AdminSection({params}:{params:Promise<{section:string}>}){
  const {section}=await params; const cfg=configs[section]; if(!cfg)return notFound();
  const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); if(!claims?.claims)redirect('/admin/login');
  const {data,error}=await supabase.from(cfg.table).select('*').order(cfg.table==='site_content'?'key':'display_order',{ascending:true}).limit(100);
  return <main className="min-h-screen bg-[#05070b] p-6"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><Link href="/admin" className="mono text-xs text-cyan-300">← CONTROL ROOM</Link><h1 className="mt-2 text-4xl font-bold">{cfg.title}</h1></div><Link href="/" className="glass rounded-full px-4 py-2 text-sm">View Site ↗</Link></div><div className="glass mt-8 overflow-hidden rounded-2xl"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-white/10 bg-white/5"><tr><th className="p-4">ID</th>{cfg.columns.map(c=><th key={c} className="p-4 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{error ? <tr><td colSpan={cfg.columns.length+1} className="p-8 text-red-300">{error.message}</td></tr> : (data??[]).map((row:any)=><tr key={row.id??row.key} className="border-b border-white/5"><td className="p-4 font-mono text-xs text-slate-500">{row.id?String(row.id).slice(0,8):row.key}</td>{cfg.columns.map(c=><td key={c} className="max-w-xs p-4 text-slate-300">{typeof row[c]==='boolean'?String(row[c]):Array.isArray(row[c])?row[c].join(', '):String(row[c]??'')}</td>)}</tr>)}{(data??[]).length===0&&!error&&<tr><td colSpan={cfg.columns.length+1} className="p-10 text-center text-slate-500">No records yet.</td></tr>}</tbody></table></div></div><p className="mt-4 text-sm text-slate-500">This section is connected to Supabase. CRUD controls can be expanded from this shared editor without changing the database contract.</p></div></main>
}