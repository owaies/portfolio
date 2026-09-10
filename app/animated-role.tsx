"use client"

import { useEffect, useState } from "react"

const roles = [
  "Deep Learning Enthusiast",
  "Builder",
  "AIML Engineer",
  "Computer Vision Builder",
]

const TYPE_SPEED = 80
const DELETE_SPEED = 45
const HOLD_TIME = 1800
const NEXT_ROLE_DELAY = 350

type Phase = "typing" | "holding" | "deleting"

export default function AnimatedRole() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [phase, setPhase] = useState<Phase>("typing")

  useEffect(() => {
    const role = roles[roleIndex]

    let delay = TYPE_SPEED
    if (phase === "holding") delay = HOLD_TIME
    if (phase === "deleting") delay = displayText.length === 0 ? NEXT_ROLE_DELAY : DELETE_SPEED

    const timer = window.setTimeout(() => {
      if (phase === "typing") {
        if (displayText.length < role.length) {
          setDisplayText(role.slice(0, displayText.length + 1))
        } else {
          setPhase("holding")
        }
      } else if (phase === "holding") {
        setPhase("deleting")
      } else if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        setRoleIndex((index) => (index + 1) % roles.length)
        setPhase("typing")
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [displayText, phase, roleIndex])

  return (
    <p className="target-role" aria-label={`Role: ${roles[roleIndex]}`}>
      <span aria-hidden="true">&lt;</span>{" "}
      <span className="target-role-changing">
        {displayText}
        <i className="target-role-cursor" aria-hidden="true" />
      </span>{" "}
      <span aria-hidden="true">| /&gt;</span>
    </p>
  )
}
