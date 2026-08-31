'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUp, Check, ChevronLeft, ChevronRight, Copy, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const EMAIL = 'owaies786@gmail.com'
const GITHUB = 'https://github.com/owaies'

type ToastKind = 'success' | 'error' | 'info'
type Toast = { id: number; kind: ToastKind; message: string }
type Stage = { label: string; ready: boolean }

const applePath = 'M116 31c-8 7-15 9-24 8-1-10 4-19 11-25 8-7 17-10 26-10 1 10-4 20-13 27ZM91 48c17 0 26 8 34 8 9 0 20-8 33-8 11 0 23 5 30 14-30 17-25 58 5 70-6 14-9 20-18 32-10 14-23 31-39 31-15 0-19-10-36-10-18 0-23 10-38 10-16 0-28-16-38-30C7 141-5 104 8 78c9-18 27-29 46-29 15 0 29 9 37 9Z'

function AppleLoader({ stages }: { stages: Stage[] }) {
  const completed = stages.filter(stage => stage.ready).length
  const progress = Math.round((completed / stages.length) * 100)
  return (
    <div className="premium-loader" role="status" aria-live="polite" aria-label={`${stages.find(stage => !stage.ready)?.label ?? 'Interface ready'}. ${progress}% of loading stages complete.`}>
      <div className="premium-loader-logo" aria-hidden="true">
        <svg viewBox="0 0 180 190" className="premium-apple-svg">
          <defs><clipPath id="apple-progress-clip"><path d={applePath} /></clipPath></defs>
          <path className="premium-apple-track" d={applePath} />
          <rect className="premium-apple-fill" x="0" y="0" width="180" height="190" transform={`translate(0 ${190 - progress * 1.9})`} clipPath="url(#apple-progress-clip)" />
          <path className="premium-apple-shine" d="M116 31c-8 7-15 9-24 8-1-10 4-19 11-25 8-7 17-10 26-10 1 10-4 20-13 27Z" />
        </svg>
      </div>
      <div className="premium-loader-percent mono">{progress}%</div>
      <div className="premium-loader-stages" aria-hidden="true">
        {stages.map(stage => <span key={stage.label} className={stage.ready ? 'ready' : ''}>{stage.ready ? <Check size={12} /> : <span className="stage-dot" />}{stage.label}</span>)}
      </div>
      <p className="premium-loader-caption">MO. · Preparing your portfolio</p>
    </div>
  )
}

