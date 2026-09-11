"use client"

import { useEffect, useState } from "react"
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
const ofLabels: Record<string,string> = { home:"Work", "about-copy":"About", projects:"Work", skills:"Tools", experience:"Journey", certificates:"Achievements", contact:"Contact" }

export default function SiteNavV2() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [obsidian, setObsidian] = useState(false)
  useEffect(() => { const update=()=>setCompact(window.innerWidth<=900); update(); window.addEventListener("resize",update); return()=>window.removeEventListener("resize",update)},[])
  useEffect(() => { const update=()=>setObsidian(document.body.dataset.uiExperience === "obsidian-forge"); update(); const obs=new MutationObserver(update); obs.observe(document.body,{attributes:true,attributeFilter:["data-ui-experience"]}); return()=>obs.disconnect() },[pathname])
  useEffect(() => { document.body.classList.toggle("nav-menu-open",open); return()=>document.body.classList.remove("nav-menu-open") },[open])
  useEffect(() => setOpen(false),[pathname])
  if(pathname.startsWith("/admin")) return null
  const navigateTo=(target:string)=>{const section=document.getElementById(target);if(!section)return;const navOffset=compact?54:58;window.scrollTo({top:Math.max(0,section.getBoundingClientRect().top+window.scrollY-navOffset),behavior:"smooth"});window.history.replaceState(null,"",target==="home"?"#home":`#${target}`);setOpen(false)}
  const handle=(e:React.MouseEvent<HTMLAnchorElement>,target:string)=>{e.preventDefault();navigateTo(target)}
  return <header className={`target-nav ${compact?"is-compact":""} ${open?"is-open":""} ${obsidian?"obsidian-nav":""}`}><div className="target-nav-inner"><a href="#home" className="target-brand" onClick={e=>handle(e,"home")}>MO<span>.</span></a>{!compact&&<nav aria-label="Primary navigation" className="target-nav-links">{links.map(link=><a key={link.target} href={`#${link.target}`} onClick={e=>handle(e,link.target)}>{obsidian?(ofLabels[link.target]||link.label):link.label}</a>)}</nav>}<div className="target-nav-actions">{!compact&&<a className="target-contact" href="#contact" onClick={e=>handle(e,"contact")}>{obsidian?"Let's Build":"Let's Talk"}<ArrowUpRight size={12}/></a>}{compact&&<button type="button" className="target-menu-button" onClick={()=>setOpen(v=>!v)} aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open}>{open?<X/>:<Menu/>}</button>}</div></div>{compact&&open&&<nav className="target-mobile-menu" aria-label="Mobile navigation">{links.map(link=><a key={link.target} href={`#${link.target}`} onClick={e=>handle(e,link.target)}>{obsidian?(ofLabels[link.target]||link.label):link.label}</a>)}</nav>}</header>
}
