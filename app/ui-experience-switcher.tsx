"use client"

import { useEffect, useState } from "react"
import { Check, Sparkles } from "lucide-react"
import { UI_EXPERIENCES, type UIExperienceId } from "@/lib/ui-experiences"

const EXPERIENCE_COOKIE = "portfolio-ui-experience"
const EXPERIENCE_ORDER: UIExperienceId[] = [
  "digital-architecture",
  "organic-intelligence",
  "neural-interface",
  "obsidian-forge",
]

function readCookie() {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${EXPERIENCE_COOKIE}=([^;]*)`))
  return match?.[1] ?? null
}

export default function UIExperienceSwitcher({ active }: { active: UIExperienceId }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<UIExperienceId>(active)

  useEffect(() => {
    const stored = readCookie()
    if (stored && EXPERIENCE_ORDER.includes(stored as UIExperienceId)) setCurrent(stored as UIExperienceId)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const choose = (experience: UIExperienceId) => {
    if (experience === current) {
      setOpen(false)
      return
    }

    const secure = window.location.protocol === "https:" ? "; Secure" : ""
    document.cookie = `${EXPERIENCE_COOKIE}=${experience}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`
    window.localStorage.setItem(EXPERIENCE_COOKIE, experience)
    setCurrent(experience)
    setOpen(false)
    window.location.reload()
  }

  const selected = UI_EXPERIENCES[current]

  return (
    <div className={`ui-experience-switcher ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="ui-experience-trigger"
        onClick={() => setOpen(value => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`UI Experience: ${selected.name}`}
      >
        <Sparkles size={14} />
        <span>UI Experience</span>
        <i aria-hidden="true" style={{ background: selected.accent }} />
      </button>

      {open && (
        <>
          <button className="ui-experience-backdrop" aria-label="Close UI Experience menu" onClick={() => setOpen(false)} />
          <div className="ui-experience-panel" role="dialog" aria-label="Choose UI Experience">
            <div className="ui-experience-heading">
              <span>INTERFACE</span>
              <strong>UI EXPERIENCE</strong>
              <small>Your preference is saved on this device.</small>
            </div>
            <div className="ui-experience-options">
              {EXPERIENCE_ORDER.map(id => {
                const item = UI_EXPERIENCES[id]
                const isCurrent = id === current
                return (
                  <button
                    key={id}
                    type="button"
                    className={`ui-experience-option ${isCurrent ? "is-current" : ""}`}
                    onClick={() => choose(id)}
                    style={{ "--experience-accent": item.accent } as React.CSSProperties}
                  >
                    <span className="ui-experience-icon" aria-hidden="true">{item.icon}</span>
                    <span className="ui-experience-copy">
                      <strong>{item.name}</strong>
                      <small>{item.tagline}</small>
                    </span>
                    {isCurrent && <span className="ui-experience-current"><Check size={12} /> CURRENT</span>}
                    <span className="ui-experience-dot" aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
