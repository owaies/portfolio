'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Mail, Menu, MessageCircle, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['education', 'Education'],
  ['resume', 'Resume'],
  ['contact', 'Contact'],
] as const

export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('about')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links
      .map(([id]) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    if (!sections.length) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.05, 0.2, 0.5, 0.8] },
    )

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return
    }

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    const drawer = drawerRef.current
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    focusable?.[0]?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !drawer || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (open) return
    const previous = previouslyFocusedRef.current
    if (previous && document.contains(previous)) previous.focus({ preventScroll: true })
    else menuButtonRef.current?.focus({ preventScroll: true })
    previouslyFocusedRef.current = null
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (pathname.startsWith('/admin')) return null

  const close = () => setOpen(false)

  return (
    <>
      <style>{`
        .site-nav-shell{position:sticky;top:0;z-index:60;width:100%;transition:padding .35s cubic-bezier(.22,1,.36,1)}
        .site-nav{position:relative;display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:66px;padding:8px 14px;border:1px solid rgba(232,189,118,.14);border-radius:0 0 18px 18px;background:rgba(10,8,7,.72);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);box-shadow:0 18px 50px rgba(0,0,0,.16);transition:min-height .35s ease,background .35s ease,border-color .35s ease,box-shadow .35s ease}
        .site-nav-scrolled{padding-top:5px;padding-bottom:5px}
        .site-nav-scrolled .site-nav{min-height:56px;background:rgba(10,8,7,.92);border-color:rgba(232,189,118,.22);box-shadow:0 16px 44px rgba(0,0,0,.3)}
        .site-nav-brand{display:inline-flex;align-items:center;color:#fff8ed;font-size:18px;font-weight:800;letter-spacing:.12em;transition:transform .25s ease,color .25s ease}
        .site-nav-brand:hover{transform:translateY(-1px);color:#f4d9a5}
        .site-nav-links{display:flex;align-items:center;gap:2px;padding:4px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:rgba(255,255,255,.018)}
        .site-nav-link{position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:0 12px;border-radius:9px;color:#9e948b;font-size:13px;font-weight:600;letter-spacing:.01em;transition:color .25s ease,background .25s ease,transform .25s ease}
        .site-nav-link:hover{color:#fff8ed;background:rgba(232,189,118,.055);transform:translateY(-1px)}
        .site-nav-link-active{color:#fff8ed;background:rgba(232,189,118,.07)}
        .site-nav-link-active:after{content:"";position:absolute;left:50%;bottom:-4px;width:18px;height:2px;border-radius:99px;background:linear-gradient(90deg,#e8bd76,#c98278);box-shadow:0 0 12px rgba(232,189,118,.35);transform:translateX(-50%);animation:site-nav-indicator .35s cubic-bezier(.22,1,.36,1) both}
        .site-nav-actions{display:flex;align-items:center;gap:8px}
        .site-nav-action{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:40px;padding:0 13px;border:1px solid rgba(255,255,255,.1);border-radius:11px;background:rgba(255,255,255,.018);font-size:13px;font-weight:650;transition:transform .25s ease,border-color .25s ease,background .25s ease,box-shadow .25s ease,color .25s ease}
        .site-nav-action:hover{transform:translateY(-1px)}
        .site-nav-whatsapp{color:#9fd0aa;border-color:rgba(91,214,133,.28)}
        .site-nav-whatsapp:hover{background:rgba(91,214,133,.08);border-color:rgba(91,214,133,.45);box-shadow:0 8px 24px rgba(91,214,133,.08)}
        .site-nav-contact{color:#f4d9a5;border-color:rgba(232,189,118,.34);background:linear-gradient(135deg,rgba(232,189,118,.11),rgba(201,130,120,.06))}
        .site-nav-contact:hover{border-color:rgba(232,189,118,.58);box-shadow:0 8px 26px rgba(232,189,118,.1)}
        .site-nav-mobile{display:none}
        .site-nav-backdrop{position:fixed;inset:0;z-index:100;border:0;background:rgba(3,2,2,.54);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);animation:site-nav-fade .25s ease both}
        .site-nav-drawer{position:fixed;inset:0 0 0 auto;z-index:101;width:min(84vw,380px);display:flex;flex-direction:column;padding:14px;overflow:hidden;background:linear-gradient(155deg,rgba(18,14,11,.985),rgba(8,7,6,.99));border-left:1px solid rgba(232,189,118,.18);box-shadow:-30px 0 80px rgba(0,0,0,.45);animation:site-nav-drawer-in .38s cubic-bezier(.22,1,.36,1) both}
        .site-nav-drawer-head{display:flex;align-items:center;justify-content:space-between;padding:1px 2px 16px}
        .site-nav-close{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#fff8ed;background:rgba(255,255,255,.025);transition:transform .25s ease,background .25s ease,border-color .25s ease}
        .site-nav-close:hover{transform:rotate(4deg) scale(1.03);background:rgba(232,189,118,.07);border-color:rgba(232,189,118,.3)}
        .site-nav-drawer-nav{border-top:1px solid rgba(255,255,255,.075)}
        .site-nav-drawer-link{display:flex;align-items:center;justify-content:space-between;min-height:53px;padding:0 10px;border-bottom:1px solid rgba(255,255,255,.075);border-radius:10px;color:#c4bbb1;font-size:18px;font-weight:550;letter-spacing:-.015em;transition:color .25s ease,background .25s ease,transform .25s ease}
        .site-nav-drawer-link:hover{color:#fff8ed;background:rgba(232,189,118,.055);transform:translateX(-2px)}
        .site-nav-drawer-link-active{color:#fff8ed;background:linear-gradient(90deg,rgba(232,189,118,.09),transparent)}
        .site-nav-drawer-link-active:before{content:"";width:3px;height:22px;border-radius:99px;background:#e8bd76;box-shadow:0 0 14px rgba(232,189,118,.4);margin-left:-10px}
        .site-nav-drawer-cta{margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:16px}
        .site-nav-drawer-cta a{min-width:0;height:44px;padding:0 7px;border-radius:11px;font-size:13px;font-weight:650;white-space:nowrap}
        .site-nav-drawer-cta svg{width:17px;height:17px;flex:none}
        .site-nav-mobile-call{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:42px;padding:0 11px;border:1px solid rgba(232,189,118,.3);border-radius:11px;color:#f4d9a5;background:rgba(232,189,118,.05);font-size:13px;font-weight:650;white-space:nowrap;transition:transform .25s ease,background .25s ease,border-color .25s ease,box-shadow .25s ease}
        .site-nav-mobile-call:hover{transform:translateY(-1px);background:rgba(232,189,118,.09);border-color:rgba(232,189,118,.48);box-shadow:0 8px 24px rgba(232,189,118,.08)}
        @keyframes site-nav-indicator{from{opacity:0;transform:translateX(-50%) scaleX(.35)}to{opacity:1;transform:translateX(-50%) scaleX(1)}}
        @keyframes site-nav-fade{from{opacity:0}to{opacity:1}}
        @keyframes site-nav-drawer-in{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
        @keyframes site-nav-item-in{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
        @media (max-width:1023px){
          .site-nav-desktop{display:none}
          .site-nav-mobile{display:block}
          .site-nav-mobile-header{position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:62px;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(9,8,7,.74);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
          .site-nav-mobile-actions{display:flex;align-items:center;gap:7px;min-width:0}
          .site-nav-menu-button{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border:1px solid rgba(255,255,255,.09);border-radius:12px;color:#fff8ed;background:rgba(255,255,255,.025);transition:transform .25s ease,background .25s ease,border-color .25s ease}
          .site-nav-menu-button:hover{transform:translateY(-1px);background:rgba(232,189,118,.06);border-color:rgba(232,189,118,.25)}
          .site-nav-drawer-link{animation:site-nav-item-in .42s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--nav-index) * 55ms + 70ms)}
        }
        @media (max-width:420px){
          .site-nav-mobile-header{padding-inline:12px}
          .site-nav-mobile-call{height:40px;padding:0 9px;font-size:12px}
          .site-nav-menu-button{width:40px;height:40px}
          .site-nav-drawer{width:min(86vw,360px);padding:12px}
          .site-nav-drawer-link{min-height:50px;font-size:18px}
          .site-nav-drawer-cta a{height:43px;font-size:12px}
        }
        @media (max-width:340px){
          .site-nav-mobile-header{padding-inline:9px}
          .site-nav-brand{font-size:17px}
          .site-nav-mobile-call{height:39px;padding:0 8px;font-size:11px}
          .site-nav-menu-button{width:39px;height:39px}
        }
        @media (prefers-reduced-motion:reduce){
          .site-nav,.site-nav-link,.site-nav-action,.site-nav-close,.site-nav-drawer-link,.site-nav-menu-button,.site-nav-brand,.site-nav-mobile-call{transition:none!important;animation:none!important}
          .site-nav-backdrop,.site-nav-drawer{animation:none!important}
        }
      `}</style>

      <div className={`site-nav-desktop site-nav-shell ${scrolled ? 'site-nav-scrolled' : ''}`}>
        <div className="container site-nav">
          <Link href="#home" className="site-nav-brand" aria-label="Go to home">MO<span style={{ color: '#e8bd76' }}>.</span></Link>
          <nav className="site-nav-links" aria-label="Primary navigation">
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={`site-nav-link ${active === id ? 'site-nav-link-active' : ''}`} aria-current={active === id ? 'location' : undefined}>{label}</a>
            ))}
          </nav>
          <div className="site-nav-actions">
            <a href="https://wa.me/917619329863" target="_blank" rel="noreferrer" className="site-nav-action site-nav-whatsapp"><MessageCircle size={15} /> WhatsApp</a>
            <a href="#contact" className="site-nav-action site-nav-contact">Get in touch <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </div>

      <div className="site-nav-mobile">
        <header className="site-nav-mobile-header">
          <Link href="#home" onClick={close} className="site-nav-brand" aria-label="Go to home">MO<span style={{ color: '#e8bd76' }}>.</span></Link>
          <div className="site-nav-mobile-actions">
            <a href="tel:+917619329863" className="site-nav-mobile-call" aria-label="Call Mohammed Owaies"><Phone size={16} aria-hidden="true" /> Call</a>
            <button ref={menuButtonRef} type="button" onClick={() => setOpen(true)} aria-label="Open navigation menu" aria-expanded={open} className="site-nav-menu-button">
              <Menu size={24} strokeWidth={2.2} />
            </button>
          </div>
        </header>

        {open && (
          <>
            <button type="button" className="site-nav-backdrop" aria-label="Close navigation menu" onClick={close} />
            <aside ref={drawerRef} className="site-nav-drawer" aria-label="Mobile navigation">
              <div className="site-nav-drawer-head">
                <Link href="#home" onClick={close} className="site-nav-brand" aria-label="Go to home">MO<span style={{ color: '#e8bd76' }}>.</span></Link>
                <button type="button" onClick={close} aria-label="Close navigation menu" className="site-nav-close"><X size={25} strokeWidth={2} /></button>
              </div>
              <nav className="site-nav-drawer-nav" aria-label="Mobile primary navigation">
                {links.map(([id, label], index) => (
                  <a key={id} href={`#${id}`} onClick={close} style={{ '--nav-index': index } as React.CSSProperties} className={`site-nav-drawer-link ${active === id ? 'site-nav-drawer-link-active' : ''}`} aria-current={active === id ? 'location' : undefined}>
                    <span>{label}</span><ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <div className="site-nav-drawer-cta">
                <a href="https://wa.me/917619329863" target="_blank" rel="noreferrer" onClick={close} className="site-nav-action site-nav-whatsapp"><MessageCircle /> WhatsApp</a>
                <a href="mailto:owaies786@gmail.com" onClick={close} className="site-nav-action site-nav-contact"><Mail /> Email</a>
              </div>
            </aside>
          </>
        )}
      </div>
    </>
  )
}
