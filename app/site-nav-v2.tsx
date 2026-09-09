"use client"

import { MessageCircle, ArrowUpRight } from "lucide-react"

const links = ["about", "skills", "projects", "education", "resume", "contact"]

export default function SiteNavV2() {
  return (
    <header className="target-nav">
      <div className="target-nav-inner">
        <a href="#home" className="target-brand">MO<span>.</span></a>
        <nav aria-label="Primary navigation" className="target-nav-links">
          {links.map((link) => (
            <a key={link} href={`#${link}`}>{link[0].toUpperCase() + link.slice(1)}</a>
          ))}
        </nav>
        <div className="target-nav-actions">
          <a className="target-whatsapp" href="https://wa.me/917619329863" target="_blank" rel="noreferrer">
            <MessageCircle size={12} /> WhatsApp
          </a>
          <a className="target-contact" href="#contact">Get in touch <ArrowUpRight size={12} /></a>
        </div>
      </div>
    </header>
  )
}
