"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"

const links = [
  { label: "Home", target: "home" },
  { label: "About", target: "about-copy" },
  { label: "Projects", target: "projects" },
  { label: "Skills", target: "skills" },
  { label: "Experience", target: "experience" },
  { label: "Certificates", target: "certificates" },
  { label: "Contact", target: "contact" },
]

export default function SiteNavV2() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const update = () => setCompact(window.innerWidth <= 900)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    document.body.classList.toggle("nav-menu-open", open)
    return () => document.body.classList.remove("nav-menu-open")
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  if (pathname.startsWith("/admin")) return null

  const navigateTo = (target: string) => {
    const section = document.getElementById(target)
    if (!section) return
    const navOffset = compact ? 54 : 58
    const top = section.getBoundingClientRect().top + window.scrollY - navOffset
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
    window.history.replaceState(null, "", target === "home" ? "#home" : `#${target}`)
    setOpen(false)
  }

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault()
    navigateTo(target)
  }

  return (
    <header className={`target-nav ${compact ? "is-compact" : ""} ${open ? "is-open" : ""}`}>
      <div className="target-nav-inner">
        <a href="#home" className="target-brand" onClick={(event) => handleNavigation(event, "home")}>MO<span>.</span></a>

        {!compact && <nav aria-label="Primary navigation" className="target-nav-links">
          {links.map((link) => <a key={link.target} href={`#${link.target}`} onClick={(event) => handleNavigation(event, link.target)}>{link.label}</a>)}
        </nav>}

        <div className="target-nav-actions">
          {!compact && <a className="target-contact" href="#contact" onClick={(event) => handleNavigation(event, "contact")}>Let&apos;s Talk <ArrowUpRight size={12} /></a>}
          {compact && <button type="button" className="target-menu-button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X /> : <Menu />}</button>}
        </div>
      </div>

      {compact && open && <nav className="target-mobile-menu" aria-label="Mobile navigation">
        {links.map((link) => <a key={link.target} href={`#${link.target}`} onClick={(event) => handleNavigation(event, link.target)}>{link.label}</a>)}
      </nav>}
    </header>
  )
}
