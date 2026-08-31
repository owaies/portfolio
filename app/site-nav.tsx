'use client'

import { useEffect, useState } from 'react'
import { Menu, X, MessageCircle, Mail } from 'lucide-react'
import Link from 'next/link'

const links = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['education', 'Education'],
  ['resume', 'Resume'],
  ['contact', 'Contact'],
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[.07] bg-black/65 backdrop-blur-2xl">
        <div className="container flex min-h-[70px] items-center justify-between gap-4">
          <Link href="#home" onClick={close} className="text-lg font-extrabold tracking-widest">
            MO<span className="text-cyan-300">.</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-400 lg:flex">
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="transition hover:text-white">{label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <a href="https://wa.me/917619329863" target="_blank" rel="noreferrer" className="rounded-full border border-emerald-400/30 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/10">WhatsApp</a>
            <a href="#contact" className="rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-300/10">Get in touch</a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/[.06] lg:hidden"
          >
            <Menu size={31} strokeWidth={2} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black text-white lg:hidden">
          <div className="container flex min-h-[70px] items-center justify-between">
            <Link href="#home" onClick={close} className="text-lg font-extrabold tracking-widest">
              MO<span className="text-cyan-300">.</span>
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Close navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center text-white"
            >
              <X size={34} strokeWidth={2} />
            </button>
          </div>

          <div className="container flex min-h-[calc(100dvh-70px)] flex-col pt-24 pb-7">
            <nav className="border-t border-white/[.08]">
              {links.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={close}
                  className="flex min-h-[76px] items-center border-b border-white/[.08] text-[29px] font-normal tracking-[-.02em] text-slate-200 transition active:text-cyan-300"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="mt-auto grid grid-cols-2 gap-5 pt-8">
              <a
                href="https://wa.me/917619329863"
                target="_blank"
                rel="noreferrer"
                onClick={close}
                className="inline-flex h-16 items-center justify-center gap-3 rounded-full border border-emerald-400/40 px-4 text-[17px] text-emerald-300 transition active:bg-emerald-400/10"
              >
                <MessageCircle size={23} /> WhatsApp
              </a>
              <a
                href="mailto:owaies786@gmail.com"
                onClick={close}
                className="inline-flex h-16 items-center justify-center gap-3 rounded-full border border-cyan-300/40 px-4 text-[17px] text-cyan-300 transition active:bg-cyan-300/10"
              >
                <Mail size={23} /> Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
