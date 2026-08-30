'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Wrench, BriefcaseBusiness, GraduationCap, Award, FileText, Images, Type, ArrowLeft, LogOut } from 'lucide-react'
import { logoutAdmin } from './actions'

const items = [
  ['Overview', '/admin', LayoutDashboard],
  ['Projects', '/admin/projects', FolderKanban],
  ['Skills', '/admin/skills', Wrench],
  ['Experience', '/admin/experience', BriefcaseBusiness],
  ['Education', '/admin/education', GraduationCap],
  ['Certificates', '/admin/certificates', Award],
  ['Resume', '/admin/resume', FileText],
  ['Gallery', '/admin/gallery', Images],
  ['Content / CMS', '/admin/content', Type],
] as const

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand"><span>MO<span className="text-cyan-300">.</span></span><small>Admin</small></div>
      <nav className="admin-nav">
        {items.map(([label, href, Icon]) => {
          const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
          return <Link key={href} href={href} className={active ? 'admin-nav-item active' : 'admin-nav-item'}><Icon size={17}/><span>{label}</span></Link>
        })}
      </nav>
      <div className="admin-sidebar-bottom">
        <Link href="/" className="admin-nav-item"><ArrowLeft size={17}/><span>Back to Site</span></Link>
        <form action={logoutAdmin}><button className="admin-nav-item w-full text-left" type="submit"><LogOut size={17}/><span>Logout</span></button></form>
      </div>
    </aside>
  )
}
