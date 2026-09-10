import { redirect } from 'next/navigation'
import AdminSidebar from '../admin-sidebar'
import UIExperienceManager from './manager'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_UI_EXPERIENCE, isUIExperienceId, type UIExperienceId } from '@/lib/ui-experiences'

export default async function UIExperiencePage() {
  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims?.claims) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', claims.claims.sub).maybeSingle()
  if (profile?.role !== 'admin') redirect('/admin/login')

  const experienceKeys = ['digital-architecture', 'organic-intelligence', 'neural-interface'] as UIExperienceId[]
  const { data } = await supabase.from('site_content').select('key,value').in('key', ['active_ui_experience', ...experienceKeys.map(id => `profile_image_${id}`)])
  const activeValue = data?.find(row => row.key === 'active_ui_experience')?.value
  const active = isUIExperienceId(activeValue) ? activeValue : DEFAULT_UI_EXPERIENCE
  const profileImages = Object.fromEntries(experienceKeys.map(id => [id, data?.find(row => row.key === `profile_image_${id}`)?.value || ''])) as Record<UIExperienceId, string>

  return (
    <main className="admin-shell">
      <AdminSidebar />
      <section className="admin-main">
        <header className="admin-topbar">
          <div><p className="mono text-xs text-slate-500">admin</p><h1 className="text-lg font-bold">UI Experience</h1></div>
          <span className="admin-status"><span /> Admin</span>
        </header>
        <div className="admin-content">
          <UIExperienceManager active={active} profileImages={profileImages} />
        </div>
      </section>
    </main>
  )
}
