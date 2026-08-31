'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const tables = new Set(['projects','skills','languages','experience','education','certificates','resumes','gallery','site_content'])
const booleanFields = new Set(['featured','published','active','currently_working'])
const numericFields = new Set(['proficiency','percentage','display_order'])
const projectDeploymentTypes = new Set(['deployed', 'local'])
const projectTagColors = new Set(['green', 'blue', 'yellow'])
const projectIcons = new Set(['Eye', 'Layers', 'Monitor', 'HelpCircle', 'Scissors', 'Code', 'Cpu', 'Boxes', 'Database'])
const allowedFields: Record<string, string[]> = {
  projects:['title','slug','short_description','detailed_description','technologies','category','github_url','live_demo_url','tag','deployment_type','tag_color','icon','accent_color','display_order'],
  skills:['name','proficiency','category','accent_color','icon','display_order','active'],
  languages:['name','proficiency_level','percentage','accent_color','display_order','active'],
  experience:['company','role','period','description','technologies','location','currently_working','display_order','active'],
  education:['period','degree','institution','details','status','accent_color','icon','display_order','active'],
  certificates:['title','issuing_organization','issue_date','credential_id','credential_url','thumbnail','certificate_pdf','display_order','active'],
  resumes:['label','preview_image','resume_pdf','active'],
  gallery:['image_url','caption','display_order','featured','published'],
  site_content:['key','value'],
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function validateProjectPayload(payload: Record<string, unknown>) {
  if (typeof payload.title !== 'string' || !payload.title.trim()) throw new Error('Title is required.')
  if (typeof payload.detailed_description !== 'string' || !payload.detailed_description.trim()) throw new Error('Description is required.')

  if (payload.github_url) {
    try {
      const url = new URL(String(payload.github_url))
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
    } catch {
      throw new Error('GitHub URL must be a valid HTTP or HTTPS URL.')
    }
  }

  if (typeof payload.deployment_type !== 'string' || !projectDeploymentTypes.has(payload.deployment_type)) {
    throw new Error('Deployment Type must be deployed or local.')
  }
  if (payload.tag_color && !projectTagColors.has(String(payload.tag_color))) {
    throw new Error('Tag Color must be green, blue, or yellow.')
  }
  if (payload.icon && !projectIcons.has(String(payload.icon))) {
    throw new Error('Icon is not supported.')
  }
  if (typeof payload.accent_color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(payload.accent_color)) {
    throw new Error('Accent Color must be a valid 6-digit hexadecimal color.')
  }
  if (typeof payload.display_order !== 'number' || !Number.isInteger(payload.display_order) || payload.display_order < 0) {
    throw new Error('Display Order must be an integer greater than or equal to 0.')
  }
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
    if(numericFields.has(key)){
      const num=Number(raw)
      if(!Number.isFinite(num)) throw new Error(`${key} must be a number`)
      payload[key]=num
      continue
    }
    if(key==='technologies'){
      payload[key]=raw.split(',').map(x=>x.trim()).filter(Boolean)
      continue
    }
    payload[key]=raw.trim()
  }

  const id=String(formData.get('id')||'')

  if(table==='projects'){
    const description=String(payload.detailed_description ?? '').trim()
    payload.detailed_description=description
    payload.short_description=description
    payload.tag=String(payload.tag || 'Project').trim() || 'Project'
    payload.deployment_type=String(payload.deployment_type || 'local')
    payload.tag_color=String(payload.tag_color || '').trim() || null
    payload.icon=String(payload.icon || '').trim() || null
    payload.accent_color=String(payload.accent_color || '#00d4ff').trim()
    payload.display_order=Number(payload.display_order ?? 0)
    validateProjectPayload(payload)

    const submittedSlug=String(payload.slug || '').trim()
    payload.slug=submittedSlug || slugify(String(payload.title))
    if(!payload.slug) throw new Error('A valid project title is required to generate the project URL.')
  }

  if(table==='site_content'){
    if(!payload.key) throw new Error('Content key is required')
  }

  payload.updated_at=new Date().toISOString()

  if(id){
    const {error}=await supabase.from(table).update(payload).eq('id',id)
    if(error) throw new Error(error.message)
  } else {
    if(table==='projects'){
      payload.featured=false
      payload.published=true
    }
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
