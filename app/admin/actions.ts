'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const tables = new Set(['projects','skills','languages','experience','education','certificates','resumes','gallery','site_content'])

export async function saveRecord(formData: FormData){
  const table=String(formData.get('table')||''); if(!tables.has(table)) throw new Error('Unsupported table')
  const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); if(!claims?.claims) redirect('/admin/login')
  const payload:Record<string,unknown>={}
  for(const [key,value] of formData.entries()){ if(key==='table'||key==='id'||key==='technologies') continue; payload[key]=String(value) }
  if(formData.has('technologies')) payload.technologies=String(formData.get('technologies')).split(',').map(x=>x.trim()).filter(Boolean)
  for(const key of ['proficiency','percentage','display_order']) if(payload[key]!==undefined) payload[key]=Number(payload[key])
  for(const key of ['featured','published','active','currently_working','read']) if(payload[key]!==undefined) payload[key]=payload[key]==='true'
  if(table==='site_content'){ payload.key=String(formData.get('key')||''); payload.updated_at=new Date().toISOString() }
  else payload.updated_at=new Date().toISOString()
  const id=String(formData.get('id')||'')
  const {error}=id?await supabase.from(table).update(payload).eq('id',id):await supabase.from(table).insert(payload)
  if(error) throw new Error(error.message)
  revalidatePath('/'); revalidatePath('/admin'); revalidatePath(`/admin/${table==='site_content'?'content':table}`)
}

export async function deleteRecord(formData:FormData){
  const table=String(formData.get('table')||''); const id=String(formData.get('id')||''); if(!tables.has(table)||!id) throw new Error('Invalid delete request')
  const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); if(!claims?.claims) redirect('/admin/login')
  const {error}=await supabase.from(table).delete().eq('id',id); if(error) throw new Error(error.message)
  revalidatePath('/'); revalidatePath('/admin');
}
