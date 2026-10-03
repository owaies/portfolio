"use client"

import { useEffect, useState } from "react"

const roles = [
  "Deep Learning Enthusiast",
  "AIML Engineer",
  "Computer Vision Builder",
  "Full-Stack Developer",
]

export default function AnimatedRole() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let timer: number | undefined
    const start = () => {
      if (timer !== undefined) return
      timer = window.setInterval(() => {
        setRoleIndex((index) => (index + 1) % roles.length)
      }, 2400)
    }
    const stop = () => {
      if (timer === undefined) return
      window.clearInterval(timer)
      timer = undefined
    }

    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    document.addEventListener("visibilitychange", handleVisibility)
    start()
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      stop()
    }
  }, [])

  return (
    <p className="target-role" aria-label={`Role: ${roles[roleIndex]}`}>
      <span aria-hidden="true">&lt;</span>{" "}
      <span className="target-role-changing" key={roles[roleIndex]}>{roles[roleIndex]}</span>{" "}
      <span aria-hidden="true">| /&gt;</span>
    </p>
  )
}
