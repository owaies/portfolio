"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, ArrowUpRight, Menu, X } from "lucide-react"

const links = [
  { label: "About", target: "about-copy" },
  { label: "Skills", target: "skills" },
  { label: "Projects", target: "projects" },
  { label: "Education", target: "education" },
  { label: "Resume", target: "resume" },
  { label: "Contact", target: "contact" },
]

export default function SiteNavV2() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (pathname.startsWith("/admin")) return null

  const navigateTo = (target: string) => {
    const section = document.getElementById(target)
    if (!section) return

    section.scrollIntoView({ behavior: "smooth", block: "start" })
    window.history.replaceState(null, "", `#${target}`)
    setOpen(false)
  }

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault()
    navigateTo(target)
  }

  return (
    <header className="target-nav">
      <div className="target-nav-inner">
        <a href="#home" className="target-brand" onClick={(event) => handleNavigation(event, "home")}>MO<span>.</span></a>

        <nav aria-label="Primary navigation" className="target-nav-links">
          {links.map((link) => (
            <a key={link.target} href={`#${link.target}`} onClick={(event) => handleNavigation(event, link.target)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="target-nav-actions">
          <a className="target-whatsapp" href="https://wa.me/917619329863" target="_blank" rel="noreferrer">
            <MessageCircle size={12} /> WhatsApp
          </a>
          <a className="target-contact" href="#contact" onClick={(event) => handleNavigation(event, "contact")}>
            Get in touch <ArrowUpRight size={12} />
          </a>
          <button
            type="button"
            className="target-menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="target-mobile-menu" aria-label="Mobile navigation">
          {links.map((link) => (
            <a key={link.target} href={`#${link.target}`} onClick={(event) => handleNavigation(event, link.target)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
