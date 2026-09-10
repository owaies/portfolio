"use client"

import { useEffect, useState } from "react"

const roles = ["Deep Learning Enthusiast", "Builder", "AIML Engineer"]

export default function AnimatedRole() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    const isComplete = displayText === currentRole
    const isEmpty = displayText === ""

    const delay = isComplete ? 1900 : deleting ? 55 : 105

    const timer = window.setTimeout(() => {
      if (isComplete) {
        setDeleting(true)
        return
      }

      if (deleting && isEmpty) {
        setDeleting(false)
        setRoleIndex((index) => (index + 1) % roles.length)
        return
      }

      setDisplayText((text) => deleting ? text.slice(0, -1) : currentRole.slice(0, text.length + 1))
    }, delay)

    return () => window.clearTimeout(timer)
  }, [displayText, deleting, roleIndex])

  return (
    <p className="target-role" aria-label={`Role: ${roles[roleIndex]}`}>
      <span aria-hidden="true">&lt;</span>{" "}
      <span className="target-role-changing">{displayText}<i className="target-role-cursor" aria-hidden="true" /> </span>
      <span aria-hidden="true"> | /&gt;</span>
    </p>
  )
}
