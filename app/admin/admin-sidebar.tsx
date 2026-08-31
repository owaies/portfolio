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
      <style>{`
        .admin-mobile-menu { display:none; }
        .admin-nav-backdrop { display:none; }
        @media (max-width:900px) {
          .admin-mobile-menu {
            display:grid;
            place-items:center;
            position:fixed;
            top:13px;
            left:22px;
            width:42px;
            height:42px;
            z-index:90;
            border:0;
            border-radius:10px;
            background:transparent;
            color:#9aa8bd;
            cursor:pointer;
          }
          .admin-mobile-menu:hover { color:#62efff; background:rgba(71,233,255,.05); }
          .admin-nav-backdrop {
            display:block;
            position:fixed;
            inset:0;
            z-index:70;
            border:0;
            padding:0;
            background:rgba(0,0,0,.72);
            backdrop-filter:blur(3px);
            opacity:0;
            pointer-events:none;
            transition:opacity .2s ease;
          }
          .admin-nav-backdrop.open { opacity:1; pointer-events:auto; }
          .admin-sidebar {
            position:fixed !important;
            inset:0 auto 0 0 !important;
            width:min(450px,86vw) !important;
            height:100dvh !important;
            min-height:100dvh !important;
            display:flex !important;
            flex-direction:column !important;
            border-right:1px solid rgba(255,255,255,.09) !important;
            border-bottom:0 !important;
            background:rgba(3,4,7,.985) !important;
            box-shadow:24px 0 70px rgba(0,0,0,.5);
            transform:translateX(-102%);
            transition:transform .24s ease;
            z-index:80 !important;
            overflow-y:auto;
            overflow-x:hidden;
          }
          .admin-sidebar.open { transform:translateX(0); }
          .admin-brand {
            height:74px !important;
            min-height:74px;
            padding:0 36px !important;
            border-bottom:1px solid rgba(255,255,255,.07);
            font-size:20px !important;
          }
          .admin-nav {
            display:grid !important;
            gap:5px !important;
            padding:22px 20px !important;
            overflow:visible !important;
          }
          .admin-nav-item {
            width:100%;
            min-height:52px !important;
            padding:0 24px !important;
            gap:18px !important;
            border-radius:14px !important;
            font-size:16px !important;
            flex:initial !important;
          }
          .admin-nav-item.active {
            color:#62efff;
            background:rgba(71,233,255,.07);
            border-color:rgba(71,233,255,.15);
          }
          .admin-sidebar-bottom {
            margin-top:auto !important;
            display:grid !important;
            gap:4px;
            padding:18px 20px 22px !important;
            border-top:1px solid rgba(255,255,255,.07);
          }
          .admin-sidebar-bottom form { width:100%; }
          .admin-sidebar-bottom .admin-nav-item { justify-content:flex-start !important; }
          .admin-main { width:100% !important; margin:0 !important; }
          .admin-topbar {
            height:74px !important;
            min-height:74px;
            padding:0 20px 0 82px !important;
            position:sticky !important;
            top:0 !important;
            z-index:30 !important;
            background:rgba(3,4,7,.94) !important;
          }
        }
        @media (max-width:640px) {
          .admin-mobile-menu { left:24px; }
          .admin-topbar { padding-left:78px !important; }
        }
      `}</style>

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