export default function PremiumUX({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; index: number } | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [stages, setStages] = useState<Stage[]>([
    { label: 'Initialization', ready: false },
    { label: 'Portfolio data', ready: false },
    { label: 'Projects & media', ready: false },
    { label: 'Interface preparation', ready: false },
  ])
  const previousFocus = useRef<HTMLElement | null>(null)
  const toastId = useRef(0)
  const publicPage = !pathname.startsWith('/admin')

  const toast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++toastId.current
    setToasts(current => [...current, { id, message, kind }])
    window.setTimeout(() => setToasts(current => current.filter(item => item.id !== id)), 3600)
  }, [])

  useEffect(() => {
    if (!publicPage) return
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0)
      setShowTop(window.scrollY > 560)
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [publicPage])

  useEffect(() => {
    if (!publicPage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main.grid-bg section[id]'))
    sections.forEach(section => section.classList.add('premium-reveal'))
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('premium-reveal-visible')), { threshold: 0.08, rootMargin: '0px 0px -8% 0px' })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [publicPage])

  useEffect(() => {
    if (!publicPage) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const setMotion = () => document.documentElement.classList.toggle('reduce-motion', reduce.matches)
    setMotion()
    reduce.addEventListener?.('change', setMotion)
    return () => reduce.removeEventListener?.('change', setMotion)
  }, [publicPage])

  useEffect(() => {
    if (!publicPage) return
    let cancelled = false
    const setStage = (index: number) => setStages(current => current.map((stage, i) => i <= index ? { ...stage, ready: true } : stage))
    setStage(0)
    const frame = window.requestAnimationFrame(() => { if (!cancelled) setStage(1) })
    const media = Array.from(document.querySelectorAll<HTMLImageElement>('main.grid-bg img'))
    const mediaPromise = Promise.all(media.map(image => image.complete ? Promise.resolve() : new Promise<void>(resolve => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => resolve(), { once: true })
    })))
    void mediaPromise.then(async () => {
      if (cancelled) return
      setStage(2)
      await document.fonts?.ready
      if (cancelled) return
      setStage(3)
      window.requestAnimationFrame(() => { if (!cancelled) setLoaded(true) })
    })
    return () => { cancelled = true; window.cancelAnimationFrame(frame) }
  }, [publicPage])

  useEffect(() => {
    if (!publicPage) return
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const image = target?.closest('main.grid-bg #projects img, main.grid-bg #certificates img, main.grid-bg #gallery img') as HTMLImageElement | null
      if (image) {
        const images = Array.from(document.querySelectorAll<HTMLImageElement>('main.grid-bg #projects img, main.grid-bg #certificates img, main.grid-bg #gallery img'))
        setLightbox({ src: image.currentSrc || image.src, alt: image.alt, index: Math.max(0, images.indexOf(image)) })
        return
      }
      const copy = target?.closest<HTMLElement>('[data-copy-value]')
      if (copy) {
        const value = copy.dataset.copyValue ?? ''
        const result = navigator.clipboard?.writeText(value)
        if (result) void result.then(() => toast(`${copy.dataset.copyLabel ?? 'Text'} copied`, 'success')).catch(() => toast('Copy failed. Please try again.', 'error'))
        else toast('Copy is unavailable in this browser.', 'error')
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [publicPage, toast])

  useEffect(() => {
    if (!lightbox) return
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.querySelector<HTMLElement>('.premium-lightbox-close')?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const images = Array.from(document.querySelectorAll<HTMLImageElement>('main.grid-bg #projects img, main.grid-bg #certificates img, main.grid-bg #gallery img'))
        if (!images.length) return
        const index = event.key === 'ArrowRight' ? (lightbox.index + 1) % images.length : (lightbox.index - 1 + images.length) % images.length
        setLightbox({ src: images[index].currentSrc || images[index].src, alt: images[index].alt, index })
      }
      if (event.key === 'Tab') {
        const buttons = Array.from(document.querySelectorAll<HTMLElement>('.premium-lightbox button'))
        if (buttons.length && ((event.shiftKey && document.activeElement === buttons[0]) || (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]))) {
          event.preventDefault()
          ;(event.shiftKey ? buttons[buttons.length - 1] : buttons[0]).focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = bodyOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocus.current?.focus()
    }
  }, [lightbox])

  if (!publicPage) return <>{children}</>

  const copyButton = (label: string, value: string) => <button type="button" className="premium-copy-button" data-copy-value={value} data-copy-label={label} aria-label={`Copy ${label}`}><Copy size={15} /> {label}</button>

  return (
    <>
      {!loaded && <div className="premium-loader-overlay"><AppleLoader stages={stages} /></div>}
      <div className={loaded ? 'premium-content premium-content-ready' : 'premium-content'}>{children}</div>
      <div className="premium-scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
      <div className="premium-copy-actions" aria-label="Quick copy actions">{copyButton('Email', EMAIL)}{copyButton('GitHub URL', GITHUB)}</div>
      <button type="button" className={`premium-back-top ${showTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp size={18} /></button>
      <nav className="premium-bottom-nav" aria-label="Mobile section navigation">{['home','about','skills','projects','education','contact'].map(id => <a key={id} href={`#${id}`}>{id === 'home' ? 'Home' : id[0].toUpperCase() + id.slice(1)}</a>)}</nav>
      {toasts.length > 0 && <div className="premium-toasts" aria-live="polite">{toasts.map(item => <div key={item.id} className={`premium-toast ${item.kind}`}><span>{item.kind === 'success' ? '✓' : item.kind === 'error' ? '!' : 'i'}</span>{item.message}</div>)}</div>}
      {lightbox && <div className="premium-lightbox-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setLightbox(null) }}>
        <div className="premium-lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt || 'Project image'}>
          <button type="button" className="premium-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close image viewer"><X size={24} /></button>
          <button type="button" className="premium-lightbox-prev" onClick={() => {
            const images = Array.from(document.querySelectorAll<HTMLImageElement>('main.grid-bg #projects img, main.grid-bg #certificates img, main.grid-bg #gallery img'))
            if (!images.length) return
            const index = (lightbox.index - 1 + images.length) % images.length
            setLightbox({ src: images[index].currentSrc || images[index].src, alt: images[index].alt, index })
          }} aria-label="Previous image"><ChevronLeft size={30} /></button>
          <img src={lightbox.src} alt={lightbox.alt} className="premium-lightbox-image" />
          <button type="button" className="premium-lightbox-next" onClick={() => {
            const images = Array.from(document.querySelectorAll<HTMLImageElement>('main.grid-bg #projects img, main.grid-bg #certificates img, main.grid-bg #gallery img'))
            if (!images.length) return
            const index = (lightbox.index + 1) % images.length
            setLightbox({ src: images[index].currentSrc || images[index].src, alt: images[index].alt, index })
          }} aria-label="Next image"><ChevronRight size={30} /></button>
        </div>
      </div>}
    </>
  )
}
