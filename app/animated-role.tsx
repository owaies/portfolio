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
    const timer = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length)
    }, 2400)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <p className="target-role" aria-label={`Role: ${roles[roleIndex]}`}>
      <span aria-hidden="true">&lt;</span>{" "}
      <span className="target-role-changing" key={roles[roleIndex]}>{roles[roleIndex]}</span>{" "}
      <span aria-hidden="true">| /&gt;</span>
    </p>
  )
}
