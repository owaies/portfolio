'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const tables = new Set(['projects','skills','languages','experience','education','certificates','resumes','gallery','site_content'])
const booleanFields = new Set(['featured','published','active','currently_working'])
const numericFields = new Set(['proficiency','percentage','display_order'])
const allowedFields: Record<string, string[]> = {
  projects:['title','slug','short_description','detailed_description','technologies','category','thumbnail','github_url','live_demo_url','featured','display_order','published'],
  skills:['name','proficiency','category','accent_color','icon','display_order','active'],
  languages:['name','proficiency_level','percentage','accent_color','display_order','active'],
  experience:['company','role','period','description','technologies','location','currently_working','display_order','active'],
  education:['period','degree','institution','details','status','accent_color','icon','display_order','active'],
  certificates:['title','issuing_organization','issue_date','credential_id','credential_url','thumbnail','certificate_pdf','display_order','active'],
  resumes:['label','preview_image','resume_pdf','active'],
  gallery:['image_url','caption','display_order','featured','published'],
  site_content:['key','value'],
}

async function requireAdmin(){
  const supabase=await createClient()
  const {data:claims}=await supabase.auth.getClaims()
  if(!claims?.claims) redirect('/admin/login')
  const {data:profile}=await supabase.from('profiles').select('role').eq('id',claims.claims.sub).maybeSingle()
  if(profile?.role!=='admin') redirect('/admin/login')
  return supabase
}

export async function logoutAdmin(){
  const supabase=await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function saveRecord(formData: FormData){
  const table=String(formData.get('table')||'')
  if(!tables.has(table)) throw new Error('Unsupported table')
  const supabase=await requireAdmin()
  const payload:Record<string,unknown>={}
  for(const key of allowedFields[table]){
    if(!formData.has(key)) continue
    const raw=String(formData.get(key) ?? '')
    if(booleanFields.has(key)){ payload[key]=raw==='true'; continue }
    if(numericFields.has(key)){ const num=Number(raw); if(!Number.isFinite(num)) throw new Error(`${key} must be a number`); payload[key]=num; continue }
    if(key==='technologies'){ payload[key]=raw.split(',').map(x=>x.trim()).filter(Boolean); continue }
    payload[key]=raw.trim()
  }
  if(table==='site_content'){
    if(!payload.key) throw new Error('Content key is required')
    payload.updated_at=new Date().toISOString()
  } else payload.updated_at=new Date().toISOString()
  const id=String(formData.get('id')||'')
  if(id){
    const {error}=await supabase.from(table).update(payload).eq('id',id)
    if(error) throw new Error(error.message)
  } else {
    const {error}=await supabase.from(table).insert(payload)
    if(error) throw new Error(error.message)
  }
  revalidatePath('/'); revalidatePath('/admin'); revalidatePath(`/admin/${table==='site_content'?'content':table}`)
}

export async function deleteRecord(formData:FormData){
  const table=String(formData.get('table')||''); const id=String(formData.get('id')||'')
  if(!tables.has(table)||!id) throw new Error('Invalid delete request')
  const supabase=await requireAdmin()
  const {error}=await supabase.from(table).delete().eq('id',id)
  if(error) throw new Error(error.message)
  revalidatePath('/'); revalidatePath('/admin'); revalidatePath(`/admin/${table==='site_content'?'content':table}`)
}
