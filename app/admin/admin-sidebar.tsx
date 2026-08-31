'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, FolderKanban, Wrench, BriefcaseBusiness, GraduationCap, Award, FileText, Images, Type, ArrowLeft, LogOut, Menu, X } from 'lucide-react'
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
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        type="button"
        className="admin-mobile-menu"
        aria-label={open ? 'Close admin navigation' : 'Open admin navigation'}
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        {open ? <X size={27} /> : <Menu size={27} />}
      </button>

      <button
        type="button"
        aria-label="Close admin navigation"
        className={`admin-nav-backdrop ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-brand"><span>MO<span className="text-cyan-300">.</span></span><small>Admin</small></div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {items.map(([label, href, Icon]) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href} className={active ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => setOpen(false)}>
                <Icon size={20}/><span>{label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" className="admin-nav-item" onClick={() => setOpen(false)}><ArrowLeft size={20}/><span>Back to Site</span></Link>
          <form action={logoutAdmin}><button className="admin-nav-item w-full text-left" type="submit"><LogOut size={20}/><span>Logout</span></button></form>
        </div>
      </aside>
    </>
  )
}
