"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, className = "", delay = 0, direction = "up" }: { children: ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right" | "scale" }) {
  const initial = direction === "left" ? { opacity: 0, x: -24 } : direction === "right" ? { opacity: 0, x: 24 } : direction === "scale" ? { opacity: 0, scale: .96 } : { opacity: 0, y: 24 }
  return <motion.div initial={initial} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .65, delay, ease }} className={className}>{children}</motion.div>
}

export function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: .12 }} variants={{ hidden: {}, show: { transition: { staggerChildren: .07 } } }} className={className}>{children}</motion.div>
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: .55, ease } } }} className={className}>{children}</motion.div>
}
