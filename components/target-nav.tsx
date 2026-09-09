"use client"

import { useState } from "react"
import { Menu, X, MessageCircle } from "lucide-react"

const links = [
  ["About", "about"], ["Skills", "skills"], ["Projects", "projects"], ["Education", "education"],
  ["Resume", "resume"], ["Contact", "contact"],
] as const

export default function TargetNav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="target-nav">
      <div className="target-nav-inner">
        <a href="#home" className="target-logo" aria-label="Mohammed Owaies home">MO<span>.</span></a>
        <nav className="target-desktop-nav" aria-label="Primary navigation">
          {links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="target-nav-actions">
          <a className="target-whatsapp" href="https://wa.me/917619329863" target="_blank" rel="noreferrer"><MessageCircle size={9} /> WhatsApp</a>
          <a className="target-contact-button" href="#contact">Get in touch</a>
          <button className="target-menu-button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <nav className="target-mobile-menu" aria-label="Mobile navigation">{links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav>}
    </header>
  )
}
